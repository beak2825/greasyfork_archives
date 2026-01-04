// ==UserScript==
// @name         Immersive Reader
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Read in Immersive Reader
// @author       You
// @match        https://*/*
// @match        http://*/*
// @match        read://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=readfog.com
// @grant        GM_registerMenuCommand
// @grant        GM.openInTab
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444034/Immersive%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/444034/Immersive%20Reader.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function getPageURL(url) {
    if (typeof url != 'string') return null;
    const m1 = /^https:\/\/www\.signalhire\.com\/sorry\?continue=([^=&]+)/.exec(url);
    let eurl = ''; // URIComponent
    if (m1) eurl = m1[1];
    try {
      if (eurl && typeof eurl == 'string') url = decodeURIComponent(eurl); // avoid URI malformed
    } catch (e) {}
    return url;
  }

  function turnPlain() {
    const url = getPageURL(location.href);
    const nurl = `read://${url}`;

      GM.openInTab(nurl, false);

  }


  if (!/^read:\/\//.test(location.href)) {

    new Promise(() => {
      GM_registerMenuCommand("Switch to Immersive Reader", turnPlain, "I");
    })

  }





})();