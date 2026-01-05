// ==UserScript==
// @name         自动删除店小秘VIP提示
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://www.dianxiaomi.com
// @match        *://www.dianxiaomi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28477/%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E5%BA%97%E5%B0%8F%E7%A7%98VIP%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/28477/%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E5%BA%97%E5%B0%8F%E7%A7%98VIP%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // test sync
    $('#expireVipShowModal').remove();
    $('body').removeClass('modal-open');
})();