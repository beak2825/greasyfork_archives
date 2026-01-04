// ==UserScript==
// @name         Tampermonkey Pong
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Pong game using Tampermonkey user script
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473994/Tampermonkey%20Pong.user.js
// @updateURL https://update.greasyfork.org/scripts/473994/Tampermonkey%20Pong.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create game canvas
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);

    const context = canvas.getContext('2d');

    // Paddle variables
    const paddleWidth = 10;
    const paddleHeight = 100;
    let playerY = (canvas.height - paddleHeight) / 2;
    let opponentY = (canvas.height - paddleHeight) / 2;

    // Ball variables
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 2;

    // Game loop
    function update() {
        // Update ball position
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Ball collision with top and bottom
        if (ballY < 0 || ballY > canvas.height) {
            ballSpeedY = -ballSpeedY;
        }

        // Ball collision with paddles
        if (ballX < paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        }
        if (ballX > canvas.width - paddleWidth && ballY > opponentY && ballY < opponentY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        }

        // Update opponent's paddle position
        opponentY = ballY - paddleHeight / 2;

        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw paddles and ball
        context.fillRect(0, playerY, paddleWidth, paddleHeight);
        context.fillRect(canvas.width - paddleWidth, opponentY, paddleWidth, paddleHeight);
        context.fillRect(ballX - 5, ballY - 5, 10, 10);

        requestAnimationFrame(update);
    }

    // Start the game loop
    update();
})();
