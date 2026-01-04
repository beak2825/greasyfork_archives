// ==UserScript==
// @name         屏蔽信息框
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202111241550
// @description  屏蔽网页上的alert信息框
// @author       流浪的蛊惑
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/416774/%E5%B1%8F%E8%94%BD%E4%BF%A1%E6%81%AF%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/416774/%E5%B1%8F%E8%94%BD%E4%BF%A1%E6%81%AF%E6%A1%86.meta.js
// ==/UserScript==
window.alert=function(e){console.log(e);};
(function() {
    'use strict';
})();