// ==UserScript==
// @name         LessAds
// @version      0.6
// @author       wolfissimo
// @description  reduce annoying ads on some webpages
// @match        https://*.duden.de/*
// @match        https://*.echo-online.de/*
// @match        https://*.hessentoday.de/*
// @run-at       document-body
// @copyright    wolfissimo 07.04.2023 / 15.03.2024
// @namespace    https://greasyfork.org/users/139428
// @downloadURL https://update.greasyfork.org/scripts/463467/LessAds.user.js
// @updateURL https://update.greasyfork.org/scripts/463467/LessAds.meta.js
// ==/UserScript==


// ***** Use RE_addStyle instead of GM_addStyle to work with both Gear Browser and Userscripts *****
if (typeof RE_addStyle == 'undefined') {
  this.RE_addStyle = (aCss) => {
    'use strict';
    let head = document.querySelector('head');
    if (head) {
      let style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = aCss;
      head.appendChild(style);
      return style;
    }
    return null;
  };
}


// ***** CSS *****

//duden.de
RE_addStyle ('#aab-overlay {display:none !important}');

//echo-online.de
RE_addStyle ('#cmpbox, #cmpbox2, [data-testid^="ad-stroer-"], [data-testid^="adBlockerLayer"] {display:none !important}');
RE_addStyle ('body {overflow:scroll !important}');
RE_addStyle ('.XheaderNotificationWrapper, .headerBanner {display:none !important}');
