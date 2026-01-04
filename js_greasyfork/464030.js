// ==UserScript==
// @name         自动加载Inoreader文章内容：auto load full content of articles in inoreader web
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动加载Inoreader文章全部内容，而非摘要：auto load full content of articles in inoreader web
// @author       leezw37
// @match        http*://*.inoreader.com/*/*
// @icon         http://www.inoreader.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464030/%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BDInoreader%E6%96%87%E7%AB%A0%E5%86%85%E5%AE%B9%EF%BC%9Aauto%20load%20full%20content%20of%20articles%20in%20inoreader%20web.user.js
// @updateURL https://update.greasyfork.org/scripts/464030/%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BDInoreader%E6%96%87%E7%AB%A0%E5%86%85%E5%AE%B9%EF%BC%9Aauto%20load%20full%20content%20of%20articles%20in%20inoreader%20web.meta.js
// ==/UserScript==

window.setInterval(function(){
    window.addEventListener("hashchange", myFunction());

    function myFunction(){
        var fulltext = document.getElementsByClassName("article_footer_buttons icon16 icon-article_topbar_mobilize_empty")[0];
        var mobilized = document.getElementsByClassName("article_content")[0];
        if (fulltext && mobilized){
            fulltext.click();
        }
    }
},2000);


/*
window.setInterval(function(){
    var isclick = false;
    window.addEventListener("hashchange", myFunction());
    //console.log("点击");

    function myFunction(){
//        window.setTimeout(function(){
            if(!isclick){
                var fulltext = document.getElementsByClassName("article_footer_buttons icon16 icon-article_topbar_mobilize_empty")[0];
                var mobilized = document.getElementsByClassName("article_content")[0];
                if (fulltext && mobilized){
                    isclick = true;
                    fulltext.click();
//                    console.log("点击");
                }
            };

//        },2000);
    };
},2000);
*/
