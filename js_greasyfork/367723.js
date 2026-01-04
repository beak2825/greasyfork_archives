// ==UserScript==
// @name         虎牙弹幕自动屏蔽、自动剧场模式
// @namespace    http://tampermonkey.net
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.huya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367723/%E8%99%8E%E7%89%99%E5%BC%B9%E5%B9%95%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E3%80%81%E8%87%AA%E5%8A%A8%E5%89%A7%E5%9C%BA%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/367723/%E8%99%8E%E7%89%99%E5%BC%B9%E5%B9%95%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E3%80%81%E8%87%AA%E5%8A%A8%E5%89%A7%E5%9C%BA%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //把弹幕全部隐藏
    var node=document.getElementById('watchChat_pub')
    node.hidden=true;

    var interval = setInterval(function(){
    var danmu=document.getElementById('player-danmu-btn');
    if(danmu){
        danmu.click();
        clearInterval(interval);
        }
    }, 1000);

     var interval2 = setInterval(function(){
    var fullpage=document.getElementById('player-fullpage-btn');
    if(fullpage){
        fullpage.click();
        clearInterval(interval2);
        }
    }, 1000);

})();