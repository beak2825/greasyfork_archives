// ==UserScript==
// @name         就是不登录知乎
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  拒绝登录知乎
// @author       thyxsl
// @match        https://*.zhihu.com/*
// @match        https://v.vzuu.com/video/*
// @match        https://video.zhihu.com/video/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/417127/%E5%B0%B1%E6%98%AF%E4%B8%8D%E7%99%BB%E5%BD%95%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/417127/%E5%B0%B1%E6%98%AF%E4%B8%8D%E7%99%BB%E5%BD%95%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(function() {
       noSticky()
       nologin()
    })

    // 去除登录
    function nologin() {
      var id = setInterval(function() {
           if($(".undefined ").length === 1) {
                $(".undefined ").remove()
                $("html").css("overflow", "auto")
                clearInterval(id)
           }
        }, 100)
    }

    // 去除右侧信息栏
    function noSticky() {
       $(".Sticky").remove()
       $(".Question-sideColumn--sticky").remove()
       $(".Question-mainColumn").css("width", "100%")
    }
})();