// ==UserScript==
// @name         BILIBILI播放条加强版
// @namespace    http://tampermonkey.net/
// @version      5.5
// @description  配合https://userstyles.org/styles/143441/bilibili-2b使用
// @author       hearinleaf
// @match        *://www.bilibili.com/*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/34812/BILIBILI%E6%92%AD%E6%94%BE%E6%9D%A1%E5%8A%A0%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/34812/BILIBILI%E6%92%AD%E6%94%BE%E6%9D%A1%E5%8A%A0%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

window.addEventListener("load", function () {//添加load事件
    console.log("load执行");
    var codex = ['天','地','不','仁','以','万','物','为','刍','狗'] , index = -1;
    setInterval(function(){
        index++;
        index = index > codex.length - 1 ? 0 : index;
        document.getElementsByClassName('bpui-slider-handle')[0].innerHTML = codex[index];
    }, 3200);
 }, false);
