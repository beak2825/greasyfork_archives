// ==UserScript==
// @name        游民星空自动展开全文
// @namespace   Violentmonkey Scripts
// @match       https://wap.gamersky.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2021/5/14下午1:57:51
// @downloadURL https://update.greasyfork.org/scripts/426449/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/426449/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var showAll = $('.gsAreaContext')[0];
    showAll.style = null;
    var showAllBtn = $('.gsAreaContextOpen')[0];
    showAllBtn.style.display = 'none';
    var headerBtn = $('.ymw-header2019')[0];
    headerBtn.style.display = 'none';
    var appBtn = $('#gsTgWapConBdshareTop')[0];
    appBtn.style.display = 'none';
})();
