// ==UserScript==
// @name         SpeedUp
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  加速bilibili视频
// @author       Goose
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @license      AGPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460455/SpeedUp.user.js
// @updateURL https://update.greasyfork.org/scripts/460455/SpeedUp.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    //视频加速按钮
    var UpBtnArea = document.createElement("div");//按钮位置
    UpBtnArea.style.position = "fixed";
    UpBtnArea.style.zIndex = 10000;
    UpBtnArea.style.top = "150px";
    UpBtnArea.style.right = "30px";
    var UpBtn = document.createElement("button");//按钮
    UpBtn.textContent = "x5";
    document.getElementsByTagName("body")[0].appendChild(UpBtnArea);//位置插入
    UpBtnArea.insertBefore(UpBtn,UpBtnArea.children[0]);//按钮插入
    
    UpBtn.addEventListener("click",function(){
      var v=document.getElementsByTagName('video');
      for(var i=0; i<v.length; i++){
        v[i].playbackRate = 1;
      }
    })
})();