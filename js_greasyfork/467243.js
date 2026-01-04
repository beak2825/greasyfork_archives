// ==UserScript==
// @name         Character.ai Unofficial Notepad
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a small context window for note taking on the character.ai website for usages with various characters.
// @author       Lefty & Chatgpt3/4
// @homepage     https://www.tiktok.com/@leftovergains
// @match        https://beta.character.ai/chat?char=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467243/Characterai%20Unofficial%20Notepad.user.js
// @updateURL https://update.greasyfork.org/scripts/467243/Characterai%20Unofficial%20Notepad.meta.js
// ==/UserScript==
 
// If you like my script tip me <3
// venmo: @radicalcommunitycare cashapp: $radicalcommumitycare
// Follow me on tiktok: @leftovergains

(function() {
  'use strict';

  var numWindows = 5; // Number of text windows
  var currentIndex = 0; // Index of the currently displayed text window

  var characterId = window.location.href.split('=')[1]; // Extracting the character ID from URL

  var newDiv = document.createElement("div");
  newDiv.style.position = "fixed";
  newDiv.style.top = "20px";
  newDiv.style.right = "20px";
  newDiv.style.zIndex = "1000";
  newDiv.style.backgroundColor = "#333";
  newDiv.style.border = "1px solid white";
  newDiv.style.color = "white";
  newDiv.style.padding = "10px";

  var textWindows = [];
  for (var i = 0; i < numWindows; i++) {
    var textContainer = document.createElement("div");
    textContainer.style.display = "none";

    var textDiv = document.createElement("div");

    var titleInput = document.createElement("input");
    titleInput.style.width = "200px";
    titleInput.style.backgroundColor = "#333";
    titleInput.style.color = "white";
    titleInput.style.display = "block";
    titleInput.style.marginLeft = "auto";
    titleInput.style.marginRight = "auto";
    titleInput.value = "Window " + (i + 1);

    titleInput.addEventListener("input", function(event) {
      var titleValue = event.target.value;
      var windowIndex = textWindows.findIndex(function(window) {
        return window.contains(event.target);
      });
      localStorage.setItem("textWindowTitle_" + characterId + "_" + windowIndex, titleValue);
    });

    var savedTitle = localStorage.getItem("textWindowTitle_" + characterId + "_" + i);
    if (savedTitle) {
      titleInput.value = savedTitle;
    }

    textDiv.appendChild(titleInput);

    var newTextarea = document.createElement("textarea");
    newTextarea.style.width = "200px";
    newTextarea.style.height = "100px";
    newTextarea.style.backgroundColor = "#333";
    newTextarea.style.color = "white";

    newTextarea.addEventListener("input", function(event) {
      var textareaValue = event.target.value;
      var windowIndex = textWindows.findIndex(function(window) {
        return window.contains(event.target);
      });
      localStorage.setItem("textWindow_" + characterId + "_" + windowIndex, textareaValue);
    });

    var savedText = localStorage.getItem("textWindow_" + characterId + "_" + i);
    if (savedText) {
      newTextarea.value = savedText;
    }

    textDiv.appendChild(newTextarea);
    textContainer.appendChild(textDiv);
    textWindows.push(textContainer);
    newDiv.appendChild(textContainer);
  }
  textWindows[0].style.display = "block";

  var prevButton = document.createElement("button");
  prevButton.innerHTML = "Prev";
  prevButton.addEventListener("click", function() {
    textWindows[currentIndex].style.display = "none";
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = textWindows.length - 1;
    }
    textWindows[currentIndex].style.display = "block";
  });

  var nextButton = document.createElement("button");
  nextButton.innerHTML = "Next";
  nextButton.addEventListener("click", function() {
    textWindows[currentIndex].style.display = "none";
    currentIndex++;
    if (currentIndex >= textWindows.length) {
      currentIndex = 0;
    }
    textWindows[currentIndex].style.display = "block";
  });

  newDiv.appendChild(prevButton);
  newDiv.appendChild(nextButton);

  document.body.appendChild(newDiv);

})();