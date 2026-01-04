// ==UserScript==
// @name         删除icon
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  删除通知头像icon
// @author       望月由爱
// @license MIT
// @match        https://sstm.moe/notifications/*
// @icon         https://s.sstmlt.com/board/monthly_2017_06/logo_1479532980294_5d1829.png.7c198e484115f85daaf0f04963f81954.png.418af10c64761f5ef969fe30c7992a40.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524758/%E5%88%A0%E9%99%A4icon.user.js
// @updateURL https://update.greasyfork.org/scripts/524758/%E5%88%A0%E9%99%A4icon.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.querySelectorAll(".ipsDataItem_icon").forEach(e => e.remove());
})();