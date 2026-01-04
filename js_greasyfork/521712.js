// ==UserScript==
// @name         Trinidad Express AdBlock
// @namespace    https://github.com/AbdurazaaqMohammed
// @version      1.0
// @description  Remove ads on Trinidad Express
// @author       Abdurazaaq Mohammed
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @match        https://trinidadexpress.com/*
// @match        https://trinidadexpress.com/
// @match        https://trinidadexpress-tto.newsmemory.com/*
// @match        https://trinidadexpresslanding-tto.newsmemory.com/
// @match        https://www.expressclassifiedstt.com/*
// @license      The Unlicense
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521712/Trinidad%20Express%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/521712/Trinidad%20Express%20AdBlock.meta.js
// ==/UserScript==
(function() {
  (document.head || document.documentElement).appendChild(document.createElement('style')).textContent = '.autors-widget, #taboola-below-article-thumbnails, .ad_rotator_actions, #ad_position_box, #adrotator, #aditems, .tnt-ads-container, .img_ad, .ad-space, .adsbygoogle { display: none !important; }';
})();