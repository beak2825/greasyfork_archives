// ==UserScript==
// @name         Loop News AdBlock
// @namespace    https://github.com/AbdurazaaqMohammed
// @version      1.0
// @description  Remove ads on Loop News
// @author       Abdurazaaq Mohammed
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @match        https://*.loopnews.com/*
// @license      The Unlicense
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521714/Loop%20News%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/521714/Loop%20News%20AdBlock.meta.js
// ==/UserScript==
(function() {
  (document.head || document.documentElement).appendChild(document.createElement('style')).textContent = '.sponsored_section, .vuukle-ads *, #taboola-below-article-thumbnails, .ads-area, .top-ads, .img_ad, .eu-cookie-compliance-banner, .adsbygoogle { display: none !important; } .vuukle-ads {min-height: 0px !important;height:0px !important; width:0px !important;}';
})();