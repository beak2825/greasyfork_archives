// ==UserScript==
// @name         在线cron广告删除
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除页面div广告
// @author       zhoudong
// @grant        none
// @include      https://www.pppet.net/
// @downloadURL https://update.greasyfork.org/scripts/407430/%E5%9C%A8%E7%BA%BFcron%E5%B9%BF%E5%91%8A%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/407430/%E5%9C%A8%E7%BA%BFcron%E5%B9%BF%E5%91%8A%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var box = document.getElementsByClassName("easyui-layout layout");
    for(var i=0;i<box.length;i++){
        if (box[i] != null) {
            box[i].parentNode.removeChild(box[i]);
        }
    }
})();
