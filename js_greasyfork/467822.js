// ==UserScript==
// @name         P3DM Timer Bypass
// @description  Download page timer bypass
// @description:ru Обход таймера страницы загрузки
// @namespace    Violentmonkey Scripts
// @icon         https://www.google.com/s2/favicons?sz=64&domain=p3dm.ru
// @version      1.0.2
// @author       Wizzergod
// @license MIT
// @match        https://p3dm.ru/download-en.html*
// @match        https://p3dm.ru/download-*.html*
// @match        https://p3dm.ru/download.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467822/P3DM%20Timer%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/467822/P3DM%20Timer%20Bypass.meta.js
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

    function createButton(newLink) {
        var downloadsPage = document.querySelector('.downloads_page');
        if (downloadsPage) {

            var linkPlace = document.getElementById('linkPlace');
            if (linkPlace) {
                linkPlace.style.display = 'none';
            }

            var download = document.querySelector('.download');
            if (download) {
                download.style.display = 'none';
            }

            var button = document.createElement('a');
            button.href = newLink;
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
            button.style.minWidth = '20.21%';
            button.style.height = '30px';
            button.style.padding = '20px';
            button.style.fontSize = '1.3em';
            button.style.textDecoration = 'none';
            button.style.color = '#ffffff';
            button.style.backgroundColor = '#28a745';
            button.style.border = 'solid 1px #333';
            button.style.borderRadius = '3px';
            button.style.oBorderRadius = '3px';
            button.style.mozBorderRadius = '3px';
            button.style.webkitBorderRadius = '3px';

            var icon = document.createElement('span');
            icon.className = 'icon-download';
            icon.style.marginRight = '5px';
            button.appendChild(icon);

            var buttonText = document.createElement('span');
            buttonText.textContent = 'DOWNLOAD';
            button.appendChild(buttonText);

            downloadsPage.appendChild(button);
        }
    }

    function decryptAndCreateButton() {
        var newLink = getDecryptedLink();
        createButton(newLink);
    }

    decryptAndCreateButton();
})();