// ==UserScript==
// @name         Namu Wiki Korean Only (Auto redirect from English or Japanese version)
// @namespace    https://mkpo.li/
// @version      0.1.0
// @description  Auto redirect from machines translated versions to Korean version of Namu Wiki
// @author       mkpoli
// @match        https://ja.namu.wiki/*
// @match        https://en.namu.wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=namu.wiki
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500898/Namu%20Wiki%20Korean%20Only%20%28Auto%20redirect%20from%20English%20or%20Japanese%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/500898/Namu%20Wiki%20Korean%20Only%20%28Auto%20redirect%20from%20English%20or%20Japanese%20version%29.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const path = window.location.pathname;
  window.location.href = `https://namu.wiki/trdr?redirect=${encodeURI(path)}`;
})();