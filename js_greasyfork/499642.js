// ==UserScript==
// @name         Imgur Direct Images
// @version      1.0.1
// @description  Direct images on Imgur including albums
// @namespace    https://github.com/AbdurazaaqMohammed
// @author       Abdurazaaq Mohammed
// @license      The Unlicense
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @match        https://imgur.com/*
// @exclude      https://imgur.com/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/499642/Imgur%20Direct%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/499642/Imgur%20Direct%20Images.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const url = window.location.href;

  if(url.includes('/a/')) {
             // Try to clean the crap. If you try to hide all elements imgur will redirect to the homepage for some reason.
             document.head.appendChild(document.createElement('style')).innerHTML = 'a:not(.Gallery-Content--media) { display: none !important; } *{ background-color: black !important; }';
             const intervalID = setInterval(function() {


        const images = document.querySelectorAll('.Gallery-Content--media img');
        if(images[0]) {
          const links = [];
          clearInterval(intervalID);
          images.forEach(image => {
            const directLink = image.src.split('?')[0].replace('_d.', '.'); //_d is a lower quality image.
            if(!links.includes(directLink)) links.push(directLink); // For some reason it shows all links twice.
          });
          window.location.href = 'https://abdurazaaqmohammed.github.io/website/imgviewer?viewimg=' + links.join(',');
        }
    }, 200);
  } else {
    window.location.href = url.replace('imgur', 'i.imgur') + '.jpg'; // It always works even if it's not a jpg.
  }
})();