// ==UserScript==
// @name         Remove ChatGPT Bottom Bar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to Tampermonkey to remove ChatGPT's bottom bar for easy clipping or making full-page screenshots. To use it, open any chat in ChatGPT, press on Tampermonkey Icon and then click "Remove Bottom Input Bar".
// @author       psxvoid
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chat.openai.com
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461223/Remove%20ChatGPT%20Bottom%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/461223/Remove%20ChatGPT%20Bottom%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_registerMenuCommand('Remove Bottom Input Bar', () => {
        document.getElementsByTagName("form")[0].parentElement.remove();
    }, 'r');
})();