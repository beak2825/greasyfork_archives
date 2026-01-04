// ==UserScript==
// @name         kill portal alert
// @namespace    http://tampermonkey.net/
// @version      0.0.1-beta
// @description  屏蔽非chrome弹窗
// @author       junliang.li
// @match        http://portal-new.beta1.fn/
// @match        http://portal-new.idc1.fn/
// @grant        none
// @run-at       document-end
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/538997/kill%20portal%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/538997/kill%20portal%20alert.meta.js
// ==/UserScript==

(function () {
  "use strict";
  if (!window.getExplorerInfo) {
    return;
  }
  let temp = window.getExplorerInfo;
  window.getExplorerInfo = function () {
    window.getExplorerInfo = temp;
    return { type: "Chrome", version: 666 };
  };
})();
