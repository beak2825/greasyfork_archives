// ==UserScript==
// @name           谷歌学术镜像网站广告屏蔽助手
// @author         wusuluren
// @description    屏蔽谷歌学术镜像网站上的广告
// @require        http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match          *://scholar.uulucky.com/*
// @match          *://scholar.fdwwr.cn/*
// @match          *://scholar.90h6.cn:1668/*
// @supportURL     https://github.com/Wusuluren
// @version        0.0.1
// @grant          None
// @namespace https://greasyfork.org/users/194747
// @downloadURL https://update.greasyfork.org/scripts/370089/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E9%95%9C%E5%83%8F%E7%BD%91%E7%AB%99%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/370089/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E9%95%9C%E5%83%8F%E7%BD%91%E7%AB%99%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';
    
    var timer1 = setInterval(function(){
      if($('#gs_res_ccl_bot > iframe:nth-child(4)')) {
          $('#gs_res_ccl_bot > iframe:nth-child(4)').remove();
          clearInterval(timer1)
       }   
    }, 10)
    var timer2 = setInterval(function(){
       if($('#gs_res_ccl_bot > iframe:nth-child(5)')) {
          $('#gs_res_ccl_bot > iframe:nth-child(5)').remove();
          clearInterval(timer2)
       }
    }, 10)
 
})();
