// ==UserScript==
// @name            Magnet Links & Torrent Search Filter
// @description     Adds magnet links to BT4G, Limetorrents, BT1207, filtering of search results by minimum and maximum size (BT4G only), automatic reload in case of server errors every 5 minutes
// @version         20251128
// @author          mykarean
// @match           *://bt4gprx.com/*
// @match           *://*.limetorrents.fun/search/all/*
// @match           *://bt1207so.top/search*
// @match           *://bt1207un.top/search*
// @run-at          document-idle
// @grant           GM_xmlhttpRequest
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_registerMenuCommand
// @compatible      chrome
// @license         GPL3
// @noframes
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAMFBMVEUAAAD/////PwA/v/8KIDUifaxN2//Cw8L5ywC8hwBuQwA+HQDSLAcPBAJvb2////9VWbprAAAAEHRSTlP///////////////////8A4CNdGQAAAAlwSFlzAAALEwAACxMBAJqcGAAABr5pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA1IDc5LjE2NDU5MCwgMjAyMC8xMi8wOS0xMTo1Nzo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjEgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNC0wNi0yMVQwODoyMTo0NCswMjowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDYtMjFUMTI6MDA6MzQrMDI6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDYtMjFUMTI6MDA6MzQrMDI6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIyIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODZhZDM2M2ItOWY4Ny0xNzQ3LWE2MDQtOTBmODg4MzA3MmU5IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ODVkNmE1ODktZmZhZC1kYTRmLWE1NTktOTc5ODAxNmRkMDJjIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YjAwNjgyYTQtMGQ2NS01YjRlLTg3MTMtMGVmYzNlN2U4ODI0Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiMDA2ODJhNC0wZDY1LTViNGUtODcxMy0wZWZjM2U3ZTg4MjQiIHN0RXZ0OndoZW49IjIwMjQtMDYtMjFUMDg6MjE6NDQrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4xIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTNhYTg2MjktN2RhNy0wOTQ4LWI0Y2UtODQ1YjM2ODA4ZmQzIiBzdEV2dDp3aGVuPSIyMDI0LTA2LTIxVDA4OjUzOjAzKzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjg2YWQzNjNiLTlmODctMTc0Ny1hNjA0LTkwZjg4ODMwNzJlOSIgc3RFdnQ6d2hlbj0iMjAyNC0wNi0yMVQxMjowMDozNCswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PocnnoQAAAGsSURBVFjD7ZdJcsQgDEV/wNACQXz/22YRNzOSU92VRSpaUv4PDWAknFtDY8JXuliG4K58h4CmziwzoO0eg+wFNOdDlAOBoo+kpAJK7igo2YSsjxQB5JrSiYBJz23aiZhDyHNJZkDdNNbPIhFRiYJzjFMUmPznUOMmIiKKBRd4ysMMQN3y24FSh0CEHaCv/FV7Jgqx+sOhr2kL6DLP4AsQMxDo6XZkLI41lhXk3AS0WBwBEGx9kioBip6JIRJGwGe19jI2y1kE5I9ij+tYAQAedf2YABABLAGgAy6HJQBEAGQA3g5AMk9L7bLzxRQPtgD7tBGA1wD4B/wD/grg5cv0FwDn5o9k8g3AKQGaJ+mw1TABOkKsgJQXDninPG1sFoQmABWQTUvgDOBo9NYfC8C5SYIxJiVnbau3q+e9I7DpzTfywYFNhzK4YDu93bQ45y4LI+DYNFn7IDpAV4J9n9iehQ4wlXDd6g6nSdEvmu0+igLwa/2u3S+3MhX5sR4YtgMHXwjrvffWHTcGjhGROaWUnHNuL9eHrqxNj7g7dN4c+1TCb4y+7xi+fzL+fwG9j0ZciTgBKAAAAABJRU5ErkJggg==
// @namespace https://greasyfork.org/users/1367334
// @downloadURL https://update.greasyfork.org/scripts/508413/Magnet%20Links%20%20Torrent%20Search%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/508413/Magnet%20Links%20%20Torrent%20Search%20Filter.meta.js
// ==/UserScript==

"use strict";

// ---------------------------------------------------------
// Config/Requirements
// ---------------------------------------------------------

const limetorrentsURL = "www.limetorrents.fun";
const bt4gURL = "bt4gprx.com";

const currentPath = window.location.href;
const hostname = location.hostname;
const magnetImage = GM_info.script.icon;

let itemsFoundElement;
if (hostname === bt4gURL) {
    itemsFoundElement = document.querySelector("body > main > p");
} else if (hostname === limetorrentsURL) {
    itemsFoundElement = document.querySelector("#content > h2");
}

// ---------------------------------------------------------
// Layout
// ---------------------------------------------------------

function setStylesAndFavicon() {
    GM_addStyle(`
        .magnet-link-img {
            cursor: pointer;
            margin: 0px 5px;
            vertical-align: sub;
            height: 20px;
            transition: filter 0.2s ease;
        }
        a.magnet-link {
            display: inline-block !important;
            vertical-align: middle;
            margin-right: 10px;
            border-radius: 6px;
            padding: 1px 10px 3px 0;
            background: #000000;
            outline: 2px solid #ffffff00;
            font-family: system-ui,-apple-system,sans-serif;
            font-size: 16px;
            font-weight: 400;
            color: white;
            text-decoration: none;
            user-select: none;
            transition: outline .15s ease-in-out;
        }
        /* detail page of BT4G */
        .card-body a.magnet-link {
            padding: 0.375rem 0.75rem;
            border: 0.8px solid transparent;
        }
        .card-body a.magnet-link .magnet-link-img {
            margin-left: 0;
        }
        a.magnet-link:hover {
            outline: 2px solid #ff3f00;
        }
    `);

    // Specific modifications for BT4G
    if (hostname === bt4gURL && location.pathname === "/search") {
        GM_addStyle(`
            a.magnet-link {
                vertical-align: top;
            }
        `);

        // Since there isn't one, add a favicon to make it easier to identify in tabs and history
        const linkFavicon = document.createElement("link");
        linkFavicon.rel = "icon";
        linkFavicon.type = "image/png";
        linkFavicon.href = "/static/favicon.ico";
        document.head.appendChild(linkFavicon);
    }
    if (hostname === bt4gURL) {
        GM_addStyle(`
            .lead {
                display: inline-block;
            }
            /* removing the annoying hover effect on search results */
            .result-item:hover,
            .list-group-item:hover {
                transform: none;
            }
        `);
    }
}

// ---------------------------------------------------------
// Helper
// ---------------------------------------------------------

/**
 * @param {String} tag Elements HTML Tag
 * @param {String|RegExp} regex Regular expression or string for text search
 * @param {Number} index Item Index
 * @returns {Object|null} Node or null if not found
 */
function getElementByText(tag, regex, item = 0) {
    if (typeof regex === "string") {
        regex = new RegExp(regex);
    }

    const elements = document.getElementsByTagName(tag);
    let count = 0;

    for (let i = 0; i < elements.length; i++) {
        if (regex.test(elements[i].textContent)) {
            if (count === item) {
                return elements[i];
            }
            count++;
        }
    }

    return null;
}

async function requestNativeFetch(url) {
    const response = await fetch(url, {
        credentials: "same-origin",
    });
    if (!response.ok) throw new Error("Request failed");
    return await response.text();
}

function requestGM_XHR(details) {
    return new Promise((resolve, reject) => {
        details.onload = function (response) {
            resolve(response);
        };
        details.onerror = function (response) {
            reject(response);
        };
        details.ontimeout = function () {
            reject(new Error("Request timed out"));
        };
        GM_xmlhttpRequest(details);
    });
}

// ---------------------------------------------------------
// Configuration menu
// ---------------------------------------------------------

// Register menu command with current state
function addMenuCommand() {
    const currentState = GM_getValue("includeDN", true);
    const menuText = `Add Name to Magnet Links ${currentState ? "✔️" : "❌"}`;

    GM_registerMenuCommand(menuText, toggleIncludeDN);
}

// Toggle function
function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #323232;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    `;

    document.body.appendChild(toast);

    // Trigger fade-in animation
    setTimeout(() => {
        toast.style.opacity = "1";
    }, 10);

    // Fade out and remove
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 1500);
}

function toggleIncludeDN() {
    const currentState = GM_getValue("includeDN", true);
    const newState = !currentState;
    GM_setValue("includeDN", newState);

    showToast(`Add Name to Magnet Links: ${newState ? "ON" : "OFF"}`);

    // Reload page to apply changes
    setTimeout(() => {
        location.reload();
    }, 2000);
}

// ---------------------------------------------------------
// search results handling
// ---------------------------------------------------------

function observeSearchResultsChange() {
    const observer = new MutationObserver(() => {
        observer.disconnect();
        setTimeout(() => {
            // console.debug("Search results changed, processing links...");
            processLinksInSearchResults().then(() => {
                observeSearchResultsChange();
            });
        }, 100);
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
    });
}

function observeNewSearchResults() {
    const observer = new MutationObserver((mutations) => {
        let hasNewResults = false;

        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                const newSearchResultWithSize = Array.from(mutation.addedNodes).some((node) => {
                    if (node.querySelector) {
                        // Returns boolean value indicating whether the element with class "cpill" exists in `node`
                        return !!node.querySelector(".cpill");
                    }
                    return false;
                });

                if (newSearchResultWithSize) {
                    hasNewResults = true;
                    break;
                }
            }
        }

        if (hasNewResults) {
            itemFilterBySize();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        // attributes: false, // Ignore style changes from itemFilterBySize()
        characterData: false, // Ignore text changes from processLinksInSearchResults()
    });
}

async function processLinksInSearchResults() {
    const links = Array.from(getSearchResultLinks());
    const promises = links.map(async (link) => {
        if (hostname === bt4gURL) {
            // return;
            await processLinksInSearchResultsBt4g(link);
        } else if (hostname === limetorrentsURL) {
            processLinksInSearchResultsLimeTorrents(link);
        }
    });

    await Promise.all(promises);

    if (hostname.includes("bt1207")) {
        for (let link of links) {
            await processLinksInSearchResultsBt1207(link);
            // await new Promise((resolve) => setTimeout(resolve, 100));

            // add magnets on hover
            link.addEventListener("mouseover", async function () {
                const magnetLink = link.getAttribute("data-magnet-added");
                if (magnetLink !== "true") {
                    try {
                        // Try to process the link
                        await processLinksInSearchResultsBt1207(link);

                        // Only set the attribute if no error occurs
                        // link.setAttribute("data-magnet-added", "true");
                    } catch (error) {
                        console.error("Error processing link:", error);
                        // Handle error (e.g., log it, but don't set data-magnet-added)
                    }
                }
            });
        }
    }

    // Add amount of visible magnet links into text
    const amountVisibleMagnets = links.length;
    const magnetLinkAllSpan = document.querySelector(".magnet-link-all-span");
    if (links && typeof links.length === "number" && magnetLinkAllSpan) {
        magnetLinkAllSpan.innerHTML = `Open all <span class="badge bg-primary">${amountVisibleMagnets}</span> loaded magnet links`;
    }

    // Remove spam elements
    setTimeout(() => {
        links.forEach((link) => {
            const title = link.title;
            if (title.includes("Downloader.exe") || title.includes("Downloader.dmg")) {
                link.parentElement.parentElement.remove();
            }
        });
    }, 100);
}

function getSearchResultLinks() {
    if (hostname === bt4gURL) {
        const elements = document.querySelectorAll('a[href*="/magnet/"]:not([href^="magnet:"])');

        // Filter and return only the visible elements (those without 'display: none' in their parent chain)
        return Array.from(elements).filter((element) => {
            let current = element;
            while (current) {
                if (window.getComputedStyle(current).display === "none") {
                    return false;
                }
                current = current.parentElement;
            }
            return true;
        });
    } else if (hostname === limetorrentsURL) {
        return document.querySelectorAll('a[href*="//itorrents.net/torrent/"]');
    } else if (hostname.includes("bt1207")) {
        return document.querySelectorAll("body > div.container-fluid > div:nth-child(6) > div.col-md-6 > ul > li:nth-child(1) > a");
    }
}

async function processLinksInSearchResultsBt4g(link) {
    try {
        // Skip if magnet link exists
        const magnetLink = link.getAttribute("data-magnet-added");
        if (magnetLink === "true") return;

        // Fetch the details page content
        // requestGM_XHR() is not working with Cloudflare protection anymore
        const html = await requestNativeFetch(link.href);

        // Find magnet links
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const downloadLink = doc.querySelector('a[href^="//downloadtorrentfile.com/hash/"]');
        if (downloadLink) {
            const hash = extractHashFromUrl(downloadLink.href.split("/").pop().split("?")[0]);
            const torrentName = link?.textContent;
            if (hash) {
                insertMagnetLink(link, hash, torrentName);
                link.setAttribute("data-magnet-added", "true");
            }
        }
    } catch (error) {
        console.error("Error getting magnet link:", error);
    }
}

async function processLinksInSearchResultsBt1207(link) {
    try {
        // Skip if magnet link exists
        const magnetLink = link.getAttribute("data-magnet-added");
        if (magnetLink === "true") return;

        const details = {
            method: "GET",
            url: link.href,
            timeout: 3000,
            headers: {
                Referer: document.referrer,
                Cookie: document.cookie,
                "User-Agent": navigator.userAgent,
                Referer: window.location.href,
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": navigator.language || navigator.userLanguage,
                "Accept-Encoding": "gzip, deflate, br",
                Connection: "keep-alive",
            },
        };

        // Fetch the details page content
        const response = await requestGM_XHR(details);
        const html = response.responseText;

        // Find magnet links
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const downloadLink = doc.querySelector("#magnet");
        if (downloadLink) {
            const hash = extractHashFromUrl(downloadLink.href);
            const torrentName = link?.textContent;
            if (hash) {
                insertMagnetLink(link, hash, torrentName);
                link.setAttribute("data-magnet-added", "true");
            }
        }
    } catch (error) {
        console.error("Error getting magnet link:", error);
    }
}

function processLinksInSearchResultsLimeTorrents(link) {
    // Skip if magnet link exists
    const magnetLink = link.getAttribute("data-magnet-added");
    if (magnetLink === "true") return;

    const hash = extractHashFromUrl(link.href.split("/").pop().split("?")[0]);
    const torrentName = link?.nextElementSibling?.textContent;
    if (hash) {
        insertMagnetLink(link, hash, torrentName);
        link.setAttribute("data-magnet-added", "true");
        // Hide unnecessary element
        link.style.display = "none";
    }
}

function insertMagnetLink(link, hash, torrentName = "") {
    // Get configuration value to determine if display name should be included
    const includeDN = GM_getValue("includeDN", true);
    let magnetLink = `magnet:?xt=urn:btih:${hash}`;

    // Add display name parameter if enabled and torrentName is provided
    if (includeDN && torrentName) {
        const encodedName = encodeURIComponent(torrentName);
        magnetLink += `&dn=${encodedName}`;
    }

    const newLink = document.createElement("a");
    newLink.classList.add("magnet-link");
    newLink.href = magnetLink;
    newLink.addEventListener("click", function () {
        imgElement.style.filter = "grayscale(100%) opacity(0.5)";
    });

    const imgElement = document.createElement("img");
    imgElement.src = magnetImage;
    imgElement.classList.add("magnet-link-img");

    // Create a text node after the image
    const textNode = document.createTextNode("Magnet Link");

    // Append image first, then text
    newLink.appendChild(imgElement);
    newLink.appendChild(textNode);

    link.parentNode.insertBefore(newLink, link);
}

function extractHashFromUrl(href) {
    const hashRegex = /(^|\/|&|-|\.|\?|=|:)([a-fA-F0-9]{40})/;
    const matches = href.match(hashRegex);
    return matches ? matches[2] : null;
}

// ---------------------------------------------------------

function addClickAllMagnetLinks() {
    // only needed if document-start
    // const openAllMagnetLinks = document.querySelector(".magnet-link-all-span");
    // if (openAllMagnetLinks) {
    //     return;
    // }

    // no elements found
    if (
        document.querySelector("body > main > p")?.textContent.includes("did not match any documents") ||
        document.querySelector("#content > h2:nth-child(9)")
    )
        return;

    const targetElement = itemsFoundElement?.parentElement?.children[3];
    if (targetElement) {
        const openAllMagnetLinksSpan = document.createElement("span");
        openAllMagnetLinksSpan.innerHTML = "Open all <span class='badge bg-primary'>0</span> loaded magnet links";
        openAllMagnetLinksSpan.classList.add("magnet-link-all-span", "lead");
        openAllMagnetLinksSpan.style.marginLeft = "10px";

        const openAllMagnetLinksImg = document.createElement("img");
        openAllMagnetLinksImg.src = magnetImage;
        openAllMagnetLinksImg.classList.add("magnet-link-img");
        openAllMagnetLinksImg.style.cssText = "cursor:pointer;vertical-align:sub;";

        targetElement.insertAdjacentElement("afterend", openAllMagnetLinksSpan);
        openAllMagnetLinksSpan.insertAdjacentElement("afterend", openAllMagnetLinksImg);

        openAllMagnetLinksImg.addEventListener("click", () => {
            const addedMagnetLinks = document.querySelectorAll("a.magnet-link");
            if (addedMagnetLinks.length > 0) {
                openAllMagnetLinksImg.style.filter = "grayscale(100%) opacity(0.5)";
                addedMagnetLinks.forEach((link, index) => {
                    // ignore hidden elements
                    if (getComputedStyle(link.parentElement.parentElement).display !== "none") {
                        setTimeout(() => {
                            link.click();
                        }, index * 100);
                    }
                });
            } else {
                openAllMagnetLinksSpan.textContent = "No magnet links found";
            }
        });

        // for a fixed position and more space, remove superfluous information
        if (hostname === bt4gURL) {
            itemsFoundElement.innerHTML = itemsFoundElement.innerHTML.replace(/(\ items)\ for\ .*/, "$1");
        } else if (hostname === limetorrentsURL) {
            itemsFoundElement.textContent = "";
        }
    }
}

// ---------------------------------------------------------
// size filter
// ---------------------------------------------------------

function itemFilterBySize() {
    if (hostname !== bt4gURL) return;

    // no elements found
    if (document.querySelector("body > main > p")?.textContent.includes("did not match any documents")) return;

    if (!document.getElementById("item-filter-styles")) {
        GM_addStyle(`
        .filter-container {
            display: inline-flex;
            align-items: center;
        }
        .filter-button {
            color: #212121;
            padding: 3px 7px;
            border: none;
            margin-right: 5px;
            margin-left: 10px;
        }
        .filter-input {
            margin-left: 5px !important;
            /* padding-left: 12px !important; */
            width: 50px !important;
            text-align: center !important;
        }
        .filter-label {
            font-weight: bold;
            margin-left: 5px;
        }
        .hidden-item {
            display: none !important;
        }
        `).setAttribute("id", "item-filter-styles");
    }

    function createFilterControl(id, text) {
        const button = document.createElement("button");
        button.id = id;
        button.className = "filter-button btn";
        button.textContent = text;

        const input = document.createElement("input");
        input.type = "number";
        input.step = "1";
        input.className = "filter-input";
        input.id = `${id}-input`;

        return { button, input };
    }

    function createFilterControls(buttonTarget) {
        const container = document.createElement("span");
        container.className = "filter-container";

        const minFilter = createFilterControl("filter-min-size-button", "Min");
        const maxFilter = createFilterControl("filter-max-size-button", "Max");

        const unitLabel = document.createElement("span");
        unitLabel.textContent = "GB";
        unitLabel.className = "filter-label";

        container.append(minFilter.button, minFilter.input, maxFilter.button, maxFilter.input, unitLabel);

        buttonTarget.parentNode.insertBefore(container, buttonTarget.nextSibling);

        return {
            minButton: minFilter.button,
            maxButton: maxFilter.button,
            minInput: minFilter.input,
            maxInput: maxFilter.input,
        };
    }

    async function setupFilter(button, input, isMinFilter) {
        const filterType = isMinFilter ? "Min" : "Max";
        let isFiltered = await GM.getValue(`is${filterType}Filtered`, false);
        let threshold = await GM.getValue(`${filterType.toLowerCase()}FilterThreshold`, isMinFilter ? 1 : 10);

        button.textContent = isFiltered ? `${filterType} filter on` : `${filterType} filter off`;
        button.style.backgroundColor = isFiltered ? "#b2dfdb" : "#dfb2b2";
        input.value = threshold;

        button.addEventListener("click", async () => {
            isFiltered = !isFiltered;
            await GM.setValue(`is${filterType}Filtered`, isFiltered);

            button.textContent = isFiltered ? `${filterType} filter on` : `${filterType} filter off`;
            button.style.backgroundColor = isFiltered ? "#b2dfdb" : "#dfb2b2";
            await applyItemFilterBySize();
        });

        input.addEventListener("input", async () => {
            threshold = parseFloat(input.value);
            await GM.setValue(`${filterType.toLowerCase()}FilterThreshold`, threshold);
            if (isFiltered) {
                await applyItemFilterBySize();
            }
        });
    }

    async function initializeFilter() {
        const buttonTarget = itemsFoundElement;
        if (!buttonTarget) return;

        const { minButton, maxButton, minInput, maxInput } = createFilterControls(buttonTarget);

        await setupFilter(minButton, minInput, true);
        await setupFilter(maxButton, maxInput, false);
        await applyItemFilterBySize();
    }

    async function applyItemFilterBySize() {
        const minFiltered = await GM.getValue("isMinFiltered", false);
        const maxFiltered = await GM.getValue("isMaxFiltered", false);
        const minThreshold = await GM.getValue("minFilterThreshold", 1);
        const maxThreshold = await GM.getValue("maxFilterThreshold", 10);

        document.querySelectorAll("b.cpill").forEach((element) => {
            const size = parseFloat(element.innerText);
            const parentElement = element.parentElement.parentElement.parentElement;

            if (parentElement && size) {
                const itemBelowGb = !element.className.includes("red-pill");
                const hideMin = minFiltered && (size < minThreshold || itemBelowGb);
                const hideMax = maxFiltered && size > maxThreshold && !itemBelowGb;

                if (hideMin || hideMax) {
                    parentElement.classList.add("hidden-item");
                } else {
                    parentElement.classList.remove("hidden-item");
                }
            }
        });
    }

    // Check if toggle buttons already exist
    const existingMinButton = document.getElementById("filter-min-size-button");
    const existingMaxButton = document.getElementById("filter-max-size-button");
    if (!existingMinButton && !existingMaxButton) {
        initializeFilter();
    } else {
        applyItemFilterBySize();
    }
}

async function main() {
    // automatic reload on server errors
    const ERROR_TITLES = ["Web server is returning an unknown error", "525: SSL handshake failed"];
    if (ERROR_TITLES.some((error) => document.title.includes(error))) {
        const RELOAD_DELAY = 5 * 60 * 1000;
        console.log("Web server error detected. Waiting 5 minutes before reloading...");
        return setTimeout(() => location.reload(), RELOAD_DELAY);
    }

    setStylesAndFavicon();

    addMenuCommand();

    // handle search results
    if (/\/search/.test(currentPath)) {
        itemFilterBySize();
        addClickAllMagnetLinks();
        await processLinksInSearchResults();

        observeSearchResultsChange();
        observeNewSearchResults();
    } else if (/\/magnet/.test(currentPath)) {
        // BT4G only: torrent detail page
        const link = document.querySelector('a[href*="/hash/"]:not([href^="magnet:"])');
        const hash = extractHashFromUrl(link?.href || "");
        const torrentName = document.querySelector("body main h3")?.textContent;
        if (hash) {
            insertMagnetLink(link, hash, torrentName);
        }
    }
}

main();
