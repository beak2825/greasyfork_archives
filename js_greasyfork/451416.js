// ==UserScript==
// @name        edrunbtn
// @namespace   Violentmonkey Scripts
// @match       https://edstem.org/*
// @grant       none
// @version     1.0
// @author      Shark / skylee03
// @description EdAutoRunCode
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451416/edrunbtn.user.js
// @updateURL https://update.greasyfork.org/scripts/451416/edrunbtn.meta.js
// ==/UserScript==
function addRunBtn(){
  let es = document.getElementsByTagName("button");
  for(let i = 0; i < es.length; i++) {
    if(es[i].classList.contains("snip-tb-item")) {
      es[i].style.display = "";
    }
  }
}

document.addEventListener('DOMNodeInserted', function() {
  addRunBtn();
}, false);