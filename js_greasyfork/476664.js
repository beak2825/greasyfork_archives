// ==UserScript==
// @name         CCF Captcha Blocker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  CCF Captcha Blocker!
// @author       none
// @match        *://*.noi.cn/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476664/CCF%20Captcha%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/476664/CCF%20Captcha%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElements() {
        // Select the elements to remove
        var img = document.querySelector('#codeImg');
        var hiddenCheckCode = document.querySelector('#hiddenCheckCode');
        var checkCode = document.querySelector('#checkCode');

        // Loop through the elements and remove them
        if (img) {
            img.remove();
        }
        if (hiddenCheckCode) {
            hiddenCheckCode.remove();
        }
        if (checkCode) {
            checkCode.remove();
        }
    }

    // Call the removeElements function when the page is loaded
    window.onload = removeElements;
})();