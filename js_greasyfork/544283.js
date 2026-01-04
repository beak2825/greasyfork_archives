// ==UserScript==
// @name         Force Ctrl + Click to Open in New Tab
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Mở link bằng Ctrl + Click dù trang web cố chặn
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544283/Force%20Ctrl%20%2B%20Click%20to%20Open%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/544283/Force%20Ctrl%20%2B%20Click%20to%20Open%20in%20New%20Tab.meta.js
// ==/UserScript==

(function () {
  document.addEventListener('click', function (e) {
    if (e.ctrlKey && e.button === 0) {
      let el = e.target;

      // Tìm phần tử cha là thẻ <a>
      while (el && el.tagName !== 'A') {
        el = el.parentElement;
      }

      if (el && el.href) {
        e.preventDefault();
        window.open(el.href, '_blank');
      }
    }
  }, true);
})();
