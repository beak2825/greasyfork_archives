// ==UserScript==
// @name         show-1688-member-id
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在1688详情页中供应商ID
// @author       Rex
// @match        *://detail.1688.com/offer/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381513/show-1688-member-id.user.js
// @updateURL https://update.greasyfork.org/scripts/381513/show-1688-member-id.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var memberId = iDetailConfig ? iDetailConfig.memberid : (WolfSmoke ? WolfSmoke.member_id: "");
    var $memberId = document.createElement('div');
    $memberId.style.display = 'flow-root';
    $memberId.innerHTML = "<span style='float: right; margin-right: 120px'>供应商ID：<strong style='font-size: 16pt; color: red; user-select: all; cursor: copy;'>" + memberId + "</strong></span>";

    var $header = document.querySelector('#site_header-box');
    $header.parentNode.insertBefore($memberId, $header.nextSibling)
})();
