// ==UserScript==
// @name         去除b站播放时关注、三连、投票弹窗
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  去除b站播放中的关注、三连、投票弹窗，包含折叠在左下角的弹窗。
// @author       OYX、仙圣
// @match        *://*.bilibili.com/video/*
// @license      MIT License

// @downloadURL https://update.greasyfork.org/scripts/491636/%E5%8E%BB%E9%99%A4b%E7%AB%99%E6%92%AD%E6%94%BE%E6%97%B6%E5%85%B3%E6%B3%A8%E3%80%81%E4%B8%89%E8%BF%9E%E3%80%81%E6%8A%95%E7%A5%A8%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/491636/%E5%8E%BB%E9%99%A4b%E7%AB%99%E6%92%AD%E6%94%BE%E6%97%B6%E5%85%B3%E6%B3%A8%E3%80%81%E4%B8%89%E8%BF%9E%E3%80%81%E6%8A%95%E7%A5%A8%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

setInterval(function(){
    var pop = document.querySelector('.bilibili-player-popup-inner')
    var pop2 = document.querySelector('.bpx-player-popup')
    var pop3 = document.querySelector('.bpx-player-cmd-dm-inside')
    var pop4 = document.querySelector('.bili-cmd-shrink')
    if(pop!=null){pop.remove()}
    if(pop2!=null){pop2.remove()}
    if(pop3!=null){pop3.remove()}
    if(pop4!=null){pop4.remove()}
    },100)