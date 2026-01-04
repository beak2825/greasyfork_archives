// ==UserScript==
// @name         删CSDN广告
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  删掉CSDN广告
// @author       懒得写
// @grant        none
// @include      *://blog.csdn.net*
// @include      *://bbs.csdn.net*
// @downloadURL https://update.greasyfork.org/scripts/408152/%E5%88%A0CSDN%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/408152/%E5%88%A0CSDN%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var localHost = location.host; //路径
    var localAddress = ""; //网站
    if (localHost.indexOf("csdn.net") > -1) {
        localAddress = "CSDN";
    }
    if ("CSDN" === localAddress) {
        // Class
        var className = ["box-box-default", "pulllog-box", "box-shadow", "mediav_ad"];
        // ID
        var eleId = ["asideFooter", "_360_interactive", "ad_pop"];
        // 元素
        var tagName = ["iframe"];

        removeClass(className);
        removeId(eleId);
        removeTag(tagName);
        console.clear();
    }
    // 删Class
    function removeClass(className) {
        for (var i = 1; i <= className.length; i++) {
            var classDom = document.getElementsByClassName(className[i]);
            for (var j = 1; j <= classDom.length; j++) {
                classDom[j].remove();
            }
        }
    }
    // 删ID
    function removeId(eleId) {
        for (var m = 1; m <= eleId.length; m++) {
            var idDom = document.getElementById(eleId[m]);
            if (idDom) {
                idDom.remove();
            }
        }
    }
    // 删元素
    function removeTag(tagName) {
        for (var d = 1; d <= tagName.length; d++) {
            var tagDom = document.getElementsByTagName(tagName[d]);
            for (var f = 1; f <= tagDom.length; f++) {
                tagDom[f].remove();
            }
        }
    }
    // 滚动
    function mouseWheel() {
        document.body.onmousewheel = function(e){
            console.debug(e.wheelDelta)
            if (e.wheelDelta < 0) { // 向下滚
                console.log("下滚");
            }
        }
    }
})();