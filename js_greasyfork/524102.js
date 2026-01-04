// ==UserScript==
// @name        粉笔去视频VIP
// @namespace   粉笔去视频VIP
// @match       *://www.fenbi.com/spa/tiku/report/exam/solution/*
// @grant       none
// @version     1.0
// @author      -
// @description 粉笔考公网页版按 “ Q ” 键去除开通VIP看视频的模块
// @downloadURL https://update.greasyfork.org/scripts/524102/%E7%B2%89%E7%AC%94%E5%8E%BB%E8%A7%86%E9%A2%91VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/524102/%E7%B2%89%E7%AC%94%E5%8E%BB%E8%A7%86%E9%A2%91VIP.meta.js
// ==/UserScript==

(function() {


  document.onkeyup = function(){
    if(event.keyCode == 81){
       hide_video();
    }
  }

//   //隐藏视频模块
  hide_video = function() {
        // 选择所有类名为 'video-item-content' 的 div 元素
        var elements = document.querySelectorAll('div.video-item-content');

        // 遍历这些元素并隐藏它们
        elements.forEach(function(element) {
            element.style.display = 'none';
        });
    }

})();