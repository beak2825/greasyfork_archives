// ==UserScript==
// @name         No alert
// @version      0.1.1
// @description  Don't pop up alert, use console.log
// @description:zh-cn  屏蔽网站使用alert弹出提示框，改用console.log，以提高页面使用体验。
// @author       binsee
// @namespace    https://github.com/binsee/tampermonkey-scripts
// @supportURL   https://github.com/binsee/tampermonkey-scripts/issues
// @license      GPL
// @run-at       document-start
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434311/No%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/434311/No%20alert.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var _alert = alert;
  alert = console.log;
})();