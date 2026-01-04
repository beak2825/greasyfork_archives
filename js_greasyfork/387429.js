// ==UserScript==
// @name Expose CSDN Folding Content
// @version 1.1
// @description Expand CSDN folding content, include '展开阅读全文' and '登录查看热评'
// @author YuDong
// @namespace YuDong/CSDN
// @match https://blog.csdn.net/*
// @downloadURL https://update.greasyfork.org/scripts/387429/Expose%20CSDN%20Folding%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/387429/Expose%20CSDN%20Folding%20Content.meta.js
// ==/UserScript==

(function () {
  document.getElementsByClassName('btn-readmore')[0].click()
  setTimeout(() => {
    unsafeWindow.currentUserName = 'currentUserName'
    document.getElementById('btnMoreComment').click()
  }, 5000)
})();