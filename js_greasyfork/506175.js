// ==UserScript==
// @name        Youtube - skip to time in Url param
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch*
// @grant       GM_registerMenuCommand
// @version     1.0
// @author      -
// @license MIT
// @description 01/09/2024, 1:04:43 pm
// @downloadURL https://update.greasyfork.org/scripts/506175/Youtube%20-%20skip%20to%20time%20in%20Url%20param.user.js
// @updateURL https://update.greasyfork.org/scripts/506175/Youtube%20-%20skip%20to%20time%20in%20Url%20param.meta.js
// ==/UserScript==


function setVideoTime(){
  let qp = new URLSearchParams(window.location.href);
  if (qp.has("t")){
    var time = Number(qp.get("t").replace("s",""))
    document.querySelector('video').currentTime = time

  }
}



GM_registerMenuCommand('Set video time to url param', setVideoTime)



