// ==UserScript==
// @name         No Baidu
// @version      0.1
// @namespace romain_li
// @description  No Baidu Better World!
// @author       romain_li
// @match        https://www.baidu.com/
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/377139/No%20Baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/377139/No%20Baidu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.href = 'https://cn.bing.com/';
})();