// ==UserScript==
// @name        Mobile Mode V2 - Bonk.io
// @namespace   left paren
// @match       https://bonk.io/gameframe-release.html
// @grant       none
// @version     1.1
// @author      left paren
// @license     The Unlicense
// @description Allows you to use bonk.io on mobile devices with improved controls.
// @downloadURL https://update.greasyfork.org/scripts/472592/Mobile%20Mode%20V2%20-%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/472592/Mobile%20Mode%20V2%20-%20Bonkio.meta.js
// ==/UserScript==

// Set the viewport for mobile devices
window.top.document.head.innerHTML += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">';

// Hide ads
function hideAd(el) {
  el.style.display = "none";
}

hideAd(window.top.document.getElementById("adboxverticalCurse"));
hideAd(window.top.document.getElementById("adboxverticalleftCurse"));

// Helper function to simulate a key event
function simulateKey(keyCode, type, modifiers) {
  var evtName = (typeof(type) === "string") ? "key" + type : "keydown";
  var modifier = (typeof(modifiers) === "object") ? modifier : {};

  var event = document.createEvent("HTMLEvents");
  event.initEvent(evtName, true, false);
  event.keyCode = keyCode;

  for (var i in modifiers) {
    event[i] = modifiers[i];
  }

  document.dispatchEvent(event);
}

// Define key codes for mobile controls
var up = 38;
var down = 40;
var left = 37;
var right = 39;
var heavy = 88;
var special = 90;
var enter = 13;

// Helper function to create a button
function createButton(key, x, y, text) {
  var button = document.createElement("div");
  button.innerText = text;
  button.addEventListener("touchstart", function() {
    simulateKey(key, "down");
  });
  button.addEventListener("touchend", function() {
    simulateKey(key, "up");
  });
  button.style.position = "fixed";
  button.style.bottom = y;
  button.style.left = x;
  button.style.lineHeight = "100px";
  button.style.fontSize = "50px";
  button.style.textAlign = "center";
  button.style.background = "#a52a2a";
  button.style.color = "#fff";
  button.style.borderRadius = "50%";
  button.style.width = button.style.height = "100px";
  button.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.3)";
  document.body.append(button);
  return button;
}

// Create the mobile controls buttons
var joystick = createButton(null, "10px", "calc(50% - 60px)", "🕹️");
var buttonHeavy = createButton(heavy, "calc(100% - 110px)", "calc(50% - 60px)", "X");
var buttonSpecial = createButton(special, "calc(100% - 220px)", "calc(50% - 60px)", "Z");
var buttonChat = createButton(null, "10px", "10px", "💬");

// Function to handle touch events for joystick
function handleJoystick(e) {
  e.preventDefault();
  var touch = e.touches[0];
  var rect = joystick.getBoundingClientRect();
  var relativeX = touch.clientX - rect.left;
  var relativeY = touch.clientY - rect.top;
  var center = rect.width / 2;

  // Calculate joystick direction
  var x = (relativeX - center) / center;
  var y = (relativeY - center) / center;

  // Limit the joystick range
  x = Math.max(-1, Math.min(x, 1));
  y = Math.max(-1, Math.min(y, 1));

  // Apply joystick keys
  simulateKey(up, y < -0.6 ? "down" : "up");
  simulateKey(down, y > 0.6 ? "down" : "up");
  simulateKey(left, x < -0.6 ? "down" : "up");
  simulateKey(right, x > 0.6 ? "down" : "up");
}

joystick.addEventListener("touchstart", handleJoystick);
joystick.addEventListener("touchmove", handleJoystick);
joystick.addEventListener("touchend", function() {
  simulateKey(up, "up");
  simulateKey(down, "up");
  simulateKey(left, "up");
  simulateKey(right, "up");
});

// Function to toggle in-game chat or lobby chat
function toggleChat() {
  var inGame = document.getElementById("gamerenderer").style.visibility === "inherit";
  var chatInput = inGame ? document.getElementById("gamerenderer") : document.getElementById("newbonklobby_chat_input");
  chatInput.focus();

  if (!inGame) {
    document.getElementById("newbonklobby_chat_lowerinstruction").style.visibility = "hidden";
  }
}

buttonChat.addEventListener("click", toggleChat);

// Function to handle gamepad input
function handleGamepad() {
  var gamepads = navigator.getGamepads();
  gamepads.forEach(function(g) {
    if (!g) return;
    simulateKey(up, g.axes[1] < -0.3 ? "down" : "up");
    simulateKey(down, g.axes[1] > 0.3 ? "down" : "up");
    simulateKey(left, g.axes[0] < -0.3 ? "down" : "up");
    simulateKey(right, g.axes[0] > 0.3 ? "down" : "up");
    simulateKey(heavy, g.buttons[2].pressed ? "down" : "up");
    simulateKey(special, g.buttons[1].pressed < -0.3 ? "down" : "up");
  });
}

// Handle requestAnimationFrame for gamepad input and scaling viewport
function handleAnimFrame() {
  requestAnimationFrame(handleAnimFrame);

  var inGame = document.getElementById("gamerenderer").style.visibility === "inherit";
  joystick.style.display = buttonSpecial.style.display = buttonHeavy.style.display = inGame ? "block" : "none";

  if (inGame) {
    handleGamepad();
  }

  if (window.top.document.fullscreenElement) {
    // Scale the viewport when in fullscreen mode
    var body = window.top.document.body;
    var scale = Math.min(window.screen.availWidth / body.clientWidth, window.screen.availHeight / body.clientHeight);
    body.style.transform = `scale(${scale})`;
  }
}

requestAnimationFrame(handleAnimFrame);

// Set up chat input for lobby
window.addEventListener("load", function() {
  var chatInput = document.getElementById("newbonklobby_chat_input");
  chatInput.type = "search";
  chatInput.autocomplete = "off";
})