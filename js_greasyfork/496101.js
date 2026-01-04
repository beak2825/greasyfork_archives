// ==UserScript==
// @name        Debug Menu(OD1)
// @namespace   Violentmonkey Scripts
// @match       https://johnbutlergames.com/games/opposite-day/1-1-0/index.html*
// @grant       none
// @version     1.13
// @description 5/25/2024, 9:38:15 AM
// @downloadURL https://update.greasyfork.org/scripts/496101/Debug%20Menu%28OD1%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496101/Debug%20Menu%28OD1%29.meta.js
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
debugMenu.style.resize = "both"; // Make resizable
debugMenu.style.overflow = "auto"; // Add overflow for resizing
document.body.appendChild(debugMenu);

// Add a header for the debug menu (for dragging)
var debugMenuHeader = document.createElement("div");
debugMenuHeader.style.cursor = "move";
debugMenuHeader.style.backgroundColor = "#333";
debugMenuHeader.style.color = "#fff";
debugMenuHeader.style.padding = "5px";
debugMenuHeader.style.fontWeight = "bold";
debugMenuHeader.textContent = "Debug Menu";
debugMenu.appendChild(debugMenuHeader);

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

// Input field for setting the timer value
var timerInput = document.createElement("input");
timerInput.type = "text";
timerInput.placeholder = "Enter Timer Value (s)";
debugMenu.appendChild(timerInput);

// Button to set the timer value
var setTimerButton = document.createElement("button");
setTimerButton.textContent = "Set Timer";
setTimerButton.addEventListener("click", function() {
  var newTime = parseFloat(timerInput.value);
  if (!isNaN(newTime)) {
    timer = newTime;
    startTime = Date.now() - (newTime * 1000);
    gameTimeTracker.textContent = "Game Time: " + newTime.toFixed(1) + "s";
    timerRunning = false; // Pause the timer
  } else {
    alert("Invalid input! Please enter a valid number for the timer value.");
  }
});
debugMenu.appendChild(setTimerButton);

// Settings button to open the settings tab
var settingsButton = document.createElement("button");
settingsButton.textContent = "Settings";
settingsButton.addEventListener("click", function() {
  settingsTab.style.display = settingsTab.style.display === "none" ? "block" : "none";
});
debugMenu.appendChild(settingsButton);

// Settings tab container
var settingsTab = document.createElement("div");
settingsTab.style.position = "absolute";
settingsTab.style.top = "10px";
settingsTab.style.left = "10px";
settingsTab.style.fontSize = "16px";
settingsTab.style.color = "white"; // Fixed quotation marks
settingsTab.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
settingsTab.style.padding = "10px";
settingsTab.style.borderRadius = "5px";
settingsTab.style.display = "none"; // Initially hidden
settingsTab.style.resize = "both"; // Make resizable
settingsTab.style.overflow = "auto"; // Add overflow for resizing
document.body.appendChild(settingsTab);

// Input for changing debug menu color
var colorInput = document.createElement("input");
colorInput.type = "color";
colorInput.addEventListener("input", function() {
  debugMenu.style.backgroundColor = colorInput.value;
});
settingsTab.appendChild(document.createTextNode("Background Color: "));
settingsTab.appendChild(colorInput);

// Input for changing text color
var textColorInput = document.createElement("input");
textColorInput.type = "color";
textColorInput.addEventListener("input", function() {
  debugMenu.style.color = textColorInput.value;
  settingsTab.style.color = textColorInput.value; // Change text color for settings tab
});
settingsTab.appendChild(document.createElement("br"));
settingsTab.appendChild(document.createTextNode("Text Color: "));
settingsTab.appendChild(textColorInput);

// Input for adjusting background color and image opacity
var bgOpacityInput = document.createElement("input");
bgOpacityInput.type = "range";
bgOpacityInput.min = "0";
bgOpacityInput.max = "1";
bgOpacityInput.step = "0.1";
bgOpacityInput.value = "1"; // Default value
bgOpacityInput.addEventListener("input", function() {
  var currentColor = debugMenu.style.backgroundColor;
  var currentImage = debugMenu.style.backgroundImage;
  var currentOpacity = bgOpacityInput.value;
  debugMenu.style.backgroundColor = rgbaToRgbaA(currentColor, currentOpacity);
  if (currentImage && currentImage !== 'none') {
    debugMenu.style.backgroundImage = rgbaToRgbaA(currentImage, currentOpacity);
  }
});
settingsTab.appendChild(document.createElement("br"));
settingsTab.appendChild(document.createTextNode("Background Color Opacity: "));
settingsTab.appendChild(bgOpacityInput);

// Function to convert RGBA color to RGBA with specified opacity
function rgbaToRgbaA(rgba, opacity) {
  return rgba.replace(/rgba?\(([^)]+)\)/, (match, colors) => {
    const [r, g, b, a] = colors.split(",").map(c => c.trim());
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  });
}

// Input for adding background image to the debug menu
var bgImageInput = document.createElement("input");
bgImageInput.type = "text";
bgImageInput.placeholder = "Enter background image URL";
bgImageInput.addEventListener("input", function() {
  debugMenu.style.backgroundImage = `url(${bgImageInput.value})`;
});
settingsTab.appendChild(document.createElement("br"));
settingsTab.appendChild(document.createTextNode("Background Image URL: "));
settingsTab.appendChild(bgImageInput);

// Input for background size
var bgSizeInput = document.createElement("input");
bgSizeInput.type = "text";
bgSizeInput.placeholder = "Enter background size (e.g., cover)";
bgSizeInput.addEventListener("input", function() {
  debugMenu.style.backgroundSize = bgSizeInput.value;
});
settingsTab.appendChild(document.createElement("br"));
settingsTab.appendChild(document.createTextNode("Background Size: "));
settingsTab.appendChild(bgSizeInput);

// Input for background repeat
var bgRepeatInput = document.createElement("input");
bgRepeatInput.type = "text";
bgRepeatInput.placeholder = "Enter background repeat (e.g., no-repeat)";
bgRepeatInput.addEventListener("input", function() {
  debugMenu.style.backgroundRepeat = bgRepeatInput.value;
});
settingsTab.appendChild(document.createElement("br"));
settingsTab.appendChild(document.createTextNode("Background Repeat: "));
settingsTab.appendChild(bgRepeatInput);

var lastFrameTime = Date.now();
var frameCount = 0;

setInterval(function() {
    var currentTime = Date.now();
    var deltaTime = (currentTime - lastFrameTime) / 1000; // convert milliseconds to seconds
    var fps = Math.round(1 / deltaTime); // calculate frames per second

    fpsTracker.textContent = "FPS: " + fps; // update FPS counter

    lastFrameTime = currentTime;
}, 1000/60); // update FPS every second

var lastX = player.x;
var lastY = player.y;
var lastTime = Date.now();
var chunkSize = 1000; // Adjusted chunk size to 1000
var startTime = Date.now();
var lastFrameTime = Date.now();
var frameCount = 0;
var timerRunning = true;

setInterval(function() {
  var currentTime = Date.now();
  var deltaTime = (currentTime - lastTime) / 1000; // convert milliseconds to seconds

  var x = player.x.toFixed(3);
  var y = player.y.toFixed(3);

  var velocityX = ((player.x - lastX) / deltaTime).toFixed(3);
  var velocityY = ((player.y - lastY) / deltaTime).toFixed(3);

  var chunkX = Math.floor(player.x / chunkSize);
  var chunkY = Math.floor(player.y / chunkSize);

  if (timerRunning) {
    var elapsedTime = (currentTime - startTime) / 1000; // convert milliseconds to seconds
    gameTimeTracker.textContent = "Game Time: " + elapsedTime.toFixed(1) + "s";
  }

  positionTracker.textContent = "Position: (X: " + x + ", Y: " + y + ")";
  velocityTracker.textContent = "Velocity: (X: " + velocityX + ", Y: " + velocityY + ")";
  chunkTracker.textContent = "Chunk: (X: " + chunkX + ", Y: " + chunkY + ")";

  if (player.x !== lastX || player.y !== lastY) {
    timerRunning = true; // Start the timer when the player moves
  }

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
    console.log('Debug menu toggle event');
    if (debugMenu.style.display === 'none') {
      debugMenu.style.display = 'block';
    } else {
      debugMenu.style.display = 'none';
    }
  }
});

// Flag to indicate whether resizing or dragging is active
var isResizing = false;
var isDragging = false;

// Make the debug menu draggable
function makeDraggable(element) {
  var pos3 = 0, pos4 = 0, pos1 = 0, pos2 = 0;
  element.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    if (isResizing) return;
    isDragging = true;
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    if (!isDragging || isResizing) return;
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    isDragging = false;
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Event listener for mousedown on debugMenu to initiate dragging
debugMenu.addEventListener('mousedown', function(event) {
  makeDraggable(debugMenu);
});

// Event listener for mousedown on settingsTab to initiate dragging
settingsTab.addEventListener('mousedown', function(event) {
  makeDraggable(settingsTab);
});

// Event listener for mousedown on debugMenu to initiate resizing
document.addEventListener('mousedown', function(event) {
  if (event.target === debugMenu) {
    var startX = event.clientX;
    var startY = event.clientY;
    var startWidth = debugMenu.offsetWidth;
    var startHeight = debugMenu.offsetHeight;

    // Set resizing flag
    isResizing = true;

    // Event listener for mousemove during resizing
    function handleMouseMove(event) {
      resizeDebugMenu(startX, startY, startWidth, startHeight, event);
    }

    // Event listener for mouseup to stop resizing
    function handleMouseUp() {
      // Reset resizing flag
      isResizing = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
});

// Event listener for mousedown on settingsTab to initiate resizing
document.addEventListener('mousedown', function(event) {
  if (event.target === settingsTab) {
    var startX = event.clientX;
    var startY = event.clientY;
    var startWidth = settingsTab.offsetWidth;
    var startHeight = settingsTab.offsetHeight;

    // Set resizing flag
    isResizing = true;

    // Event listener for mousemove during resizing
    function handleMouseMove(event) {
      resizeSettingsTab(startX, startY, startWidth, startHeight, event);
    }

    // Event listener for mouseup to stop resizing
    function handleMouseUp() {
      // Reset resizing flag
      isResizing = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
});