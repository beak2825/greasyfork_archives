// ==UserScript==
// @name         CSDN优化
// @namespace    http://happyers.top
// @version      0.1
// @description  去广告，净化剪切板，自动展开全文，免登录
// @author       HAPPY
// @match        https://blog.csdn.net/*
// @match        http://blog.csdn.net/*
// @grant        none
// @icon         https://csdnimg.cn/public/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/388439/CSDN%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/388439/CSDN%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


var sideInterval = 500; //设置多少时间(ms)后去除广告


function expand(){
    var ok = false;
    var e = $('.hide-article-box');
    if(e.length > 0){
        ok = true;
        e.remove();
        $('#article_content').removeAttr('style');
    }
    if (document.getElementsByClassName("comment-list-box")[0]){
        document.getElementsByClassName("comment-list-box")[0].removeAttribute("style");
    } //自动展开评论
}

function remove_ad(){
    var element = document.querySelector("#asideFooter > div:nth-child(1)");
    element.parentNode.removeChild(element);

    setTimeout(function () {
        var hot = document.getElementsByClassName("type_hot_word");
        var recommend = document.getElementsByClassName("recommend-ad-box");
        for (var i = (hot.length - 1); i >= 0; i--) {
            hot[i].remove();
        }
        for (var j = (recommend.length - 1); j >= 0; j--) {
            recommend[j].remove();
        }
        if (document.getElementsByClassName("fourth_column")[0]) {
            document.getElementsByClassName("fourth_column")[0].remove();
        }
    }, sideInterval);//去除底部推荐中的广告
}

(function() {
    remove_ad();//去广告
    csdn.copyright.init("", "", ""); //去除剪贴板劫持
    localStorage.setItem("anonymousUserLimit", ""); // 免登陆
    expand();// 自动展开全文
})();