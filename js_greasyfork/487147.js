// ==UserScript==
// @name        Full width job board unicornfactory.nz
// @namespace   Violentmonkey Scripts
// @match       https://app.unicornfactory.nz/dl/job-board*
// @grant       none
// @version     1.1
// @author      Ryan Halliday (me@ryanhalliday.com)
// @description 12/02/2024, 18:11:32
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487147/Full%20width%20job%20board%20unicornfactorynz.user.js
// @updateURL https://update.greasyfork.org/scripts/487147/Full%20width%20job%20board%20unicornfactorynz.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

function waitForElems(querySelectorStr, min_count=1, timer=1000) {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      const elements = document.querySelectorAll(querySelectorStr);

      if (elements.length >= min_count) {
        clearInterval(intervalId);
        resolve(elements);
      }
    }, timer);
  });
}

function updateElemWidth(){
  return new Promise(async (resolve, reject) => {
    for (const el of await waitForElems('.beWWxK.small', 4)){
      el.style['max-width'] = "100%";

      // waiting here gives it at least one second to load after the other elements
      waitForElems('.bUfyDd').then(rows => {
        for (const row of rows){
          row.style['grid-template-columns'] = "2fr 1fr 1fr";
        }
        resolve();
      })
    }
  })
}

window.addEventListener('load', updateElemWidth)
window.addEventListener('popstate', updateElemWidth)