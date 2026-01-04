// ==UserScript==
// @name         P3DM Fast Download
// @description  Decryption and redirects by decrypted link
// @description:ru  Расшифровка и перенаправления по расшифрованой ссылке
// @namespace    Violentmonkey Scripts
// @icon         https://www.google.com/s2/favicons?sz=64&domain=p3dm.ru
// @version      1.0.2
// @author       Wizzergod
// @license MIT
// @match        https://p3dm.ru/download-en.html*
// @match        https://p3dm.ru/download-*.html*
// @match        https://p3dm.ru/download.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467821/P3DM%20Fast%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/467821/P3DM%20Fast%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function decryptCode(code) {
        return atob(code);
    }

    function getDecryptedLink() {
        var url = window.location.href;
        var startIndex = url.indexOf('?') + 1;
        var code = url.substring(startIndex);
        var decryptedCode = decryptCode(code);
        var newLink = decryptedCode;
        return newLink;
    }

    function navigateToDecryptedLink() {
        var newLink = getDecryptedLink();
        if (newLink) {
            window.location.href = newLink;
        }
    }

    navigateToDecryptedLink();
})();
