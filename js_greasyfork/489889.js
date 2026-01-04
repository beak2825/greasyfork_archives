// ==UserScript==
// @name         Duo's auto-comebacker
// @namespace    http://tampermonkey.net/
// @version      v1.1
// @description  Need Duolingo-Cheat-Tool to working automaticly (https://update.greasyfork.org/scripts/431948/Duolingo-Cheat-Tool.user.js)
// @author       mhuy2k11
// @match        https://www.duolingo.com/learn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duolingo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489889/Duo%27s%20auto-comebacker.user.js
// @updateURL https://update.greasyfork.org/scripts/489889/Duo%27s%20auto-comebacker.meta.js
// ==/UserScript==

const startTime = Date.now();
async function run() {
  let link;
  // Thay số sau startTime nhỏ hơn để vào nhanh hơn
  while(!link && Date.now() - startTime < 1000){
    link = await waitForElement("#linkB");
  }
  if(link){
    location.replace('/practice'); //có thể chuyển /practice thành /lesson
  } else {
    setTimeout(() => {
      run();
    }, 1000);
  }
}

setTimeout(() => {
  document.body.innerHTML += '<div id="linkB"></div>';
}, 1000);
function waitForElement(selector) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
      }
    }, 1000);
  });
}
run();
