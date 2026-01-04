// ==UserScript==
// @name         删除CSDN页面广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除页面广告
// @author       Ink足迹
// @grant        none
// @include      *://blog.csdn.net*
// @include      *://bbs.csdn.net*
// @note         2018-08-14 17:16 删除CSDN页面广告
// @downloadURL https://update.greasyfork.org/scripts/373957/%E5%88%A0%E9%99%A4CSDN%E9%A1%B5%E9%9D%A2%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/373957/%E5%88%A0%E9%99%A4CSDN%E9%A1%B5%E9%9D%A2%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var localHost = location.host; //当前路径
    var localAddress = ""; //当前所在网站
    if (localHost.indexOf("csdn.net") > -1) {
        localAddress = "CSDN";
    }
    if ("CSDN" === localAddress) {
        // Class集合
        var className = ["box-box-default", "pulllog-box", "box-shadow", "mediav_ad"];
        // ID集合
        var eleId = ["asideFooter", "_360_interactive", "ad_pop"];
        // 元素标签集合
        var tagName = ["iframe"];

        removeClassName(className);
        removeIdName(eleId);
        removeTagName(tagName);
        console.clear();
    }
    // 通过Class删除
    function removeClassName(className) {
        for (var i = 0; i < className.length; i++) {
            var classDom = document.getElementsByClassName(className[i]);
            for (var j = 0; j < classDom.length; j++) {
                classDom[j].remove();
            }
        }
    }
    // 通过ID删除
    function removeIdName(eleId) {
        for (var m = 0; m < eleId.length; m++) {
            var idDom = document.getElementById(eleId[m]);
            if (idDom) {
                idDom.remove();
            }
        }
    }
    // 通过元素标签删除
    function removeTagName(tagName) {
        for (var d = 0; d < tagName.length; d++) {
            var tagDom = document.getElementsByTagName(tagName[d]);
            for (var f = 0; f < tagDom.length; f++) {
                tagDom[f].remove();
            }
        }
    }
    // 页面滚动事件
    function mouseWheel() {
        document.body.onmousewheel = function(e){
            console.debug(e.wheelDelta)
            if (e.wheelDelta < 0) { // 当滑轮向下滚动时
                console.log("滑轮向下滚动");
            }
        }
    }
})();