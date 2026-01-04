// ==UserScript==
// @name        Clean TikTok
// @name:es     Clean TikTok
// @version      0.2
// @description  Redirect Tiktok's videos to offtiktok for a clean view
// @description:es      Redirige los videos de Tiktok a offtiktok para una vista limpia
// @author       johnromerobot
// @license      MIT
// @match        *://www.tiktok.com/*/video/*
// @namespace    https://greasyfork.org/users/1243768
// @downloadURL https://update.greasyfork.org/scripts/502293/Clean%20TikTok.user.js
// @updateURL https://update.greasyfork.org/scripts/502293/Clean%20TikTok.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var url = window.location.href;

  if (url.includes('/video/')) {
      var nuevaUrl = url.replace(/www\.tiktok\.com/, "www.offtiktok.com");
      window.location.href = nuevaUrl;
  }
})();