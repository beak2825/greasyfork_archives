// ==UserScript==
// @name        Better AD Marker "AdHolder" 
// @namespace   Violentmonkey Scripts
// @match       https://www.amazon.*/*
// @grant       none
// @version     1.0
// @author      jside
// @description Script that highlights / warns you of sponsored products
// @downloadURL https://update.greasyfork.org/scripts/441658/Better%20AD%20Marker%20%22AdHolder%22.user.js
// @updateURL https://update.greasyfork.org/scripts/441658/Better%20AD%20Marker%20%22AdHolder%22.meta.js
// ==/UserScript==

let styleSheet = `
div.AdHolder {
  background: #ffe3ba;
}

`;

let s = document.createElement('style');
s.type = "text/css";
s.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(s);

