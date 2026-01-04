// ==UserScript==
// @name         按键选择
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  0-0,1-1,2-2,3-3,4-4,5-5,6-6，space-6
// @author       huqz
// @match        http://discover.sm.cn/2/*
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/434441/%E6%8C%89%E9%94%AE%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/434441/%E6%8C%89%E9%94%AE%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==
(function() {
  'use strict';
  setTimeout(() => {
      var opts = $('.ant-radio-group.ant-radio-group-outline')[0].children;
      var length = opts.length;
    document.onkeydown = function(e){
      switch (e.keyCode) {
        case 48:
        case 96:
          opts[0].click();
          break;
        // 0
        case 49:
        case 97:
          opts[1].click();
          break;
          // 1
        case 50:
        case 98:
          opts[2].click();
          break;
        case 51:
        case 99:
          opts[3].click();
          break;
        case 52:
        case 100:
          opts[4].click();
          break;
        case 53:
        case 101:
          opts[5].click();
          break;
        case 32:
        case 102:
        case 54:
          opts[length-1].click();
          break;
      }
       $(".ant-btn.ant-btn-primary").click();
    };
  }, 3000)
  // Your code here...
})();