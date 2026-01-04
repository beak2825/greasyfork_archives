// ==UserScript==
// @name         Clock Display
// @version      5.5
// @description  Displays a fancy AM/PM clock that can be moved around the screen and overlays everything.
// @author       Rylogix
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/1260014
// @downloadURL https://update.greasyfork.org/scripts/487125/Clock%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/487125/Clock%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a clock container
    var clockContainer = document.createElement('div');
    clockContainer.id = 'fancy-clock';
    clockContainer.style.position = 'fixed';
    clockContainer.style.top = '10px';
    clockContainer.style.left = '10px'; // Updated left position
    clockContainer.style.color = '#ffffff';
    clockContainer.style.fontFamily = 'Arial, sans-serif';
    clockContainer.style.fontSize = '20px';
    clockContainer.style.padding = '10px';
    clockContainer.style.background = 'rgba(0, 0, 0, 0.5)';
    clockContainer.style.borderRadius = '5px';
    clockContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    clockContainer.style.zIndex = '9999'; // Set a high z-index to overlay everything
    document.body.appendChild(clockContainer);

    var isDragging = false;
    var offsetX, offsetY;

    // Function to update the clock
    function updateClock() {
        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();
        var meridiem = hours >= 12 ? 'PM' : 'AM';

        // Convert 24-hour time to 12-hour time
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        // Add leading zeros to minutes and seconds
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        // Update clock text
        clockContainer.textContent = hours + ':' + minutes + ':' + seconds + ' ' + meridiem;
    }

    // Update clock every second
    setInterval(updateClock, 1000);

    // Function to handle mouse down event
    function onMouseDown(e) {
        isDragging = true;
        offsetX = e.clientX - clockContainer.getBoundingClientRect().left;
        offsetY = e.clientY - clockContainer.getBoundingClientRect().top;
    }

    // Function to handle mouse move event
    function onMouseMove(e) {
        if (isDragging) {
            var x = e.clientX - offsetX;
            var y = e.clientY - offsetY;
            clockContainer.style.left = x + 'px';
            clockContainer.style.top = y + 'px';
        }
    }

    // Function to handle mouse up event
    function onMouseUp() {
        isDragging = false;
    }

    // Add event listeners
    clockContainer.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

})();
