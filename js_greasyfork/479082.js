// ==UserScript==
// @name         PandA 課題 色分け
// @namespace    https://twitter.com/mochimkchiking
// @version      1.2
// @description  PandAの課題を提出状況に合わせて色分けします。
// @author       わらピもち
// @match        https://panda.ecs.kyoto-u.ac.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kyoto-u.ac.jp
// @grant        none
// @license      CC BY 4.0
// @downloadURL https://update.greasyfork.org/scripts/479082/PandA%20%E8%AA%B2%E9%A1%8C%20%E8%89%B2%E5%88%86%E3%81%91.user.js
// @updateURL https://update.greasyfork.org/scripts/479082/PandA%20%E8%AA%B2%E9%A1%8C%20%E8%89%B2%E5%88%86%E3%81%91.meta.js
// ==/UserScript==

(()=>{
  if(document.querySelector(".is-current").innerText != "課題"){
    return;
  }
  const color = {
    "未開始": "#FAA",
    "提出済": "#DDD",
    "返却済": "#DED",
    "再提出": "#DEE",
    "取組中": "#EDE",
    "宣誓済": "#EED",
  }
  const statusNode = document.querySelectorAll("[headers=status]");
  for(const entry of statusNode) {
    console.log(entry.innerText);
    const txt = entry.innerText.substr(0,3);
    entry.parentNode.style.backgroundColor = color[txt];
  }
})();