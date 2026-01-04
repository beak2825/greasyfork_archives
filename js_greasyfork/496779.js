// ==UserScript==
// @name        TAS Debug Menu(OD1)
// @namespace   Violentmonkey Scripts
// @match       https://johnbutlergames.com/games/opposite-day/1-1-0/index.html*
// @grant       none
// @version     1.13
// @description 5/25/2024, 9:38:15 AM
// @downloadURL https://update.greasyfork.org/scripts/496779/TAS%20Debug%20Menu%28OD1%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496779/TAS%20Debug%20Menu%28OD1%29.meta.js
// ==/UserScript==

// Add a container for the debug menu
var debugMenu = document.createElement("div");
debugMenu.style.position = "absolute";
debugMenu.style.top = "10px";
debugMenu.style.left = "10px";
debugMenu.style.fontSize = "16px";
debugMenu.style.color = "white";
debugMenu.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
debugMenu.style.padding = "10px";
debugMenu.style.borderRadius = "5px";
debugMenu.style.display = "none"; // Initially hidden
document.body.appendChild(debugMenu);

// Add elements for various debug information
var positionTracker = document.createElement("div");
positionTracker.textContent = "Position: (X: 0.000, Y: 0.000)";
debugMenu.appendChild(positionTracker);

var velocityTracker = document.createElement("div");
velocityTracker.textContent = "Velocity: (X: 0.000, Y: 0.000)";
debugMenu.appendChild(velocityTracker);

var chunkTracker = document.createElement("div");
chunkTracker.textContent = "Chunk: (X: 0, Y: 0)";
debugMenu.appendChild(chunkTracker);

var fpsTracker = document.createElement("div");
fpsTracker.textContent = "FPS: 0";
debugMenu.appendChild(fpsTracker);

var gameTimeTracker = document.createElement("div");
gameTimeTracker.textContent = "Game Time: 0s";
debugMenu.appendChild(gameTimeTracker);

// Input fields for setting position
var posXInput = document.createElement("input");
posXInput.type = "text";
posXInput.placeholder = "Enter X position";
debugMenu.appendChild(posXInput);

var posYInput = document.createElement("input");
posYInput.type = "text";
posYInput.placeholder = "Enter Y position";
debugMenu.appendChild(posYInput);

// Button to set position
var setPositionButton = document.createElement("button");
setPositionButton.textContent = "Set Position";
setPositionButton.addEventListener("click", function() {
  var newX = parseFloat(posXInput.value);
  var newY = parseFloat(posYInput.value);
  if (!isNaN(newX) && !isNaN(newY)) {
    player.x = newX;
    player.y = newY;
    positionTracker.textContent = "Position: (X: " + newX.toFixed(3) + ", Y: " + newY.toFixed(3) + ")";
  } else {
    alert("Invalid input! Please enter valid numbers for X and Y positions.");
}
});
debugMenu.appendChild(setPositionButton);

var lastX = player.x;
var lastY = player.y;
var lastTime = Date.now();
var chunkSize = 1000; // Adjusted chunk size to 1000
var startTime = Date.now();
var lastFrameTime = Date.now();
var frameCount = 0;

setInterval(function() {
  var currentTime = Date.now();
  var deltaTime = (currentTime - lastTime) / 1000; // convert milliseconds to seconds

  var x = player.x.toFixed(3);
  var y = player.y.toFixed(3);

  var velocityX = ((player.x - lastX) / deltaTime).toFixed(3);
  var velocityY = ((player.y - lastY) / deltaTime).toFixed(3);

  var chunkX = Math.floor(player.x / chunkSize);
  var chunkY = Math.floor(player.y / chunkSize);

  var elapsedTime = (currentTime - startTime) / 1000; // convert milliseconds to seconds

  positionTracker.textContent = "Position: (X: " + x + ", Y: " + y + ")";
  velocityTracker.textContent = "Velocity: (X: " + velocityX + ", Y: " + velocityY + ")";
  chunkTracker.textContent = "Chunk: (X: " + chunkX + ", Y: " + chunkY + ")";
  gameTimeTracker.textContent = "Game Time: " + elapsedTime.toFixed(1) + "s";

  lastX = player.x;
  lastY = player.y;
  lastTime = currentTime;
}, 100);

// Function to update the debug menu position based on window size
function updateDebugMenuPosition() {
  var topPos = window.innerHeight * 0.01;
  var leftPos = window.innerWidth * 0.01;
  debugMenu.style.top = topPos + 'px';
  debugMenu.style.left = leftPos + 'px';
}

// Initial position update
updateDebugMenuPosition();

// Add event listener for window resize to update debug menu position
window.addEventListener('resize', updateDebugMenuPosition);

// Add event listener for keydown to toggle the debug menu visibility
document.addEventListener('keydown', function(event) {
  if (event.key === 'd' || event.key === 'D') {
    if (debugMenu.style.display === 'none') {
      debugMenu.style.display = 'block';
    } else {
      debugMenu.style.display = 'none';
    }
  }
});

// Track FPS at 60 frames per second
setInterval(function() {
  var currentFrameTime = Date.now();
  var frameDeltaTime = (currentFrameTime - lastFrameTime) / 1000; // convert milliseconds to seconds
  var fps = (frameCount / frameDeltaTime).toFixed(1);
  fpsTracker.textContent = "FPS: " + fps;

  // Reset frame count and last frame time every second
  if (currentFrameTime - lastFrameTime >= 1000) {
    frameCount = 0;
    lastFrameTime = currentFrameTime;
  }
  frameCount++;
}, 1000 / 60); // Run at 60 frames per second