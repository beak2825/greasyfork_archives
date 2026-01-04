// ==UserScript==
// @name         秀动
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://wap.showstart.com/pages/order/activity/*
// @grant        document-end
// @downloadURL https://update.greasyfork.org/scripts/423809/%E7%A7%80%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/423809/%E7%A7%80%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
      setTimeout(function(){
      if(document.getElementsByClassName('payBtn')[0].classList.contains('disabled'))
      {
      setTimeout(function(){location.reload()},3000)
      }else
      {
          //document.getElementsByClassName('uni-checkbox-input')[1].click();
        setInterval(function(){document.getElementsByClassName('payBtn')[0].click();},1000)
      }

      },500)

    // Your code here...
})();