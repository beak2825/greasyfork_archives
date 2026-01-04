// ==UserScript==
// @name         Shaman助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hack shaman项目的一些功能，提交便捷操作
// @author       微笑
// @match        http://shaman.ops.xinhuazhiyun.com/createAppDeploy.html?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xinhuazhiyun.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469559/Shaman%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/469559/Shaman%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const branchName = document.querySelector('#branch_name').innerText;
  const input = document.querySelector('#branch');
  if (branchName && input) {
    input.value = branchName;
  }
  // Your code here...
})();
