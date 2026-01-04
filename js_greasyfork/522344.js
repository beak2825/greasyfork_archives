// ==UserScript==
// @name         Agar.io custom skin by jmx.iox
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Upload image for custom skin
// @author       New JM 🕹️
// @match        agar.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522344/Agario%20custom%20skin%20by%20jmxiox.user.js
// @updateURL https://update.greasyfork.org/scripts/522344/Agario%20custom%20skin%20by%20jmxiox.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
 
  // Create and return a new file input element
  function createButton() {
    const button = document.createElement("input");
    button.type = "file";
    button.accept = "image/*";
    button.id = "customImageUpload";
    return button;
  }
 
  // Insert the given button into a new div element, and insert the div as a child element of the "color-option" element
  function insertButton(button, target) {
    if (target) {
      const newDiv = document.createElement("div");
      newDiv.style.marginTop = "5px"; // Add some space between the divs
      newDiv.appendChild(button);
      target.querySelector(".clear").appendChild(newDiv);
    }
  }
 
  // Convert the uploaded image to a base64 string and draw it on the canvas
  function convertImageToBase64(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
 
    reader.onloadend = function () {
      const base64 = reader.result;
      drawImage(base64);
    };
 
    reader.readAsDataURL(file);
  }
 
  // Draw the given base64 image on the canvas, resizing it to 512x512
  function drawImage(base64) {
    const canvas = document.getElementById("skin-editor-canvas");
    const context = canvas.getContext("2d");
    const image = new Image();
 
    image.onload = function () {
      canvas.width = 512;
      canvas.height = 512;
      context.drawImage(image, 0, 0, 512, 512);
      context.save();
    };
 
    image.src = base64;
  }
 
  // Check for the target element every 5 seconds (5000 milliseconds)
  function checkForTarget() {
    const target = document.querySelector(".left-tools");
 
    if (target) {
      const button = createButton();
      insertButton(button, target);
      button.addEventListener("change", convertImageToBase64);
      clearInterval(checkInterval); // Clear the interval once the button is added
    }
  }
 
  // Start checking for the target element
  const checkInterval = setInterval(checkForTarget, 1000);
})();