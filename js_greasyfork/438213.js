// ==UserScript==
// @name Element Outline
// @namespace -
// @version 0.2
// @description creates outline for all elements.
// @author NotYou
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/438213/Element%20Outline.user.js
// @updateURL https://update.greasyfork.org/scripts/438213/Element%20Outline.meta.js
// ==/UserScript==

(function() {
let css = `/* MAIN */

nav {
outline: 1px dashed rgb(238, 255, 0) !important
}

div {
outline: 1px dashed rgb(255, 0, 0) !important
}

footer,header {
outline: 1px dashed rgb(0, 0, 0) !important
}

img,svg,use {
outline: 1px dashed rgb(24, 136, 162) !important
}

h1 {
outline: 1px dashed rgb(149, 89, 0) !important
}

h2 {
outline: 1px dashed rgb(179, 107, 0) !important
}

h3 {
outline: 1px dashed rgb(198, 118, 0) !important
}

h4 {
outline: 1px dashed rgb(223, 133, 0) !important
}

h5 {
outline: 1px dashed rgb(236, 141, 0) !important
}

h6 {
outline: 1px dashed rgb(255, 152, 0) !important
}

span {
outline: 1px dashed rgb(5, 189, 5) !important
}

p {
outline: 1px dashed rgb(161, 0, 198) !important
}

i,b,u,s,q {
outline: 1px dashed rgb(121, 0, 151) !important
}

a {
outline: 1px dashed rgb(0, 135, 198) !important
}

input,output,label,button,form,textarea,fieldset,select,option,optgroup,summary,canvas {
outline: 1px dashed rgb(168, 249, 0) !important
}

video, audio {
outline: 1px dashed rgb(0, 255, 200) !important
}

code {
outline: 1px dashed rgb(0, 0, 0) !important
}

li,ul,table,tbody,tr,td,legend {
outline: 1px dashed rgb(0, 38, 230) !important
}

ol,table,tbody {
outline: 1px dashed rgb(10, 0, 151) !important
}

/* OTHER  */

figure {
outline: 1px dashed rgb(0, 255, 231) !important
}

figcaption {
outline: 1px dashed rgb(255, 26, 230) !important
}

::before,::after,::marker {
outline: 1px dashed rgb(255, 0, 131) !important
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
