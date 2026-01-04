// ==UserScript==
// @name        Gab selection color fix - gab.com
// @namespace   Violentmonkey Scripts
// @match       https://gab.com/*
// @grant       none
// @version     0.0.1
// @author      diehardzg
// @description Changes selected text and background colour, so it is readable
// @downloadURL https://update.greasyfork.org/scripts/429423/Gab%20selection%20color%20fix%20-%20gabcom.user.js
// @updateURL https://update.greasyfork.org/scripts/429423/Gab%20selection%20color%20fix%20-%20gabcom.meta.js
// ==/UserScript==

var css = document.createElement("style");
css.innerHTML=`
  ::selection {
    color: #63da9d;
    background: black;
  }
`;
document.head.appendChild(css);