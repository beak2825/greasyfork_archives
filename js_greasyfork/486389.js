// ==UserScript==
// @name         Streamable downloader
// @namespace    http://tampermonkey.net/
// @version      2024-02-03
// @description  Download easily streamable videos
// @author       Dziks0nn
// @match        https://streamable.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=streamable.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486389/Streamable%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/486389/Streamable%20downloader.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function() {
        var buttons = getElementByXpath("//*[@id=\"player-j50h9e-info\"]")
        var download_button = document.createElement('a')
        download_button.innerHTML = "Download";
        var download_link = download();
        download_button.href = download_link
        download_button.style.color = "red"
        buttons.appendChild(download_button)
    }, false);

    function download(){
        return document.querySelector('meta[property="og:video:secure_url"]').content
    }

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
})();