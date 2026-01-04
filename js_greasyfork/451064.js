// ==UserScript==
// @name        copy LaTeX from zhihu
// @namespace   Violentmonkey Scripts
// @match       https://zhuanlan.zhihu.com/*
// @grant       none
// @version     1.0
// @author      chopong
// @license MIT
// @description 2022/9/10 01:28:03
// @downloadURL https://update.greasyfork.org/scripts/451064/copy%20LaTeX%20from%20zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/451064/copy%20LaTeX%20from%20zhihu.meta.js
// ==/UserScript==



(function(){
  "use strict";
  var mathblocks = document.querySelectorAll(".ztext-math");
  var num = mathblocks.length;
  if (num>0){
    for (var i=0;i<num;i++){
      mathblocks[i].addEventListener("click",function(){
        let transfer = document.createElement('input');
        this.parentNode.insertBefore(transfer,this);
        transfer.value =  this.attributes['data-tex'].value ;
        // 这里表示想要复制的内容
        transfer.focus();
        transfer.select();
        if (document.execCommand('copy')) {
          document.execCommand('copy');
        }
        this.parentNode.removeChild(transfer);
        if(window.Notification && Notification.permission !== "denied") {
          Notification.requestPermission(function(status) {
            var n = new Notification('LaTeX', { body: transfer.value }); 
          });
        }
      });
    }
  }
})();
