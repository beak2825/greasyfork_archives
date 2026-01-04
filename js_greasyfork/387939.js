// ==UserScript==
// @name     Tinder anti-blur
// @version  1.2
// @grant    none
// @match    *://tinder.com/*
// @description Script that removes blur from liked profiles on Tinder ;)
// @namespace https://greasyfork.org/users/321352
// @downloadURL https://update.greasyfork.org/scripts/387939/Tinder%20anti-blur.user.js
// @updateURL https://update.greasyfork.org/scripts/387939/Tinder%20anti-blur.meta.js
// ==/UserScript==

function findReplacement(bi){
  bi = bi.split(" ")[0];
  let strs = [];
  let dims = ["320x400", "172x216", "84x106"];
  for (let dim of dims){
    strs.push(bi.replace(/(\d+x\d+)/g, match => dim));
  }
  return strs.join(", ");
}

setInterval(()=>{
  for (let e of document.querySelectorAll("[class*=Blur]"))
    for (let k of e.classList)
      if (k.startsWith("Blur"))
        e.classList.remove(k);
  for (let a of document.querySelectorAll("[style*=\"background-image: url\"]")){
  	a.style.backgroundImage = findReplacement(a.style.backgroundImage);
  }
}, 300)