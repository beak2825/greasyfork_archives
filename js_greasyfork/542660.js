// ==UserScript==
// @name        Remove difficulty on boot.dev assignments
// @namespace   https://github.com/luigiMinardi
// @match       https://www.boot.dev/lessons/*
// @grant       none
// @version     1.0
// @author      luigiMinardi
// @license     MIT
// @description Remove difficulty on boot.dev assignments by hiding the element
// @homepageURL https://greasyfork.org/en/scripts/542660-remove-difficulty-on-boot-dev-assignments
// @downloadURL https://update.greasyfork.org/scripts/542660/Remove%20difficulty%20on%20bootdev%20assignments.user.js
// @updateURL https://update.greasyfork.org/scripts/542660/Remove%20difficulty%20on%20bootdev%20assignments.meta.js
// ==/UserScript==

function removeDifficulty() {
  let fullBar = document.querySelector("#__nuxt > div > div.static-bgimage.bg-image-blue > div.h-full-minus-bar.flex > div > div > div > div:nth-child(1) > div");

  let iconsArray = fullBar.children[0].children
  //console.log("iconsArray:", iconsArray) // Use that to debug if iconsArray change in the future
  if (iconsArray.length == 0) {
    setTimeout(() => {
      removeDifficulty()
    }, 100)
    return
  }
  iconsArray[3].style.display = 'none'; // remove one divisory
  iconsArray[4].style.display = 'none'; // remove the difficulty icon
}

setTimeout(() => {
  removeDifficulty()
},100);

// Code to call function on page change
// This seem to refresh the page every time you move to a new one, so you may want to remove this part of the script
// Source: https://itsopensource.com/how-to-call-a-function-on-URL-change-in-javascript/#:~:text=Solution
(function(history){
    let pushState = history.pushState;
    history.pushState = function(state) {
      setTimeout(() => {
        removeDifficulty()
      },100);

      return pushState.apply(history, arguments);
    };
})(window.history);