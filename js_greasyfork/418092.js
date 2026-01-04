// ==UserScript==
// @name Gfycat never autoplay
// @namespace https://lalalaautoplaysucks
// @version 0.2
// @description Automatically turn Gfycat autoplay to false.
// @match https://gfycat.com/*
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/418092/Gfycat%20never%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/418092/Gfycat%20never%20autoplay.meta.js
// ==/UserScript==

(function() {

  max_fails = 3
  max_successes = 2
  
  function toggle_autoplay() {
  
    var checkbox = document.querySelector(".switch > input:nth-child(1)");
  
    if (checkbox) {
      console.log(checkbox);
      console.log(checkbox.checked);
  
      if (checkbox.checked) {
        if (max_successess > 0) {
          checkbox.click(); 
          setTimeout(toggle_autoplay, 1000);
          max_successess--
        }
      }

    } else {
      if (max_fails > 0) {
        console.log("Did not find the switch. Retrying...");
        setTimeout(toggle_autoplay, 1000);
        max_fails--;
      }
    }
  }

//  setTimeout(toggle_autoplay, 1000);
  setTimeout(simple_changer, 1000);
  setTimeout(simple_changer, 2000);
  
  function simple_changer() {
  
    var checkbox = document.querySelector(".switch > input:nth-child(1)");
  
    if (checkbox) {
      console.log("trying the simpler method and checkbox was: " + checkbox.checked);
  
      if (checkbox.checked) {
        checkbox.click(); 
        console.log("clicked on the checkbox to be: " + checkbox.checked);
      }

    } else {
    }
      setTimeout(simple_changer, 3000);
      console.log("Simple did not find the switch.");
  }


})();