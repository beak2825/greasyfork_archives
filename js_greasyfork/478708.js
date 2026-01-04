// ==UserScript==
// @name         强制缩放
// @author       ChatGPT
// @version      1.2
// @description  让网页可以双指放大页面
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/478708/%E5%BC%BA%E5%88%B6%E7%BC%A9%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/478708/%E5%BC%BA%E5%88%B6%E7%BC%A9%E6%94%BE.meta.js
// ==/UserScript==

(function() {
  function autoScale() {
    if (window.innerWidth < 700) {
      document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=10.0, user-scalable=1');
    }
  }

  autoScale();
  document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 1) {
      autoScale();
    }
  });
})();