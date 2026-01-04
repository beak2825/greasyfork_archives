// ==UserScript==
// @name         Tampermonkey Check and Logic for Iframe
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Works for petridish and localhost with specific logic through iframe.
// @author       You
// @match        https://petridish.pw/test/*
// @match        https://petri.pw/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523846/Tampermonkey%20Check%20and%20Logic%20for%20Iframe.user.js
// @updateURL https://update.greasyfork.org/scripts/523846/Tampermonkey%20Check%20and%20Logic%20for%20Iframe.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const url = window.location.href;
    if (url.startsWith("https://petridish.pw/test/")) {
if (window.location.pathname !== '/test/x') {
    window.location.href = `https://petridish.pw/test/x${window.location.hash}`;
    return;
}
window.stop();
document.documentElement.innerHTML = "";
fetch('https://itana.pw/ru/', {
    method: 'GET',
    headers: { 'Content-Type': 'text/html' },
})
.then(response => response.text())
.then(data => {
    document.open();
    document.write(data);
    document.close();
})
.catch(error => console.error('Ошибка:', error));
        console.log("Tampermonkey active on petridish.pw");
        window.scriptActive = true;
    } else if (url.startsWith("https://petri.pw/")) {
        console.log("Tampermonkey active on petri.pw");
        // Скрыть баннер на localhost, если скрипт активен
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        const iframe = document.getElementById('iframe-petridish');
        if (iframe) {
            iframe.onload = function() {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const iframeOverlay = iframeDoc.getElementById('overlay');
                if (iframeOverlay) {
                    iframeOverlay.style.display = 'none';
                }
            };
        }
    } else {
        console.warn("Tampermonkey not configured for this domain.");
    }
})();
