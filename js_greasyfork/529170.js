// ==UserScript==
// @name         ASMR Brave切り替え
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Execute UserScript
// @author       Your Name
// @match        https://asmr18.fans/* 
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529170/ASMR%20Brave%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88.user.js
// @updateURL https://update.greasyfork.org/scripts/529170/ASMR%20Brave%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const button = document.createElement('div');
    button.style.position = 'fixed';
    button.style.top = '15px';
    button.style.left = '80px';
    button.style.width = '25px';
    button.style.height = '25px';
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '10000';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
 
    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.style.width = '20px';
        line.style.height = '3px';
        line.style.backgroundColor = 'white';
        line.style.margin = '2px 0';
        button.appendChild(line);
    }
 
    button.addEventListener('click', () => {
javascript:(function(){
  var u = window.location.href;
  var ua = navigator.userAgent;
  if(/android/i.test(ua)){
    // Androidの場合: intentスキームを利用
    window.location = "intent:" + u.replace(/^https?:\/\//, "") + "#Intent;package=com.brave.browser;scheme=https;end";
  } else if(/(iPhone|iPad|iPod)/i.test(ua)){
    // iOSの場合: BraveのカスタムURLスキーム（Braveが対応している場合）
    window.location = "brave://open-url?url=" + encodeURIComponent(u);
  } else {
    // その他（主にデスクトップ）
    if(confirm("Braveで表示しますか？")){
      window.location = "brave://open-url?url=" + encodeURIComponent(u);
    }
  }
})();
    });
 
    document.body.appendChild(button);
})();