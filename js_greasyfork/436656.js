// ==UserScript==
// @name         hao123首页去广告
// @namespace    mrnianj@hotmail.com
// @version      0.1
// @icon         https://i0.hdslb.com/bfs/article/22c554f415718a12b04bd1bd5c0e0d195be382cc.gif
// @description  hao123首页精简，支持logo自定义
// @author       mrnianj
// @homepageURL  none
// @match        *://www.hao123.com/*
// @grant        none
// @license      none
// @require      https://code.jquery.com/jquery-3.0.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/436656/hao123%E9%A6%96%E9%A1%B5%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/436656/hao123%E9%A6%96%E9%A1%B5%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    const cycle = 1000*5; // 广告检测周期（毫秒）
    const firstcycle = 20; // 第一次广告检测周期
    let isagain = true; // 是否循环检测
    const logurl = 'https://www.bing.com/th/id/OGC.f5fdac42703d2dc3b3b8f3c48040755a?pid=1.7&rurl=https%3a%2f%2fimg.zcool.cn%2fcommunity%2f01fe7e5b20e106a80121bbecefcfbc.gif&ehk=fF7pT%2fA0vVUR4hUSmQXaqPY7057Z6yRGnVcSliYO3Hg%3d';//替换 logo 地址
    function myRemove (id){
      //$(id).css('display','none');
      $(id).remove();
    }

    let classname = [
        "#topbeWrapper",//顶部广告
        "#lefttip",// 左侧悬浮广告
        ".siye",// 右侧顶部广告
        ".rightTip",// 右下广告
        "#box-famous-resource",// 横幅广告
        ".bottom-banner-link-wrapper",// 底部广告
        ".wm"// 推荐栏广告
    ]
    let timer = setInterval(() => {
          $(".hao123logourl img").attr('src',logurl);
          $.each(classname, function (indexInArray, valueOfElement) { 
            myRemove(valueOfElement)
          });
          clearInterval(timer);
          if (isagain){
            setInterval(() => {
                $.each(classname, function (indexInArray, valueOfElement) { 
                    myRemove(valueOfElement)
                });
            },cycle)
          }
    },firstcycle) 
})(jQuery);