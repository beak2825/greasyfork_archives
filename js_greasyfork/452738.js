// ==UserScript==
// @name        wikipedia table header float
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.0
// @author      tanhaworen
// @description 2/8/2022, 6:40:34 PM
// @match      https://*.wikipedia.org/wiki/*
// @run-at     document-start
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/452738/wikipedia%20table%20header%20float.user.js
// @updateURL https://update.greasyfork.org/scripts/452738/wikipedia%20table%20header%20float.meta.js
// ==/UserScript==


document.addEventListener('DOMNodeInserted', function() {
  var listOfThead = document.getElementsByTagName('thead');
  //console.log(listOfThead)
  var num = listOfThead.length;
  //console.log(num)
  var newUI = document.getElementById('vector-sticky-header');
    if (num > 0 ){
    Array.from(listOfThead).forEach(child => {
      child.style.position = "sticky";
      if(newUI){
          child.style.top = "50px";
      } else {
          child.style.top = 0;
      }
    });
  }
}, false);
