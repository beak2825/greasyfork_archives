// ==UserScript==
// @name         战旗清理弹幕
// @namespace    com.jh
// @version      0.2
// @description  自动清理战旗弹幕，改善因弹幕池弹幕过多造成直播卡顿。
// @description  去除了快捷键，并改变了弹幕自动清理的策略，从以前的按时间清理
// @description  改成了按弹幕池数量清理，一旦弹幕数量大于150条就会触发清理操作。
// @description  这种通过监控弹幕数量的方式来执行清理，会更加的有效和具有针对性，在弹幕短时间高能刷屏时能发挥更大的效果
// @description  如果有什么建议和反馈可以通过邮箱1210060701@qq.com来和我交流
// @author       haogg
// @match        *://www.zhanqi.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28081/%E6%88%98%E6%97%97%E6%B8%85%E7%90%86%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/28081/%E6%88%98%E6%97%97%E6%B8%85%E7%90%86%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
   //阈值
    var threshold=150;
    //每隔1秒检查一次弹幕池的数量
    window.setInterval(clear,1000);
    function clear(){
        //如果当前累积弹幕数量大于阈值就清除
        if(getListLength()>threshold){
        var m=document.getElementsByClassName("clear-screen-btn js-hover-btn");
        m[0].click();
        }
    }
    //获取当前累积的弹幕数量
    function getListLength(){
        var msgList=document.getElementsByClassName("js-chat-msg-list");
       return msgList[0].getElementsByTagName("li").length ;
    }
})();
