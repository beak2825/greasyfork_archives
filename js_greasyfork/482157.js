// ==UserScript==
// @copyright 2023, D0n9X1n (https://openuserjs.org/users/MikeCoder)
// @license MIT
// @name         Remove locked problems from leetcode.com
// @namespace    http://d0n9x1n.dev/leetcode.com
// @version      1.0
// @description  try to take over the leetcode site!
// @author       D0n9X1n
// @match        https://leetcode.com/problemset/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482157/Remove%20locked%20problems%20from%20leetcodecom.user.js
// @updateURL https://update.greasyfork.org/scripts/482157/Remove%20locked%20problems%20from%20leetcodecom.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var mainPage = document.getElementsByTagName("body")[0];
  var button = document.createElement("input");
  button.type = "button";
  button.classList = "px-4 py-[10px] leading-tight rounded-full whitespace-nowrap flex space-x-2 items-center text-base pointer-event-none bg-gray-8 dark:bg-white text-label-r dark:text-dark-label-r shadow-level2 dark:shadow-dark-level2";
  button.style = "position: fixed;z-index: 10000;top: 80%;left: 80%;width:150px";
  button.value = "Hide Locked";
  button.onclick = removeLocks;
  mainPage.append(button);

  function removeLocks() {
    console.log("remove locks");
    // Get all div elements with the specified class names and role attribute
    var divElements = document.querySelectorAll('div[role="row"].odd\\:bg-layer-1.even\\:bg-overlay-1.dark\\:odd\\:bg-dark-layer-bg.dark\\:even\\:bg-dark-fill-4');

    // Define the SVG code as a string
    var svgCode = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="text-brand-orange h-[18px] w-[18px]" style="--darkreader-inline-fill: currentColor;" data-darkreader-inline-fill=""><path fill-rule="evenodd" d="M7 8v2H6a3 3 0 00-3 3v6a3 3 0 003 3h12a3 3 0 003-3v-6a3 3 0 00-3-3h-1V8A5 5 0 007 8zm8 0v2H9V8a3 3 0 116 0zm-3 6a2 2 0 100 4 2 2 0 000-4z" clip-rule="evenodd"></path></svg>';

    // Iterate through each div element
    divElements.forEach((divElement) => {
      console.log(divElement);

      // Check if the divElement's innerHTML contains the SVG code as a substring
      if (divElement.innerHTML.includes(svgCode)) {
        divElement.style.display = 'none'; // Hide the div if the SVG code is found
      }
    });
  }
})();