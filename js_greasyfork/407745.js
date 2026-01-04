// ==UserScript==
// @name        Bypass GitHub Ajax
// @namespace   binoc.projects.userscript.github.ajax
// @description Helps avoid Ajax-based loading of stuff on github with the side effect of bypassing some webcomponents
// @include     https://github.com/*
// @version     1.0.0a1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/407745/Bypass%20GitHub%20Ajax.user.js
// @updateURL https://update.greasyfork.org/scripts/407745/Bypass%20GitHub%20Ajax.meta.js
// ==/UserScript==

function removePjaxAttr() {
  document.querySelectorAll('*').forEach(function(node) {
    if (node.hasAttribute("data-pjax")) {
      node.removeAttribute("data-pjax");
    }
  });
}

window.onload = removePjaxAttr;