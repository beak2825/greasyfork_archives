// ==UserScript==
// @name         dingtalk full screen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       莫纯谊
// @email        mochunyi@163.com
// @match        https://im.dingtalk.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419604/dingtalk%20full%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/419604/dingtalk%20full%20screen.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Your code here...
  const loop = setInterval(() => {
    var mainLayout = document.querySelector("#layout-main");
    if (mainLayout) {
      mainLayout.style.width = '100%';
      mainLayout.style.flex = 'unset';
      mainLayout.style.height = '100%';
      var body = mainLayout.querySelector("#body");
      if (body) {
        body.style.flex = '1';
        clearInterval(loop);
      }
    }
  }, 10)
})();