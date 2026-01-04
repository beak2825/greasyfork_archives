// ==UserScript==
// @name         微博视频关闭播放下一个
// @version      1.0.3
// @description  微博视频自动播放
// @include      http*://weibo.com/tv/*
// @match        http*://weibo.com/tv/*
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @namespace https://greasyfork.org/users/177790
// @downloadURL https://update.greasyfork.org/scripts/40217/%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E5%85%B3%E9%97%AD%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/40217/%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E5%85%B3%E9%97%AD%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){
        if($CONFIG.islogin==0){
               document.querySelector(".wb_tv_switch> input[type='checkbox']").remove();
           }
    } ,3000);
})();