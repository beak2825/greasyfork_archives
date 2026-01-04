// ==UserScript==
// @name         自动填充建行单笔新增
// @namespace    http://tampermonkey.net/
// @version      2025-07-25
// @description  自动填充建行单笔新增desc
// @author       imzhi <yxz_blue@126.com
// @match        https://marketpay.ccb.com/manage/merchantAccount/singleInsertNew*
// @match        https://marketpay.ccb.com/manage/merchantAccount/modifyNew*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ccb.com
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542078/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%BB%BA%E8%A1%8C%E5%8D%95%E7%AC%94%E6%96%B0%E5%A2%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/542078/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%BB%BA%E8%A1%8C%E5%8D%95%E7%AC%94%E6%96%B0%E5%A2%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自动填充胡总信息
    $('[name="ctcpsnNm"]').val('胡志高')
    $('#exdat').val('2044-11-13')
    $('[name="mrchCrdtNo"]').val('430626198901056419')
    $('[name="mblphNo"]').val('18008443244')
    $('#crdtTp').val('1010')
    // Your code here...
})();