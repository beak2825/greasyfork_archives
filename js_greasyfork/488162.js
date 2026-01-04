// ==UserScript==
// @name        pixiv bulk downloader
// @description simple script to download multiple arts from pixiv illustration
// @version     0.0.2
// @namespace   owowed.moe
// @author      owowed
// @license     GPL-3.0-or-later
// @match       *://www.pixiv.net/*
// @require     https://update.greasyfork.org/scripts/488160/1335044/make-mutation-observer.js
// @require     https://update.greasyfork.org/scripts/488161/1335046/wait-for-element.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_download
// @run-at      document-end
// @copyright   All rights reserved. Licensed under GPL-3.0-or-later. View license at https://spdx.org/licenses/GPL-3.0-or-later.html
// @downloadURL https://update.greasyfork.org/scripts/488162/pixiv%20bulk%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/488162/pixiv%20bulk%20downloader.meta.js
// ==/UserScript==

;3 ;3 ;3

!async function() { // main async function

/* Pixiv Website Navigation Event */

const navigationEvent = new EventTarget();
const charcoal = await waitForElement(".charcoal-token > div > div[style]:not([class])");

// Charcoal Navigation

let lastHrefDispatched;

makeMutationObserverOptions(
    { target: charcoal, childList: true, attributes: true },
    () => {
        if (lastHrefDispatched != window.location.href) {
            navigationEvent.dispatchEvent(new Event("charcoal-navigate"));
            lastHrefDispatched = window.location.href;
        }
    }
);

setTimeout(() => {
    if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            dispatchCharcoalNavigateEvent();
        });
    }
    else {
        dispatchCharcoalNavigateEvent();
    }
});

// Illustration Navigation

navigationEvent.addEventListener("charcoal-navigate", async () => {
    if (!window.location.href.includes("/artworks/")) return;

    navigationEvent.dispatchEvent(new Event("illust-open"));
    navigationEvent.dispatchEvent(new Event("illust-navigate"));

    const illustAnchor = await waitForElement("figure:has(~ figcaption)");
    let lastWindowHref = window.location.href;

    const observer = makeMutationObserverOptions({ target: illustAnchor, childList: true, subtree: true }, () => {
        if (lastWindowHref == window.location.href) return;
        navigationEvent.dispatchEvent(new Event("illust-navigate"));
        lastWindowHref = window.location.href;
    });

    navigationEvent.addEventListener("charcoal-navigate", () => {
        observer.disconnect();
        navigationEvent.dispatchEvent(new Event("illust-close"));
    }, { once: true });
});

/* Pixiv Bulk Downloader */

// Downloader Box

const filenameTemplateVariablesGuide = ""
    + "/illust-id/ Numeric id for the illustration\n"
    + "/illust-title/ Illustration title\n"
    + "/illust-tags-short/ Short tags derived from the illustration title\n"
    + "/illust-original/ If the illustration is tagged original, then it is written 'original', otherwise it is 'non-original'\n"
    + "/illust-author-name/ Author name\n"
    + "/illust-author-id/ Numeric id for the author\n"
    + "/illust-like-num/ Illustration like count\n"
    + "/illust-bookmark-num/ Illustration bookmark count\n"
    + "/illust-view-num/ Illustration view count\n"
    + "/illust-datetime/ Illustration posting date and time in long format\n"
    + "/illust-datetime-hours-24/ Illustration posting 24-hour format\n"
    + "/illust-datetime-hours/ Illustration posting 12-hour format\n"
    + "/illust-datetime-minutes/ Illustration posting minutes\n"
    + "/illust-datetime-seconds/ Illustration posting seconds\n"
    + "/illust-datetime-ampm/ Illustration posting AM/PM\n"
    + "/illust-datetime-date/ Illustration posting date\n"
    + "/illust-datetime-day/ Illustration posting day of the week as a number\n"
    + "/illust-datetime-month/ Illustration posting month as a number\n"
    + "/illust-datetime-year/ Illustration posting year\n"
    + "/illust-datetime-day-name/ Illustration posting day of the week as a name\n"
    + "/illust-datetime-month-name/ Illustration posting month as a name\n"
    + "/illust-datetime-timestamp/ Illustration posting timestamp\n"
    + "/current-datetime/ Current date and time in long format\n"
    + "/current-datetime-{...}/ Same as 'illust-datetime-{...}'\n"
    + "/artwork-quality/ Selected artwork quality\n"
    + "/artwork-part/ Selected artwork part\n"
    + "/artwork-parts-num/ Artwork total part count\n"
    + "/file-extension/ File extension for the image\n"
    + "/file-url-name/ File name from the source URL\n"
    + "/file-url-datetime/ File URL's associated date and time in long format\n"
    + "/file-url-datetime-{...}/ Same as 'illust-datetime-{...}'\n"
    + "/website-title/ Website title when it was downloaded\n"
    + "/website-lang/ Website language from the website URL";
const defaultFilenameTemplate = "/illust-title/ by /illust-author-name/ #/artwork-part/ (/illust-tags-short/) [pixiv /illust-id/]./file-extension/";
const { parent, shadow } = createShadowDom(`
    <button id="pbd-btn" class="btn-green expander closed">
        [+] pbd
    </button>
    <div id="pbd-box" class="popup" hidden>
        <h1>pivix bulk downloader</h1>
        <span class="note">userscript made by owowed</span>
        
        <div>
            <h2>Filename Template</h2>
            <div>Naming format for the filename. Include artwork info: author name, creation date, etc.</div>
            <textarea id="filename-template" cols="70" spellcheck="false">${GM_getValue("filename-template", defaultFilenameTemplate)}</textarea>
        </div>

        <div>
            <h2>Artwork Quality</h2>
            <div>Select artwork quality to download.</div>
            <select id="artwork-quality-selector">
                <option value="original">Original (best)</option>
                <option value="regular">Regular</option>
                <option value="small">Small</option>
                <option value="thumb_mini">Thumbnail Mini</option>
            </select>
        </div>

        <div id="selected-artwork-part-entry">
            <h2>Selected Artwork Part</h2>
            <div>Illustration can have multiple artworks (comic, doujin, etc.), you can manully select or bulk download them.</div>
            <select id="artwork-part-selector"></select>
            <div id="bulk-range" hidden>
                From: <select id="bulk-from"></select> To: <select id="bulk-to"></select>
            </div>
        </div>

        <!-- Author Page Exclusive -->

        <div class="artist-filter" hidden>
            <h2>Illustration Date</h2>
            <div>Select illustrations to download from the posting date</div>
            From: <input type="date" />
            To: <input type="date" />
        </div>

        <div class="artist-filter" hidden>
            <h2>Illustration Tags</h2>
            <div>Select illustrations to download from inclusion/exclusion of tags</div>
            <div class="tags-row">
                <div>
                    Inclusion:
                    <div class="tag-list">
                        <div class="added-tags">
                            <input type="text" value="touhou-project" readonly/>
                            <input type="text" value="satori-komeiji" readonly/>
                        </div>
                        <input type="text"/>
                    </div>
                </div>
                <div>
                    Exclusion:
                    <div class="tag-list">
                        <div class="added-tags">
                            <input type="text" value="touhou-project" readonly/>
                            <input type="text" value="satori-komeiji" readonly/>
                        </div>
                        <input type="text"/>
                    </div>
                </div>
            </div>
        </div>

        <style>
            :not([data-page="artist"]) .artist-filter {
                display: none;
            }
        </style>

        <div>
            <button id="btn-download">Start Download</button>
        </div>

        <div class="popup-footer">
            <button id="logs-btn" class="btn-green" hidden>[?] Logs</button>
            <button id="filename-template-variable-list-btn" class="btn-green">[?] Filename Template Variable List</button>
        </div>

        <div id="filename-template-variable-list-guide" class="popup" hidden>
            <pre class="guide-title">Filename Template Variables</pre>
            <pre class="guide-body">${filenameTemplateVariablesGuide}</pre>
        </div>
    </div>
    <style>
        #pbd-btn {
            margin: 12px 0 4px 0;
        }
        .popup {
            background: #E3E0D1;
            font-family: arial,helvetica,sans-serif;
            color: black;
            text-align: center;

            border: 2px solid grey;
            padding: 10px;
            margin: 4px 0;

            resize: both;
            overflow: auto;

            z-index: 100;
        }
        .popup > *:not(:first-child) {
            margin: 10px 0;
        }
        .popup-footer {
            text-align: left;
        }
        .expander {
            display: inline-block;
            padding: 5px;
            resize: none;
        }
        .expander.closed {
            font-weight: bold;
        }
        .btn-green {
            background-color: #edebdf;
            color: black;
            border: 2px solid grey;
            cursor: pointer;
        }
        pre.guide-title {
            text-align: center;
        }
        pre.guide-body {
            margin-left: 2.4cm;
            text-align: start;
        }
        .tags-row {
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: 14px;
        }
        .tag-list {
            display: flex;
            flex-direction: column;
            width: min-content;
            /* margin: auto; */
        }
        .tag-list .added-tags {
            max-height: 100px;
            overflow: auto;
        }
        h1, h2, h3, h4 {
            all: unset;
            display: block;
        }
        h1 {
            font-weight: bold;
            font-style: italic;
            font-size: 14pt;
        }
        h2 {
            font-size: 12pt;
        }
        .note {
            font-style: italic;
        }
    </style>
`);

const ftvlButton = shadow.getElementById("filename-template-variable-list-btn");
const ftvlContainer = shadow.getElementById("filename-template-variable-list-guide");

ftvlButton.addEventListener("click", () => {
    ftvlContainer.hidden = !ftvlContainer.hidden;
});

const pbdButton = shadow.getElementById("pbd-btn");
const pbdBox = shadow.getElementById("pbd-box");

pbdButton.addEventListener("click", () => {
    pbdBox.hidden = !pbdBox.hidden;
    pbdBox.classList.toggle("closed");
    pbdButton.textContent = `[${pbdBox.hidden ? "+" : "-"}] pbd`;
});

const filenameTemplateTextarea = shadow.getElementById("filename-template");

GM_setValue("filename-template", filenameTemplateTextarea.value)

filenameTemplateTextarea.addEventListener("change", () => {
    GM_setValue("filename-template", filenameTemplateTextarea.value)
});

navigationEvent.addEventListener("illust-navigate", async () => {
    selectedArtworkPartEntry.hidden = true;
    const caption = await waitForElement("figure ~ figcaption > div:has(div footer)", { parent: charcoal });
    const column = caption.children[0];
    column.append(parent);
});

// Artwork Selector & Artwork Quality

const selectedArtworkPartEntry = shadow.getElementById("selected-artwork-part-entry");
const artworkPartSelector = shadow.getElementById("artwork-part-selector");
const bulkRangeContainer = shadow.getElementById("bulk-range");
const bulkFromSelector = shadow.getElementById("bulk-from");
const bulkToSelector = shadow.getElementById("bulk-to");
const artworkQualitySelector = shadow.getElementById("artwork-quality-selector");

let artworkPartSelectorDict = {};

navigationEvent.addEventListener("illust-navigate", async () => {
    pbdBox.dataset.page = "illust";
    const pixivIllustPagesUrl = `https://www.pixiv.net/ajax/illust/${window.location.pathname.split("/").slice(-1)}/pages?lang=en`;
    artworkPartSelector.replaceChildren(); // remove all children
    bulkFromSelector.replaceChildren();
    bulkToSelector.replaceChildren();
    artworkPartSelectorDict = {};

    bulkRangeContainer.hidden = true;

    const illustPages = await fetch(pixivIllustPagesUrl, {
        headers: {
            Accept: "application/json",
            Referer: window.location.href
        }
    }).then(i => i.json());

    let counter = 0;
    for (const { urls, width, height } of illustPages.body) {
        const artworkPartOption = Object.assign(document.createElement("option"), {
            textContent: `p${counter}: ${width}x${height}`,
            value: urls.original
        });
        artworkPartSelector.append(artworkPartOption);
        artworkPartSelectorDict[urls.original] = { urls, width, height };

        const bulkFromToNumOption = Object.assign(document.createElement("option"), {
            textContent: counter,
            value: counter
        });

        bulkFromSelector.append(bulkFromToNumOption);
        bulkToSelector.append(bulkFromToNumOption.cloneNode(true));

        counter++;
    }

    if (counter > 1) {
        selectedArtworkPartEntry.hidden = false;
    }

    bulkToSelector.value = counter;
    
    const bulkDownloadOption = Object.assign(document.createElement("option"), {
        id: "bulk-download",
        textContent: "Bulk Download",
        value: "bulk-download",
    });

    artworkPartSelector.append(bulkDownloadOption);
});

// Download Button

const downloadButton = shadow.getElementById("btn-download");

downloadButton.addEventListener("click", () => {
    const filenameTemplate = filenameTemplateTextarea.value;
    if (artworkPartSelector.value == "bulk-download") {
        for (const imageUrl of Object.keys(artworkPartSelectorDict)) {
            downloadIllust(imageUrl, filenameTemplate);
        }
    }
    else {
        downloadIllust(artworkPartSelector.value, filenameTemplate);
    }
});

function downloadIllust(imageUrl, filenameTemplate) {
    const downloadUrl = artworkPartSelectorDict[imageUrl].urls[artworkQualitySelector.value];
    const dictionary = {
        ...getIllustDictionary(),
        ...getDownloadDictionary({
            url: new URL(downloadUrl),
            artworkQuality: artworkQualitySelector.value,
            artworkPart: Object.keys(artworkPartSelectorDict).findIndex(i => i == imageUrl),
            artworkPartTotal: Object.keys(artworkPartSelectorDict).length
        })
    };
    GM_download({
        url: downloadUrl,
        name: formatTemplate(filenameTemplate, dictionary),
        headers: {
            Referer: window.location.href
        },
        saveAs: false
    });
}

// Artist Filter

navigationEvent.addEventListener("charcoal-navigate", () => {
    pbdBox.dataset.page = "artist";
});


}(); // main async function

function createShadowDom(innerHTML) {
    const parent = document.createElement("div");
    const shadow = parent.attachShadow({ mode: "closed" });
    shadow.innerHTML = innerHTML;
    return { parent, shadow };
}

// Filename Template Functions

function formatTemplate(template, dictionary, { matcher = "/{{@.-}}/" } = {}) {
    let formatted = template;
    for (const [k, v] of Object.entries(dictionary)) {
        formatted = formatted.replace(matcher.replace("{{@.-}}", k), v);
    }
    return formatted;
}

function getIllustDictionary() {
    const authorAsideProfile = document.querySelector("aside h2 > div [data-gtm-value]:has([title])");
    const authorName = authorAsideProfile.querySelector("[title]").getAttribute("title");
    const illustPostingDate = new Date(document.querySelector("time[title='Posting date']").dateTime);
    return {
        // illustration info
        "illust-id": window.location.pathname.split("/").slice(-1)[0],
        "illust-title": document.title.split("/").slice(1).join("/").slice(1).split(" - pixiv")[0],
        "illust-tags-short": document.title.split("/")[0].slice(0,-1),
        "illust-original": document.querySelector("figure ~ figcaption [href*='オリジナル']") ? "original" : "non-original",
        "illust-author-name": authorName,
        "illust-author-id": authorAsideProfile.dataset.gtmValue,
        // illustration social stats
        "illust-like-num": document.querySelector("dd[title='Like']").textContent,
        "illust-bookmark-num": document.querySelector("dd[title='Bookmarks']").textContent,
        "illust-view-num": document.querySelector("dd[title='Views']").textContent,
        // illustration posting datetime
        ...getDateTimeDictionary("illust", illustPostingDate),
        // current datetime
        ...getDateTimeDictionary("current", new Date),
        // website info
        "website-title": document.title,
        "website-lang": window.location.pathname.split("/")[1],
    };
}

function getDownloadDictionary(context) {
    const fileUrlName = context.url.pathname.split("/").slice(-1)[0];
    const urlDateArray = context.url.pathname.split("/img/")[1].split("/").slice(0, 6);
    const urlDate = new Date(urlDateArray.slice(0,3).join("-") + "T" + urlDateArray.slice(3).join(":") + "+09:00");
    return {
        // artwork
        "artwork-quality": context.artworkQuality,
        "artwork-part": context.artworkPart,
        "artwork-parts-num": context.artworkPartTotal,
        // file info
        "file-extension": fileUrlName.split(".").slice(-1)[0],
        "file-url-name": fileUrlName,
        ...getDateTimeDictionary("file-url", urlDate),
    };
}

function getDateTimeDictionary(namespace, date) {
    return {
        [`${namespace}-datetime`]: date.toLocaleString("default", { dateStyle: "long" }),
        [`${namespace}-datetime-hours-24`]: date.getHours(),
        [`${namespace}-datetime-hours`]: Math.abs(date.getHours() % 12 || 12),
        [`${namespace}-datetime-minutes`]: date.getMinutes(),
        [`${namespace}-datetime-seconds`]: date.getSeconds(),
        [`${namespace}-datetime-ampm`]: date.getHours() >= 12 ? "PM" : "AM",
        [`${namespace}-datetime-date`]: date.getDate(),
        [`${namespace}-datetime-day`]: date.getDay(),
        [`${namespace}-datetime-month`]: date.getMonth() + 1,
        [`${namespace}-datetime-year`]: date.getFullYear(),
        [`${namespace}-datetime-day-name`]: date.toLocaleString("default", { weekday: "long" }),
        [`${namespace}-datetime-month-name`]: date.toLocaleString("default", { month: "long" }),
        [`${namespace}-datetime-timestamp`]: date.getTime(),
    };
}