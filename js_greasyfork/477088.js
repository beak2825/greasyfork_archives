// ==UserScript==
// @name         Keep Google Colab Running
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Keep Google Colab running
// @match        *://colab.research.google.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477088/Keep%20Google%20Colab%20Running.user.js
// @updateURL https://update.greasyfork.org/scripts/477088/Keep%20Google%20Colab%20Running.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the 'Keep Colab Running' button
    var button = document.createElement('button');
    button.innerHTML = '🔄';
    button.style.position = 'fixed';
    button.style.top = '0';
    button.style.right = '0';
    button.style.zIndex = '9999'; // Ensure the button is always on top
    button.style.background = '#FF0000'; // Red when script is off
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '50%'; // Circular button
    button.style.width = '60px';
    button.style.height = '60px';
    button.style.display = 'flex';
    button.style.justifyContent = 'center';
    button.style.alignItems = 'center';
    button.style.fontSize = '24px';
    button.style.cursor = 'move'; // Change cursor to move cursor
    document.body.appendChild(button);

    // Make the DIV element draggable:
    dragElement(button);

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        elmnt.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Function to keep Colab running
    var keepColabRunning = null;

    // Add the event listener for the button
    button.addEventListener('click', function() {
        if (keepColabRunning) {
            clearInterval(keepColabRunning);
            keepColabRunning = null;
            console.log('Stopped keeping Colab running');
            button.style.background = '#FF0000'; // Red when script is off
        } else {
            keepColabRunning = setInterval(function() {
                console.log('Clicking to keep Colab running');
                document.querySelector('colab-connect-button').shadowRoot.getElementById('connect').click();
                }, 60000);
                console.log('Started keeping Colab running');
                button.style.background = '#34A853'; // Green when script is on
        }
     });
})();
