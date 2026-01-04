// ==UserScript==
// @name         gitlab
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  gitlab 自动去掉勾选
// @author       You
// @match        http://192.168.1.228:9980/LRS/*/-/merge_requests/new?merge_request*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444855/gitlab.user.js
// @updateURL https://update.greasyfork.org/scripts/444855/gitlab.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const selector = "input[checked=checked]";
  const target = document.querySelector(selector);
  console.log(target);
  if (target) {
    target.click();
    console.log('点击了')
  }

  // Your code here...
})();
