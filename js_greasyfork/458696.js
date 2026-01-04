// ==UserScript==
// @name         動畫瘋長寬比調整
// @namespace    https://github.com/DonkeyBear
// @version      0.1
// @description  增加「將錯誤的 16:9 畫面壓縮回 4:3」的功能。
// @author       DonkeyBear
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458696/%E5%8B%95%E7%95%AB%E7%98%8B%E9%95%B7%E5%AF%AC%E6%AF%94%E8%AA%BF%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/458696/%E5%8B%95%E7%95%AB%E7%98%8B%E9%95%B7%E5%AF%AC%E6%AF%94%E8%AA%BF%E6%95%B4.meta.js
// ==/UserScript==

let animeInfoDetail = document.querySelector(".anime_info_detail");
let newInput = document.createElement("input");
let newLabel = document.createElement("label");
newInput.id = "aspect-ratio-hack";
newInput.type = "checkbox";
newInput.style.marginLeft = "12px";
newInput.style.marginRight = "4px";
newLabel.setAttribute("for", "aspect-ratio-hack");
newLabel.innerText = "將畫面壓縮為 4:3";
newLabel.className = "newanime-count";
newInput.onchange = (e) => {
  let video = document.querySelector("#video-container video");
  if (e.target.checked) {
    video.style.left = "12.5%";
    video.style.width = "75%";
    video.style.objectFit = "fill";
  } else {
    video.style.left = "0";
    video.style.width = "100%";
  }
}

animeInfoDetail.appendChild(newInput);
animeInfoDetail.appendChild(newLabel);