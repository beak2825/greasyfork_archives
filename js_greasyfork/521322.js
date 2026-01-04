// ==UserScript==
// @name        Old Reddit Mobile Reader
// @namespace   Violentmonkey Scripts
// @match       http://old.reddit.com/*
// @match       https://old.reddit.com/*
// @grant       none
// @version     0.3
// @author      j239872933
// @description Make old.reddit.com mobile friendly by moving sidebar to the top and hiding some non-essential elements.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/521322/Old%20Reddit%20Mobile%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/521322/Old%20Reddit%20Mobile%20Reader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $('html').prepend(`<meta name="viewport" content="width=device-width, initial-scale=1"/>`);
    $('head').append(`
<style type="text/css">
  .side {
    float: none;
  }
  .linkinfo,
  .premium-banner-outer,
  .titlebox,
  .infobar,
  .sidecontentbox,
  .read-next-container {
    display: none !important;
  }
  .content[role="main"],
  .commentarea,
  .sitetable {
    margin-right: 0px !important;
  }
</style>`);
  //  {
})();