// ==UserScript==
// @name         deepseek copy message
// @description  click to copy message
// @match        https://chat.deepseek.com/a/chat/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @version 0.0.1.20250422115422
// @namespace https://greasyfork.org/users/3920
// @downloadURL https://update.greasyfork.org/scripts/526451/deepseek%20copy%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/526451/deepseek%20copy%20message.meta.js
// ==/UserScript==

(function() {
  function copyToClipboard(val) {
    let ta = document.createElement("textarea");
    document.body.appendChild(ta);
    ta.value = val;
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  document.addEventListener('click', function(e) {
    let elem = document.elementFromPoint(e.clientX, e.clientY);
    while (elem && (!elem.className || false == elem.className.includes('ds-markdown '))) {
      elem = elem.parentElement;
    }
    if (elem) {
      copyToClipboard(elem.innerText);
    }
  });
})();