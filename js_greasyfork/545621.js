// ==UserScript==
// @name         Quozio Panel Image Copier
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a button next to the quote to copy the image (auto-refreshes if image changes)
// @author       fishcat2431
// @match        https://quozio.com/quote/*
// @grant        GM_setClipboard
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/545621/Quozio%20Panel%20Image%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/545621/Quozio%20Panel%20Image%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastImgSrc = null;
    let btn = null;

    function addOrUpdateButton() {
        const panel = document.querySelector(".quote-edit-image-panel.text-center.small-scroll");
        if (!panel) return;
        const img = panel.querySelector("img");
        if (!img) return;

        if (!btn) {
            btn = document.createElement("button");
            btn.id = "copyImageSrcBtn";
            btn.textContent = "Copy Image URL";
            btn.style.marginLeft = "10px";
            btn.style.padding = "5px 10px";
            btn.style.cursor = "pointer";
            btn.addEventListener("click", function() {
                GM_setClipboard(lastImgSrc);
                btn.textContent = "Copied!";
                setTimeout(() => btn.textContent = "Copy Image URL", 1500);
            });
            panel.parentNode.insertBefore(btn, panel.nextSibling);

            new MutationObserver(() => {
                if (img.src !== lastImgSrc) lastImgSrc = img.src;
            }).observe(img, { attributes: true, attributeFilter: ["src"] });
        }

        lastImgSrc = img.src;
    }

    addOrUpdateButton();
    new MutationObserver(addOrUpdateButton).observe(document.body, { childList: true, subtree: true });
})();
