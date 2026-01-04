// ==UserScript==
// @name         Pico论坛替换title
// @namespace    Pico_title_replace
// @version      0.2
// @description  Pico论坛自动替换title，包含帖子详情、版块详情、个人主页
// @author       维克牛
// @match        https://bbs.picovr.com/*
// @icon         https://zstatic.picovr.com/pico/global/imgs/header/favicon.ico
// @grant        none


//脚本编写日期：2022年03月19日
//第二次更新：2022年09月27日

// @downloadURL https://update.greasyfork.org/scripts/441734/Pico%E8%AE%BA%E5%9D%9B%E6%9B%BF%E6%8D%A2title.user.js
// @updateURL https://update.greasyfork.org/scripts/441734/Pico%E8%AE%BA%E5%9D%9B%E6%9B%BF%E6%8D%A2title.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        if (document.URL.includes("post/") )
        {
            var title ="帖子-"+ document.getElementsByClassName("index__titleText__c0Gll community-post-title-text")[0].innerHTML;
            document.title=title;
            //alert(title);
        }
        else if (document.URL.includes("category/"))
        {
           var cat="版块-"+document.getElementsByClassName("pico-typography index__title___71vLP")[0].innerHTML;
            document.title=cat;
        }

        else if (document.URL.includes("user/"))
        {
            var user ="个人-"+ document.getElementsByClassName("index__userName___R7Kz0")[0].innerHTML;
            document.title=user;
        }
        else {}

},1000);



})();
