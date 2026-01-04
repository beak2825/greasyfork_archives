// ==UserScript==
// @name         placement tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  track placement number for steam searches (https://store.steampowered.com/search/?sort_by=_ASC&ignore_preferences=1&filter=globaltopsellers)
// @author       TheGuy920
// @match        https://store.steampowered.com/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420506/placement%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/420506/placement%20tracker.meta.js
// ==/UserScript==

var placementCounter = 0;

async function execute1() {
  while (true) {
      await new Promise(resolve => setTimeout(resolve, 100));
      var parent = document.getElementById("search_resultsRows");
      var children = parent.children;
      for(var i = 0; i < children.length; i++)
      {
          if(!(children[i].innerHTML).includes("Placement Number:"))
          {
              placementCounter++;
              children[i].children[1].children[0].children[1].innerHTML += "<span>Placement Number: "+placementCounter + "</span>";
          }
      }
  }
}


(function() {
    'use strict';
   execute1();
})();
