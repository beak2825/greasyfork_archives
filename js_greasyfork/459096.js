// ==UserScript==
// @name        Vector for EN Wikipedia
// @namespace   Violentmonkey Scripts
// @match       https://en.wikipedia.org/*
// @grant       none
// @version     1.0
// @author      lwnsc
// @license MIT
// @description 29.1.2023, 13:40:39
// @downloadURL https://update.greasyfork.org/scripts/459096/Vector%20for%20EN%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/459096/Vector%20for%20EN%20Wikipedia.meta.js
// ==/UserScript==

var url = window.location.href;
if (url.indexOf('?useskin=vector') > -1){
   null}
else{
   url += '?useskin=vector'
   window.location.href = url;}