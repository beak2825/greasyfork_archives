// ==UserScript==
// @name         fix vimium for google search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world
// @author       xianmua
// @include      https://www.google*/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464401/fix%20vimium%20for%20google%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/464401/fix%20vimium%20for%20google%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let inputField = document.querySelector('textarea[name=q]'); // replace with the selector for the input field
    inputField.addEventListener('focus', function() {
        inputField.selectionStart = inputField.selectionEnd = inputField.value.length;
    });
})();