// ==UserScript==
// @name         移除YouTube影片廣告 
// @name:ja      youtube去廣告 手動調播放速度
// @namespace    
// @version      1.2.
// @description   youtube
// @description:ja youtube 去廣告 手動調播放速度
// @author       
// @match        
// @grant        
// @license     未知
// @downloadURL https://update.greasyfork.org/scripts/446080/%E7%A7%BB%E9%99%A4YouTube%E5%BD%B1%E7%89%87%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/446080/%E7%A7%BB%E9%99%A4YouTube%E5%BD%B1%E7%89%87%E5%BB%A3%E5%91%8A.meta.js
// ==/UserScript==

var WL_YTASP = true;

var pbs = document.createElement("INPUT");
pbs.type="number";
pbs.style="background-color: black;color: white;background-repeat:no-repeat;border: none;cursor:pointer;overflow: hidden;outline:none;/*-moz-appearance: textfield;*/width:8vw;text-align: center;font-size:auto;/*pointer-events: none;*/";
pbs.step=0.1;
pbs.min=0;
pbs.value=1.0;
pbs.addEventListener("change",function(){if(pbs.value>0){document.getElementsByTagName("video")[0].playbackRate = pbs.value;}else{pbs.value=1;document.getElementsByTagName("video")[0].playbackRate = pbs.value;}});

document.getElementById('center').appendChild(pbs);

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
      if (document.contains(document.getElementsByClassName('ytp-ad-skip-button ytp-button')[0])) {
          document.getElementsByClassName('ytp-ad-skip-button ytp-button')[0].click();
      }
      if (document.contains(document.getElementsByClassName('ytp-ad-overlay-close-button')[0])) {
          document.getElementsByClassName('ytp-ad-overlay-close-button')[0].click();
      }
      document.getElementsByTagName("video")[0].playbackRate = pbs.value;
  });
});
const config = {childList:true,subtree:true};
observer.observe(document.body, config);
