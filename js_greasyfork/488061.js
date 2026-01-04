// ==UserScript==
// @name        去掉微信公众号网页右侧的二维码悬浮框
// @namespace    http://tampermonkey.net/
// @match       https://*/*
// @grant       none
// @version     1.2
// @author      Alex
// @icon        https://www.google.com/s2/favicons?domain=tampermonkey.net
// @description Remove specified element
// @license     Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/488061/%E5%8E%BB%E6%8E%89%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BD%91%E9%A1%B5%E5%8F%B3%E4%BE%A7%E7%9A%84%E4%BA%8C%E7%BB%B4%E7%A0%81%E6%82%AC%E6%B5%AE%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/488061/%E5%8E%BB%E6%8E%89%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BD%91%E9%A1%B5%E5%8F%B3%E4%BE%A7%E7%9A%84%E4%BA%8C%E7%BB%B4%E7%A0%81%E6%82%AC%E6%B5%AE%E6%A1%86.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function removeElement() {
    let qrCodeDiv = document.querySelector('.qr_code_pc');
    if (qrCodeDiv) {
      qrCodeDiv.remove();
    }
  }

  new MutationObserver(removeElement).observe(document, {
    childList: true,
    subtree: true
  });

  removeElement();

})();