// ==UserScript==
// @name    去除csdn需要登录才能复制和关注才能复制
// @require https://cdn.bootcdn.net/ajax/libs/jquery/1.11.1/jquery.min.js
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  使用js修改css解除限制-csdn需要登录才能复制和关注才能复制
// @author       zx01785233@qq.com
// @match       *.csdn.net/*
// @grant        none
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/447156/%E5%8E%BB%E9%99%A4csdn%E9%9C%80%E8%A6%81%E7%99%BB%E5%BD%95%E6%89%8D%E8%83%BD%E5%A4%8D%E5%88%B6%E5%92%8C%E5%85%B3%E6%B3%A8%E6%89%8D%E8%83%BD%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/447156/%E5%8E%BB%E9%99%A4csdn%E9%9C%80%E8%A6%81%E7%99%BB%E5%BD%95%E6%89%8D%E8%83%BD%E5%A4%8D%E5%88%B6%E5%92%8C%E5%85%B3%E6%B3%A8%E6%89%8D%E8%83%BD%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    //去除小尾巴
    [...document.querySelectorAll('*')].forEach(item=>{
        item.oncopy = function(e) {
            e.stopPropagation();
        }
    })

    //插入样式的方法
    var importStyle=function importStyle(b){var a=document.createElement("style"),c=document;c.getElementsByTagName("head")[0].appendChild(a);if(a.styleSheet){a.styleSheet.cssText=b}else{a.appendChild(c.createTextNode(b))}};

    var localHost = location.host; //当前路径
    var localAddress = ""; //当前所在网站
    if (localHost.indexOf("csdn.net") > -1) {
        localAddress = "CSDN";
    }



    if(localAddress == "CSDN"){
        //去NM的登录复制 *blog.csdn.net/*
        importStyle('#content_views pre code {user-select: text !important;');//调用
        importStyle('#content_views pre  {user-select: text !important;');//调用
         //关注ni** csdn
        if($('#article_content').length){
          $('#article_content').css('height','auto')
        }
    }


})();