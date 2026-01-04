// ==UserScript==
// @name         OneClick Tools - McGraw-Hill
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      4
// @description  Copy/Google with a single click on all McGraw-Hill quiz questions of your course.
// @author       hacker09
// @match        https://ezto.mheducation.com/ext/map/index.html*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ezto.mheducation.com&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487325/OneClick%20Tools%20-%20McGraw-Hill.user.js
// @updateURL https://update.greasyfork.org/scripts/487325/OneClick%20Tools%20-%20McGraw-Hill.meta.js
// ==/UserScript==

setInterval(() => {
  (function() {
    'use strict';
    document.querySelector("#question-info-holder")?.remove();
    document.querySelector(".Win32").style.cursor = "pointer"; //Change cursor style to pointer
    document.querySelector(".Win32").addEventListener('mouseup', function(event) { //When the mouse is clicked
      event.preventDefault(); //Prevent the default context menu from being opened
      if (event.button === 0) { //If the user single click anywhere on the question/answer
        navigator.clipboard.writeText(document.querySelector(".Win32").innerText.replaceAll(/\n|\s+|%media:case.jpg%|Required information|Skip to question|View the animation below, then complete the quiz to test your knowledge of the concept./gm, ' ')); //Copy the text and question
      } else if (event.button === 2) { //If the user right click anywhere on the question/answer
        navigator.clipboard.writeText(document.querySelector(".Win32").querySelector(".question, .worksheet__main > p")?.innerText); //Copy the question
        open('https://www.google.com/search?q=' + encodeURIComponent(document.querySelector(".Win32").innerText.replaceAll(/\n|\s+|%media:case.jpg%|Required information|Skip to question|View the animation below, then complete the quiz to test your knowledge of the concept./gm, ' '))); //Google the question and answer
      } //Finishes the else condition
    }); //Finishes the mouseup event listener
  })()
}, 1000);