// ==UserScript==
// @name        KAT Link Unshortener
// @namespace   Violentmonkey Scripts
// @include     /^http?s:\/\/(thekat|kickasstorrents|kkickass|kkat|kickass-kat|kickasst|kickasshydra)\..+\/.+/
// @grant       none
// @version     0.1
// @author      Samad Khafi
// @license     MIT
// @description Removes link shorteners from all kickass websites.
// @downloadURL https://update.greasyfork.org/scripts/444592/KAT%20Link%20Unshortener.user.js
// @updateURL https://update.greasyfork.org/scripts/444592/KAT%20Link%20Unshortener.meta.js
// ==/UserScript==

(function() {
  console.log("KAT Link Unshortener started...");
  var links = document.getElementsByTagName("a");
  for(var i=0;i < links.length; i++){
    if(links[i].href.indexOf("mylink") != -1) {
      links[i].href = decodeURIComponent(links[i].href.split("?url=")[1]);
    }
  }
})();
