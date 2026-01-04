// ==UserScript==
// @name         30secondsofcode 清爽版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  清除 30secondsofcode 上的广告
// @author       chenwen6591
// @license MIT
// @match        https://www.30secondsofcode.org/articles/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454958/30secondsofcode%20%E6%B8%85%E7%88%BD%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/454958/30secondsofcode%20%E6%B8%85%E7%88%BD%E7%89%88.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function () {
  "use strict";

  $(document).ready(() => {});

  window.onload = () => {
    removeADS();
  };

  function removeADS() {
    $(".google-auto-placed").remove();
    $(".cookie-consent-popup").remove();
    $(".adsbygoogle").remove();
  }
})();
