// ==UserScript==
// @name         Useless Things Series: Circle 4 - Eye Simulation
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  It display a small circle, within a blue circle, within a red circle. The point is it simulate and look like an eye it will follow the mouse movement.
// @match        *://*/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1126616
// @downloadURL https://update.greasyfork.org/scripts/487738/Useless%20Things%20Series%3A%20Circle%204%20-%20Eye%20Simulation.user.js
// @updateURL https://update.greasyfork.org/scripts/487738/Useless%20Things%20Series%3A%20Circle%204%20-%20Eye%20Simulation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a circle
    function createCircle(container, centerX, centerY, bigCircleWidth, bigCircleHeight) {
        // Maximum radius that the red circle can pass through (adjustable by the user)
        let maxAllowedRadius = 50;

        // Create the big blue circle
        const bigCircle = document.createElement('div');
        bigCircle.style.position = 'absolute';
        bigCircle.style.width = `${bigCircleWidth}px`;
        bigCircle.style.height = `${bigCircleHeight + 2}px`;
        bigCircle.style.border = '3px dashed blue'; // Change border style here
        bigCircle.style.borderRadius = '90% /90%'; // Eye-shaped border-radius
        bigCircle.style.left = `${centerX - bigCircleWidth / 2}px`;
        bigCircle.style.top = `${centerY - bigCircleHeight / 2}px`;
        container.appendChild(bigCircle);

        // Create the big red circle
        const bigCircleAbove = document.createElement('div');
        bigCircleAbove.style.position = 'absolute';
        bigCircleAbove.style.width = `${bigCircleWidth + 100}px`; // Larger width
        bigCircleAbove.style.height = `${bigCircleHeight}px`;
        bigCircleAbove.style.border = '5px solid red'; // Change border style here
        bigCircleAbove.style.borderRadius = '100% /100%'; // Eye-shaped border-radius
        bigCircleAbove.style.left = `${centerX - (bigCircleWidth + 100) / 2}px`;
        bigCircleAbove.style.top = `${centerY - bigCircleHeight / 2}px`;
        container.appendChild(bigCircleAbove);

        // Create the small red filled circle
        const smallCircle = document.createElement('div');
        smallCircle.style.width = '60px';
        smallCircle.style.height = '60px';
        smallCircle.style.borderRadius = '50%';
        smallCircle.style.backgroundColor = 'red';
        smallCircle.style.position = 'absolute';
        smallCircle.style.transition = 'all 0.1s ease-out'; // Smooth transition
        smallCircle.style.zIndex = '9999'; // Ensure it's above other elements
        smallCircle.style.pointerEvents = 'auto'; // Make it clickable
        container.appendChild(smallCircle);

        // Add event listener to prevent mouse pass-through
        smallCircle.addEventListener('mousemove', function(event) {
            event.stopPropagation();
        });

        // Add event listener for mouse movement
        let timeout;
        document.addEventListener('mousemove', function(event) {
            clearTimeout(timeout); // Reset the timeout on mouse movement
            // Calculate the distance between the mouse position and the center of the screen
            const distance = Math.sqrt(Math.pow(event.clientX - centerX, 2) + Math.pow(event.clientY - centerY, 2));

            // Ensure the distance does not exceed the maximum allowed radius
            if (distance >= maxAllowedRadius) {
                // Calculate the angle between the mouse position and the center of the screen
                const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
                // Calculate the position of the small circle on the circumference of the blue circle
                const smallCircleX = centerX + maxAllowedRadius * Math.cos(angle) - 20;
                const smallCircleY = centerY + maxAllowedRadius * Math.sin(angle) - 20;
                // Set the position of the small circle
                smallCircle.style.left = `${smallCircleX}px`;
                smallCircle.style.top = `${smallCircleY}px`;
            } else {
                // Set the position of the small circle to the mouse position
                smallCircle.style.left = `${event.clientX - 20}px`;
                smallCircle.style.top = `${event.clientY - 20}px`;
            }
        });

        // Function to move the small circle to the center when there is no mouse movement after a certain time
        function moveToCenter() {
            const smallCircleX = centerX - 20;
            const smallCircleY = centerY - 20;
            smallCircle.style.left = `${smallCircleX}px`;
            smallCircle.style.top = `${smallCircleY}px`;
        }

        // Set a timeout to move the small circle to the center after 2 seconds of inactivity
        document.addEventListener('mousemove', function() {
            clearTimeout(timeout);
            timeout = setTimeout(moveToCenter, 2000);
        });

        // Function to set the maximum allowed radius
        function setMaxAllowedRadius(radius) {
            maxAllowedRadius = radius;
        }

        // Expose the function to the global scope
        window.setMaxAllowedRadius = setMaxAllowedRadius;

        // Add event listener to remove the circle when clicked
        smallCircle.addEventListener('click', function() {
            // Remove all circles
            container.removeChild(bigCircle);
            container.removeChild(bigCircleAbove);
            container.removeChild(smallCircle);
            // Show the circle again after 3 seconds
            setTimeout(function() {
                container.appendChild(bigCircle);
                container.appendChild(bigCircleAbove);
                container.appendChild(smallCircle);
            }, 3000);
        });


    }

    // Create a container for the circles
    const container = document.createElement('div');
    container.classList.add('shape'); // Add a class for easier selection
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    // Get the center coordinates of the screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Create circles positioned at the left and right centers of the screen
    createCircle(container, centerX / 2, centerY, 200, 170); // Left center
    createCircle(container, centerX + centerX / 2, centerY, 200, 170); // Right center

    function addMouthCircle() {
        let distanceFromBottom = 10;

        // Create the resizing circle container
        const resizingCircleContainer = document.createElement('div');
        resizingCircleContainer.classList.add('shape'); // Add a class for easier selection
        resizingCircleContainer.style.position = 'fixed';
        resizingCircleContainer.style.bottom = `${distanceFromBottom}px`; // Distance from the bottom of the screen
        resizingCircleContainer.style.left = '50%'; // Center horizontally
        resizingCircleContainer.style.transform = 'translateX(-50%)'; // Adjust horizontal position to center
        resizingCircleContainer.style.transition = 'all 0.1s ease-out'; // Smooth transition
        resizingCircleContainer.style.borderRadius = '50% /90%'; // Oval shape
        resizingCircleContainer.style.zIndex = '10000';
        document.body.appendChild(resizingCircleContainer);

        // Create the resizing circle
        const resizingCircle = document.createElement('div');
        resizingCircle.style.width = '60px'; // Initial width
        resizingCircle.style.height = '60px'; // Initial height
        resizingCircle.style.borderRadius = '50%';
        resizingCircle.style.border = '2px solid black'; // Outline color and thickness
        resizingCircle.style.backgroundColor = 'blue'; // Default fill color of the circle
        resizingCircle.style.position = 'relative';
        resizingCircle.style.transition = 'all 0.1s ease-out'; // Smooth transition
        resizingCircleContainer.appendChild(resizingCircle);

        // Create the small circle inside the resizing circle
        const smallCircle = document.createElement('div');
        smallCircle.style.width = '40px'; // Initial width
        smallCircle.style.height = '40px'; // Initial height
        smallCircle.style.borderRadius = '20%';
        smallCircle.style.backgroundColor = 'red'; // Fill color of the small circle
        smallCircle.style.position = 'absolute';
        smallCircle.style.left = '50%'; // Center horizontally
        smallCircle.style.top = '70%'; // Center vertically
        smallCircle.style.transform = 'translate(-50%, -50%)'; // Adjust position to center
        resizingCircle.appendChild(smallCircle);

        // Add event listener for mouse movement
        document.addEventListener('mousemove', function(event) {
            const distance = Math.sqrt(Math.pow(event.clientX - centerX, 2) + Math.pow(event.clientY - (window.innerHeight - distanceFromBottom), 2));
            const maxSize = 200; // Maximum size of the circle when mouse is far
            const minSize = 0; // Minimum size of the circle when mouse is near
            const newSize = maxSize - distance * 0.3; // Adjust size based on distance
            resizingCircle.style.width = `${Math.max(minSize, newSize)}px`;
            resizingCircle.style.height = `${Math.max(minSize, newSize)}px`;
            smallCircle.style.width = `${Math.max(minSize / 2, newSize / 2)}px`; // Adjust size of the small circle
            smallCircle.style.height = `${Math.max(minSize / 2, newSize / 2)}px`;
        });

        // Add event listener for click event on the resizing circle
        resizingCircle.addEventListener('click', function() {
            // Enlarge the circles
            resizingCircle.style.width = '900px';
            resizingCircle.style.height = '900px';
            // Enlarge the small circle
            smallCircle.style.width = '600px';
            smallCircle.style.height = '600px';
        });

    }
    addMouthCircle();

    function createNose(container, centerX1, centerX2, distanceFromTop, triangleSize) {
        // Calculate the midpoint between the centers of the two circles
        const midX = (centerX1 + centerX2) / 2;
        const centerY = window.innerHeight / 2; // Automatically calculate the vertical center

        // Create the container for the nose triangle
        const noseContainer = document.createElement('div');
        noseContainer.classList.add('shape'); // Add a class for easier selection
        noseContainer.style.position = 'absolute';
        noseContainer.style.top = `${distanceFromTop}px`; // Set the distance from the top of the screen
        noseContainer.style.left = `${midX}px`; // Center horizontally
        noseContainer.style.transform = 'translateX(-50%)'; // Adjust horizontal position to center
        container.appendChild(noseContainer);

        // Create the triangle
        const triangle = document.createElement('div');
        triangle.style.width = '0';
        triangle.style.height = '0';
        triangle.style.borderLeft = `${triangleSize / 2}px solid transparent`;
        triangle.style.borderRight = `${triangleSize / 2}px solid transparent`;
        triangle.style.borderBottom = `${triangleSize}px solid #00FF00`; // Green color using hex code
        noseContainer.appendChild(triangle);

    }

    // Call createNose function to create the nose
    createNose(container, centerX / 2, centerX + centerX / 2, 450, 50); // Adjust the size and position of the nose as needed


    // Add event listener to the document for the 'keydown' event
    document.addEventListener('keydown', function(event) {
        if (event.key === 'e' || event.key === 'E') { // Check if 'e' key is pressed
            toggleShapesVisibility(); // Toggle visibility of all shapes
        }
    });

    // Function to toggle the visibility of all shapes
    function toggleShapesVisibility() {
        const allShapes = document.querySelectorAll('.shape'); // Select all shapes
        allShapes.forEach(shape => {
            if (shape.style.display === 'none') {
                shape.style.display = 'block'; // Show hidden shapes
            } else {
                shape.style.display = 'none'; // Hide visible shapes
            }
        });
    }

    function hideShapes() {
        const allShapes = document.querySelectorAll('.shape'); // Select all shapes
        allShapes.forEach(shape => {
            shape.style.display = 'none'; // Hide all shapes
        });
    }

    hideShapes();

})();
