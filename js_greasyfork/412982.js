// ==UserScript==
// @name         新标签打开超链接
// @namespace    http://www.skji.net/
// @version      0.1
// @description  以新标签打开超链接
// @author       及
// @match        *://*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/412982/%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E8%B6%85%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/412982/%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E8%B6%85%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var head = document.head || document.getElementsByTagName('head')[0];
    var base = document.createElement('base');
    base.target = "_blank";
    head.appendChild(base);
})();