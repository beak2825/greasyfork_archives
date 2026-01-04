// ==UserScript==
// @name        Optifine.net Ad-Free Link Generator.
// @namespace   armagan.rest
// @match       https://optifine.net/downloads
// @grant       none
// @version     0.1.1
// @author      Kıraç Armağan Önal
// @description It allows you to download Optifine jars wihtout seeing the ads.
// @downloadURL https://update.greasyfork.org/scripts/424480/Optifinenet%20Ad-Free%20Link%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/424480/Optifinenet%20Ad-Free%20Link%20Generator.meta.js
// ==/UserScript==

document.addEventListener("click",(e)=>{
  
  if (e.target.classList.contains("spoilerLink") || e.target.classList.contains("showAll")) {
    setTimeout(()=>{
      updateLinks();
    },0);
  }
  
});

window.addEventListener("DOMContentLoaded", ()=>{
  
  updateLinks();
  
})

function updateLinks() {
  console.log("update");
  let aElements = document.querySelectorAll(".colMirror a:not(.adFree)");
  aElements.forEach((aElement)=>{
    let url = new URL(aElement.href);
    url.pathname = "/download";
    aElement.classList.add("addFree");
    aElement.href = url.toString();
    aElement.textContent = "(Ad-Free)";
    aElement.title = "This link does not shows the ads and just directly downloads the jar."
    url = 0;
    aElement = 0;
  });
  aElements = 0;
}

