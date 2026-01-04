// ==UserScript==
// @name         Soundcloud Precise Date
// @namespace    Violentmonkey Scripts
// @match        https://soundcloud.com/*
// @grant        none
// @version      2.0
// @author       bye-csavier (https://github.com/bye-csavier)
// @run-at       document-end
// @description  A script to replace relative dates with exact dates (e.g track upload date, comment publication date).
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/503724/Soundcloud%20Precise%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/503724/Soundcloud%20Precise%20Date.meta.js
// ==/UserScript==

function setRealDate(relDate){
  if(relDate.dataset.xjsPreciseSoundCloudDate) return;
  let realDate = relDate.getAttribute("title")
  relDate.children[1].innerText = realDate; //may changed based on soundcloud comoponents strcture
  relDate.dataset.xjsPreciseSoundCloudDate = true;
}

function handleAllRelativeTimes(){
  let trackDates = document.querySelectorAll("time.relativeTime");
  for (let i = 0, len = trackDates.length; i < len; ++i) {
    setRealDate(trackDates[i])
  }
}

handleAllRelativeTimes(); //If the content is already loaded, somehow


let idleDone = false;
/*
    I guess soundcloud loads everything after the DOMContentLoaded event, trough scripts. Therefore I need to observe for every mutation on the body :(
    Still, the mutation is used to replace the new content the user loads so +1 for mutation observer.

    It may be possible to stop it after a while it gets not called and trigger the mec
*/
new MutationObserver((mutations, observer)=>{
  handleAllRelativeTimes();
  if(!idleDone){
    idleDone = true;
    observer.disconnect();
    observer.observe(document.getElementById("content"), {subtree:true, childList:true})
  }
}).observe(document.body, {subtree:true, childList:true})
