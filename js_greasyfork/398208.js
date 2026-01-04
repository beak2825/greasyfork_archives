// ==UserScript==
// @name         百度网盘视频加速播放
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  加速百度网盘在线播放视频的速度
// @author       HollowME
// @match        https://pan.baidu.com/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398208/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/398208/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // Your code here...
    var videoToolbar = document.getElementById('video-toolbar');

    var btnSpeedUp = document.createElement('a');
    btnSpeedUp.className = 'g-button';
    btnSpeedUp.setAttribute('title','加速');
    btnSpeedUp.setAttribute('style','height:32px; margin:0 5px; padding:0 0 0 10px; cursor:pointer;');

    var iconSpeedUp = document.createElement('em');
    iconSpeedUp.className = 'icon icon-speed';
    iconSpeedUp.title = '加速';

    var spanTxt = document.createElement('span');
    spanTxt.className = 'text';
    spanTxt.innerText = '加速';

    var gBtnRight = document.createElement('span');
    gBtnRight.className = 'g-button-right';
    gBtnRight.append(iconSpeedUp,spanTxt);
    gBtnRight.setAttribute('style','padding:0 10px 0 0');

    var rateNum = document.createElement('input');
    rateNum.type = 'number';
    rateNum.id = 'ratenum';
    rateNum.setAttribute('step', '0.2');
    rateNum.setAttribute('style','width:44px; height:32px; padding:0px 0px 0px 12px; margin:0px 0px 0px 3px; border:1px solid #c3eaff');
    rateNum.value = '1';
    rateNum.className = 'g-button';

    btnSpeedUp.onclick = function setPlayerRate() {
        var player = videojs.getPlayers("video-player");
        player.html5player.tech_.setPlaybackRate(document.getElementById('ratenum').value);
    }

    videoToolbar.childNodes[3].append(btnSpeedUp,rateNum);
    btnSpeedUp.appendChild(gBtnRight);
})();