// ==UserScript==
// @name         csdn自动加载更多
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  自动加载csdn更多的内容并隐藏阅读更多按钮，不需要跳转登录。
// @author       段文康
// @match        http://blog.csdn.net/*/article/details/*
// @match        https://blog.csdn.net/*/article/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374938/csdn%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/374938/csdn%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';


    /*显示文字内容*/
    function showArticleContent(){
        var article_div = document.getElementById("article_content");
        if(article_div){
            article_div.style.height = "initial";
        }
    }

    /*隐藏加载更多按钮*/
    function hideMoreButton(){
        var btn_readmore = document.getElementsByClassName("hide-article-box");
        if(btn_readmore && btn_readmore.length>0){
            btn_readmore[0].style.display="none";
        }
    }
   
    /*隐藏登录*/
    function hideLogin(){
        var loginBox = document.getElementsByClassName("login-box");
        if(loginBox && loginBox.length>0){
            loginBox[0].style.display="none";
        }
    }


    setTimeout(function(){
        showArticleContent();
        hideMoreButton();
        hideLogin();
    },1000);
})();