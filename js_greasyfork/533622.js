// ==UserScript==
// @name         Titan High‑Res Loader
// @description  Automatically forces Titan India’s product images to load at full 1000×1000 resolution.
// @match        https://www.titan.co.in/*
// @run-at       document-end
// @license      N/A
// @version 0.0.1.20250422110253
// @namespace https://greasyfork.org/users/1460930
// @downloadURL https://update.greasyfork.org/scripts/533622/Titan%20High%E2%80%91Res%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/533622/Titan%20High%E2%80%91Res%20Loader.meta.js
// ==/UserScript==
(function(){
  document.querySelectorAll('img[src*="?sw="]').forEach(img => {
    img.src = img.src.replace(/sw=\d+&sh=\d+/, 'sw=1000&sh=1000');
  });
})();