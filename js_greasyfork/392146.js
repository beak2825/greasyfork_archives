// ==UserScript==
// @name         e-typing_keyboard_hidden
// @namespace    e-typing_keyboard_hidden
// @version      0.1
// @description  Tampermonkeyでe-typingのキーボード表示を消す
// @author       meguru
// @match        https://www.e-typing.ne.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392146/e-typing_keyboard_hidden.user.js
// @updateURL https://update.greasyfork.org/scripts/392146/e-typing_keyboard_hidden.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function () {
        const config = {
            attributes: true,
            childList: true,
            subtree: true
        }
        const observer = new MutationObserver(function () {
            const target = document.querySelector('#virtual_keyboard')
            if (target != null) {
                target.style.visibility = 'hidden'
            }
        })
        observer.observe(document.body, config);
    }) ();
})();