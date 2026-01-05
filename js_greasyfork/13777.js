// ==UserScript==
// @name        Rutracker.org Magnet URLs
// @namespace   http://darkdaskin.tk/
// @description Transforms info hash into a magnet url
// @include     http://rutracker.org/*
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13777/Rutrackerorg%20Magnet%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/13777/Rutrackerorg%20Magnet%20URLs.meta.js
// ==/UserScript==

function makeMagnet(element) {
   var hash = element.textContent;
    if (/^[0-9A-F]{40}$/.test(hash)) {
       element.innerHTML = '<a href="magnet:?xt=urn:btih:' + hash + '">' + hash + '</a>';
    }
}

if (/closed=1/.test(location.search)) {
   var hashElements = document.querySelectorAll('i[data-timestamp] + i');
   for (var i = 0; i < hashElements.length; i++) {
      makeMagnet(hashElements[i]);
   }
} else {
   var hashElement = document.getElementById('tor-hash');
   if (hashElement) makeMagnet(hashElement);
}