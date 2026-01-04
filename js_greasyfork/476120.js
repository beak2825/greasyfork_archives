// ==UserScript==
// @name         LOLZ_Sueta
// @namespace    LOLZ_Sueta
// @version      0.3
// @description  Removing ignored users on the market.
// @author       el9in
// @match        https://lolz.guru/*
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/476120/LOLZ_Sueta.user.js
// @updateURL https://update.greasyfork.org/scripts/476120/LOLZ_Sueta.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('keydown', function(event) {
        if (event.altKey && (event.key === 'с' || event.key === 'c')) {
            const selectedText = window.getSelection().toString();
            document.execCommand('insertText', false, selectedText + ':sueta:');
        }
    });
})();