// ==UserScript==
// @name         Webnovel Online Fixer
// @namespace    https://theusaf.github.io
// @version      1.1
// @description  Attempt to fix broken html and stuff
// @author       theusaf
// @match        https://webnovelonline.com/chapter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413267/Webnovel%20Online%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/413267/Webnovel%20Online%20Fixer.meta.js
// ==/UserScript==

const paragraphs = document.querySelectorAll(".chapter-content > p,.chapter-content>div p");
const noselect = document.querySelectorAll("[style=\"user-select: none;\"]");
for(let i = 0;i<paragraphs.length;i++){
  paragraphs[i].innerHTML = paragraphs[i].innerHTML.replace(/&gt;/gm,">").replace(/&lt;/gm,"<");
  while(paragraphs[i].innerHTML.indexOf("&amp;") !== -1){
    paragraphs[i].innerHTML = paragraphs[i].innerHTML.replace(/&amp;/gm,"&");
  }
  if(paragraphs[i].innerHTML === "*** You are reading on https://webnovelonline.com ***"){
    paragraphs[i].style = "display:none;";
  }
}
for(let i = 0;i<noselect.length;i++){
  noselect[i].style = "";
}