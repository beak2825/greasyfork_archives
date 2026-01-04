// ==UserScript==
// @name          ACS Embed
// @namespace     raiyansarker
// @version       1.1
// @description   Get rid of the annoying embed and open the actual page in a new tab
// @author        raiyansarker
// @match         https://*.aparsclassroom.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant         GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/468170/ACS%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/468170/ACS%20Embed.meta.js
// ==/UserScript==

(function () {
  'use strict';
  window.addEventListener('load', () => {
    const element = document.querySelectorAll('iframe');

    Object.keys(element).forEach((index) => {
      if (element[index].src.includes('youtube')) {
        const url = new URL(element[index].src);
        const redirectUrl = `${url.origin}/watch?v=${
          url.pathname.split('/')[2]
        }`;
        GM_setClipboard(redirectUrl, 'text');
        alert('Link copied to clipboard');
      }
    });
  });
})();
