// ==UserScript==
// @name         去除限制tapd文档
// @namespace    https://github.com/Dcatfly/Tampermonkey.git
// @version      0.2
// @description  去除tapd文档上不能选中（select）的限制
// @author       Dcatfly
// @match        https://www.tapd.cn/*/documents/*
// @downloadURL https://update.greasyfork.org/scripts/398529/%E5%8E%BB%E9%99%A4%E9%99%90%E5%88%B6tapd%E6%96%87%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/398529/%E5%8E%BB%E9%99%A4%E9%99%90%E5%88%B6tapd%E6%96%87%E6%A1%A3.meta.js
// ==/UserScript==

(function() {
  "use strict";
  window.onload = function() {
    document.querySelectorAll("*").forEach(function(node) {
      if (node.style.userSelect) {
        node.style.userSelect = "unset";
      }
    });
  };
})();
