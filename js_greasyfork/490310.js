// ==UserScript==
// @namespace ATGT
// @name     Bilibili Tune
// @description Bilibili Tune: longer and wider video list, ...
// @version  2
// @license  MIT
// @match    https://www.bilibili.com/video/*
// @icon     https://www.bilibili.com/favicon.ico
// @grant    none
// @run-at   document-end
// @downloadURL https://update.greasyfork.org/scripts/490310/Bilibili%20Tune.user.js
// @updateURL https://update.greasyfork.org/scripts/490310/Bilibili%20Tune.meta.js
// ==/UserScript==
  
//alert("hello");
console.log("++++++ bilibili-tune");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


let tuneFunc = async function () {
  const start = Date.now();
  const height = "600px";
  console.log("bilibili-tuneFunc start", start/1000);
  
  while (Date.now() - start < 5000) {
    let vlist = document.querySelector(".base-video-sections-v1 .video-sections-content-list");
//     console.log("bilibili-tune vlist", vlist);

    if (vlist) {
      vlist.style.maxHeight = height;
      vlist.style.height = height;
      
      let videos = document.querySelectorAll(".base-video-sections-v1 .video-section-list .video-episode-card__info-title");
// 			console.log("bilibili-tune videos", videos);
      for (let v of videos) {
        v.style.width = "auto";
      }
    }
    
    await sleep(500);
  }
  
  console.log("bilibili-tuneFunc end", start/1000);
}

tuneFunc();
window.addEventListener('popstate', tuneFunc);
window.addEventListener('pushstate', tuneFunc);

console.log("------ bilibili-tune");
