// ==UserScript==
// @name         自动修改f77转f90页面高度
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动修改高度!
// @author       You
// @match        http://quill.fcode.cn/quill.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fcode.cn
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457337/%E8%87%AA%E5%8A%A8%E4%BF%AE%E6%94%B9f77%E8%BD%ACf90%E9%A1%B5%E9%9D%A2%E9%AB%98%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/457337/%E8%87%AA%E5%8A%A8%E4%BF%AE%E6%94%B9f77%E8%BD%ACf90%E9%A1%B5%E9%9D%A2%E9%AB%98%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector(".cm-s-quill_style").style.cssText="height:1090px;"
})();