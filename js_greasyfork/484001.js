// ==UserScript==
// @name         youtube shorts onetap normal video page
// @name:zh-CN   youtube shorts onetap normal video page
// @name:en      youtube shorts onetap normal video page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ショートからワンタップで通常の動画ページに飛ぶ
// @description:zh-cn 只需轻点一下短片，即可跳转到普通视频页面
// @description:en    One tap from the short jumps to the regular video page
// @author       You
// @match        https://www.youtube.com/shorts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484001/youtube%20shorts%20onetap%20normal%20video%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/484001/youtube%20shorts%20onetap%20normal%20video%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Create a button
var newButton = document.createElement("button");
newButton.style.backgroundColor = "gray";
newButton.innerHTML = "F";

// Make the button circular
newButton.style.borderRadius = "50%";

// Adjust the size of the button
newButton.style.width = "50px";
newButton.style.height = "50px";

// Make the text bold
newButton.style.fontWeight = "bold";

// Set the text color to white
newButton.style.color = "white";

// Position the button in the middle right of the screen
newButton.style.position = "fixed";
newButton.style.right = "0px";
newButton.style.top = "50%";
newButton.style.transform = "translateY(-50%)";

// Define the action when the button is clicked
newButton.onclick = function() {
  // Get the URL of the current page
  var currentUrl = window.location.href;

  // Extract the necessary part from the URL
  var videoId = currentUrl.split("/shorts/")[1];

  // Create a new URL
  var newUrl = "https://www.youtube.com/watch?v=" + videoId;

  // Open the new URL
  window.open(newUrl, "_blank");
};

// Add the button to the body element
document.body.appendChild(newButton);


})();