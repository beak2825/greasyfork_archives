// ==UserScript==
// @name         郑州市专业技术人员继续教育网(自动音频/自动播放)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  郑州市专业技术人员继续教育网
// @author       Cs
// @match        *://zzszyk.user.ghlearning.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447055/%E9%83%91%E5%B7%9E%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%28%E8%87%AA%E5%8A%A8%E9%9F%B3%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447055/%E9%83%91%E5%B7%9E%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%28%E8%87%AA%E5%8A%A8%E9%9F%B3%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url = window.location.pathname;
    if (url.startsWith("/learning/index")) {
       setInterval(function (){
           const playPauseButton = document.getElementsByClassName('pv-playpause')[0];
           // 切换音频
           if (playPauseButton.classList.contains('pv-icon-pause') && document.getElementsByClassName('pv-audio-mode')[0].style.display === 'none'){
               const wrapper = document.getElementsByClassName('pv-stream-select-wrap')[0];
               const audioSettingButton = wrapper.getElementsByTagName('span')[1];
               if (audioSettingButton.getAttribute('class') !== 'pv-active') {
                   audioSettingButton.click();
                   console.log("切换音频")
               }
           }
           // 自动播放
       }, 3000);
    }
    // Your code here...
})();