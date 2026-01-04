// ==UserScript==
// @name         ChatGPT's Ball
// @namespace    http://example.com
// @version      1.0
// @description  Displays a bouncing ball with a smiley face on ChatGPT screen
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469314/ChatGPT%27s%20Ball.user.js
// @updateURL https://update.greasyfork.org/scripts/469314/ChatGPT%27s%20Ball.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the ball element with smiley face
    var ball = document.createElement('div');
    ball.innerHTML = '<img src="https://n1.sdlcdn.com/imgs/e/8/k/VRV-Yellow-Smiley-Face-Ball-SDL121016762-5-27d1e.JPG" alt="Smiley Face" style="width: 50px; height: 50px;">';
    ball.style.position = 'absolute';
    ball.style.left = '0';
    ball.style.top = '50%';
    ball.style.transform = 'translateY(-50%)';

    // Add the ball to the document
    document.body.appendChild(ball);

    // Set initial movement direction
    var direction = 1;

    // Set animation interval
    var intervalId = setInterval(moveBall, 10);

    // Function to move the ball
    function moveBall() {
        var currentLeft = parseInt(ball.style.left);
        var newLeft = currentLeft + direction;

        // Reverse direction if ball hits the edge of the screen
        if (newLeft + ball.offsetWidth > window.innerWidth || newLeft < 0) {
            direction *= -1;
        }

        ball.style.left = newLeft + 'px';
    }

    // Style the ball and animation
    GM_addStyle(`
        @keyframes bounce {
            0% { transform: translateY(0); }
             50% { transform: translateY(-100px); }
            100% { transform: translateY(0); }
        }

        div#ball {
            animation: bounce 1s infinite;
        }
    `);

    // Apply the styles to the ball element
    ball.setAttribute('id', 'ball');
})();
