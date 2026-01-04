// ==UserScript==
// @name         微信读书沉浸式阅读（上划隐藏头部侧栏）
// @namespace    http://github.com/lossj
// @version      0.2.1
// @description  微信读书上划隐藏头部和侧栏，下滑显示头部和侧栏
// @author       LossJ
// @match        https://weread.qq.com/web/reader/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413731/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB%EF%BC%88%E4%B8%8A%E5%88%92%E9%9A%90%E8%97%8F%E5%A4%B4%E9%83%A8%E4%BE%A7%E6%A0%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/413731/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB%EF%BC%88%E4%B8%8A%E5%88%92%E9%9A%90%E8%97%8F%E5%A4%B4%E9%83%A8%E4%BE%A7%E6%A0%8F%EF%BC%89.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var windowTop=0;
    $(window).scroll(function(){
        let scrollS = $(this).scrollTop();
        let selBtn = document.querySelector('.readerTopBar');
        let readerControl = document.querySelector(".readerControls");
        if(scrollS >= windowTop){
            // 上划显示
            selBtn.style.opacity = 0;
            readerControl.style.opacity = 0;
            windowTop = scrollS;
        }else{
            // 下滑隐藏
            selBtn.style.opacity = 1;
            readerControl.style.opacity = 1;
            windowTop=scrollS;
        }
    });
})();