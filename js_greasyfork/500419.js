// ==UserScript==
// @name         Taming.io shark finder
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  if there's a shark hidden on your screen it will find it for you
// @author       Phantasm
// @match        *://taming.io/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500419/Tamingio%20shark%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/500419/Tamingio%20shark%20finder.meta.js
// ==/UserScript==
// Get the canvas element
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Set the line color to RGB 123, 159, 209
ctx.strokeStyle = 'rgb(123, 159, 209)';

// Set the line width
ctx.lineWidth = 5;

// Function to get the coordinates of an object with a specific color
function getObjectCoordinates(color) {
  // Get the page's image data
  var imageData = getImageData();

  // Iterate through the image data to find the object with the specified color
  for (var y = 0; y < imageData.height; y++) {
    for (var x = 0; x < imageData.width; x++) {
      var pixel = imageData.data[(y * imageData.width * 4) + (x * 4)];
      if (pixel[0] === color[0] && pixel[1] === color[1] && pixel[2] === color[2]) {
        // Found the object! Return its coordinates
        return [x, y];
      }
    }
  }

  // If no object is found, return null
  return null;
}

// Function to get the page's image data
function getImageData() {
  // Create a temporary canvas to render the page
  var tempCanvas = document.createElement('canvas');
  tempCanvas.width = window.innerWidth;
  tempCanvas.height = window.innerHeight;
  var tempCtx = tempCanvas.getContext('2d');

  // Render the page on the temporary canvas
  tempCtx.drawWindow(window, 0, 0, window.innerWidth, window.innerHeight);

  // Get the image data from the temporary canvas
  var imageData = tempCtx.getImageData(0, 0, window.innerWidth, window.innerHeight);

  // Remove the temporary canvas
  tempCanvas.remove();

  return imageData;
}

// Get the coordinates of the object with the color RGB 123, 159, 209
var objectCoordinates = getObjectCoordinates([123, 159, 209]);

// If the object is found, draw a line to it
if (objectCoordinates) {
  ctx.beginPath();
  ctx.moveTo(968, 630);
  ctx.lineTo(objectCoordinates[0], objectCoordinates[1]);
  ctx.stroke();
} else {
  console.log("Object not found!");
}