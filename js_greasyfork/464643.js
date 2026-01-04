// ==UserScript==
// @name        SC: get fullsize artwork
// @namespace   Violentmonkey Scripts
// @match       https://soundcloud.com/*
// @match       https://*.sndcdn.com/*
// @grant       none
// @version     0.1.9
// @author      -
// @description click artwork to get fullsize original. configurable to open in new tab, put URL on clipboard, etc.
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/464643/SC%3A%20get%20fullsize%20artwork.user.js
// @updateURL https://update.greasyfork.org/scripts/464643/SC%3A%20get%20fullsize%20artwork.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // config
  const openInTab     = true;  // open art in new tab
  const useClipboard  = false; // put URL on clipboard
  const runEverywhere = false; // run everywhere, homepage/feed/etc.
  const doAvatars     = false; // run on avatars
  // end config

  if (window.location.href.includes('soundcloud.com') ) {
    document.querySelector('body').addEventListener('click', checkImage, true);
  } else {
    // sometimes the original image is .png
    if (document.body.textContent.includes('403 Forbidden') ) {
      window.location = window.location.href.replace(/\.jpg$/, '.png');
    }
  }

  function checkImage(evt) {
    const t = evt.target;
    if (t.nodeName == 'SPAN' && t.classList.contains('sc-artwork') ) {
      var url = t.style.backgroundImage
                    .split('"')[1]
                    .replace(/-t\d{2,4}x\d{2,4}\.(jpg|png)/, '-original.$1');
      if (!url) {
        console.log('error finding image url');
        return;
      }
      //console.log(url);

      if (!runEverywhere && !document.querySelector('div.l-listen-hero') ) {
         return;
      }
      if (!doAvatars && url.includes('/avatars-') ) {
        return;
      }

      evt.preventDefault();
      evt.stopPropagation();

      if (useClipboard) { navigator.clipboard.writeText(url); }
      if (openInTab)    { window.open(url); }
    }
   }

})();