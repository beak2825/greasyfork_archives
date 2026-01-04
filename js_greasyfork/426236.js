// ==UserScript==
// @name Better Erome download links
// @namespace greasyfork.org
// @icon https://www.erome.com/android-chrome-192x192.png
// @description Exposes media-download links for erome media galleries
// @include http://erome.com/*
// @include http://*.erome.com/*
// @include https://erome.com/*
// @include https://*.erome.com/*
// @grant none
// @run-at document-end
// @copyright 2021 the-juju
// @grant        none
// @author the-juju
// @version 1.0.2
// @license MIT
// Credits : https://greasyfork.org/en/scripts/415766-erome-download-links/

// @downloadURL https://update.greasyfork.org/scripts/426236/Better%20Erome%20download%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/426236/Better%20Erome%20download%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var addLink = function(media) {
        var tagName = media.tagName;
        var src = tagName === 'IMG' ? media.src || media.getAttribute('data-src') : '';

        if (tagName === 'VIDEO') {
            var sourceElement = media.querySelector('source');
            src = !src && sourceElement ? sourceElement.src : '';
        }

        var br = document.createElement('br');
        var link = document.createElement('a');
        link.setAttribute('href', src);
        link.download = '';
        link.textContent = tagName + ': ' + src;
        link.target = '_blank';
        link.rel = 'noopener';

        media.parentElement.parentElement.appendChild(link);
        media.parentElement.parentElement.appendChild(br);
    }

    var init = function() {
        var mediaElements = document.querySelectorAll('.media-group .video video, .media-group .img img');

        for (var i = 0; i < mediaElements.length; i++) {
            var media = mediaElements[i];
            addLink(media);
        }
    }

    window.addEventListener('load', init, false);
    document.addEventListener('DOMContentLoaded', init, false);
})();