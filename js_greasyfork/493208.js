// ==UserScript==
// @name         One-click-download-ficbook-epub
// @namespace    http://tampermonkey.net/
// @version      2024-04-19
// @license      MIT
// @description  Изменяет функцию кнопки скачать, позволяя в один клик скачать файл .epub
// @author       Vlad Apostol
// @match        http*://ficbook.net/readfic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ficbook.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493208/One-click-download-ficbook-epub.user.js
// @updateURL https://update.greasyfork.org/scripts/493208/One-click-download-ficbook-epub.meta.js
// ==/UserScript==

function start() {
    console.log("replace button_download");
    let button_download = document.querySelector('a[href$="/download"]');
    let url = button_download.href.replace("/download", "/epub").replace("/readfic", "/fanfic_download");
    button_download.href = url;
    button_download.onclick = "";
    button_download.style.backgroundColor = "#1c1c1c33";
}


(function() {
    window.addEventListener("load", start);
    if (document.readyState !== 'loading') {
        console.log("replace button_download loaded.");
        start();
        window.removeEventListener('load', start);
    }
})();