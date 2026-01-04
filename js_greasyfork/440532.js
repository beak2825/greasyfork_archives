// ==UserScript==
// @name         腾讯学堂看得清
// @namespace    https://greasyfork.org/zh-CN/scripts/440532-%E8%85%BE%E8%AE%AF%E5%AD%A6%E5%A0%82%E7%9C%8B%E5%BE%97%E6%B8%85
// @version      0.1
// @description  让你看腾讯学堂的时候看的更清楚一点
// @author       SYJ
// @match        http://v8.learn.oa.com/user/net?act_id=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440532/%E8%85%BE%E8%AE%AF%E5%AD%A6%E5%A0%82%E7%9C%8B%E5%BE%97%E6%B8%85.user.js
// @updateURL https://update.greasyfork.org/scripts/440532/%E8%85%BE%E8%AE%AF%E5%AD%A6%E5%A0%82%E7%9C%8B%E5%BE%97%E6%B8%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var styleEl = document.createElement('style');

    $(styleEl).html('div#logoid {display: none} div#videoPlayerWrapper_watermark_xx512{display: none}');

    $("head").append(styleEl);
})();