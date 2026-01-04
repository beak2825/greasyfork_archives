// ==UserScript==
// @name                Socialmediagirls pixeldrain use url bypass limit
// @namespace           https://greasyfork.org/users/821661
// @match               https://forums.socialmediagirls.com/*
// @grant               GM.xmlHttpRequest
// @version             1.0
// @run-at              document-start
// @author              hdyzen
// @description         it
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/527885/Socialmediagirls%20pixeldrain%20use%20url%20bypass%20limit.user.js
// @updateURL https://update.greasyfork.org/scripts/527885/Socialmediagirls%20pixeldrain%20use%20url%20bypass%20limit.meta.js
// ==/UserScript==

function bypassUrl(id) {
    return `https://pd.cybar.xyz/${id}`;
}

async function getIndividualIds(url) {
    const res = await GM.xmlHttpRequest({
        url: url,
    });

    return [...res.response.matchAll(/"id":"([^"]+)","name"/g)].map(e => e[1]);
}

async function processNode(node) {
    const url = node.dataset.url;
    const parts = url.split("/");
    const type = parts.at(-2);
    const id = parts.at(-1);

    if (type === "l") {
        const ids = await getIndividualIds(url);

        node.innerHTML = ids.map(e => `<a href="${bypassUrl(e)}">${bypassUrl(e)}</a>`).join("\n");
    } else {
        node.innerHTML = `<a href="${bypassUrl(id)}">${bypassUrl(id)}</a>`;
    }
}

function initObserver() {
    const handleMutations = async mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE && node.dataset.host === "pixeldrain.com") {
                    processNode(node);
                }
            }
        }
    };

    const observer = new MutationObserver(handleMutations);

    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
    });

    disObserver(observer);
}
initObserver();

function disObserver(observer) {
    document.addEventListener("DOMContentLoaded", e => {
        observer.disconnect();
    });
}
