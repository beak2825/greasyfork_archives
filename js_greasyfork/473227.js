// ==UserScript==
// @name        GitHub Network graph Intercept arrow keys
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @grant       none
// @version     1.0
// @description Stops the arrow keys from scrolling the page, because GitHub forgot to use "e.preventDefault();" when they made the keyboard shortcuts for the Network graph.
// @license MIT
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/473227/GitHub%20Network%20graph%20Intercept%20arrow%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/473227/GitHub%20Network%20graph%20Intercept%20arrow%20keys.meta.js
// ==/UserScript==
const regex = /^https:\/\/github\.com\/\S+\/network$/;
document.addEventListener("keydown", function(e){
  if (e.keyCode==37 || e.keyCode==38 || e.keyCode==39 || e.keyCode==40){
    if (document.location.href.match(regex)){
      if(document.activeElement.tagName!="INPUT"){
        e.preventDefault();
      }
    }
  }
});