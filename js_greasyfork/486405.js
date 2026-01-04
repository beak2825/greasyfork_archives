// ==UserScript==
// @name         shows time
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  shows the time in every website and can be dragged any where
// @author       Bibek
// @match        https://*/*
// @icon         https://purepng.com/public/uploads/medium/purepng.com-clock-iconsymbolsiconsapple-iosiosios-8-iconsios-8-721522596027cnipp.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486405/shows%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/486405/shows%20time.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // your code starts here 👇👇👇


    // Create a container for the time display
    const timeContainer = document.createElement('div');
    timeContainer.style.position = 'fixed';
    timeContainer.style.top = '0';
    timeContainer.style.left = '0';
    timeContainer.style.backgroundColor = '#4e2bda';
    timeContainer.style.padding = '5px';
    timeContainer.style.border = '1px solid #3300ff8a';
    timeContainer.style.cursor = 'move';
    timeContainer.style.borderRadius = '8px'; // Add border radius
    timeContainer.style.zIndex = '9999'; // Set z-index to a high value
    timeContainer.style.color = '#f7f7f7'; // Set text color
    timeContainer.style.fontWeight = 'bold'; // Set font weight
    //  timeContainer.style.background = 'linear-gradient(to right, #ff8c00, #ff0000)';
    // timeContainer.style.animation = 'gradient 8s ease infinite';

    // Create a span for the current time
    const currentTime = document.createElement('span');
    timeContainer.appendChild(currentTime);

    // Append the container to the body
    document.body.appendChild(timeContainer);

    // Update the time every second
    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Format the time in 12-hour clock format
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        // Format the time as HH:MM:SS AM/PM
        const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} ${ampm}`;

        // Update the time text
        currentTime.textContent = formattedTime;
    }

    // Make the time container draggable
    dragElement(timeContainer);

    // Update the time initially and set an interval to update it every second
    updateTime();
    setInterval(updateTime, 1000);

    // Function to make an element draggable
    function dragElement(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        elmnt.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + 'px';
            elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }









    // your code ends here 👆👆👆
})();