// ==UserScript==
// @name PybGen more CSS
// @namespace https://jurkourko.net/
// @version 1.0.0
// @description Add to PybGen: (In version 1.0.0) only new cursor.
// @author Jurkourko
// @grant GM_addStyle
// @run-at document-start
// @match https://romw314.com/priv0/pybgen0/*
// @downloadURL https://update.greasyfork.org/scripts/522294/PybGen%20more%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/522294/PybGen%20more%20CSS.meta.js
// ==/UserScript==

(function() {
let css = `
/* Cursor CSS */
body{
    cursor: url(https://jurkourko.net/static/data/Cursor.png), default;
}
.blocklyFieldRect:hover{
    cursor: url(https://jurkourko.net/static/data/Cursor-Hovered.png), pointer;
}
.blocklyText text {
  cursor: url(https://jurkourko.net/static/data/Cursor-Text.png) 16 16, text;
}
.blocklyNonEditableText>text {
  pointer-events: none;
}
.blocklyMenuItemContent:hover{
    cursor: url(https://jurkourko.net/static/data/Cursor-Hovered.png), pointer;
}
.blocklyMenuItem{
    cursor: url(https://jurkourko.net/static/data/Cursor-Hovered.png), pointer;
}
.blocklyHtmlInput:hover{
    cursor: url(https://jurkourko.net/static/data/Cursor-Text.png) 16 16, text;
}
button:hover{
    cursor: url(https://jurkourko.net/static/data/Cursor-Hovered.png), pointer;
}
.blocklyDraggable{
    cursor: url(https://jurkourko.net/static/data/Cursor-Hovered.png), grab;
}
.blocklyDraggable:active{
    cursor: url(https://jurkourko.net/static/data/Cursor-Grabbing.png) 31 0, grabbing;
}
.blocklyDragging.blocklyDraggingDelete{
  cursor: url(https://jurkourko.net/static/data/Cross.png) 16 16, auto !important;
}
.blocklyDragging{
    cursor: url(https://jurkourko.net/static/data/Cursor-Grabbing.png) 31 0, grabbing;
}
/* End cursor CSS */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
