// ==UserScript==
// @name         更好地使用B站
// @namespace    https://greasyfork.org/zh-CN/
// @version      0.1.3
// @description  网站样式编辑
// @author       rogermmg@gmail.com
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @require https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477919/%E6%9B%B4%E5%A5%BD%E5%9C%B0%E4%BD%BF%E7%94%A8B%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/477919/%E6%9B%B4%E5%A5%BD%E5%9C%B0%E4%BD%BF%E7%94%A8B%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function b(){;
        // 添加样式
        var css2 = '<style>\
           .scroll-btn{display:none}\
           .flashed{position:fixed;right:90px}\
           .flashed button{width: 40px;height: 84px;display: flex;justify-content: center;}\
           .flashed{z-index: 999999;}\
        </style>';
        $('.win').before(css2);

        //无推荐栏
        $('.recommended-swipe.grid-anchor').remove();

        // 添加刷新
        var flashed ='<div class="flashed"><button class="primary-btn"><span class="primary-btn-text">换一批</span></button></div>';
        $('.bili-feed4-layout').before(flashed);
        // 点击刷新
        $('.flashed').click(function(){
           localStorage.setItem("scrollPosition", '130');
           location.reload();
        });
    }

    // 去插入广告
    function rmAd(divName){
        divName.forEach(item=>{
           $('.'+item).each(function(){
            var href = $(this).find('a').attr('href');
            //console.log(index,href);
            if(href.indexOf('cm.bilibili.com')>=0){
                $(this).remove();
            }
           })
        })
    }

    //开始滚动
    function slIng(){
        var position = localStorage.getItem("scrollPosition");
         if(position !== null) {
             $(window).scrollTop(position);
             localStorage.removeItem("scrollPosition");
         }
    }

    window.addEventListener('load', function() {
    // 加载完成后执行的代码
        slIng();
        b();
        rmAd(['feed-card','bili-video-card']);
        console.log('运行成功');
   }, false);
})();