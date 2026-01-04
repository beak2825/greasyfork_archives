// ==UserScript==
// @name        Remove YouTube Shorts and Recommendations
// @namespace   Violentmonkey Scripts
// @match       https://*.youtube.com/*
// @grant       none
// @version     1.0.1
// @run-at      document-end
// @author      Kalavian
// @license     MIT
// @description Remove YouTube recommendations and redirect shorts to the main YouTube viewer.
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/545923/Remove%20YouTube%20Shorts%20and%20Recommendations.user.js
// @updateURL https://update.greasyfork.org/scripts/545923/Remove%20YouTube%20Shorts%20and%20Recommendations.meta.js
// ==/UserScript==

// trying to program at 2:40 am goes hard :3 also trans rights :3

if(window.location.href.includes("shorts/")){
  window.location = window.location.href.replace("shorts/","watch?v=");
}
window.onload = function(){
  let successfullyRemoved = false;
  let removeAttempts = 0;
  const removeRecommendations = setInterval(function(){
    try {
      document.getElementById("secondary").remove();
      successfullyRemoved=true;
    }
    catch {
      successfullyRemoved=false;
    }
    finally {
      if(successfullyRemoved){
        clearInterval(removeRecommendations);
      }
    }
    removeAttempts++;
    if(removeAttempts>100){
      clearInterval(removeRecommendations);
      alert("Could not remove recommendations");
    }
  }, 50);
}