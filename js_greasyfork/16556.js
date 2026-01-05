// ==UserScript==
// @name        CodeMirror Set Theme
// @namespace   http://hermanfassett.me
// @description Change CodeMirror theme to default
// @include     http://www.freecodecamp.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16556/CodeMirror%20Set%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/16556/CodeMirror%20Set%20Theme.meta.js
// ==/UserScript==

var cm = document.getElementsByClassName("CodeMirror");
for (var i = 0; i < cm.length; i++) {
  cm[i].className = cm[i].className.replace(/\bcm-s-[^\s]+\b/,'cm-s-default');
}