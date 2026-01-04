// ==UserScript==
// @name        arras.io miter edges
// @namespace   http://bzzzzdzzzz.blogspot.com/
// @description no rounded edges
// @author      BZZZZ
// @include     /^https\:\/\/arras\.io\/([?#]|$)/
// @version     0.3
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/428391/arrasio%20miter%20edges.user.js
// @updateURL https://update.greasyfork.org/scripts/428391/arrasio%20miter%20edges.meta.js
// ==/UserScript==

{
const a=document.createElement('div');
a.setAttribute('onclick','CanvasRenderingContext2D.prototype.__defineSetter__("lineJoin",function(){})');
a.click();
}