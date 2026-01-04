// ==UserScript==
// @name         Instagram image downloader
// @namespace    http://lbreda.com/
// @version      1.2
// @description  Adds a download link for instagram images in the one-image pages
// @author       Lorenzo Breda
// @license      MIT
// @match        https://*.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370065/Instagram%20image%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/370065/Instagram%20image%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(document.querySelector('meta[property="og:image"]') && document.querySelector('meta[property="og:image"]').content && !document.querySelector('meta[property="og:video"]')){
        var a = document.createElement('a');
        var container = document.querySelector('.ltpMr.Slqrh');
        a.href = document.querySelector('meta[property="og:image"]').content;
        a.style.width = '24px';
        a.style.height = '24px';
        a.style.margin = '8px';
        a.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAV1BMVEUAAAAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAec59cAAAAHHRSTlMAAQUHCQoRGBkcHz9AUFZecYCVqLTK0dPp7ff5cWDvugAAAG1JREFUKFPFjUcOgDAMBE0vCb0n/v87IZZBCeQIYuTDakfyAnxAqRFHn5B48IcIN7xoHNNfvcodEZxGFeDC5tGz8fRkbn1HT5YoaDKoKK8pCZ6dE4Cas7AF6mE5o3QE0cbmPGJqzQlr3IbH32IHtA8TFl6BBTUAAAAASUVORK5CYII=')";
        a.setAttribute('download','');
        container.appendChild(a);
    }
})();