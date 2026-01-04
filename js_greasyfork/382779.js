// ==UserScript==
// @name         动漫狂(動漫狂) 移动版 跳过广告
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  ADSkip
// @author       Lien
// @match        http://www.comicmad.fun8.us/m/loading/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382779/%E5%8A%A8%E6%BC%AB%E7%8B%82%28%E5%8B%95%E6%BC%AB%E7%8B%82%29%20%E7%A7%BB%E5%8A%A8%E7%89%88%20%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/382779/%E5%8A%A8%E6%BC%AB%E7%8B%82%28%E5%8B%95%E6%BC%AB%E7%8B%82%29%20%E7%A7%BB%E5%8A%A8%E7%89%88%20%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var url = document.URL;
    //alert(url);
    var arrUrl = url.split("//");
    var start = arrUrl[1].indexOf("/",25);
    if(start>0){
        var target="http://www.cartoonmad.com/m/comic" + arrUrl[1].substring(start);
        //alert(target);
        window.location.href=target;
        //window.open(target);
        //setTimeout(window.close(),5000);
    }
})();