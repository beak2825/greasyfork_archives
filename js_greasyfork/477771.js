// ==UserScript==
// @name         浙工大邮箱去元素
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ZJUT校园邮箱去除<div id="qqmail_mask"元素
// @author       haoni886
// @match        https://mail.zjut.edu.cn/coremail/index.jsp*
// @match        https://mail.zjut.edu.cn/cgi-bin/frame_html*
// @connect      *
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.cookie
// @grant        GM.registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477771/%E6%B5%99%E5%B7%A5%E5%A4%A7%E9%82%AE%E7%AE%B1%E5%8E%BB%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/477771/%E6%B5%99%E5%B7%A5%E5%A4%A7%E9%82%AE%E7%AE%B1%E5%8E%BB%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
  function hideElement() {
    let mask = document.getElementById('qqmail_mask');
    if (mask) {
      mask.style.display = 'none';
    }
  }

  new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.target.id === 'qqmail_mask') {
        hideElement();
      }
    });
  }).observe(document, {
    subtree: true,
    childList: true
  });

  hideElement();

  setInterval(hideElement, 200);

})();
