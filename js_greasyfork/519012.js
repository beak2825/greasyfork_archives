// ==UserScript==
// @name         nHentai arrow key navigation
// @version      1
// @license      MIT
// @namespace    _pc
// @description  Disables site script and adds arrow key navigation (next page, previous page etc.) best to be used together with the preloader for nHentai (see other scripts)
// @author       verydelight
// @icon         https://nhentai.net/favicon.ico
// @grant        none
// @match	     *://nhentai.net/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519012/nHentai%20arrow%20key%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/519012/nHentai%20arrow%20key%20navigation.meta.js
// ==/UserScript==
var csp = document.createElement("meta");
csp.setAttribute("http-equiv", "Content-Security-Policy");
csp.setAttribute("content", "script-src 'none'");
document.head.appendChild(csp);
(function() {
  'use strict';
  document.onkeyup = e => {
  const previousLink = document.querySelector('a.previous');
  const nextLink = document.querySelector('a.next');
  const goBackLink = document.querySelector('a.go-back');
  const coverLink = document.querySelector('div#cover > a');
      switch(e.key) {
      case 'ArrowLeft':
        if (previousLink) {
          previousLink.click();
        } else if (goBackLink) {
          goBackLink.click();
        } else {
          location.reload();
        }
        break;
      case 'ArrowRight':
        if (nextLink) {
          nextLink.click();
        } else if (goBackLink) {
          goBackLink.click();
        } else {
          coverLink.click();
        }
        break;
    }
  }
})();