// ==UserScript==
// @name         json.cn去广告
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  json.cn去广告.
// @author       You
// @match        https://www.json.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432656/jsoncn%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/432656/jsoncn%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 移除底部广告条
    $('.footer-gg-b-addr-img').remove();
    // 右侧服务器广告
    $('.tool ul').remove();
    // csdn
    // 右侧
    $('#recommendAdBox').remove();
    $('.top-link-area').remove();
    // 顶部
    $('.toolbar-advert').remove();

    // 全屏
    $('#formatFullScreen').click();
    // 双11广告
    $('#shuangshi1Modal1 .close').click();
})();