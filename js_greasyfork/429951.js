// ==UserScript==
// @name        取消hamivideo暂停广告
// @namespace   gqqnbig
// @match       https://hamivideo.hinet.net/hamivideo/play/*
// @grant       GM_addStyle
// @version     1.0
// @author      gqqnbig
// @description 在hamivideo暂停时，不再显示遮挡视频的广告和黑屏。
// @downloadURL https://update.greasyfork.org/scripts/429951/%E5%8F%96%E6%B6%88hamivideo%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/429951/%E5%8F%96%E6%B6%88hamivideo%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
 
    GM_addStyle(`#overlays-ad {
    display:none !important;
}`);
})();