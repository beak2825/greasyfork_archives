// ==UserScript==
// @name         twitter fix select style
// @namespace    http://tampermonkey.net/
// @version      2024-05-17
// @description  fix twitter selection not working
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491669/twitter%20fix%20select%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/491669/twitter%20fix%20select%20style.meta.js
// ==/UserScript==

(async()=>{
  let scr=document.head.querySelector("#draftjs-styles")
  while(!scr){
    await new Promise(res=>setTimeout(res,10))
    scr=document.head.querySelector("#draftjs-styles")
  }
   scr.textContent=scr.textContent.replace("div:only-child > .public-DraftStyleDefault-block::selection {\n        background: transparent;\n","div:only-child > .public-DraftStyleDefault-block::selection {\n        background: rgb(29, 155, 240);\n")
})()

