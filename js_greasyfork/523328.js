// ==UserScript==
// @name         Embed Jetpunk
// @namespace    https://your-website.com
// @version      1.0
// @description  Embed Jetpunk into whatever site (change the @match)
// @author       Your Name
// @match        (what I want to embed in)
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523328/Embed%20Jetpunk.user.js
// @updateURL https://update.greasyfork.org/scripts/523328/Embed%20Jetpunk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container div to hold the iframe
    var iframeContainer = document.createElement('div');
    iframeContainer.style.position = 'absolute'; // Positioning it on top of other content
    iframeContainer.style.top = '70px'; // Adjusted this value to push it lower
    iframeContainer.style.left = '0';
    iframeContainer.style.width = '100%';
    iframeContainer.style.height = '600px'; // Default height
    iframeContainer.style.zIndex = '9999'; // Ensure it stays on top of other content
    iframeContainer.style.border = '5px solid #a75cf5'; // Vibrant purple border
    iframeContainer.style.marginBottom = '50px'; // Prevent content from being hidden underneath the resizer
    iframeContainer.style.overflow = 'auto'; // Allow scrolling in the container if necessary

    // Create a draggable header bar with a gradient background (lighter blue to green)
    var headerBar = document.createElement('div');
    headerBar.style.background = 'linear-gradient(45deg, #513df9, #00ff00)'; // Lighter blue to green gradient
    headerBar.style.color = 'white';
    headerBar.style.padding = '5px';
    headerBar.style.cursor = 'move';
    headerBar.style.textAlign = 'center';
    headerBar.innerHTML = 'Drag to Move Textbook';

    // Adjust headerBar to ensure it's not pushed out of view
    headerBar.style.marginBottom = '0px'; // Increased margin to push down slightly

    // Add the header bar to the container
    iframeContainer.appendChild(headerBar);

    // Create an iframe element to embed the OpenStax website
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.jetpunk.com/';
    iframe.style.width = '100%';
    iframe.style.height = '100%'; // Take up full container height
    iframe.style.border = 'none';

    // Append the iframe to the container
    iframeContainer.appendChild(iframe);

    // Function to create resizers
    function createResizer(position) {
        var resizer = document.createElement('div');
        resizer.style.width = '20px';
        resizer.style.height = '20px';
        resizer.style.position = 'absolute';
        resizer.style.cursor = `${position}-resize`;

        // Set the resizer color to black
        resizer.style.backgroundColor = 'black';

        switch(position) {
            case 'top-left':
                resizer.style.top = '-5px'; // Push resizer up slightly
                resizer.style.left = '-5px'; // Ensure resizer is visible in the corner
                break;
            case 'top-right':
                resizer.style.top = '-5px'; // Push resizer up slightly
                resizer.style.right = '-5px'; // Ensure resizer is visible in the corner
                break;
        }

        return resizer;
    }

    // Add resizers to top-left and top-right only
    var topLeftResizer = createResizer('top-left');
    var topRightResizer = createResizer('top-right');

    iframeContainer.appendChild(topLeftResizer);
    iframeContainer.appendChild(topRightResizer);

    // Append the container to the body of the page
    document.body.appendChild(iframeContainer);

    // Function to make the container draggable
    headerBar.addEventListener('mousedown', function(e) {
        e.preventDefault();

        // Start dragging the container
        var initialTop = iframeContainer.offsetTop;
        var initialLeft = iframeContainer.offsetLeft;
        var initialX = e.clientX;
        var initialY = e.clientY;

        // Mousemove event to move the container
        function onMouseMove(event) {
            var deltaX = event.clientX - initialX;
            var deltaY = event.clientY - initialY;

            iframeContainer.style.top = initialTop + deltaY + 'px'; // Only allow vertical movement
            iframeContainer.style.left = initialLeft + deltaX + 'px'; // Allow horizontal movement as well
        }

        // Mouseup event to stop dragging the container
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // Function to resize the iframe container from the corners
    function resizeContainer(resizer, corner) {
        let isResizing = false;

        resizer.addEventListener('mousedown', function(e) {
            e.preventDefault();
            isResizing = true;

            // Initial dimensions and mouse position
            var initialWidth = iframeContainer.offsetWidth;
            var initialHeight = iframeContainer.offsetHeight;
            var initialX = e.clientX;
            var initialY = e.clientY;
            var initialTop = iframeContainer.offsetTop;
            var initialLeft = iframeContainer.offsetLeft;

            // Mousemove event to resize both horizontally and vertically
            function onMouseMove(event) {
                if (isResizing) {
                    var deltaX = event.clientX - initialX;
                    var deltaY = event.clientY - initialY;

                    // Handle resizing based on corner
                    if (corner === 'top-left') {
                        iframeContainer.style.width = initialWidth - deltaX + 'px';
                        iframeContainer.style.height = initialHeight - deltaY + 'px';
                        iframe.style.width = iframeContainer.style.width;
                        iframe.style.height = iframeContainer.style.height;
                        iframeContainer.style.top = initialTop + deltaY + 'px'; // Update top position when resizing
                        iframeContainer.style.left = initialLeft + deltaX + 'px'; // Update left position when resizing
                    } else if (corner === 'top-right') {
                        iframeContainer.style.width = initialWidth + deltaX + 'px';
                        iframeContainer.style.height = initialHeight - deltaY + 'px';
                        iframe.style.width = iframeContainer.style.width;
                        iframe.style.height = iframeContainer.style.height;
                        iframeContainer.style.top = initialTop + deltaY + 'px'; // Update top position when resizing
                    }
                }
            }

            // Mouseup event to stop resizing
            function onMouseUp() {
                isResizing = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    // Attach resize functionality to the top-left and top-right corners
    resizeContainer(topLeftResizer, 'top-left');
    resizeContainer(topRightResizer, 'top-right');
})();
