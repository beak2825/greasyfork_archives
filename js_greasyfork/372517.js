// ==UserScript==
// @name         廖雪峰官网阅读优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  此脚本是Qshunmli和A23187和我的集合...js板块可用，闲来无事的可以看看给别的板块加点。
// @author       Hanhuoer
// @match        *://www.liaoxuefeng.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/372517/%E5%BB%96%E9%9B%AA%E5%B3%B0%E5%AE%98%E7%BD%91%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/372517/%E5%BB%96%E9%9B%AA%E5%B3%B0%E5%AE%98%E7%BD%91%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function(){

        // 删除广告和字体是下面两位的
        // https://greasyfork.org/zh-CN/scripts/37984-%E5%BB%96%E9%9B%AA%E5%B3%B0%E7%9A%84%E5%AE%98%E6%96%B9%E7%BD%91%E7%AB%99-%E9%98%85%E8%AF%BB%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%E8%B0%83%E8%8A%82
        // https://greasyfork.org/zh-CN/scripts/39707-%E5%BB%96%E9%9B%AA%E5%B3%B0%E5%AE%98%E7%BD%91%E5%8E%BB%E5%B9%BF%E5%91%8A

        // 删除广告
        $("#x-sponsor-a").remove();
        $("#x-sponsor-b").remove();
        //
        // 字体
        var oCent = document.querySelector('.x-content .x-main-content');
        oCent.style['font-size'] = '20px';
        oCent.style['line-height'] = '30px';
        ////////////////////////////////////////////////////////////
        //
        //
        //                 [滑稽] 分割...
        //              此脚本js板块可以用
        //
        ////////////////////////////////////////////////////////////
        // 背景
        var bd = document.querySelector('body')
        bd.style['backgroundColor'] = '#a3a380';
        bd.style['color'] = '#000';
        //
        // 导航
        var js = document.querySelector('#header > div > div');
        js.style['backgroundColor'] = '#333';
        var python = document.querySelector('#header > div > div')
        python.style['backgroundColor'] = '#333';
        var head = document.querySelector('#header');
        head.style['backgroundColor'] = '#333';

        var nav = document.querySelector('.uk-navbar');
        nav.style['backgroundColor'] = '#777159';
        var act = document.querySelector('.uk-navbar-nav>li.uk-active>a');
        act.style['backgroundColor'] = '#6d633b';

        //
        // 左侧导航
        var uk = document.querySelector('div.uk-active>a.x-wiki-index-item');
        uk.style['backgroundColor'] = '#777159';
        uk.style['color'] = '#fff';
        //
        // 代码块
        var p = document.querySelector('pre');
        p.style['backgroundColor'] = '#f2efe6';
        p.style['color'] = '#333';
        p.style['boder'] = '1px solid #ff8a8a';
    })
})();