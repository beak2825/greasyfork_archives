// ==UserScript==
// @name         Torn Flappy Bird
// @namespace    Apo
// @version      1.3
// @description  Adds a Flappy Bird clone to replace the travel plane.
// @author       Apollyon [445323]
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514980/Torn%20Flappy%20Bird.user.js
// @updateURL https://update.greasyfork.org/scripts/514980/Torn%20Flappy%20Bird.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove the plane element
    const planeDiv = document.getElementById("plane");
    if (planeDiv) {
        planeDiv.innerHTML = "";
    }

    // Canvas element
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 360;

    // Center canvas
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";  // Horizontal center

    planeDiv.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // Variables
    let baseSpeed = 0.2; // Initial speed
    const SPEED_INCREASE = 0.002; // Speed increase per score point
    const GRAVITY = 0.012; // Gravity for smoother descent
    const JUMP_VELOCITY = -0.9; // Jump velocity for a better jump experience
    const PIPE_WIDTH = 24; // Pipe width
    const PIPE_GAP = 84; // Gap between pipes
    const BIRD_SIZE = 11; // Bird size

    let birdY = canvas.height / 2;
    let birdVelocity = 0;
    let birdX = canvas.width / 6;
    let pipes = [];
    let gameRunning = true;
    let score = 0;

    //Pipes
    function createPipe(x) {
        const pipeHeight = Math.floor(Math.random() * (canvas.height - PIPE_GAP - 60)) + 24; // Adjusted height range
        pipes.push({
            x: x,
            topY: pipeHeight,
            bottomY: pipeHeight + PIPE_GAP
        });
    }

    //bird, pipes, and background
    function drawBird() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(birdX, birdY, BIRD_SIZE, BIRD_SIZE);
    }

    function drawPipe(pipe) {
        ctx.fillStyle = "green";
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topY);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, canvas.height - pipe.bottomY);
    }

    function drawBackground() {
        ctx.fillStyle = "skyblue";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawScore() {
        ctx.fillStyle = "black";
        ctx.font = "16px Arial"; // Font size
        ctx.fillText("Score: " + score, 10, 20); // Y position
    }

    // Update game state
    function updateGame() {
        if (!gameRunning) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();

        // Bird movement
        birdVelocity += GRAVITY;
        birdY += birdVelocity;

        // Pipe movement and creation
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 120) { // Adjusted pipe creation condition
            createPipe(canvas.width);
        }

        // Update and draw pipes
        pipes.forEach(pipe => {
            pipe.x -= baseSpeed; // Move pipes at adjusted speed
            drawPipe(pipe);
        });

        // Remove off-screen pipes
        if (pipes[0].x + PIPE_WIDTH < 0) {
            pipes.shift();
            score++;
            // Increase speed slowly as the score increases
            baseSpeed += SPEED_INCREASE; // Gradually increase speed
        }

        // Draw bird and score
        drawBird();
        drawScore();

        // Collision detection
        pipes.forEach(pipe => {
            if (
                birdX + BIRD_SIZE > pipe.x &&
                birdX < pipe.x + PIPE_WIDTH &&
                (birdY < pipe.topY || birdY + BIRD_SIZE > pipe.bottomY)
            ) {
                gameRunning = false; // End game if collision detected
            }
        });

        // Check for hitting the ground or top
        if (birdY + BIRD_SIZE > canvas.height || birdY < 0) {
            gameRunning = false;
        }

        // Game over text
        if (!gameRunning) {
            ctx.fillStyle = "red";
            ctx.font = "24px Arial"; // Font size
            ctx.fillText("Game Over!", canvas.width / 6, canvas.height / 2);
            ctx.fillText("Score: " + score, canvas.width / 4, canvas.height / 1.5);
        }

        // Request next frame if game is still running
        if (gameRunning) {
            requestAnimationFrame(updateGame);
        }
    }

    // Control bird jump with Space key
    document.addEventListener("keydown", function(event) {
        if (event.code === "Space") {
            event.preventDefault(); // Prevents the default scrolling behavior
            if (gameRunning) {
                birdVelocity = JUMP_VELOCITY; // Use jump velocity
            } else {
                // Restart game if game is over
                birdY = canvas.height / 2;
                birdVelocity = 0;
                pipes = [];
                score = 0;
                baseSpeed = 0.2; // Reset speed to initial value
                gameRunning = true;
                updateGame();
            }
        }
    });

    // Hide the popup element
    const popupInfo = document.querySelector(".popup-info");
    if (popupInfo) {
        popupInfo.style.display = "none"; // Hide the popup
    }

    // Start the game loop
    updateGame();

})();
