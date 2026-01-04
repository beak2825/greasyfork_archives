// ==UserScript==
// @name        Sankaku - Convenience
// @namespace   Selbi
// @match       https://chan.sankakucomplex.com/*
// @grant       none
// @version     1.0
// @author      Selbi
// @description Whole lotta convenience features
// @downloadURL https://update.greasyfork.org/scripts/420236/Sankaku%20-%20Convenience.user.js
// @updateURL https://update.greasyfork.org/scripts/420236/Sankaku%20-%20Convenience.meta.js
// ==/UserScript==
// 

// 429
if (document.title.includes("429")) {
  
  let body = document.querySelector("body");
  body.innerHTML = "";
  let reload = document.createElement("div");
  reload.onclick = function () { location.reload(); };
  reload.innerHTML = "Reload";
  reload.style.cursor = "pointer";
  reload.style.width = "100vw";
  reload.style.height = "100vh";
  reload.style.fontSize = "10vw";
  reload.style.textAlign = "center";
  body.appendChild(reload);
  
  setTimeout(function() { location.reload(); }, 30000);
  return;
}
const FULL = "fullvertical";

// Click and scale
window.addEventListener('load', () => {
  // Remove _blank from all thumbs
  let thumbs = document.querySelectorAll("span.thumb > a")
  for (let thumb of thumbs) {
    thumb.target = "";
  }
  
  // Image view settings
  let img = document.querySelector("#image");
  if (img != null) {
    // Autoscale
    img.click(); 

    // Autoscroll
    let y = Math.round(img.getBoundingClientRect().top + window.scrollY - 3);
    window.scrollTo({top: y});
    
    // More scaling options on click
    img.addEventListener('click', () => {
      if (!img.classList.contains(FULL)) {
        img.classList.add(FULL);  
      } else {
        img.classList.remove(FULL);
      }
    });
    
    // Middle click open picture in new tab
    img.parentNode.addEventListener('mouseup', (e) => {
      if (e.button === 1) {
        let url = img.parentNode.getAttribute("img-redirect");
        window.open(url, '_blank');
      }
    });
    setTimeout(() => img.parentNode.setAttribute("img-redirect", img.src), 500);
  }
  
}, true);
