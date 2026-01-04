// ==UserScript==
// @name         bilibili鼠标选取复制cc字幕
// @namespace     https://github.com/MonoeRI
// @version      1.2
// @description  实现用鼠标选取cc字幕的功能,英语学习者可配合沙拉查词插件使用.
// @author       Monoe
// @match        https://www.bilibili.com/video/*
// @downloadURL https://update.greasyfork.org/scripts/426088/bilibili%E9%BC%A0%E6%A0%87%E9%80%89%E5%8F%96%E5%A4%8D%E5%88%B6cc%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/426088/bilibili%E9%BC%A0%E6%A0%87%E9%80%89%E5%8F%96%E5%A4%8D%E5%88%B6cc%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function init (){
        let classArr =document.getElementById('bilibiliPlayer');
    // 判断是否加载播放器
    if(classArr){
        //设置6秒延迟,避免网速过慢脚本先执行,网速快的可以自行设置时间.
        setTimeout(function(){
          let arraim=classArr.getElementsByClassName('bilibili-player-dm-tip-wrap')[0];
          arraim.classList.remove('bilibili-player-dm-tip-wrap');
          //0.6秒自执行,不断获取节点
          setInterval(function(){
              let classLista=classArr.getElementsByClassName('subtitle-item-text');
              if(classLista[0]){
                  classLista[0].addEventListener('mousedown',function(event){
                              event.stopPropagation();
                              return;
                  },true)
                  classLista[0].style.userSelect='text';
                  classLista[0].style.cursor='text';
                 }
          },600)
        },6000)
      }
   }
    window.onload = init;

})();