// ==UserScript==
// @name         YouTube Time Limiter
// @namespace    your-namespace
// @version      1.0
// @description  Limits the amount of time spent watching YouTube videos and displays a timer on the YouTube website.
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/469225/YouTube%20Time%20Limiter.user.js
// @updateURL https://update.greasyfork.org/scripts/469225/YouTube%20Time%20Limiter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Default time limit in seconds
  let timeLimit = 3600; // 1 hour

  // Function to display the time limit GUI
  function showTimeLimitGUI() {
    const timeInput = prompt('Enter the time limit (in hours):', timeLimit / 3600);
    const parsedTime = parseFloat(timeInput);
    if (!isNaN(parsedTime)) {
      timeLimit = Math.floor(parsedTime * 3600);
      updateTimer();
    }
  }

  // Function to update the timer display
  function updateTimer() {
    const youtubeLogo = document.querySelector('#logo-icon');
    if (youtubeLogo) {
      const timerDisplay = document.querySelector('#youtube-timer');
      const timeInput = document.querySelector('#youtube-time-input');
      if (timerDisplay) {
        timerDisplay.innerText = formatTime(timeLimit);
      } else {
        const timerElement = document.createElement('span');
        timerElement.id = 'youtube-timer';
        timerElement.innerText = formatTime(timeLimit);
        youtubeLogo.parentNode.insertBefore(timerElement, youtubeLogo.nextSibling);

        const timeInputElement = document.createElement('input');
        timeInputElement.id = 'youtube-time-input';
        timeInputElement.type = 'number';
        timeInputElement.value = timeLimit / 3600;
        timeInputElement.addEventListener('change', handleTimeInputChange);
        timerElement.parentNode.insertBefore(timeInputElement, timerElement.nextSibling);
      }

      if (timeLimit <= 0) {
        // Time limit reached, display stop sign and close the YouTube tab
        displayStopSign();
        window.close();
      } else {
        // Decrement time limit every second
        timeLimit--;
        setTimeout(updateTimer, 1000);
      }
    }
  }

  // Function to handle changes in the time input
  function handleTimeInputChange(event) {
    const newTime = parseFloat(event.target.value);
    if (!isNaN(newTime)) {
      timeLimit = Math.floor(newTime * 3600);
      updateTimer();
    }
  }

  // Function to display a pop-up with a stop sign when the time runs out
  function displayStopSign() {
    const stopSignURL = 'https://afarmishkindoflife.com/wp-content/uploads/2022/02/186-do-something-else.jpg'; // Replace with your stop sign image URL
    const stopSignHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <img src="${stopSignURL}" alt="Stop Sign" style="width: 200px; height: auto;">
      </div>
    `;
    const stopSignWindow = window.open('', '_blank', 'width=300,height=300');
    stopSignWindow.document.write(stopSignHTML);
    stopSignWindow.document.close();
  }

  // Function to format time in HH:MM:SS format
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${padZero(hours)}:${padZero(mins)}:${padZero(secs)}`;
  }

  // Function to pad zeros for single-digit numbers
  function padZero(num) {
    return num.toString().padStart(2, '0');
  }

  // Add a custom style for the timer display and time input
  GM_addStyle(`
    #youtube-timer {
      display: inline-block;
      font-weight: bold;
      margin-left: 10px;
      color: red;
    }

    #youtube-time-input {
      margin-left: 10px;
      width: 60px;
    }
  `);

  // Add a listener to show the time limit GUI on a key press (e.g., 't' key)
  window.addEventListener('keydown', function(event) {
    if (event.key === 't' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
      showTimeLimitGUI();
    }
  });

  // Start the timer
  updateTimer();
})();
