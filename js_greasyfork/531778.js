// ==UserScript==
// @name        Debug Menu(OD2) Version 1.6
// @namespace   Violentmonkey Scripts
// @match       https://johnbutlergames.com/od2/index.html*
// @grant       none
// @author      ppougj
// @version     1.6
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADDCAMAAADwQa5vAAAAclBMVEX/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAcAAAwAABoAAAAAAAIAAAQAAAAAAAMAABAAABgAAAAAAAAAABUAAAAAABYAAAAAABMAAAYAAAEAAAoAABIAAAAAAAu4vcagAAAAJnRSTlP///Tq/vvz7+j1/fzm8v/////6///u////5fn/9//2///////t/8yjdV0AAAIGSURBVHic7dnZUsJAEIVhIriAu6C4L6jv/4qW5kJJJpNhpjttuv7v1pxJHxsLJJPJaFRB1lNlCPbYs54qg5eFTJ30cLOQYBHrmXJ46REqMrOeKYuXhey3exxYz5TFy0ICRawnynPo5C/dzULcFDly0qO9EOuBcjV7TK0HyjT3uhDrebI1eiys58l17HQh1uPk81LkpPUuMtJa0R5uiojfQy96qt5j+8gzrWisx7yoQNf55zpR5YVchM69VIhe6fboODllKTtGIz0E/tvtPHspHo0UUexRVSvhaPA7+Np1cY+byDTVWjYauby4x21smPj5u0cVe/R8ZIjeYefoXeel9+o9Ik0Koq0Dinv8kyJD9Oi8SUG0thi4yIN8tHlAeY+UabreFQuijQPK30JShun6fRVEmyeU90ibJnyjgmhtJtjDtEjKNaMqItGDIgJFZr1XyDcRj/6JC/UwfB+pr3iUKrLqn+ZJPvpbRKpH0utDPirfw+7T78/PJR+NmBYR7DHsf4iN7LOXIqI9esZ5UYoq9IhO86oVraRfWPF5+r6fy48qLOTbW3iYjV5U69nUOjiNXlRpIZPQS2STequcqObDwu1Z3nWj1UfmlKkDfa6Wy+QXVUF0TE9vY3T3MSAvCwEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg2hdI7xKfgNWQpAAAAB10RVh0U29mdHdhcmUAQGx1bmFwYWludC9wbmctY29kZWP1QxkeAAAAAElFTkSuQmCC
// @description 5/25/2024, 10:59:45 PM
// @downloadURL https://update.greasyfork.org/scripts/531778/Debug%20Menu%28OD2%29%20Version%2016.user.js
// @updateURL https://update.greasyfork.org/scripts/531778/Debug%20Menu%28OD2%29%20Version%2016.meta.js
// ==/UserScript==

var isFirstOpen = true;

document.addEventListener("keydown", function(event) {
if (event.key === "q" || event.key === "Q") {
if (isFirstOpen) {
var welcomeBox = document.createElement("div");
welcomeBox.style.backgroundColor = "#333"; // dark background
welcomeBox.style.padding = "5px";
welcomeBox.style.borderBottom = "1px solid #666"; // grey border
welcomeBox.style.borderRadius = "5px";

var logoImage = document.createElement("img");
logoImage.src = "https://cdn.discordapp.com/attachments/1243919565558382602/1245017588401045534/red-logo.png?ex=6657387c&is=6655e6fc&hm=38e855237582a70c38dd2fbb1071f2563275fcace2380c20e8a96b7e9233f450&";
logoImage.style.width = "20px";
logoImage.style.height = "20px";
logoImage.style.marginRight = "10px";
welcomeBox.appendChild(logoImage);

var welcomeText = document.createElement("span");
welcomeText.textContent = "Script Made By ppougj";
welcomeText.style.color = "#fff";
welcomeText.style.fontSize = "14px";
welcomeBox.appendChild(welcomeText);

var closeButton = document.createElement("button");
closeButton.textContent = "X";
closeButton.style.float = "right";
closeButton.style.fontSize = "12px";
closeButton.style.padding = "5px";
closeButton.style.border = "none";
closeButton.style.backgroundColor = "#444";
closeButton.style.color = "#fff";
closeButton.style.cursor = "pointer";
closeButton.addEventListener("click", function() {
welcomeBox.style.display = "none";
});
welcomeBox.appendChild(closeButton);

document.body.appendChild(welcomeBox);
isFirstOpen = false;
}
}
});

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

// Settings button to open the settings tab
var settingsButton = document.createElement("button");
settingsButton.textContent = "Settings";
settingsButton.addEventListener("click", function() {
  settingsTab.style.display = settingsTab.style.display === "none" ? "block" : "none";
});
debugMenu.appendChild(settingsButton);

// Hide/show media tab
var mediaTabButton = document.createElement("button");
mediaTabButton.textContent = "Media Settings";
mediaTabButton.addEventListener("click", function() {
  mediaTab.style.display = mediaTab.style.display === "none" ? "block" : "none";
});
debugMenu.appendChild(mediaTabButton);

// Add element for displaying player position
var positionTracker = document.createElement("div");
positionTracker.textContent = "Player Position: (X: 0.000, Y: 0.000)";
debugMenu.appendChild(positionTracker);

// Add element for displaying player velocity
var velocityTracker = document.createElement("div");
velocityTracker.textContent = "Player Velocity: (X: 0.000, Y: 0.000)";
debugMenu.appendChild(velocityTracker);

// Add element for displaying FPS
var fpsTracker = document.createElement("div");
fpsTracker.textContent = "FPS: 0";
debugMenu.appendChild(fpsTracker);

// Add element for displaying time spent in the game
var gameTimeTracker = document.createElement("div");
gameTimeTracker.textContent = "Game Time: 0s";
debugMenu.appendChild(gameTimeTracker);

// Add element for setting player position
var positionInputRow = document.createElement("div");
positionInputRow.style.display = "flex";
positionInputRow.style.alignItems = "center";
positionInputRow.style.marginBottom = "5px";
debugMenu.appendChild(positionInputRow);

var posXInput = document.createElement("input");
posXInput.type = "text";
posXInput.placeholder = "Enter X position";
posXInput.style.marginRight = "5px";
positionInputRow.appendChild(posXInput);

var posYInput = document.createElement("input");
posYInput.type = "text";
posYInput.placeholder = "Enter Y position";
posYInput.style.marginRight = "5px";
positionInputRow.appendChild(posYInput);

// Button to set position
var setPositionButton = document.createElement("button");
setPositionButton.textContent = "Set Position";
setPositionButton.style.marginRight = "5px";
setPositionButton.addEventListener("click", function() {
    var newX = parseFloat(posXInput.value);
    var newY = parseFloat(posYInput.value);
    if (!isNaN(newX) && !isNaN(newY)) {
        updatePlayerCoordinates(newX, newY);
        posXInput.value = ""; // Clear the X input field
        posYInput.value = ""; // Clear the Y input field
    } else {
        alert("Invalid input! Please enter valid numbers for X and Y positions.");
    }
});
positionInputRow.appendChild(setPositionButton);

// Add input field and button to set the game level
var levelInputRow = document.createElement("div");
levelInputRow.style.display = "flex";
levelInputRow.style.alignItems = "center";
levelInputRow.style.marginBottom = "5px";
debugMenu.appendChild(levelInputRow);

var levelInput = document.createElement("input");
levelInput.type = "text";
levelInput.placeholder = "Enter Level Number";
levelInput.style.marginRight = "5px";
levelInputRow.appendChild(levelInput);

var setLevelButton = document.createElement("button");
setLevelButton.textContent = "Set Level";
setLevelButton.style.marginRight = "5px";
setLevelButton.addEventListener("click", function() {
    var levelNumber = levelInput.value.trim(); // Trim the input value to remove whitespace
    if (levelNumber === "") {
        alert("Please enter a level number.");
    } else if (isNaN(levelNumber)) {
        alert("Invalid input! Please enter a valid level number.");
    } else {
        game.level.load(parseInt(levelNumber) - 1); // Subtract 1 from the input level number
        levelInput.value = ""; // Clear the level input field
    }
});
levelInputRow.appendChild(setLevelButton);

// Add element for displaying player size
var sizeTracker = document.createElement("div");
sizeTracker.textContent = "Player Size: (W: 0.000, H: 0.000)";
debugMenu.appendChild(sizeTracker);

// Add element for setting player size
var sizeInputRow = document.createElement("div");
sizeInputRow.style.display = "flex";
sizeInputRow.style.alignItems = "center";
sizeInputRow.style.marginBottom = "5px";
debugMenu.appendChild(sizeInputRow);

var widthInput = document.createElement("input");
widthInput.type = "text";
widthInput.placeholder = "Enter width";
widthInput.style.marginRight = "5px";
sizeInputRow.appendChild(widthInput);

var heightInput = document.createElement("input");
heightInput.type = "text";
heightInput.placeholder = "Enter height";
heightInput.style.marginRight = "5px";
sizeInputRow.appendChild(heightInput);

// Button to set size
var setSizeButton = document.createElement("button");
setSizeButton.textContent = "Set Size";
setSizeButton.style.marginRight = "5px";
setSizeButton.addEventListener("click", function() {
    var newW = parseFloat(widthInput.value);
    var newH = parseFloat(heightInput.value);
    if (!isNaN(newW) && !isNaN(newH)) {
        updatePlayerSize(newW, newH);
        widthInput.value = ""; // Clear the width input field
        heightInput.value = ""; // Clear the height input field
    } else {
        alert("Invalid input! Please enter valid numbers for width and height.");
    }
});
sizeInputRow.appendChild(setSizeButton);

// Add element for setting player type
var playerTypeSelectRow = document.createElement("div");
playerTypeSelectRow.style.display = "flex";
playerTypeSelectRow.style.alignItems = "center";
playerTypeSelectRow.style.marginBottom = "5px";
debugMenu.appendChild(playerTypeSelectRow);

var playerTypeSelect = document.createElement("select");
playerTypeSelectRow.appendChild(playerTypeSelect);

// Define player types
var playerTypes = [
    "player",
    "player eye",
    "sokoban player",
    "snake player",
    "pacman player",
    "ping pong player",
    "circles player",
    "old player",
];

// Populate dropdown options
playerTypes.forEach(function(type) {
    var option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    playerTypeSelect.appendChild(option);
});

// Button to change player type
var setPlayerTypeButton = document.createElement("button");
setPlayerTypeButton.textContent = "Set Player Type";
setPlayerTypeButton.style.marginRight = "5px";
setPlayerTypeButton.addEventListener("click", function() {
    const playerObject = game.objects.objects.find(e => e.type.includes("player"));
    if (playerObject) {
        playerObject.type = playerTypeSelect.value;
        playerTypeDisplay.textContent = "Player Type: " + playerObject.type;
        alert("Player type changed.");
    } else {
        alert("Player not found.");
    }
});
playerTypeSelectRow.appendChild(setPlayerTypeButton);

// Clear input fields after clicking the "Set Position" button
setPositionButton.addEventListener("click", function() {
    var newX = parseFloat(posXInput.value);
    var newY = parseFloat(posYInput.value);
    if (!isNaN(newX) && !isNaN(newY)) {
        updatePlayerCoordinates(newX, newY);
        posXInput.value = ""; // Clear the X input field
        posYInput.value = ""; // Clear the Y input field
    } else {
        alert("Invalid input! Please enter valid numbers for X and Y positions.");
    }
});

// Clear input field after clicking the "Set Level" button
setLevelButton.addEventListener("click", function() {
    var levelNumber = parseInt(levelInput.value);
    if (!isNaN(levelNumber)) {
        game.level.load(levelNumber);
        levelInput.value = ""; // Clear the level input field
    }
});

// Add elements for displaying blue cube status and position
var cubeTracker = document.createElement("div");
cubeTracker.textContent = "Blue Cube Status: Not Collected";
debugMenu.appendChild(cubeTracker);

var cubePositionTracker = document.createElement("div");
cubePositionTracker.textContent = "Blue Cube Position: (X: 0.000, Y: 0.000)";
debugMenu.appendChild(cubePositionTracker);

// Button to set player position to blue cube position
var setPlayerToCubeButton = document.createElement("button");
setPlayerToCubeButton.textContent = "Set Player to Blue Cube Position";
setPlayerToCubeButton.addEventListener("click", function() {
    const cubeObject = game.objects.objects.find(e => e.type.includes("cube") && !e.red);
    const playerObject = game.objects.objects.find(e => e.type.includes("player"));
    if (cubeObject && playerObject) {
        updatePlayerCoordinates(cubeObject.x, cubeObject.y);
        alert("Player position set to blue cube position.");
    } else {
        alert("Blue cube or player not found.");
    }
});
debugMenu.appendChild(setPlayerToCubeButton);

// Add elements for displaying red cube status and position
var redCubeTracker = document.createElement("div");
redCubeTracker.textContent = "Red Cube Status: Not Found";
debugMenu.appendChild(redCubeTracker);

var redCubePositionTracker = document.createElement("div");
redCubePositionTracker.textContent = "Red Cube Position: (X: 0.000, Y: 0.000)";
debugMenu.appendChild(redCubePositionTracker);

// Function to track blue cube's collected status and position
function trackCube() {
    const cubeObject = game.objects.objects.find(e => e.type.includes("cube") && !e.red);
    if (cubeObject) {
        cubeTracker.textContent = "Blue Cube Status: " + (cubeObject.collected ? "Collected" : "Not Collected");
        cubePositionTracker.textContent = "Blue Cube Position: (X: " + cubeObject.x.toFixed(3) + ", Y: " + cubeObject.y.toFixed(3) + ")";
    } else {
        cubeTracker.textContent = "Blue Cube not found.";
        cubePositionTracker.textContent = "Blue Cube Position: (X: 0.000, Y: 0.000)";
    }
}

// Function to track red cube's position
function trackRedCube() {
    const redCubeObject = game.objects.objects.find(e => e.type === "cube" && e.red);
    if (redCubeObject) {
        redCubeTracker.textContent = "Red Cube Status: Found";
        redCubePositionTracker.textContent = "Red Cube Position: (X: " + redCubeObject.x.toFixed(3) + ", Y: " + redCubeObject.y.toFixed(3) + ")";
    } else {
        redCubeTracker.textContent = "Red Cube not found.";
        redCubePositionTracker.textContent = "Red Cube Position: (X: 0.000, Y: 0.000)";
    }
}

// Track blue cube every 100 milliseconds
setInterval(trackCube, 100);

// Track red cube every 100 milliseconds
setInterval(trackRedCube, 100);

// Button to teleport player to red cube position
var tpToRedCubeButton = document.createElement("button");
tpToRedCubeButton.textContent = "Teleport Player to Red Cube";
tpToRedCubeButton.addEventListener("click", function() {
    const redCubeObject = game.objects.objects.find(e => e.type === "cube" && e.red);
    const playerObject = game.objects.objects.find(e => e.type.includes("player"));
    if (redCubeObject && playerObject) {
        updatePlayerCoordinates(redCubeObject.x, redCubeObject.y);
        alert("Player teleported to red cube position.");
    } else {
        alert("Red cube or player not found.");
    }
});
debugMenu.appendChild(tpToRedCubeButton);

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

// Settings tab header
var settingsHeader = document.createElement("div");
settingsHeader.style.cursor = "move";
settingsHeader.style.backgroundColor = "#333";
settingsHeader.style.color = "#fff";
settingsHeader.style.padding = "5px";
settingsHeader.style.fontWeight = "bold";
settingsHeader.textContent = "Settings";
settingsTab.appendChild(settingsHeader);

var canvasColorSelect = document.createElement("select");
canvasColorSelect.addEventListener("change", function() {
    updateBackgroundColor(canvasColorSelect.value);
});
var canvasColorOptions = [
    { value: "white", label: "White" },
    { value: "lightgray", label: "Light Gray" },
    { value: "lightblue", label: "Light Blue" },
    { value: "lightgreen", label: "Light Green" },
    { value: "lightpink", label: "Light Pink" },
];
canvasColorOptions.forEach(function(option) {
    var canvasColorOption = document.createElement("option");
    canvasColorOption.value = option.value;
    canvasColorOption.textContent = option.label;
    canvasColorSelect.appendChild(canvasColorOption);
});
settingsTab.appendChild(document.createElement("br"));
settingsTab.appendChild(document.createTextNode("Canvas Color: "));
settingsTab.appendChild(canvasColorSelect);

// Input for selecting background color
var bgColorInput = document.createElement("input");
bgColorInput.type = "color";
bgColorInput.value = "#000000"; // Default color
bgColorInput.addEventListener("input", function() {
    debugMenu.style.backgroundColor = bgColorInput.value;
});
settingsTab.appendChild(document.createElement("br"));
settingsTab.appendChild(document.createTextNode("Debug Menu Background Color: "));
settingsTab.appendChild(bgColorInput);

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

// Create a tab for image and video settings
var mediaTab = document.createElement("div");
mediaTab.style.position = "absolute";
mediaTab.style.top = "10px";
mediaTab.style.left = "10px";
mediaTab.style.fontSize = "16px";
mediaTab.style.color = "white";
mediaTab.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
mediaTab.style.padding = "10px";
mediaTab.style.borderRadius = "5px";
mediaTab.style.display = "none"; // Initially hidden
mediaTab.style.resize = "both"; // Make resizable
mediaTab.style.overflow = "auto"; // Add overflow for resizing
document.body.appendChild(mediaTab);

// Media tab header
var mediaHeader = document.createElement("div");
mediaHeader.style.cursor = "move";
mediaHeader.style.backgroundColor = "#333";
mediaHeader.style.color = "#fff";
mediaHeader.style.padding = "5px";
mediaHeader.style.fontWeight = "bold";
mediaHeader.textContent = "Media Settings";
mediaTab.appendChild(mediaHeader);

// Input for uploading background video file to the debug menu
var debugMenuBgVideoInput = document.createElement("input");
debugMenuBgVideoInput.type = "file";
debugMenuBgVideoInput.accept = "video/mp4";
debugMenuBgVideoInput.addEventListener("change", function(event) {
  var file = event.target.files[0];
  if (file) {
    var url = URL.createObjectURL(file);

    // Remove existing video if present
    var existingVideo = debugMenu.querySelector("video");
    if (existingVideo) {
      debugMenu.removeChild(existingVideo);
    }

    // Create video element
    var video = document.createElement("video");
    video.src = url;
    video.autoplay = true;
    video.loop = true;
    video.style.position = "absolute";
    video.style.top = "0";
    video.style.left = "0";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    video.style.zIndex = "-1"; // Ensure the video is behind the content
    debugMenu.appendChild(video);

    // Create audio slider for volume control
    var audioSlider = document.createElement("input");
    audioSlider.type = "range";
    audioSlider.min = "0";
    audioSlider.max = "1";
    audioSlider.step = "0.01";
    audioSlider.value = "0.5"; // Default volume at 50%
    audioSlider.addEventListener("input", function() {
      video.volume = audioSlider.value;
    });
    mediaTab.appendChild(document.createElement("br"));
    mediaTab.appendChild(document.createTextNode("Debug Menu Background Video Volume: "));
    mediaTab.appendChild(audioSlider);
  }
});
mediaTab.appendChild(document.createElement("br"));
mediaTab.appendChild(document.createTextNode("Debug Menu Background Video: "));
mediaTab.appendChild(debugMenuBgVideoInput);

// Input for adding background image(URL) to the debug menu
var bgImageInput = document.createElement("input");
bgImageInput.type = "text";
bgImageInput.placeholder = "Enter background image URL";
bgImageInput.addEventListener("input", function() {
  debugMenu.style.backgroundImage = `url(${bgImageInput.value})`;
});
mediaTab.appendChild(document.createElement("br"));
mediaTab.appendChild(document.createTextNode("Background Image URL(Debug Menu): "));
mediaTab.appendChild(bgImageInput);

// Input for adding background image to the debug menu
var bgImageInputDebug = document.createElement("input");
bgImageInputDebug.type = "file";
bgImageInputDebug.addEventListener("change", function() {
    const file = bgImageInputDebug.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            debugMenu.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
});
mediaTab.appendChild(document.createElement("br"));
mediaTab.appendChild(document.createTextNode("Background Image (Debug Menu): "));
mediaTab.appendChild(bgImageInputDebug);

// Input for adding background image (URL) to the settings menu
var settingsTabBgImageInput = document.createElement("input");
settingsTabBgImageInput.type = "text";
settingsTabBgImageInput.placeholder = "Enter background image URL for settings menu";
settingsTabBgImageInput.addEventListener("input", function() {
  settingsTab.style.backgroundImage = `url(${settingsTabBgImageInput.value})`;
});
mediaTab.appendChild(document.createElement("br"));
mediaTab.appendChild(document.createTextNode("Background Image URL(settings): "));
mediaTab.appendChild(settingsTabBgImageInput);

// Input for adding background image to the settings menu
var bgImageInputSettings = document.createElement("input");
bgImageInputSettings.type = "file";
bgImageInputSettings.addEventListener("change", function() {
    const file = bgImageInputSettings.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            settingsTab.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
});
mediaTab.appendChild(document.createElement("br"));
mediaTab.appendChild(document.createTextNode("Background Image (Settings Menu): "));
mediaTab.appendChild(bgImageInputSettings);

// Input for background size
var bgSizeSelect = document.createElement("select");
bgSizeSelect.addEventListener("change", function() {
  debugMenu.style.backgroundSize = bgSizeSelect.value;
});
var bgSizeOptions = [
  "cover",
  "contain",
  "auto"
];
bgSizeOptions.forEach(function(option) {
  var bgSizeOption = document.createElement("option");
  bgSizeOption.textContent = option;
  bgSizeSelect.appendChild(bgSizeOption);
});
mediaTab.appendChild(document.createElement("br"));
mediaTab.appendChild(document.createTextNode("Background Size: "));
mediaTab.appendChild(bgSizeSelect);

// Input for background repeat
var bgRepeatSelect = document.createElement("select");
bgRepeatSelect.addEventListener("change", function() {
  debugMenu.style.backgroundRepeat = bgRepeatSelect.value === "true" ? "repeat" : "no-repeat";
});
var bgRepeatOptions = [
  "true",
  "false"
];
bgRepeatOptions.forEach(function(option) {
  var bgRepeatOption = document.createElement("option");
  bgRepeatOption.textContent = option;
  bgRepeatSelect.appendChild(bgRepeatOption);
});
mediaTab.appendChild(document.createElement("br"));
mediaTab.appendChild(document.createTextNode("Background Repeat: "));
mediaTab.appendChild(bgRepeatSelect);

// Make the media tab draggable
let isMediaDragging = false;
let mediaOffsetX, mediaOffsetY;

mediaHeader.addEventListener('mousedown', function(e) {
    isMediaDragging = true;
    mediaOffsetX = e.clientX - mediaTab.offsetLeft;
    mediaOffsetY = e.clientY - mediaTab.offsetTop;
});

document.addEventListener('mousemove', function(e) {
    if (isMediaDragging) {
        mediaTab.style.left = (e.clientX - mediaOffsetX) + 'px';
        mediaTab.style.top = (e.clientY - mediaOffsetY) + 'px';
    }
});

document.addEventListener('mouseup', function() {
    isMediaDragging = false;
});

// Input for changing font family
var fontSelector = document.createElement("select");
fontSelector.addEventListener("change", function() {
  var selectedFont = fontSelector.value;
  debugMenu.style.fontFamily = selectedFont;
  settingsTab.style.fontFamily = selectedFont;
});
var fontOptions = [
  "Abadi MT Condensed Light",
  "Albertus Extra Bold",
  "Albertus Medium",
  "Antique Olive",
  "Arial",
  "Arial Black",
  "Arial MT",
  "Arial Narrow",
  "Bazooka",
  "Book Antiqua",
  "Bookman Old Style",
  "Boulder",
  "Calisto MT",
  "Calligrapher",
  "Century Gothic",
  "Century Schoolbook",
  "Cezanne",
  "CG Omega",
  "CG Times",
  "Charlesworth",
  "Chaucer",
  "Clarendon Condensed",
  "Comic Sans MS",
  "Copperplate Gothic Bold",
  "Copperplate Gothic Light",
  "Cornerstone",
  "Haettenschweiler",
  "Heather",
  "Helvetica",
  "Marigold",
  "Market",
  "Matisse ITC",
  "MS LineDraw",
  "News GothicMT",
  "OCR A Extended",
  "Old Century",
  "Pegasus",
  "Pickwick",
  "Poster",
  "Pythagoras",
  "Sceptre",
  "Sherwood",
  "Signboard",
  "Socket",
  "Steamer",
  "Storybook",
  "Subway",
  "Tahoma",
  "Technical",
  "Teletype",
  "Tempus Sans ITC",
  "Times",
  "Times New Roman",
  "Times New Roman PS",
  "Trebuchet MS",
  "Verdana",
  "Westminster"
];
fontOptions.forEach(function(option) {
  var fontOption = document.createElement("option");
  fontOption.textContent = option;
  fontSelector.appendChild(fontOption);
});
settingsTab.appendChild(document.createElement("br"));
settingsTab.appendChild(document.createTextNode("Font Family: "));
settingsTab.appendChild(fontSelector);

// Set default font family for debug and settings menu
debugMenu.style.fontFamily = "Arial";
settingsTab.style.fontFamily = "Arial";

// Create a container for the input tracker
var inputTrackerContainer = document.createElement("div");
inputTrackerContainer.style.marginTop = "20px";
debugMenu.appendChild(inputTrackerContainer);

// Create labels for W, A, S, D
var wLabel = createInputLabel("W");
var aLabel = createInputLabel("A");
var sLabel = createInputLabel("S");
var dLabel = createInputLabel("D");

// Create labels for arrow keys
var upLabel = createInputLabel("↑");
var leftLabel = createInputLabel("←");
var downLabel = createInputLabel("↓");
var rightLabel = createInputLabel("→");

// Append labels to the input tracker container
[inputTrackerContainer, inputTrackerContainer].forEach(container => {
    container.appendChild(wLabel);
    container.appendChild(aLabel);
    container.appendChild(sLabel);
    container.appendChild(dLabel);
    container.appendChild(document.createElement("br")); // Add line break
    container.appendChild(upLabel);
    container.appendChild(leftLabel);
    container.appendChild(downLabel);
    container.appendChild(rightLabel);
});

// Function to create input labels
function createInputLabel(key) {
    var label = document.createElement("div");
    label.textContent = key;
    label.style.display = "inline-block";
    label.style.width = "30px";
    label.style.height = "30px";
    label.style.backgroundColor = "black";
    label.style.color = "white";
    label.style.textAlign = "center";
    label.style.paddingTop = "8px";
    label.style.borderRadius = "5px";
    label.style.marginRight = "5px";
    return label;
}

// Function to toggle the background color of the labels when corresponding keys are pressed
function toggleLabelColor(label, isActive) {
    if (isActive) {
        label.style.backgroundColor = "green";
    } else {
        label.style.backgroundColor = "black";
    }
}

// Add event listeners to track keydown and keyup events for W, A, S, D
document.addEventListener("keydown", function(event) {
    if (event.key === "w") {
        toggleLabelColor(wLabel, true);
    } else if (event.key === "a") {
        toggleLabelColor(aLabel, true);
    } else if (event.key === "s") {
        toggleLabelColor(sLabel, true);
    } else if (event.key === "d") {
        toggleLabelColor(dLabel, true);
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key === "w") {
        toggleLabelColor(wLabel, false);
    } else if (event.key === "a") {
        toggleLabelColor(aLabel, false);
    } else if (event.key === "s") {
        toggleLabelColor(sLabel, false);
    } else if (event.key === "d") {
        toggleLabelColor(dLabel, false);
    }
});

// Add event listeners to track keydown and keyup events for arrow keys
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") {
        toggleLabelColor(upLabel, true);
    } else if (event.key === "ArrowLeft") {
        toggleLabelColor(leftLabel, true);
    } else if (event.key === "ArrowDown") {
        toggleLabelColor(downLabel, true);
    } else if (event.key === "ArrowRight") {
        toggleLabelColor(rightLabel, true);
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowUp") {
        toggleLabelColor(upLabel, false);
    } else if (event.key === "ArrowLeft") {
        toggleLabelColor(leftLabel, false);
    } else if (event.key === "ArrowDown") {
        toggleLabelColor(downLabel, false);
    } else if (event.key === "ArrowRight") {
        toggleLabelColor(rightLabel, false);
    }
});

// Toggle debug menu visibility with 'q' key
document.addEventListener('keydown', function(event) {
    if (event.key === 'q') {
        if (debugMenu.style.display === 'none') {
            debugMenu.style.display = 'block';
        } else {
            debugMenu.style.display = 'none';
        }
    }
});

let isDebugMenuActive = false;

// Add a focus event listener to the input fields in the debug menu
posXInput.addEventListener('focus', function() {
    isDebugMenuActive = true;
});

posYInput.addEventListener('focus', function() {
    isDebugMenuActive = true;
});

levelInput.addEventListener('focus', function() {
    isDebugMenuActive = true;
});

// Add a blur event listener to the input fields in the debug menu
posXInput.addEventListener('blur', function() {
    isDebugMenuActive = false;
});

posYInput.addEventListener('blur', function() {
    isDebugMenuActive = false;
});

levelInput.addEventListener('blur', function() {
    isDebugMenuActive = false;
});

// Disable Backspace as a hotkey for game functions when interacting with the debug menu
document.addEventListener('keydown', function(event) {
    if (event.key === 'Backspace' && isDebugMenuActive) {
        return; // Allow Backspace to work in the debug menu
    } else if (event.key === 'Backspace' &&
               (event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'TEXTAREA')) {
        event.preventDefault();
    }
});

// Function to update player's x and y coordinates
function updatePlayerCoordinates(newX, newY) {
    const playerObject = game.objects.objects.find(e => e.type.includes("player"));
    if (playerObject) {
        playerObject.x = newX;
        playerObject.y = newY;
        updatePositionTracker(newX, newY);
    }
}

// Function to update player's width and height
function updatePlayerSize(newW, newH) {
    const playerObject = game.objects.objects.find(e => e.type.includes("player"));
    if (playerObject) {
        const deltaH = newH - 50; // Calculate the difference between new height and 40
        playerObject.w = newW;
        playerObject.h = newH;
        playerObject.x += deltaH; // Offset X position by the difference
        updateSizeTracker(newW, newH);
    }
}

// Function to update the position tracker
function updatePositionTracker(x, y) {
    positionTracker.textContent = "Player Position: (X: " + x.toFixed(3) + ", Y: " + y.toFixed(3) + ")";
}

// Function to update the velocity tracker
function updateVelocityTracker(vx, vy) {
    velocityTracker.textContent = "Player Velocity: (X: " + vx.toFixed(3) + ", Y: " + vy.toFixed(3) + ")";
}

// Function to update the size tracker
function updateSizeTracker(w, h) {
    sizeTracker.textContent = "Player Size: (W: " + w.toFixed(3) + ", H: " + h.toFixed(3) + ")";
}

// Function to update the FPS tracker
function updateFPSTracker(fps) {
    fpsTracker.textContent = "FPS: " + fps.toFixed(0);
}

// Function to update the game time tracker
function updateGameTimeTracker(seconds) {
    gameTimeTracker.textContent = "Game Time: " + seconds + "s";
}

// Variables for tracking FPS
let lastFrameTime = performance.now();
let frameCount = 0;
let fps = 0;

// Variables for tracking game time
let startTime = performance.now();

// Variables for tracking player velocity
let lastPlayerX = 0;
let lastPlayerY = 0;

// FPS tracking (60 times per second)
setInterval(function() {
    const currentTime = performance.now();
    frameCount++;
    const elapsedTime = currentTime - lastFrameTime;
    if (elapsedTime >= 1000) { // Update FPS every second
        fps = (frameCount / elapsedTime) * 1000;
        updateFPSTracker(fps);
        frameCount = 0;
        lastFrameTime = currentTime;
    }
}, 16.67); // ~60 FPS

// Continuous tracking of player's position, velocity, width, height, and game time (every 1/4 second)
setInterval(function() {
    const playerObject = game.objects.objects.find(e => e.type.includes("player"));
    if (playerObject) {
        // Update position
        updatePositionTracker(playerObject.x, playerObject.y);

        // Update velocity
        const deltaX = playerObject.x - lastPlayerX;
        const deltaY = playerObject.y - lastPlayerY;
        updateVelocityTracker(deltaX / 0.25, deltaY / 0.25); // Velocity per 0.25 seconds
        lastPlayerX = playerObject.x;
        lastPlayerY = playerObject.y;

        // Update width and height
        updateSizeTracker(playerObject.w, playerObject.h);
    }

    // Update game time
    const currentTime = performance.now();
    const gameTime = Math.floor((currentTime - startTime) / 1000);
    updateGameTimeTracker(gameTime);
}, 250); // Update every 0.25 seconds

// Track cube every second
setInterval(trackCube, 1000);

// Function to update background color of the canvas
function updateBackgroundColor(color) {
    var canvas = document.getElementById("canvas");
    if (canvas) {
        canvas.style.backgroundColor = color;
    } else {
        console.error("Canvas element not found!");
    }
}

// Make the debug menu draggable
let isDragging = false;
let offsetX, offsetY;

debugMenuHeader.addEventListener('mousedown', function(e) {
    isDragging = true;
    offsetX = e.clientX - debugMenu.offsetLeft;
    offsetY = e.clientY - debugMenu.offsetTop;
});

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        debugMenu.style.left = (e.clientX - offsetX) + 'px';
        debugMenu.style.top = (e.clientY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});

// Make the settings tab draggable
let isSettingsDragging = false;
let settingsOffsetX, settingsOffsetY;

settingsHeader.addEventListener('mousedown', function(e) {
    isSettingsDragging = true;
    settingsOffsetX = e.clientX - settingsTab.offsetLeft;
    settingsOffsetY = e.clientY - settingsTab.offsetTop;
});

document.addEventListener('mousemove', function(e) {
    if (isSettingsDragging) {
        settingsTab.style.left = (e.clientX - settingsOffsetX) + 'px';
        settingsTab.style.top = (e.clientY - settingsOffsetY) + 'px';
    }
});

document.addEventListener('mouseup', function() {
    isSettingsDragging = false;
});

function addScriptRunnerUI() {
    // Create the container for the script runner UI
    var scriptRunnerContainer = document.createElement("div");
    scriptRunnerContainer.style.position = "absolute";
    scriptRunnerContainer.style.top = "50px";
    scriptRunnerContainer.style.left = "10px";
    scriptRunnerContainer.style.width = "300px";
    scriptRunnerContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    scriptRunnerContainer.style.padding = "10px";
    scriptRunnerContainer.style.border = "1px solid #666";
    scriptRunnerContainer.style.borderRadius = "5px";
    scriptRunnerContainer.style.display = "none";
    scriptRunnerContainer.style.zIndex = "9999";
    scriptRunnerContainer.style.resize = "both"; // Make resizable
    scriptRunnerContainer.style.overflow = "auto"; // Add overflow for resizing
    document.body.appendChild(scriptRunnerContainer);

    // Add a header for the script runner UI
    var header = document.createElement("div");
    header.style.backgroundColor = "#444";
    header.style.padding = "5px";
    header.style.borderBottom = "1px solid #666";
    header.style.color = "#fff";
    header.style.fontWeight = "bold";
    header.style.cursor = "move";
    header.textContent = "Script Debugger";
    scriptRunnerContainer.appendChild(header);

    // Make the header draggable
    var isDragging = false;
    var offsetX = 0;
    var offsetY = 0;

    header.addEventListener("mousedown", function(event) {
        isDragging = true;
        offsetX = event.offsetX;
        offsetY = event.offsetY;
    });

    document.addEventListener("mousemove", function(event) {
        if (isDragging) {
            scriptRunnerContainer.style.top = (event.clientY - offsetY) + "px";
            scriptRunnerContainer.style.left = (event.clientX - offsetX) + "px";
        }
    });

    document.addEventListener("mouseup", function() {
        isDragging = false;
    });

    // Add a textarea for the script input
    var scriptCodeInput = document.createElement("textarea");
    scriptCodeInput.placeholder = "Enter your script code here... like (game.objects.objects.find(e => e.type.includes(player)) || {}).x = 50;";
    scriptCodeInput.style.width = "100%";
    scriptCodeInput.style.height = "150px";
    scriptCodeInput.style.padding = "5px";
    scriptCodeInput.style.border = "1px solid #666";
    scriptRunnerContainer.appendChild(scriptCodeInput);

    // Add a button to run the script
    var runScriptButton = document.createElement("button");
    runScriptButton.textContent = "Run Script";
    runScriptButton.style.marginTop = "10px";
    runScriptButton.style.padding = "5px 10px";
    runScriptButton.style.border = "none";
    runScriptButton.style.borderRadius = "5px";
    runScriptButton.style.backgroundColor = "#4CAF50";
    runScriptButton.style.color = "#fff";
    runScriptButton.addEventListener("click", function() {
        try {
            eval(scriptCodeInput.value);
            alert("Script executed successfully!");
        } catch (error) {
            alert("Error executing script: " + error.message);
        }
    });
    scriptRunnerContainer.appendChild(runScriptButton);

    // Toggle the visibility of the script runner UI with the 'c' key
    document.addEventListener("keydown", function(event) {
        if (event.key === "`" || event.key === "~") {
            scriptRunnerContainer.style.display = scriptRunnerContainer.style.display === "none" ? "block" : "none";
        }
    });
}

// Call the function to add the script runner UI
addScriptRunnerUI();