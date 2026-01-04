// ==UserScript==
// @name        cloudflare email protection decoder
// @namespace   https://github.com/jan-ale/
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      jan-ale
// @description polyfill-ish? useless if you have most javascript enabled
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/503879/cloudflare%20email%20protection%20decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/503879/cloudflare%20email%20protection%20decoder.meta.js
// ==/UserScript==

// thanks to https://blog.jse.li/posts/cloudflare-scrape-shield/ !
(() => {
  const protectedEmails = [...document.getElementsByClassName("__cf_email__")];
  for(email of protectedEmails) {
    let decodedEmail = "";
    const encodedEmail = email.getAttribute("data-cfemail");
    const key = parseInt(encodedEmail.slice(0,2),16);
    for(let i=2;i<encodedEmail.length-1;i+=2) {
      let num = parseInt(encodedEmail.slice(i,i+2),16);
      num ^= key;
      decodedEmail += String.fromCharCode(num);
    }
    email.parentNode.replaceChild(document.createTextNode(decodedEmail), email);
  }
})()