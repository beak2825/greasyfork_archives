// ==UserScript==
// @name         Nejire Skip Preview
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  ねじれのプレビュー画面をスキップします。
// @author       euro_s
// @match        http://nejiten.halfmoon.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=halfmoon.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449559/Nejire%20Skip%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/449559/Nejire%20Skip%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if (document.querySelector('input[name="prv"]')) {
        document.querySelector('input[type="submit"]').click();
    }
    document.querySelector('textarea.whisper_textarea').parentElement.parentElement.style.display = 'none';
})();