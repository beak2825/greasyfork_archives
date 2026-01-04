// ==UserScript==
// @name    防止暂停
// @namespace    http://tampermonkey.net/
// @version   1.0
// @description  一旦开启，永不停止
// @author   Admin––lsz
// @match  http://m.360kan.com/
// @run-at  document-end
// @grant   none
// @downloadURL https://update.greasyfork.org/scripts/416380/%E9%98%B2%E6%AD%A2%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/416380/%E9%98%B2%E6%AD%A2%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onblur = null;
    window.onfocus = null;
})();