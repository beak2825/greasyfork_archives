// ==UserScript==
// @name         简书侧边栏文章导航
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  简单的简书侧边栏导航使用，方便快速浏览查找文章，点击目录按钮切换显示
// @author       mwrz
// @match        http://www.jianshu.com/p/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/32516/%E7%AE%80%E4%B9%A6%E4%BE%A7%E8%BE%B9%E6%A0%8F%E6%96%87%E7%AB%A0%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/32516/%E7%AE%80%E4%B9%A6%E4%BE%A7%E8%BE%B9%E6%A0%8F%E6%96%87%E7%AB%A0%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('body').append(
        '<button class="btn btn-menu" style="width: auto;height: auto;position: fixed;right: 0px;top: 70px;border: 0px solid black;background-color: #BDF1F6;">目录</button>'
        + '<div class="sidebar" style="width: auto;height: auto;position: fixed;right: 0px;top: 120px;border: 0px solid black;">'
        + '<ul class="mwrz_nav nav">'
        + '</ul>'
        + '</div>');

    var titles = $('body').find('h1,h2,h3,h4,h5,h6').slice(1);
    var i = 0;
    //var a = new Array();
    var last = '';
    var now = '';
    var temp = '';
    var res = '';

    titles.each(function(index, el){

        now = el.tagName.slice(-1);

        $(this).attr('id', 'mwrz' + i);
        i += 1;

        var t = '<li><a href="#'
        + $(this).attr('id')
        + '">'
        + $(this).text()
        + '</a>';

        var head = '';
        var tail = '';
        if (last == ''){
            res += t;
        }else if(last < now){ // 层级更深
            temp += ('<ul class="nav nav-stacked">' + t + '</li>');
        }else if(last > now){
            res += (temp + '</ul></li>');
            temp = t;
        }else{
            temp += (t + '</li>');
        }

        last = now;
    }); // 构造ul,li列表

    $('.sidebar .mwrz_nav').append(res+temp);

    $('.sidebar>.mwrz_nav a').each(function(){
        $(this).css('max-width', '300px');
    }); // 最大宽度

    var width = '3px';
    $('.sidebar>.mwrz_nav>li>ul').each(function(){
        $(this).css('border-left', width + ' solid #A0E418');
    }); // 内层列表线宽

    $('.sidebar>.mwrz_nav>li>ul:last').css(
        'border-bottom', '2px' + ' solid #A0E418'
    );  // 最底部列表线宽

    $('.sidebar>.mwrz_nav>li>a').each(function(){
        $(this).css('background-color', 'rgba(255, 111, 90, 1)');
        $(this).css('color', 'white');
        $(this).css('margin-left', '-10px');
    }); // 首级目录样式

    $(".btn-menu").click(function(){
        $(".sidebar").slideToggle();
        return false;
    }); // 点击事件

    $('.sidebar>.mwrz_nav>li').dblclick(function(e){
        $(e.target).parent().next().slideToggle()
    }); // 双击事件收起相邻栏

    // Your code here...
})();