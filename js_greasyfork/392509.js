// ==UserScript==
// @name         去除纵横中文网多余广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  边分享边学习!
// @author       KimHuang
// @match        http://book.zongheng.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392509/%E5%8E%BB%E9%99%A4%E7%BA%B5%E6%A8%AA%E4%B8%AD%E6%96%87%E7%BD%91%E5%A4%9A%E4%BD%99%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/392509/%E5%8E%BB%E9%99%A4%E7%BA%B5%E6%A8%AA%E4%B8%AD%E6%96%87%E7%BD%91%E5%A4%9A%E4%BD%99%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function(){
    'use strict';
    //先把要抽离出来的元素列出来 统统都干掉
    //置换背景颜色
    //设置文字大小和文字间隔

    setTimeout(function(){

        let piclnk = document.getElementById('index_right_bottom_piclnk');
        let head_simple = document.getElementsByClassName('head-simple');
        let uiGPUserAct = document.getElementById('uiGPUserAct');
        let goodgame = document.getElementsByClassName('goodgame');
        let reader_crumb = document.getElementsByClassName('reader_crumb');
        let bookinfo = document.getElementsByClassName('bookinfo');
        let big_donate = document.getElementsByClassName('big_donate');
        let chapter_forum_tit = document.getElementsByClassName('chapter_forum_tit');
        let chapter_thread_list = document.getElementsByClassName('chapter_thread_list');

        piclnk.remove();
        goodgame[0].style.backgroundImage = ''
        head_simple[0].remove();
        uiGPUserAct.remove();
        reader_crumb[0].remove();
        bookinfo[0].remove();
        big_donate[0].remove();
        chapter_forum_tit[0].remove();
        chapter_thread_list[0].remove();

        //背景修改原有的黑色背景
        let class_body = document.getElementsByTagName("body")[0]
        class_body.className = "rb_8";

    } ,2000)
})();