// ==UserScript==
// @name         csdn看评论免登录+去广告
// @namespace    http://tampermonkey.net/csdn
// @version      0.1
// @description  去掉右侧、评论区上侧广告，支持免登陆查看评论、显示全文
// @author       decode
// @match        https://blog.csdn.net/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/423115/csdn%E7%9C%8B%E8%AF%84%E8%AE%BA%E5%85%8D%E7%99%BB%E5%BD%95%2B%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/423115/csdn%E7%9C%8B%E8%AF%84%E8%AE%BA%E5%85%8D%E7%99%BB%E5%BD%95%2B%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    // 1.看评论免登陆
    var i = 130+5*35;
    var comment = document.getElementById('btnMoreComment');
    if(comment){
        comment.onclick = function(){
            document.getElementById('passportbox').style.display='none';
            document.getElementsByClassName('login-mark')[0].style.display='none'
            document.getElementsByClassName('comment-list-box')[0].style['max-height']= i+'px';
            i+=5*35;
        }
    }
    console.log('评论');
    // 2.去右侧广告
    document.getElementById('recommendAdBox').style.display='none';
    console.log('去右侧广告');
    // 3.去评论区广告
    var commAD = document.getElementById('kp_box_58');
    if(commAD)commAD.style.display='none';
    console.log('去评论区广告');
    // 4.免登陆看全文
    let hide_article = $('main').find('div').filter('.hide-article-box');
    if(hide_article){
        hide_article.remove();
        let h = $('#content_views').height();
        $('#article_content').height(h);
        console.log(h);
    }
    //
    // Your code here...
})();