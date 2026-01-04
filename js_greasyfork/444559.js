// ==UserScript==
// @name         希赛网文字复制
// @namespace    fartpig
// @version      0.1
// @description  允许在希赛网复制文字
// @author       fartpig
// @match        *://wangxiao.xisaiwang.com/*
// @grant        unsafeWindow
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444559/%E5%B8%8C%E8%B5%9B%E7%BD%91%E6%96%87%E5%AD%97%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/444559/%E5%B8%8C%E8%B5%9B%E7%BD%91%E6%96%87%E5%AD%97%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(!$){
        var s = document.createElement ("script");
        s.src = "http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js";
        s.async = false;
        document.documentElement.appendChild (s);
    }

    $(document).ready(function(){
        $('body').css("user-select","auto");
    });
})();