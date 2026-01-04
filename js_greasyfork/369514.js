// ==UserScript==
// @name         知乎去除链接跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  暴力替换知乎页面的链接, 去除知乎重定向, 直接跳转到页面
// @author       Ericwyn
// @match        https://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369514/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/369514/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //替换所有链接
    function replaceAllLink() {
        var as = document.getElementsByTagName("a");
        for(var i=0;i<as.length;i++){
            if(as[i].href.indexOf("link.zhihu.com/?target=")!==-1) {
                as[i].href = decodeURIComponent(
                    as[i].href.replace("http://link.zhihu.com/?target=", "")
                        .replace("https://link.zhihu.com/?target=", ""));
            }
        }
    }
    //给所有得加载更多按钮都加上监听
    function replaecAllMoreBtnFun() {
        var btns = document.getElementsByClassName("ContentItem-more");
        for (var i=0;i<btns.length;i++){
            btns[i].onclick = function (ev) {
                setTimeout(replaceAllLink,800);
            }
        }
    }
    //载入页面的时候加入一次
    setTimeout(replaceAllLink,600);
    replaecAllMoreBtnFun();
    //每1秒执行一次
    var offHeight_Q09ESU5HTXlTZWxG = document.body.offsetHeight;
    var offHeight_Q09ESU5HTXlTZWxG_TEMP = 0;
    setInterval(function () {
        if ((offHeight_Q09ESU5HTXlTZWxG_TEMP = document.body.offsetHeight) !== offHeight_Q09ESU5HTXlTZWxG){
            offHeight_Q09ESU5HTXlTZWxG = offHeight_Q09ESU5HTXlTZWxG_TEMP;
            setTimeout(replaceAllLink,600);
            replaecAllMoreBtnFun();
        }
    },1000);
})();