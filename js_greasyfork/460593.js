// ==UserScript==
// @name         百度去广告、CSDN访问优化
// @namespace    http://tampermonkey.net/
// @version      1.8.2
// @description  优化CSDN访问以及复制代码功能解禁
// @author       啦A多梦
// @license      MIT
// @match        https://*.baidu.com/*
// @match        https://*.csdn.net/*/article/details/*
// @match        https://*.blog.csdn.net/*
// @match        https://www.ahsrst.cn/*
// @match        https://www.ruiwen.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460593/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%E3%80%81CSDN%E8%AE%BF%E9%97%AE%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/460593/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%E3%80%81CSDN%E8%AE%BF%E9%97%AE%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var $jq = jQuery.noConflict(true);
//    $jq('div[tpl="feed-ad"]').remove();
    setInterval(()=>{
        if($jq('div[tpl="feed-ad"]').length >= 1){
            console.log('发现首页广告,执行屏蔽操作');
           $jq('div[tpl="feed-ad"]').remove();
        }
        if($jq('.ec-tuiguang').length >= 1){
            console.log('发现推广广告,执行屏蔽操作');
           $jq('.ec-tuiguang').parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide();
        }
        if($jq(".c-gap-left").length >= 1 ){
            console.log("发现广告", $jq(".c-gap-left").length);
            $jq(".c-gap-left").parent().parent().hide();
        }
//        if($jq('div#1.result.c-container.new-pmd').length >= 1){
//            console.log('发现搜索页面广告,执行屏蔽操作');
//            $jq('div#1.result.c-container.new-pmd').remove();
//        }
//        $jq('.result-op:first').prevAll().hide();
    },300);

    //复制百度文库里面的内容
    document.addEventListener('keydown', (e)=>{
            if(window.location.host == 'wenku.baidu.com' && document.querySelector(".link").innerText != ''){
                if(e.ctrlKey && e.key == 'c' || e.ctrlKey && e.key == 'C'){
                    let wkText = document.querySelector(".link").innerText.split("查看全部包含“")[1].split("”的文档")[0];
                    navigator.clipboard.writeText(wkText);
                    console.log('Text is copyed');
                }
            }
    },true);
    //去除文库选定文本时候出现的干扰项
    if(window.location.host == 'wenku.baidu.com'){
        var wkstyle = document.createElement("style");
        wkstyle.innerHTML = "#reader-helper{display: none !important}";
        document.body.appendChild(wkstyle);
    }

    //CSDN增强
    try{
        document.getElementsByTagName("aside")[0].outerHTML = "";
        document.getElementById("rightAside").outerHTML = "";
        document.getElementsByTagName("main")[0].style.width = "100%";
        var sty = document.createElement("style");
        sty.type = "text\/css"
        sty.innerHTML = ".left-toolbox, .passport-login-container, .hide-preCode-box{display: none !important} .set-code-hide{height: auto !important;} code{user-select: text !important;}";
        document.head.appendChild(sty);
        csdn.copyright.init("", "", ""); //去除剪切板劫持
    //    $("#article_content").removeAttr("style");  //去除关注作者才能看全文限制

    //解除CTRL+C复制代码限制
//        document.addEventListener('keydown', (e)=>{
//            if(e.ctrlKey && e.keyCode == 67){
//                navigator.clipboard.writeText(window.getSelection().toString());
//                console.log('Text is copyed');
//            }
//        },true);

    //解除右键复制代码限制
        var selectText = '';
        document.addEventListener('copy', (e)=>{
            navigator.clipboard.writeText(window.getSelection().toString());
            console.log('Text is copyed');
        },true);

        document.addEventListener("mouseup", (e)=>{
            if(getSelection().toString() != ''){
                selectText = getSelection().toString();
            }
        })
        for(var i=0; i<document.getElementsByClassName("hljs-button").length; i++){
            document.getElementsByClassName("hljs-button")[i].attributes["data-title"].value = '复制';
            document.getElementsByClassName("hljs-button")[i].onclick = function(){
                navigator.clipboard.writeText(selectText);
                selectText = '';
                console.log('Text is copyed');
            }
        }

        document.getElementById("article_content").style = "";
        if(document.getElementsByClassName("guide-rr-first").length > 0){
            document.getElementsByClassName("guide-rr-first")[0].outerHTML = "";
        }
        if(document.getElementsByClassName("hide-article-box").length > 0){
            document.getElementsByClassName("hide-article-box")[0].outerHTML = "";
        }
        }catch(err){}

        //解除范文网复制限制
        if(window.location.host == 'www.ahsrst.cn' || window.location.host == 'www.ruiwen.com'){
            document.cookie = 'copyKey=0; path=/';
            document.cookie = 'is_vip=0; path=/';
        }

})();