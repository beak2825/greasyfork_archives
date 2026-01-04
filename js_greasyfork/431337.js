// ==UserScript==
// @name              MusicBrainz Batch Add to Collection
// @namespace         https://github.com/y-young/userscripts
// @version           2025.5.11
// @description       Batch add entities to MusicBrainz collection and copy MBIDs from entity pages, search result or existing collections.
// @author            y-young
// @license           MIT; https://opensource.org/licenses/MIT
// @supportURL        https://github.com/y-young/userscripts/labels/mb-batch-add-to-collection
// @include           /^https?:\/\/(.*\.)?musicbrainz.org\/(artist|collection|label|release|release-group|series|work)\/[\w-]{32,}(\/disc\/.*)?\/?(\?page=\d+|\?order=\w+)?$/
// @include           /^https?:\/\/(.*\.)?musicbrainz.org\/area\/[\w-]+\/(artists|events|labels|releases|recordings|places|works)\/?(\?page=\d+)?$/
// @include           /^https?:\/\/(.*\.)?musicbrainz.org\/artist\/[\w-]+\/(events|releases|recordings|works)\/?(\?page=\d+|\?filter.+)?$/
// @include           /^https?:\/\/(.*\.)?musicbrainz.org\/place\/[\w-]+\/events\/?(\?page=\d+)?$/
// @include           /^https?:\/\/(.*\.)?musicbrainz.org\/search\?.*type=(artist|event|label|instrument|place|recording|release_group|release|series|work)/
// @require           https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @require           https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js
// @grant             GM_setClipboard
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_deleteValue
// @run-at            document-idle
// @name:zh-CN        MusicBrainz 批量添加收藏
// @description:zh-CN 从条目页面、搜索结果或现有收藏页面批量复制MBID或添加项目到MusicBrainz收藏。
// @downloadURL https://update.greasyfork.org/scripts/431337/MusicBrainz%20Batch%20Add%20to%20Collection.user.js
// @updateURL https://update.greasyfork.org/scripts/431337/MusicBrainz%20Batch%20Add%20to%20Collection.meta.js
// ==/UserScript==

"use strict";

// To enable "Copy MBIDs" button, set this option to true
const SHOW_COPY_BUTTON = false;
// Whether to close dialog when successfully submitted
const CLOSE_DIALOG_AFTER_SUBMIT = true;

const IDENTIFIER = "batch-add-to-collection";
const CLIENT =
    "BatchAddToCollection/2025.5.11(https://github.com/y-young/userscripts)";
const ENTITY_TYPE_MAPPING = {
    artist: "release-group",
    label: "release",
    place: "event",
    "release-group": "release",
    release: "recording",
    work: "recording",
};
// prettier-ignore
const SUPPORTED_TYPES = [
    "artist", "event", "label", "instrument", "place",
    "recording", "release", "release-group",
    "series", "work"
];
const DIALOG_LOADING_NOTICE = `
    <div class="banner loading-message" style="background-position: right;">
        Loading your collections...
    </div>
`;

let $ = jQuery.noConflict(true);

const url = new URL(location.href);
const origin = url.origin;
const path = url.pathname.split("/");

// Determine entity type of current page and target collection type
const entityType = path[1];
let collectionType = ENTITY_TYPE_MAPPING[entityType];
switch (entityType) {
    case "area":
    case "artist": {
        const subType = path[3];
        if (subType) {
            // Convert plural form to singular form
            collectionType = subType.substring(0, subType.length - 1);
        } else if (entityType === "artist") {
            // Artist index pages without release groups fall back to list recordings
            if (!document.querySelector("table.release-group-list")) {
                collectionType = "recording";
            }
        }
        break;
    }
    case "search":
        collectionType = url.searchParams.get("type");
        if (collectionType === "release_group") {
            collectionType = "release-group";
        }
        break;
    case "collection": {
        const type = document.querySelector("dd[class='type']").innerText;
        collectionType = type.toLowerCase().replaceAll(" ", "-");
        if (collectionType === "owned-music" || collectionType === "wishlist") {
            collectionType = "release";
        } else if (
            collectionType === "attending" ||
            collectionType === "maybe-attending"
        ) {
            collectionType = "event";
        } else {
            collectionType = collectionType.replaceAll("-collection", "");
        }
        break;
    }
    case "series": {
        const type = document.querySelector("dd[class='type']").innerText;
        collectionType = type
            .toLowerCase()
            .replaceAll(" ", "-")
            .replaceAll("-series", "");
        break;
    }
}
let collections = undefined;

// Initialize "Batch add to collection" dialog
const dialogElement = document.createElement("div");
dialogElement.id = IDENTIFIER + "-dialog";
dialogElement.title = "Batch add to collection";
dialogElement.innerHTML = DIALOG_LOADING_NOTICE;
dialogElement.style.overflow = "auto";
document.querySelector("body").appendChild(dialogElement);
const dialog = $("#" + IDENTIFIER + "-dialog").dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    open: function () {
        loadCollections();
    },
    buttons: {
        Refresh: function () {
            collections = undefined;
            GM_deleteValue("collections");
            dialogElement.innerHTML = DIALOG_LOADING_NOTICE;
            loadCollections();
        },
        Cancel: function () {
            $(this).dialog("close");
        },
    },
});

function request(url, options = {}) {
    return fetch(origin + url, {
        ...options,
        headers: {
            "user-agent": CLIENT,
            accept: "application/json",
        },
    });
}

function getGidFromUrl(url) {
    const path = new URL(url).pathname.split("/");
    return path[2];
}

function getCollectionTypePlural() {
    if (collectionType === "series") {
        return "series";
    }
    return collectionType + "s";
}

function createCheckbox(recordingId) {
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.classList.add(IDENTIFIER);
    checkbox.dataset.id = recordingId;
    const cell = document.createElement("td");
    cell.prepend(checkbox);
    return cell;
}

function getSelectedIds() {
    const entityIds = Array.from(
        document.querySelectorAll(
            "input:checked[type='checkbox']." + IDENTIFIER
        )
    ).map((checkbox) => checkbox.dataset.id);
    return entityIds;
}

function chunked(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

function addToCollection(collectionId, ids) {
    const CHUNK_SIZE = 400;
    const tasks = chunked(ids, CHUNK_SIZE).map((chunk) =>
        request(
            `/ws/2/collection/${collectionId}/${getCollectionTypePlural()}/${chunk.join(
                ";"
            )}?client=${encodeURIComponent(CLIENT)}`,
            { method: "PUT" }
        )
    );
    return Promise.all(tasks).then((responses) => {
        const error = responses.find((response) => response.status !== 200);
        if (error) {
            throw error;
        }
        alert(`Successfully added ${ids.length} item(s) to collection.`);
    });
}

function addSelectedToCollection(event) {
    let target = event.target;
    // Compatibility with katakana-terminator
    if (target.nodeName === "RUBY") {
        target = target.parentElement;
    } else if (target.nodeName === "RT") {
        target = target.parentElement.parentElement;
    }

    const collectionId = target.dataset.id;
    const ids = getSelectedIds();
    if (ids.length === 0) {
        alert("No item is selected.");
        dialog.dialog("close");
        return;
    }
    const loadingNotice = document.querySelector(
        "#" + IDENTIFIER + "-dialog div.loading-message"
    );
    loadingNotice.style.display = "block";
    addToCollection(collectionId, ids)
        .then(() => {
            loadingNotice.style.display = "none";
            if (CLOSE_DIALOG_AFTER_SUBMIT) {
                dialog.dialog("close");
            }
        })
        .catch((error) => {
            console.error(error);
            alert("An error occurred, please see console output.");
        });
}

function renderCollections() {
    document.querySelector("#" + IDENTIFIER + "-dialog").innerHTML = `
        <div>You have the following ${collectionType} collection(s), click to add selected items:</div>
        <div class="banner loading-message" style="background-position: right; display: none;">
            Adding to collection...
        </div>
        <table class="tbl">
            <thead>
                <th>Name</th>
                <th>Action</th>
            </thead>
            <tbody>
                ${collections
                    .map(
                        (collection, index) => `
                <tr class="${index % 2 ? "odd" : "even"}">
                    <td>
                        <a href="/collection/${
                            collection.id
                        }" target="_blank" rel="noreferrer">
                            ${collection.name}
                        </a>
                    </td>
                    <td>
                        <a name="add" data-id="${
                            collection.id
                        }" href="javascript:void(0)">
                            Add
                        </a>
                    </td>
                </tr>`
                    )
                    .join("")}
                <tr class="${collections.length % 2 ? "odd" : "even"}">
                    <td>
                        <a href="/collection/create" target="_blank" rel="noreferrer">
                            Create a new collection
                        </a>
                    </td>
                    <td />
                </tr>
            </tbody>
        </table>
        <p style="color: gray">
            The collections are cached in local storage.
            Click "Refresh" to get latest data from server.
        </p>`;
    document
        .querySelectorAll("#" + IDENTIFIER + "-dialog a[name='add']")
        .forEach((element) =>
            element.addEventListener("click", addSelectedToCollection)
        );
}

// Filter and sort collections according to current entity type
function filterCollections(data) {
    return data
        .filter(
            (collection) =>
                collection["entity-type"] ===
                (collectionType === "release-group"
                    ? "release_group"
                    : collectionType)
        )
        .sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
}

function loadCollections() {
    if (collections) {
        // Collections already rendered
        return collections;
    }
    // Try to get cached collections
    const cachedCollections = GM_getValue("collections");
    if (cachedCollections) {
        collections = filterCollections(cachedCollections);
        renderCollections();
        return collections;
    }
    // Fetch collections from server
    return request("/ws/2/collection")
        .then((response) => response.json())
        .then((data) => data.collections)
        .then((collections) => {
            GM_setValue("collections", collections);
            return filterCollections(collections);
        })
        .then((result) => {
            collections = result;
            renderCollections();
            return collections;
        });
}

function toggleSelection(event) {
    const target = event.target;
    let context = target;
    while (context.nodeName !== "TABLE") {
        context = context.parentNode;
    }
    const checked = target.checked;
    context
        .querySelectorAll("input[type='checkbox']." + IDENTIFIER)
        .forEach((checkbox) => {
            checkbox.checked = checked;
        });
}

function createToggleSelectionCheckbox() {
    const headCell = document.createElement("th");
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.addEventListener("click", toggleSelection);
    headCell.appendChild(checkbox);
    headCell.className = "checkbox-cell";
    return headCell;
}

function initHeaderCheckbox(header) {
    if (header.querySelector("th.checkbox-cell")) {
        // Already initialized
        return;
    }
    header.prepend(createToggleSelectionCheckbox());
}

function initTableCheckboxes(table) {
    // Get rows
    const rows = Array.from(table.querySelectorAll("tr.odd, tr.even"));
    rows.forEach((row) => {
        const entityLink = row.querySelector(
            `td a[href^='/${collectionType}']`
        );
        if (!entityLink) {
            if (entityType === "search") {
                // Some rows in search result are grouped together
                row.prepend(document.createElement("td"));
            }
            return;
        }
        const gid = getGidFromUrl(entityLink.href);
        // Use existing checkboxes if possible
        const checkbox = row.querySelector("td input[type='checkbox']");
        if (checkbox) {
            checkbox.classList.add(IDENTIFIER);
            checkbox.dataset.id = gid;
        } else {
            row.prepend(createCheckbox(gid));
        }
    });
    // Update table headers
    switch (entityType) {
        case "release":
            table.querySelectorAll("thead th[colspan]").forEach((header) => {
                header.setAttribute(
                    "colspan",
                    Number(header.getAttribute("colspan")) + 1
                );
            });
            table.querySelectorAll("tr.subh").forEach(initHeaderCheckbox);
            break;
        case "work":
            table.querySelectorAll("tr.subh th[colspan]").forEach((header) => {
                header.setAttribute("colspan", "5");
            });
            initHeaderCheckbox(table.querySelector("thead tr"));
            break;
        case "search":
        case "series":
            initHeaderCheckbox(table.querySelector("thead tr"));
            break;
        case "collection":
            if (!table.querySelector("thead th input[type='checkbox']")) {
                initHeaderCheckbox(table.querySelector("thead tr"));
            }
            break;
    }
}

function initCheckboxes() {
    document.querySelectorAll("table.tbl").forEach((table) => {
        initTableCheckboxes(table);

        // Handle dynamically loaded rows,
        // e.g. more than 100 tracks in a medium, or more than 7 media
        const observerOptions = {
            childList: true,
            subtree: true,
        };
        const observer = new MutationObserver((records) => {
            if (
                records.findIndex(
                    (record) => record.target.tagName === "TBODY"
                ) != -1
            ) {
                initTableCheckboxes(table);
            }
        });
        observer.observe(table, observerOptions);
    });
}

function openDialog() {
    dialog.dialog("open");
}

function copyMBIDs() {
    const entityIds = getSelectedIds();
    GM_setClipboard(entityIds.join("\n"));
    // temporarily replace the button text with a status message
    const previousText = this.innerText;
    this.innerText = `Copied ${entityIds.length} MBIDs`;
    setTimeout(() => (this.innerText = previousText), 1000);
}

function addClipboardToCollection() {
    const input = prompt("Paste MBIDs of entities to add to this collection:");
    if (!input) {
        return;
    }
    const entityIds = Array.from(input.matchAll(/\b[a-fA-F0-9\-]{36}\b/gm)).map(
        (match) => match[0]
    );
    if (!entityIds.length) {
        alert("No MBIDs found in input.");
        return;
    }
    const collectionId = path[2];

    const previousText = this.innerText;
    this.innerText = `Adding ${entityIds.length} entities...`;
    this.disabled = true;

    addToCollection(collectionId, entityIds)
        .then(() => {
            location.reload();
        })
        .catch((error) => {
            console.error(error);
            alert("An error occurred, please see console output.");
        })
        .finally(() => {
            this.innerText = previousText;
            this.disabled = false;
        });
}

function initButtons() {
    const buttons = [];

    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.innerText = "Batch add to collection";
    button.addEventListener("click", openDialog);
    buttons.push(button);

    if (SHOW_COPY_BUTTON) {
        const copyButton = document.createElement("button");
        copyButton.setAttribute("type", "button");
        copyButton.innerText = "Copy MBIDs";
        copyButton.title = "Copies MBIDs to clipboard.";
        copyButton.addEventListener("click", copyMBIDs);
        buttons.push(copyButton);
    }

    if (entityType === "collection") {
        const fromClipboardButton = document.createElement("button");
        fromClipboardButton.setAttribute("type", "button");
        fromClipboardButton.innerText = "Add from clipboard";
        fromClipboardButton.title =
            "Adds entities from clipboard to collection.";
        fromClipboardButton.addEventListener("click", addClipboardToCollection);
        buttons.push(fromClipboardButton);
    }

    let container = document.querySelector("form div.row span.buttons");
    if (container) {
        buttons.forEach((button) => container.appendChild(button));
    } else {
        container = document.createElement("form");
        container.innerHTML = `<div class="row"><span class="buttons"></span></div>`;
        const tables = document.querySelectorAll("table.tbl");
        // Insert after the last table if there're multiple ones
        let precedent = tables[tables.length - 1];
        if (!precedent) {
            // Empty collection
            precedent = document.querySelector("#content > p");
        }
        buttons.forEach((button) =>
            container.querySelector("span.buttons").appendChild(button)
        );
        precedent.parentNode.insertBefore(container, precedent.nextSibling);
    }
}

function isLoggedOut() {
    const loginLink = document.querySelector("ul.menu > li > a");
    return loginLink && loginLink.href.split("/")[3].startsWith("login");
}

console.log("[Batch add to collection]", entityType, collectionType);
if (SUPPORTED_TYPES.includes(collectionType) && !isLoggedOut()) {
    setTimeout(function () {
        initCheckboxes();
        initButtons();
    }, 500);
}
