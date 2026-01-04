// ==UserScript==
// @name         Instagram video downloader
// @namespace    http://lbreda.com/
// @version      1.3
// @description  Adds a download link for instagram videos in the one-image pages
// @author       Lorenzo Breda
// @match        https://*.instagram.com/p/*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/370064/Instagram%20video%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/370064/Instagram%20video%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM.xmlHttpRequest({
        method: 'GET',
        url: window.location.href,
        onload: function(response) {
            var parser = new DOMParser();
            var resDocument = parser.parseFromString(response.responseText, 'text/html');
            if(resDocument.querySelector('meta[property="og:video"]') && resDocument.querySelector('meta[property="og:video"]').content){
                var a = document.createElement('a');
                var container = document.querySelector('.ltpMr.Slqrh');
                a.href = resDocument.querySelector('meta[property="og:video"]').content;
                a.style.width = '24px';
                a.style.height = '24px';
                a.style.margin = '8px';
                a.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAV1BMVEUAAAAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAsPlAec59cAAAAHHRSTlMAAQUHCQoRGBkcHz9AUFZecYCVqLTK0dPp7ff5cWDvugAAAG1JREFUKFPFjUcOgDAMBE0vCb0n/v87IZZBCeQIYuTDakfyAnxAqRFHn5B48IcIN7xoHNNfvcodEZxGFeDC5tGz8fRkbn1HT5YoaDKoKK8pCZ6dE4Cas7AF6mE5o3QE0cbmPGJqzQlr3IbH32IHtA8TFl6BBTUAAAAASUVORK5CYII=')";
                a.setAttribute('download','');
                container.appendChild(a);
            }
        }
    });
})();
