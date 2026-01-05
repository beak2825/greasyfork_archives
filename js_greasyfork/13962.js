// ==UserScript==
// @name        innerText
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @version     1
// @description Support for the proprietary IE innerText property
// @copyright   Copyright 2015 Jefferson Scher
// @license     BSD
// @include     *
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13962/innerText.user.js
// @updateURL https://update.greasyfork.org/scripts/13962/innerText.meta.js
// ==/UserScript==

if (document.body.innerText === undefined){
   HTMLElement.prototype.__defineGetter__("innerText", function() {
     return this.textContent;
   });
   HTMLElement.prototype.__defineSetter__("innerText", function(txt) {
     this.textContent = txt;
   });
}
