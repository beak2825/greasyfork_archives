// ==UserScript==
// @name        Scrollable Volume Control with Custom Collapse and Step Control
// @namespace   Tampermonkey Scripts
// @match       https://www.redgifs.com/ifr/*
// @match       https://www.redgifs.com/*
// @match       *://*/*  // Include any embeds/iframes
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @run-at      document-end
// @version     2.10
// @description A scrollable, draggable, volume control with adjustable steps, collapse functionality, and volume persistence. Works for regular pages and embeds.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513129/Scrollable%20Volume%20Control%20with%20Custom%20Collapse%20and%20Step%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/513129/Scrollable%20Volume%20Control%20with%20Custom%20Collapse%20and%20Step%20Control.meta.js
// ==/UserScript==

//const isFirefox = typeof InstallTrigger !== 'undefined'; // Detect Firefox

// Default step size for volume control, saved in localStorage
let volumeStep = parseFloat(localStorage.getItem('volumeStep')) || 0.01;

// Helper to save square position to localStorage
function savePosition(x, y) {
  localStorage.setItem('volumeControlPos', JSON.stringify({ x, y }));
}

// Helper to load saved square position
function loadPosition() {
  const pos = JSON.parse(localStorage.getItem('volumeControlPos'));
  return pos ? { x: pos.x, y: pos.y } : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

// Create the volume control square
function createVolumeControlSquare(video) {
  const controlSquare = document.createElement('div');
  const { x, y } = loadPosition();

  // Style for the square
  Object.assign(controlSquare.style, {
    position: 'fixed',
    left: `${x}px`,
    top: `${y}px`,
    width: '8.5mm',
    height: '8.5mm',
    backgroundColor: 'rgba(23, 23, 23, 0.8)', // Slight transparency
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '3px', // Rounded corners
    cursor: 'pointer',
    zIndex: 1000,
    transition: 'all 0.3s ease',
  });

  let volume = localStorage.getItem('videoVolume') || 0.01; // Default to 1% volume
  video.volume = volume;

  // Volume text, centered
  const volumeText = document.createElement('div');
  volumeText.textContent = `${Math.round(volume * 100)}%`;
  Object.assign(volumeText.style, {
    pointerEvents: 'none',
    fontSize: '12px',
    fontFamily: 'Tahoma, sans-serif',
    color: 'rgba(255, 255, 255, 0.9)',
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
    zIndex: 2,
  });
  controlSquare.appendChild(volumeText);

  // Scrollable volume control, adjustable steps
  controlSquare.addEventListener('wheel', (e) => {
    e.preventDefault();
    volume = Math.min(Math.max(parseFloat(volume) + (e.deltaY > 0 ? -volumeStep : volumeStep), 0), 1);
    video.volume = volume;
    localStorage.setItem('videoVolume', volume);
    volumeText.textContent = `${Math.round(volume * 100)}%`;
  });

  // Create the drag bar
  const dragBar = document.createElement('div');
  Object.assign(dragBar.style, {
    position: 'absolute',
    top: '0px',
    width: '100%',
    height: '3px',
    backgroundColor: 'rgba(150, 200, 60, 0.9)', // Dragbar color
    cursor: 'move',
    zIndex: 1,
  });
  controlSquare.appendChild(dragBar);

  // Drag functionality
  let isDragging = false, offsetX = 0, offsetY = 0;
  dragBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - controlSquare.getBoundingClientRect().left;
    offsetY = e.clientY - controlSquare.getBoundingClientRect().top;
    document.body.style.userSelect = 'none'; // Disable text selection while dragging
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const x = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - controlSquare.offsetWidth));
      const y = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - controlSquare.offsetHeight));
      controlSquare.style.left = `${x}px`;
      controlSquare.style.top = `${y}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      savePosition(controlSquare.getBoundingClientRect().left, controlSquare.getBoundingClientRect().top);
      isDragging = false;
      document.body.style.userSelect = ''; // Re-enable text selection
    }
  });

  // Collapse/expand functionality on double-click
  let isCollapsed = false;
  controlSquare.addEventListener('dblclick', () => {
    if (!isCollapsed) {
      controlSquare.style.width = '5mm'; // Collapsed size
      controlSquare.style.height = '5mm';
      controlSquare.style.backgroundColor = 'rgba(150, 200, 60, 0.9)'; // Match dragbar color
      volumeText.style.display = 'none'; // Hide volume text
      dragBar.style.display = 'none'; // Hide drag bar
    } else {
      controlSquare.style.width = '8.5mm'; // Original size
      controlSquare.style.height = '8.5mm';
      controlSquare.style.backgroundColor = 'rgba(23, 23, 23, 0.8)'; // Restore transparency
      volumeText.style.display = 'block'; // Show volume text
      dragBar.style.display = 'block'; // Show drag bar
    }
    isCollapsed = !isCollapsed;
  });

  // Add the control square to the page
  document.body.appendChild(controlSquare);
}

// MutationObserver to handle changes in both iframes and regular pages
function handleVideos() {
  const observer = new MutationObserver(() => {
    const video = document.querySelector('a.videoLink video[src]:not([exist]), video[src]:not([exist])');
    if (video) {
      video.setAttribute('exist', '');
      createVolumeControlSquare(video);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize the script based on page type
if (window !== window.top) {
  // Handle iframes (embeds)
  handleVideos();
} else {
  // Regular page
  window.addEventListener('load', handleVideos);
}

// Tampermonkey menu commands

// Reset volume to 1%
GM_registerMenuCommand('Reset Volume to 1%', () => {
  const videos = document.querySelectorAll('video');
  videos.forEach((video) => {
    video.volume = 0.01;
    localStorage.setItem('videoVolume', 0.01);
  });
  alert('Volume reset to 1%.');
});

// Set volume step size
GM_registerMenuCommand('Set Volume Step Size', () => {
  let step = prompt(`Current step size is ${volumeStep * 100}%. Enter new step size as a percentage:`, volumeStep * 100);
  if (step !== null) {
    step = parseFloat(step) / 100;
    if (!isNaN(step) && step > 0 && step <= 1) {
      volumeStep = step;
      localStorage.setItem('volumeStep', volumeStep);
      alert(`Volume step size set to ${volumeStep * 100}%`);
    } else {
      alert('Invalid input. Enter a value between 0.01 and 100.');
    }
  }
});

// Clear saved volume controller location
GM_registerMenuCommand('Clear Controller Location', () => {
  localStorage.removeItem('volumeControlPos');
  alert('Controller location cleared. It will reset to the center on the next load.');
});
