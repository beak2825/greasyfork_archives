// ==UserScript==
// @license MIT
// @name        pure-systems.com syntax highlighting
// @namespace   Violentmonkey Scripts
// @match       https://www.pure-systems.com/*
// @grant       none
// @version     1.0
// @author      -
// @description For documentation pages. Example page: https://www.pure-systems.com/pv-update/additions/doc/latest/com.ps.consul.eclipse.ui.doc/ch06s14.html
// @require https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js
// @downloadURL https://update.greasyfork.org/scripts/464843/pure-systemscom%20syntax%20highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/464843/pure-systemscom%20syntax%20highlighting.meta.js
// ==/UserScript==

$("head").append('<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css">')
$(".programlisting").each(function () {
  if ($(this).children().length == 0) {
    $(this).wrapInner(document.createElement("code")) //wrap the content in a <code> tag
  }
  else {
    $(this).children().wrapInner(document.createElement("code")) //wrap each child's content in its own <code> tag
  }
});

hljs.highlightAll();