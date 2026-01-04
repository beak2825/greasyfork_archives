// ==UserScript==
// @name           莞易学自动播放助手
// @version        1.0.2
// @description  莞易学自动播放+16倍速
// @author         Edmond
// @run-            document-start
// @grant          unsafeWindow
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @match        https://study.dgjy.net/#/*
// @match       *://*study.dgjy.net/*
// @namespace   https://greasyfork.org/zh-CN/scripts/446248
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/446248/%E8%8E%9E%E6%98%93%E5%AD%A6%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446248/%E8%8E%9E%E6%98%93%E5%AD%A6%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
/*jshint esversion:6 */

// 1.0.1 实现自动播放+16倍速
// 1.0.2 实现当原网页出现卡壳时自动点击刷新
// 已知待解决问题：某些课程章节96%往后部份重复播放，有些播放完后不能跳转到下一章节(可能是报务器带宽或文件设置问题)
// 某些课程章节视频资源无法连接也不提示一直加载


//10秒钟检查是否在播放一次
    function wwc(){

//1.0.2网页代码（卡壳时出现）：<a class="j-error-reload" id="auto-id-1654825098065">刷新页面</a>
//即当原网页出现卡壳时点击刷新
    if(document.getElementsByClassName('j-error-reload').length){
    document.getElementsByClassName('j-error-reload')[0].click();};
//1.0.2

//1.0.1 原网页代码（等待播放）：        <i class="u-edu-h5player-icon icon-big_play_btn"></i>
    if(document.getElementsByClassName('u-edu-h5player-icon icon-big_play_btn').length){
//控制台下输入下面这一行即可实现播放+16倍速
    document.querySelector('video').playbackRate = 16;document.getElementsByClassName('u-edu-h5player-icon icon-big_play_btn')[0].click(); };
    };
//10秒钟
  setInterval(wwc, 10000);



//控制台下输入下面这一行即可实现播放+16倍速：$("video").playbackRate=16
    document.querySelector('video').playbackRate = 16;document.getElementsByClassName('u-edu-h5player-icon icon-big_play_btn')[0].click();

