
// ==UserScript==
// @name         Mega Register Form Filling
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automate Mega.nz registration with random data and a draggable icon using a Tampermonkey user script
// @author       k0w581k
// @match        https://mega.nz/register
// @icon         https://mega.nz/favicon.ico?v=3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480935/Mega%20Register%20Form%20Filling.user.js
// @updateURL https://update.greasyfork.org/scripts/480935/Mega%20Register%20Form%20Filling.meta.js
// ==/UserScript==

(function() {
  'use strict';

// Function to generate a random name
const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Emma'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis'];

function generateRandomName() {
  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${randomFirstName} ${randomLastName}`;
}

// Function to click a checkbox
function clickCheckbox(parentClass, checkboxClass) {
  var divElement = document.querySelector(parentClass);
  if (divElement) {
      var checkbox = divElement.querySelector(checkboxClass);
      if (checkbox) {
          checkbox.click();
      } else {
          console.error("Checkbox not found within the div");
      }
  } else {
      console.error("Div element not found");
  }
}

// Get the icon element
var icon = document.createElement('img');
icon.src = 'https://mega.nz/favicon.ico?v=3';
icon.alt = 'Icon';
icon.style.cursor = 'pointer';
icon.style.position = 'fixed';
icon.style.top = '50%';
icon.style.left = '50%';
icon.style.transform = 'translate(-50%, -50%)';

var isDragging = false;
var offsetX, offsetY;

// Function to start dragging
function startDragging(e) {
  isDragging = true;
  offsetX = e.clientX - parseInt(icon.style.left);
  offsetY = e.clientY - parseInt(icon.style.top);
}

// Function to stop dragging
function stopDragging() {
  isDragging = false;
}

// Function to handle dragging
function dragIcon(e) {
  if (isDragging) {
      icon.style.left = e.clientX - offsetX + 'px';
      icon.style.top = e.clientY - offsetY + 'px';
  }
}

// Add event listeners for dragging
icon.addEventListener('mousedown', startDragging);
document.addEventListener('mouseup', stopDragging);
document.addEventListener('mousemove', dragIcon);

// Add click event listener to the icon
icon.addEventListener('click', function () {
  // Generate random name and fill form
  const randomName = generateRandomName();

  // First name
  var firstNameInput = document.getElementById("register-firstname-registerpage2");
  firstNameInput.value = randomName.split(' ')[0];

  // Last name
  var lastNameInput = document.getElementById("register-lastname-registerpage2");
  lastNameInput.value = randomName.split(' ')[1];

  // Passwords
  var passwordsInput = document.getElementById("register-password-registerpage2");
  passwordsInput.value = "U#83%v;Z2?F{9zG";

  // Retype password
  var passwordInput = document.getElementById("register-password-registerpage3");
  passwordInput.value = "U#83%v;Z2?F{9zG";

  // checkbox 1 & 2
  clickCheckbox(".understand-check", ".checkboxOff");
  clickCheckbox(".register-check", ".checkboxOff");
});

// Append the icon to the body
document.body.appendChild(icon);

})();
