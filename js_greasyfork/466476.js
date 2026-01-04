// ==UserScript==
// @name         Chatgpt Unofficial Notepad
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a small context window for note taking on the openai.com website for usages with chatgpt.
// @author       Lefty & Chatgpt3/4
// @homepage     https://www.tiktok.com/@leftovergains
// @match        https://chat.openai.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466476/Chatgpt%20Unofficial%20Notepad.user.js
// @updateURL https://update.greasyfork.org/scripts/466476/Chatgpt%20Unofficial%20Notepad.meta.js
// ==/UserScript==

// If you like my script tip me <3
// venmo: @radicalcommunitycare cashapp: $radicalcommumitycare
// Follow me on tiktok: @leftovergains

(function() {
  'use strict';

  var numWindows = 5; // Number of text windows
  var currentIndex = 0; // Index of the currently displayed text window

  // Create a new div element for the floating window
  var newDiv = document.createElement("div");
  newDiv.style.position = "fixed";
  newDiv.style.top = "20px";
  newDiv.style.right = "20px";
  newDiv.style.zIndex = "1000";
  newDiv.style.backgroundColor = "#333"; // Dark background
  newDiv.style.border = "1px solid white"; // White border
  newDiv.style.color = "white"; // White text
  newDiv.style.padding = "10px";

  // Create the text windows
  var textWindows = [];
  for (var i = 0; i < numWindows; i++) {
    // Create a new div for the text window and its title
    var textContainer = document.createElement("div");
    textContainer.style.display = "none"; // Initially hide the text divs

    var textDiv = document.createElement("div");

    // Create an editable title for the text window
    var titleInput = document.createElement("input");
    titleInput.style.width = "200px"; // Match the width of the textarea
    titleInput.style.backgroundColor = "#333"; // Dark background
    titleInput.style.color = "white"; // White text
    titleInput.style.display = "block";
    titleInput.style.marginLeft = "auto";
    titleInput.style.marginRight = "auto";

    titleInput.value = "Window " + (i + 1); // Initial title text

    // Add an event listener to save the title input value when it changes
    titleInput.addEventListener("input", function(event) {
      var titleValue = event.target.value;
      var windowIndex = textWindows.findIndex(function(window) {
        return window.contains(event.target);
      });
      localStorage.setItem("textWindowTitle_" + windowIndex, titleValue);
    });

    // Retrieve the saved title from localStorage, if any, and populate the title input
    var savedTitle = localStorage.getItem("textWindowTitle_" + i);
    if (savedTitle) {
      titleInput.value = savedTitle;
    }

    textDiv.appendChild(titleInput);

    var newTextarea = document.createElement("textarea");
    newTextarea.style.width = "200px";
    newTextarea.style.height = "100px";
    newTextarea.style.backgroundColor = "#333"; // Dark background
    newTextarea.style.color = "white"; // White text

    // Add an event listener to save the text area content when it changes
    newTextarea.addEventListener("input", function(event) {
      var textareaValue = event.target.value;
      var windowIndex = textWindows.findIndex(function(window) {
        return window.contains(event.target);
      });
      localStorage.setItem("textWindow_" + windowIndex, textareaValue);
    });

    // Retrieve the saved text from localStorage, if any, and populate the textarea
    var savedText = localStorage.getItem("textWindow_" + i);
    if (savedText) {
      newTextarea.value = savedText;
    }

    textDiv.appendChild(newTextarea);

    textContainer.appendChild(textDiv);
    textWindows.push(textContainer);
    newDiv.appendChild(textContainer);
  }
  textWindows[0].style.display = "block"; // Show the first text div

  // Create the previous and next buttons
var prevButton = document.createElement("button");
prevButton.textContent = "Prev";
prevButton.style.backgroundColor = "#333"; // Dark background
prevButton.style.color = "white"; // White text
prevButton.style.marginRight = "10px"; // Add space between the buttons
prevButton.onclick = function() {
  textWindows[currentIndex].style.display = "none";
  currentIndex = (currentIndex - 1 + numWindows) % numWindows;
  textWindows[currentIndex].style.display = "block";
};

var nextButton = document.createElement("button");
nextButton.textContent = "Next";
nextButton.style.backgroundColor = "#333"; // Dark background
nextButton.style.color = "white"; // White text
nextButton.onclick = function() {
  textWindows[currentIndex].style.display = "none";
  currentIndex = (currentIndex + 1) % numWindows;
  textWindows[currentIndex].style.display = "block";
};

var buttonDiv = document.createElement("div");
buttonDiv.appendChild(prevButton);
buttonDiv.appendChild(nextButton);

// Append the buttons to the div
newDiv.appendChild(buttonDiv);

// Append the div to the body of the document
document.body.appendChild(newDiv);
})();