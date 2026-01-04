// ==UserScript==
// @name            YouTube Preview Handle
// @namespace       outrowed
// @description     This userscript will preview/show handle right next to channel name.
// @author          outrowed
// @version         1.0.0
// @grant           none
// @comment         YouTube is a single-app website, which mean when you're when navigating on it, YouTube doesn't really change the page, rather changing some DOM elements on the spot. This match is needed to run the script correctly when that happens.
// @match           *://www.youtube.com/*
// @comment         This is what only neccessary to run the userscript. Do note, you can remove the match above, but in some cases, like navigating from "youtube.com" to "youtube.com/watch?v=...", the script may not execute.
// @match           *://www.youtube.com/watch
// @match           *://www.youtube.com/post/*
// @run-at          document-end
// @license         GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/455298/YouTube%20Preview%20Handle.user.js
// @updateURL https://update.greasyfork.org/scripts/455298/YouTube%20Preview%20Handle.meta.js
// ==/UserScript==

// CONFIG

const previewHandleOnVidPlayerPage = true;
const previewHandleOnPostPage = true;
const globalInterval = 10;

//

addStyle(`
    .yt-handle {
        margin-left: 5px;
        font-size: 1.4rem;
        color: var(--yt-spec-text-secondary);
    }
`);

const onUrlChange = (() => {
    let tasks = [];

    setInterval(() => {
        tasks.forEach((i, ind) =>
            i.check(window.location.href) && (i.callback(), i.once && tasks.splice(ind, 1)));
    }, globalInterval);

    return (check, callback, { once = true } = {}) => {
        tasks.push({ check, callback, once });
    };
})();

VidChannelName: previewHandleOnVidPlayerPage && onUrlChange
(url => url.includes("www.youtube.com/watch?v="), async () => {
    const { anchor, handleContainer, qHandleText } = addHandle({
        anchor: await awaitElement(`#meta #upload-info #channel-name a`),
        pos: await awaitElement("#meta #upload-info #channel-name"),
    });
    
    new MutationObserver(() => {
        handleContainer.textContent = qHandleText();
    }).observe(anchor, { childList: true });
});

PostChannelName: previewHandleOnPostPage && onUrlChange
(url => url.includes("www.youtube.com/post/"), async () => {
    const { anchor, handleContainer, qHandleText } = addHandle({
        anchor: await awaitElement(`#header-author > a`),
        pos: await awaitElement("#header-author"),
    });

    onUrlChange(url =>
        url.includes("www.youtube.com/post/"),
        () => {
            anchor.href.includes("/channel/")
                ? handleContainer.hidden = true
                : handleContainer.hidden = false;
                
            handleContainer.textContent = qHandleText();
        },
        { once: false });
});

function awaitElement(query) {
    return new Promise((rest) => {
        const interval = setInterval(() => {
            const result = document.querySelector(query);

            if (result) {
                rest(result);
                clearInterval(interval);
            }
        }, globalInterval);
    });
}

function addHandle({ anchor, pos }) {
    /** @returns {string} */
    const qHandleText = () =>
        anchor.href.includes("/@")
            ? "@" + anchor.href.split("@")[1]
            : anchor.href.substring(anchor.href.indexOf("/c/"));
    /** @type {HTMLElement} */
    const chanme = pos;
    const handleContainer = document.createElement("div");

    handleContainer.className = "yt-handle";
    handleContainer.textContent = qHandleText();

    chanme.appendChild(handleContainer);

    return { anchor, handleContainer, qHandleText };
}

function addStyle(style) {
    const styleElem = document.createElement("style");
    styleElem.innerText = style;
    document.documentElement.append(styleElem);
}