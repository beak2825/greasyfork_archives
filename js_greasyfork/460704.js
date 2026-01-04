// ==UserScript==
// @name         Youtube helper (fixed)
// @namespace    unik
// @version      0.4
// @description  Removes "thanks", "download", "clip" and "description" buttons, also removes "Do you want to continue?" popup in the playlist
// @author       Murka, unik
// @match        *://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/a14aba22/img/favicon_144x144.png
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=250853
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/460704/Youtube%20helper%20%28fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/460704/Youtube%20helper%20%28fixed%29.meta.js
// ==/UserScript==

const SELECTOR_BTNS = "#content #actions #menu #top-level-buttons-computed, " +
                      "#content #actions #menu #flexible-item-buttons";

window.addEventListener('load', function() {
    const log = console.log;

    waitForElems({
        sel: SELECTOR_BTNS,
        onmatch: function(item) {
            const exclude = ["SHARE", "OFFLINE_DOWNLOAD", "MONEY_HEART", "CONTENT_CUT", "INFO"];
            for (const child of item.children) {
                const data = child.__data && child.__data.data;
                const iconType = data && (data.defaultIcon && data.defaultIcon.iconType || data.icon && data.icon.iconType);
                if (iconType && exclude.includes(iconType)) {
                    child.style.display = "none";
                }
                child.style.fontSize = "1em";
            }
        },
    });
}, false);
