// ==UserScript==
// @name        Enlarge to Fill Stand-Alone Image Viewer
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @version     0.5
// @copyright   Copyright 2020 Jefferson Scher
// @license     BSD-3-Clause
// @description Make stand-alone images fill the viewport regardless of whether they are too wide or too tall
// @match       https://*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/402915/Enlarge%20to%20Fill%20Stand-Alone%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/402915/Enlarge%20to%20Fill%20Stand-Alone%20Image%20Viewer.meta.js
// ==/UserScript==

var tgt;
function resizeImg(e){
  // don't resize when full size
  if (tgt.className.indexOf('overflowing') > -1) return;
  var whratio = tgt.width / tgt.height;
  var vpratio = window.innerWidth / window.innerHeight;
  if (whratio < vpratio){ // width needs more help
    tgt.width = parseInt(document.body.clientWidth);
    tgt.height = Math.round(tgt.width * (1 / whratio));
    // repeat to account for scroll bar
    tgt.width = parseInt(document.body.clientWidth);
    tgt.height = Math.round(tgt.width * (1 / whratio));
  } else {
    tgt.height = window.innerHeight;
    tgt.width = Math.round(tgt.height * whratio);
    // repeat to account for scroll bar
    tgt.height = window.innerHeight;
    tgt.width = Math.round(tgt.height * whratio);
  }
}
var resizeTimeout;
function resizeThrottler(){
  if(!resizeTimeout){
    resizeTimeout = window.setTimeout(function(){resizeTimeout = null; resizeImg();}, 200);
  }
}
if (document.querySelector('head').innerHTML.indexOf('TopLevelImageDocument.css') > -1) {
  tgt = document.querySelector('body img'); // first image in body
  tgt.addEventListener('click', resizeImg, false);
  window.addEventListener('resize', resizeThrottler, false); 
  window.setTimeout(resizeImg, 50);
}
