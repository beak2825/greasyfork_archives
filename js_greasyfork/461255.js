// ==UserScript==
// @name         Rainbow colors for websites
// @version      2
// @description  Changes the background color of the specified websites to rainbow colors
// @match        https://hac20.esp.k12.ar.us/*
// @match        https://classroom.google.com/*
// @match        https://docs.google.com/*
// @run-at       document-end
// @license      MIT
// @namespace https://greasyfork.org/users/1033545
// @downloadURL https://update.greasyfork.org/scripts/461255/Rainbow%20colors%20for%20websites.user.js
// @updateURL https://update.greasyfork.org/scripts/461255/Rainbow%20colors%20for%20websites.meta.js
// ==/UserScript==

const colors = [
  'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
  'radial-gradient(circle, blue, green, yellow, red)',
  '#FFDAB9',
  '#FA8072',
  '#F0E68C',
  '#7FFFD4'
];
let index = 0;
let speed = 1000;
let isEnabled = true;
let styleIndex = 0;
const styleNames = [
  'linear gradient',
  'radial gradient',
  'solid color'
];

function changeBackground() {
  if (!isEnabled) return;
  document.body.style.background = colors[index];
  index = (index + 1) % colors.length;
}

function toggleEnabled() {
  isEnabled = !isEnabled;
  document.getElementById('rainbow-toggle').textContent = isEnabled ? 'Disable' : 'Enable';
}

function setSpeed() {
  const newSpeed = parseInt(prompt('Enter a new color change interval (in milliseconds):'));
  if (!isNaN(newSpeed)) speed = newSpeed;
}

function cycleStyle() {
  styleIndex = (styleIndex + 1) % styleNames.length;
  switch (styleIndex) {
    case 0:
      colors[0] = 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)';
      colors[1] = 'linear-gradient(to left, red, orange, yellow, green, blue, indigo, violet)';
      break;
    case 1:
      colors[0] = 'radial-gradient(circle, blue, green, yellow, red)';
      colors[1] = 'radial-gradient(circle, yellow, green, blue, red)';
      break;
    case 2:
      colors[0] = '#FFDAB9';
      colors[1] = '#FA8072';
      colors[2] = '#F0E68C';
      colors[3] = '#7FFFD4';
      colors[4] = '#FFA07A';
      break;
  }
  styleButton.textContent = `Switch to ${styleNames[styleIndex]}`;
}

const buttonContainer = document.createElement('div');
buttonContainer.style.position = 'fixed';
buttonContainer.style.bottom = '10px';
buttonContainer.style.right = '10px';
buttonContainer.style.zIndex = '9999';
buttonContainer.style.display = 'flex';

const toggleButton = document.createElement('button');
toggleButton.id = 'rainbow-toggle';
toggleButton.textContent = 'Disable';
toggleButton.addEventListener('click', toggleEnabled);
buttonContainer.appendChild(toggleButton);

const speedButton = document.createElement('button');
speedButton.textContent = 'Change Speed';
speedButton.addEventListener('click', setSpeed);
buttonContainer.appendChild(speedButton);

const styleButton = document.createElement('button');
styleButton.textContent = `Switch to ${styleNames[styleIndex]}`;
styleButton.addEventListener('click', cycleStyle);
buttonContainer.appendChild(styleButton);

document.body.appendChild(buttonContainer);

setInterval(changeBackground, speed);