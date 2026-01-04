// ==UserScript==
// @name         TAB shortcut-key play voice for Duolingo
// @namespace    TAB shortcut-key play voice for Duolingo
// @version      0.8
// @description  TAB shortcut-key play voice for Duolingo (タブキーで発音を聞く)
// @author       meguru
// @license MIT
// @match        *://*.duolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393911/TAB%20shortcut-key%20play%20voice%20for%20Duolingo.user.js
// @updateURL https://update.greasyfork.org/scripts/393911/TAB%20shortcut-key%20play%20voice%20for%20Duolingo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function playSound(evt) {
        const key = {
            tab: 9,
            a: 65
        }

        if (evt.keyCode === key.tab) {
            document.dispatchEvent(new KeyboardEvent("keydown", { key: " ", ctrlKey: true }));
            evt.preventDefault();
        }
    }

    document.addEventListener("keydown", playSound, false);
})();
