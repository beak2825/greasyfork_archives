// ==UserScript==
// @name     xforum.live anti-adblocker
// @version  0.1.2
// @grant    none
// @license MIT
// @include    *://xforum.live/*
// @include    *://*.xforum.live/*
// @description Blocks annoying anti-adblocker pop-up on xforum.live
// @namespace https://greasyfork.org/users/1109490
// @downloadURL https://update.greasyfork.org/scripts/469275/xforumlive%20anti-adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/469275/xforumlive%20anti-adblocker.meta.js
// ==/UserScript==

function addScript(sourceCode)
{
  var script = document.createElement('script');
  script.innerHTML = sourceCode;
  var head = document.getElementsByTagName("head")[0];
  head.insertBefore(script, head.firstChild);
}
  
addScript('function adsBlocked(callback){}');