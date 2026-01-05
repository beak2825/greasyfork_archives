// ==UserScript==
// @name          Simple WFM CSS Mod
// @description   Modifies the Workflowmax header CSS with a new colour
// @include       https://my.workflowmax.com/*
// @version       2017.1.3
// @grant         none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/27773/Simple%20WFM%20CSS%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/27773/Simple%20WFM%20CSS%20Mod.meta.js
// ==/UserScript==

var headTag = document.getElementsByTagName('head')[0],
styleTag = document.createElement('style');

styleTag.type = 'text/css';
styleTag.innerHTML = ".xn-s-green-header {background-color:#004242;}"			   
headTag.appendChild(styleTag);