// ==UserScript==
// @name                Redgifs Tweaks
// @namespace           https://greasyfork.org/users/821661
// @match               https://www.redgifs.com/*
// @exclude-match       https://www.redgifs.com/ifr/*
// @grant               GM_addStyle
// @grant               GM_xmlhttpRequest
// @run-at              document-start
// @version             0.5.0
// @author              hdyzen
// @description         tweaks for redgifs page
// @license             MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/496197/Redgifs%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/496197/Redgifs%20Tweaks.meta.js
// ==/UserScript==

const gifsURLS = new Map();

function observerInit() {
    const mutationsHandler = (mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === "attributes" && mutation.target.classList.contains("GifPreview")) {
                const likeButton = mutation.target.querySelector(".sideBarItem:has(.LikeButton)");

                if (!likeButton || likeButton.nextElementSibling.querySelector(".download-button")) return;

                const gifID = mutation.target.getAttribute("data-feed-item-id");
                if (!gifID) {
                    throw new Error("Gif ID not found!");
                }

                likeButton.insertAdjacentHTML("afterend", getDownloadButton(gifID));

                const entriesDL = likeButton.nextElementSibling.querySelectorAll("[data-url]");
                addListenerToEntries(entriesDL);
            }
        }
    };

    const observer = new MutationObserver(mutationsHandler);

    observer.observe(document.documentElement, {
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
    });
}
observerInit();

function patchJSONParse() {
    const originalJParse = JSON.parse;

    JSON.parse = function (text, reviver) {
        const result = originalJParse.call(this, text, reviver);

        if (Array.isArray(result.gifs)) {
            result.gifs = result.gifs.filter((gif) => {
                if (gif.cta !== null) return false;

                gifsURLS.set(gif.id, gif.urls);
                return true;
            });
        }

        return result;
    };
}
patchJSONParse();

function addListenerToEntries(entries) {
    for (const entry of entries) {
        entry.addEventListener("click", downloadAsBlob);
    }
}

async function downloadAsBlob(ev) {
    const vUrl = ev.target.dataset.url;
    const abort = ev.target._abortReq?.abort;

    if (abort) abort();

    const dlPromise = new Promise((resolve, reject) => {
        const req = GM_xmlhttpRequest({
            method: "GET",
            url: vUrl,
            responseType: "blob",

            onload: (res) => resolve(res),
            onerror: (err) => reject(err),
            onabort: () => reject(new Error("aborted")),

            onprogress(evt) {
                const loaded = (evt.loaded / evt.total) * 100;
                const progress = (loaded / 100) * ev.target.offsetWidth;

                ev.target.style.boxShadow = `${progress}px 0 0 0 rgba(192, 28, 119, 0.5) inset`;
            },
        });

        ev.target._abortReq = req;
    });

    try {
        const res = await dlPromise;
        const blobUrl = URL.createObjectURL(res.response);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = vUrl.split("/").at(-1);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    } catch (err) {
        console.log("Erro on download:", err);
    }
}

function getDownloadButton(gifID) {
    const gifURLS = gifsURLS.get(gifID);
    let buttonsHTML = "";
    const buttonsOrders = {
        hd: "0",
        sd: "1",
        silent: "2",
        poster: "3",
        thumbnail: "4",
    };

    for (const key in gifURLS) {
        if (key === "html") continue;

        buttonsHTML += `<button data-url="${gifURLS[key]}" style="order: ${buttonsOrders[key] || "5"}" class="item">${key}</button>`;
    }

    const sidebarItem = `
        <li class="sideBarItem">
            <div class="download-button">
                <label for="${gifID}" class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512" width="42">
                        <path d="M336 176h40a40 40 0 0140 40v208a40 40 0 01-40 40H136a40 40 0 01-40-40V216a40 40 0 0140-40h40"
                            fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32">
                        </path>
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"
                            d="M176 272l80 80 80-80M256 48v288"></path>
                    </svg>
                </label>
                <input type="checkbox" name="${gifID}" id="${gifID}" hidden>
                <div class="list">
                    ${buttonsHTML}
                </div >
            </div >
        </li>
    `;

    return sidebarItem;
}

GM_addStyle(`
    /* Annoyances */
    .sideBarItem:has(.liveAdButton), .InformationBar_ishalloween {
        display: none !important;
    }
    .topNav-wrap > div:not([class]), .OnlyFansCreatorsSidebar {
        visibility: hidden !important;
        opacity: 0 !important;
    }
    /* Download button/list */
    .download-button {
        position: relative;
    }
    .download-button svg {
        width: 42px !important;
        height: 42px !important;
    }
    .download-button .icon {
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
    }
    .download-button > input:checked +.list {
        visibility: visible;
        opacity: 1;
    }
    .download-button .list {
        visibility: hidden;
        opacity: 0;
        display: flex;
        justify-content: center;
        align-content: center;
        flex-direction: column;
        font-size: 1rem;
        background: rgb(10, 10, 10, .8);
        backdrop-filter: blur(20px);
        position: absolute;
        bottom: 0;
        right: 100%;
        width: max-content;
        border-radius: 0.75rem;
        border-start-end-radius: 0.25rem;
        overflow: hidden;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, .6);
        border: 1px solid rgba(255, 255, 255, .05);
        transition: .2s ease;

        & > .item {
            padding: .5rem 1rem;
            background: none;
            border: none;
            color: #fff;
            transition: .3s ease background-color;
        }
        & > .item:hover {
            background: rgb(255, 255, 255, .1);
            cursor: pointer;
        }
    }
`);
