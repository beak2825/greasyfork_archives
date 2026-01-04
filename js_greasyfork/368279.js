// ==UserScript==
// @name         Darren's custom userscript
// @namespace    ren-custom-userscript
// @version      0.3
// @description  try to take over the world!
// @author       darren
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/368279/Darren%27s%20custom%20userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/368279/Darren%27s%20custom%20userscript.meta.js
// ==/UserScript==
// 

function checkWL(){
  let currentURL = window.location.href;
  if(currentURL.indexOf('playlist?list=WL') > 0 && currentURL.indexOf('disable_polymer=true') < 0){
    location.replace("https://www.youtube.com/playlist?list=WL&disable_polymer=true");
  }else{}
}
function fixWLNav(){
  checkWL();
  var watchLaterNav = document.querySelector('a[href="/playlist?list=WL"]');
  if (watchLaterNav) {
    watchLaterNav.setAttribute('href', '/playlist?list=WL&disable_polymer=true');
    watchLaterNav.addEventListener("click", function(){
      location.replace("https://www.youtube.com/playlist?list=WL&disable_polymer=true");
    });
  }else{}

}

checkWL();

window.addEventListener("spfdone", fixWLNav); // old youtube design, just in case    
window.addEventListener("yt-navigate-start", fixWLNav); // new youtube design

document.addEventListener("DOMContentLoaded", fixWLNav); // one-time early processing
window.addEventListener("load", checkWL); // one-time late postprocessing 