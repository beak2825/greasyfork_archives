// ==UserScript==
// @name        Hide Shorts button / tab
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.1
// @author      jside
// @description Script that hides the short tab 
// @downloadURL https://update.greasyfork.org/scripts/441830/Hide%20Shorts%20button%20%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/441830/Hide%20Shorts%20button%20%20tab.meta.js
// ==/UserScript==


var mainLoop = setInterval(()=>{
  try {
  a = document.getElementsByTagName("ytd-guide-entry-renderer");
  a[2].hidden = true;
    
  if (a[2].hidden == true){
      clearInterval(mainLoop); // for the performance
    }
  }
  catch(err) {
  // lets not spam the console
  }
},1000);
