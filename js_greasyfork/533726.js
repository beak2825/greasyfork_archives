// ==UserScript==
// @name        metruyencv unhide Content
// @namespace   Violentmonkey Scripts
// @match       https://metruyencv.*/*
// @grant       none
// @version     1.0
// @author      -
// @run-at      document-idle
// @description 4/23/2025, 6:46:34 PM
// @license     MIT2
// @downloadURL https://update.greasyfork.org/scripts/533726/metruyencv%20unhide%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/533726/metruyencv%20unhide%20Content.meta.js
// ==/UserScript==

// const sleep=ms=>new Promise(rs=>setTimeout(rs,ms))
// console.log=console.debug;

// async function waitForElement(cssSelector, wT=2000,interval=100) {
//   for (let i=0; i<=wT; i=i+interval) {
//     let el = document.querySelector(cssSelector);
//     if (el) return el;
//     else await sleep(interval); }
//   return false;
// }

(async function (){
  document.querySelectorAll('div[data-x-show="$store.account.isLoggedIn || isGoogleBot()"][style="display: none;"]').forEach(el=>{
    el.setAttribute('style',"display: block;");   })
})()