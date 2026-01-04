// ==UserScript==
// @name         OneClick Tools - Canvas Instructure
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      2
// @description  Copy/Google with a single click on all instructure.com quizzes/exam questions of your course.
// @author       hacker09
// @match        https://*.instructure.com/courses/*/quizzes/*
// @icon         https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486992/OneClick%20Tools%20-%20Canvas%20Instructure.user.js
// @updateURL https://update.greasyfork.org/scripts/486992/OneClick%20Tools%20-%20Canvas%20Instructure.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.querySelectorAll(".text").forEach(el => { //forEach question
    el.style.cursor = "pointer"; //Change cursor style to pointer
    el.addEventListener('mouseup', function(event) { //When the mouse is clicked
      event.preventDefault(); //Prevent the default context menu from being opened
      var textToCopy = el.cloneNode(true); //Clone the question/answers
      textToCopy.querySelectorAll('.original_question_text, #question_input_1_statusbar, .ic-RichContentEditor, .tox-editor-header, style')?.forEach(editor => editor.remove()); //If existent, select elements to remove their text
      if (event.button === 0) { //If the user single clicks anywhere on the question/answer
        navigator.clipboard.writeText(textToCopy.innerText.replace(/(\r?\n\s*){2,}/g, '\n')); //Copy the text and question
      } else if (event.button === 2) { //If the user right clicks anywhere on the question/answer
        navigator.clipboard.writeText(el.querySelector(".question_text.user_content.enhanced").innerText); //Copy only the question
        open('https://www.google.com/search?q=' + encodeURIComponent(textToCopy.innerText.replace(/(\r?\n\s*){2,}/g, '\n'))); //Google the question and answer
      } //Finishes the else condition
    }); //Finishes the mouseup event listener
  }); //Finishes the forEach loop
})();