// ==UserScript==
// @name         No "Before you continue" pop-up on Youtube and Google
// @version      0.1
// @description  Remove the "Before you continue" popup from Google and YouTube
// @author       AstroVD
// @match        https://www.google.com/*
// @match        https://www.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/651064
// @downloadURL https://update.greasyfork.org/scripts/424019/No%20%22Before%20you%20continue%22%20pop-up%20on%20Youtube%20and%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/424019/No%20%22Before%20you%20continue%22%20pop-up%20on%20Youtube%20and%20Google.meta.js
// ==/UserScript==


const style = document.createElement('style');

console.log("i")

if(location.href.startsWith("https://www.google.com")){
style.innerHTML = /* css */ `
  html {
    overflow: auto !important;
  }
  
  .gTMtLb > div[class=""] {
    display: none !important;
  }
`;
}
if(location.href.startsWith("https://www.youtube.com")){
  style.innerHTML = /* css */ `
  iron-overlay-backdrop {
    display: none !important;
  }
  
  #consent-bump {
    display: none !important;
  }
`;
}
document.head.append(style);