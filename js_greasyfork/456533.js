// ==UserScript==
// @name         hhykw
// @namespace    lly
// @version      4.0
// @description  视频自动播放
// @author       You
// @match       *://research.hhykw.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456533/hhykw.user.js
// @updateURL https://update.greasyfork.org/scripts/456533/hhykw.meta.js
// ==/UserScript==

let hre = location.href
if (hre.includes("https://research.hhykw.com/listen/courseDetail?"))
{
  document.querySelectorAll("textarea").forEach(i=>i.onpaste=null)
}