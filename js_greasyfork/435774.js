// ==UserScript==
// @name         Clean CSDN Blog
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  净化CSDN，优化阅读体验
// @author       fengxxc
// @match        https://blog.csdn.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435774/Clean%20CSDN%20Blog.user.js
// @updateURL https://update.greasyfork.org/scripts/435774/Clean%20CSDN%20Blog.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 干掉下边登录条
    var pulllogbox = document.getElementsByClassName('pulllog-box');
    if(pulllogbox.length > 0) {
        pulllogbox[0].style.display = 'none';
    }
    // 阅读更多
    function triggerClick(dom){
        //IE
        if(document.all) {
            dom.click();
        }
        // 其它浏览器
        else {
            var e = document.createEvent("MouseEvents");
            e.initEvent("click", true, true);
            dom.dispatchEvent(e);
        }
    }
    var btnReadmore = document.getElementsByClassName('btn-readmore')[0];
    if (btnReadmore) {
        triggerClick(btnReadmore); // csdn blog
    }
    // 干掉左边
    document.getElementById('mainBox').getElementsByTagName('aside')[0].remove();
    //document.getElementById('mainBox').getElementsByTagName('aside')[0].style.transform = 'translate(-370px,0)'; // new
    // 干掉右边
    document.getElementsByClassName('recommend-right')[0].style.display = 'none';
    //document.getElementsByClassName('recommend-right')[0].style.transform = 'translate(370px,0)'; // new
    // 放大中间
    document.getElementById('mainBox').style.zIndex = '999';
    document.getElementById('mainBox').style.position = 'relative'; // new
    document.getElementById('mainBox').getElementsByTagName('main')[0].style.position = 'absolute'; // new
    document.getElementById('mainBox').getElementsByTagName('main')[0].style.width = '100%';
    // 轮询干掉注册登录
    var passportboxHandle = setInterval(function() {
        var ppb = document.getElementById('passportbox')
        if(ppb) {
            ppb.style.display = 'none';
            passportboxHandle = null;
        }
    }, 800);
    
    // 轮询干掉注册登录遮罩层
    var passportLoginMarkHandle = setInterval(function() {
        var plm = document.getElementByClassName('passport-login-mark')
        if(plm != null && plm.length > 0) {
            plm[0].style.display = 'none';
            passportLoginMarkHandle = null;
        }
    }, 800);
    
    // document.getElementsByClassName('login-mark')[0].style.display = 'none';

    // 干掉最上面的广告
    document.querySelector("#csdn-toolbar").remove();
    
    // 轮询干掉关注博主即可阅读全文
    var hideArticleBoxHandler = setInterval(function() {
        var hideArticleBox = document.getElementsByClassName('hide-article-box')
        if(hideArticleBox != null && hideArticleBox.length > 0) {
            hideArticleBox[0].style.display = 'none'
            document.getElementById('article_content').style.height = 'inherit'
            hideArticleBoxHandler = null
        }
    }, 800)
    
    
    // 轮询干掉下面作者条
    var leftBoxHandler = setInterval(function() {
        var leftBox = document.getElementsByClassName('left-toolbox');
        if(leftBox && leftBox.length > 0) {
            leftBox[0].style.display = 'none';
            leftBoxHandler = null;
        }
        
    }, 800)
    
})();