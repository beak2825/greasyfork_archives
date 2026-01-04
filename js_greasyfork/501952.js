// ==UserScript==
// @name Even Better Erome download links
// @namespace sleazyfork.org
// @icon https://www.erome.com/android-chrome-192x192.png
// @description Exposes media-download links for erome media galleries
// @match http://erome.com/*
// @match http://*.erome.com/*
// @match https://erome.com/*
// @match https://*.erome.com/*
// @match https://erome.fan/*
// @grant none
// @run-at document-end
// @copyright 2025 hltl
// @grant        none
// @author the-juju & hltl
// @version 1.0.3
// @license MIT
// Credits : https://greasyfork.org/en/scripts/415766-erome-download-links/
// Credits : https://sleazyfork.org/en/scripts/426236-better-erome-download-links

// @downloadURL https://update.greasyfork.org/scripts/501952/Even%20Better%20Erome%20download%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/501952/Even%20Better%20Erome%20download%20links.meta.js
// ==/UserScript==

function AddLinks() {
    'use strict';

    var addLink = function(media) {
        // Exit early if the element is the blur image
        if(media.parentElement.getAttribute('class') == "img-blur"){
            return
        }

        var tagName = media.tagName;
        var src = ''

        if (tagName === 'IMG'){
          var linkdata = media.getAttribute('data-src');
          if(linkdata == null || linkdata.includes("data:image")){
            linkdata = media.getAttribute('src')
          }
          src = linkdata;
        }

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
        var mediaElements = document.querySelectorAll('.video video, .img img');
        for (var i = 0; i < mediaElements.length; i++) {
          var media = mediaElements[i];
          if(! media.getAttribute("linkAdded")){
            media.setAttribute("linkAdded","true");
            addLink(media);
          }
        }
    }
    init();
};

window.addEventListener('load', AddLinks, false);
document.addEventListener('DOMContentLoaded', AddLinks, false);
// Use the Jquery event from Erome
$('#page').on( 'append.infiniteScroll', function( event, body, path, items, response ) {
  AddLinks();
});
