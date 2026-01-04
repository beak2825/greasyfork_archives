// ==UserScript==
// @name         【知乎】摸鱼神奇(标题移除，右侧条目栏移除)
// @namespace    http://zhihu.com
// @version      2.6
// @description  摸鱼嘿嘿嘿
// @author       tuite
// @match        https://www.zhihu.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394091/%E3%80%90%E7%9F%A5%E4%B9%8E%E3%80%91%E6%91%B8%E9%B1%BC%E7%A5%9E%E5%A5%87%28%E6%A0%87%E9%A2%98%E7%A7%BB%E9%99%A4%EF%BC%8C%E5%8F%B3%E4%BE%A7%E6%9D%A1%E7%9B%AE%E6%A0%8F%E7%A7%BB%E9%99%A4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/394091/%E3%80%90%E7%9F%A5%E4%B9%8E%E3%80%91%E6%91%B8%E9%B1%BC%E7%A5%9E%E5%A5%87%28%E6%A0%87%E9%A2%98%E7%A7%BB%E9%99%A4%EF%BC%8C%E5%8F%B3%E4%BE%A7%E6%9D%A1%E7%9B%AE%E6%A0%8F%E7%A7%BB%E9%99%A4%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // QuestionHeader-title
    document.getElementsByClassName("QuestionHeader-title")[0].innerHTML = '';
    document.getElementsByClassName("QuestionHeader-title")[1].innerHTML = '';
    // Question-sideColumn--sticky
    document.getElementsByClassName("Question-sideColumn--sticky")[0].style = 'display:none';
    document.getElementsByTagName("title")[0].innerHTML = '';
    var btn1 = document.createElement('button');
    btn1.innerText = '1';
    btn1.style = 'position: fixed; left:0; bottom: 0;';
    btn1.onclick = function () {
        document.getElementsByTagName('title')[0].innerHTML = '😃论工作效率的提高办法';
    }
    var btn3 = document.createElement('button');
    btn3.innerText = '3';
    btn3.style = 'position: fixed; left:0; bottom: 44px;';
    btn3.onclick = function () {
        document.getElementsByClassName("Question-sideColumn--sticky")[0].style = 'display:none';
    }
    var btn2 = document.createElement('button');
    btn2.innerText = '2';
    btn2.style = 'position: fixed; left:0; bottom: 22px;';
    btn2.onclick = function () {
        var figures = document.getElementsByTagName('figure');
        for (var fi = 0 ; fi < figures.length ; fi++) {
            figures[fi].style = 'display: none;';
        }
        var videos = document.getElementsByClassName('RichText-video');
        for (var vi = 0 ; vi < videos.length ; vi++) {
            videos[vi].style = 'display: none;';
        }
    }
    var btn4 = document.createElement('button');
    btn4.innerText = '4';
    btn4.style = 'position: fixed; left:0; bottom: 66px;';
    btn4.onclick = function () {
        var figures = document.getElementsByTagName('figure');
        for (var fi = 0 ; fi < figures.length ; fi++) {
            figures[fi].style = 'display: block;';
        }
        var videos = document.getElementsByClassName('RichText-video');
        for (var vi = 0 ; vi < videos.length ; vi++) {
            videos[vi].style = 'display: block;';
        }
    }
    var b = document.body;
    b.appendChild(btn1)
    b.appendChild(btn2)
    b.appendChild(btn3)
    b.appendChild(btn4)
})();