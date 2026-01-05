// ==UserScript==
// @name        Outlook without Ads
// @namespace   feifeihang.info
// @description Remove ads from Outlook
// @include     https://*.mail.live.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12270/Outlook%20without%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/12270/Outlook%20without%20Ads.meta.js
// ==/UserScript==
(function (window, document, undefined) {
  var style = document.createElement('style');
  style.innerHTML = '.WithRightRail {right: 0 !important;}' +
    ' #RightRailContainer {display: none !important;}';
  document.head.appendChild(style);
}) (this, this.document);
