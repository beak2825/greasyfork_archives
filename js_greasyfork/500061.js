// ==UserScript==
// @name         去除tapd人数上限弹窗
// @namespace    https://github.com/Dcatfly/Tampermonkey.git
// @version      0.3
// @description  去除tapd授权人数超上限弹窗
// @author       Dcatfly
// @license MIT
// @match        https://www.tapd.cn/*
// @downloadURL https://update.greasyfork.org/scripts/500061/%E5%8E%BB%E9%99%A4tapd%E4%BA%BA%E6%95%B0%E4%B8%8A%E9%99%90%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/500061/%E5%8E%BB%E9%99%A4tapd%E4%BA%BA%E6%95%B0%E4%B8%8A%E9%99%90%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
  "use strict";
  window.onload = function() {
      function removeModal () {
          const overlay = document.getElementsByClassName('v-modal')[0];
          if (overlay) {
              overlay.style.display = "none";
          }
          var content = document.querySelectorAll('.el-dialog__wrapper.company-renew-dialog')
          content?.forEach(item=>{
              if (item) {
                  item.style.display = "none";
              }
          })
      }
      removeModal()
      let count = 20
     const timer = setInterval(()=>{
         if (count === 0) {
             clearInterval(timer)
         }
         count--
         removeModal()
      },200)

  };
})();
