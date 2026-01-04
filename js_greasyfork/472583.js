// ==UserScript==
// @name         Old Github languages bar
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  move the languages bar to the top like the old github
// @author       jrvgr
// @match        https://github.com/*/*
// @exclude      https://github.com/*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/472583/Old%20Github%20languages%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/472583/Old%20Github%20languages%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    shiftLayout()
    if (window.onurlchange === null) addEventListener('urlchange', shiftLayout);

    function shiftLayout() {
    setTimeout(() => {
    const cell = document.querySelector(".BorderGrid-row:has(li > .mr-3 > svg")
    const langs = document.querySelector(".BorderGrid-row ul:has(li > .mr-3 > svg)")
    const bar = document.querySelector(".mb-2:has(.Progress > span.Progress-item.color-bg-success-emphasis)")
    const legacyNewPlace = document.querySelector(".Layout-main div")
    const newPlace = document.querySelector("div[data-selector='repos-split-pane-content'] div:has(div + div) div")
    if (newPlace) {
        newPlace.insertAdjacentElement("afterEnd", bar)
        bar.insertAdjacentElement("afterEnd", langs)
    } else {
        legacyNewPlace.insertAdjacentElement("afterEnd", bar)
        bar.insertAdjacentElement("afterEnd", langs)
    }
    langs.setAttribute('style', 'margin-bottom: 1em !important; display: flex; justify-content: space-evenly; flex-wrap: wrap; background: var(--color-notifications-row-read-bg); border-radius: 5px; border: var(--color-bg-discussions-row-emoji-box) 1px solid; box-sizing: border-box; padding: 5px; padding-bottom: 3px; margin-top: 10px;');
    cell.remove()
    }, 0)
    }
})();