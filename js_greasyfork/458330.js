// ==UserScript==
// @name Erome Video Download Links
// @namespace greasyfork.org
// @icon https://www.erome.com/android-chrome-192x192.png
// @description Exposes video-download links for erome media galleries
// @include http://erome.com/*
// @include http://*.erome.com/*
// @include https://erome.com/*
// @include https://*.erome.com/*
// @run-at document-end
// @copyright 2023 malakai
// @grant  GM_download
// @author malakai
// @version 1.0
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/458330/Erome%20Video%20Download%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/458330/Erome%20Video%20Download%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let addLink = function(media) {
        let tagName = media.tagName;
let src;
let sourceElement = media.querySelector('source');
            src = !src && sourceElement ? sourceElement.src : '';

        let br = document.createElement('br');
        let link = document.createElement('a');
        link.setAttribute('href', src);
        link.download = '';
        link.textContent = 'DOWNLOAD' + ': ' + src.split('/').pop();
        link.target = '_blank';
        link.rel = 'noopener';
link.onclick = function(e) {
e.preventDefault();
let src = e.target.href;
let fname = src.split('/').pop();
GM_download(src,fname);
};
        media.parentElement.parentElement.appendChild(link);
        media.parentElement.parentElement.appendChild(br);
    }

    let init = function() {
        let mediaElements = document.querySelectorAll('.media-group .video video');

        for (let i = 0; i < mediaElements.length; i++) {
            let media = mediaElements[i];
            addLink(media);
        }
    }

    window.addEventListener('DOMContentLoaded', init, false);
})();