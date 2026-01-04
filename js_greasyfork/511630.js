// ==UserScript==
// @name         Drawaria Jump Game
// @namespace    http://tampermonkey.net/
// @version      2024-10-06
// @description  New drawaria Jump Game!
// @author       YouTube Drawaria
// @match        https://drawaria.online/game
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
 
 
// @downloadURL https://update.greasyfork.org/scripts/511630/Drawaria%20Jump%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/511630/Drawaria%20Jump%20Game.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Remove the "Cannot GET /dinosaur" text
    document.body.innerHTML = "";
 
    // Change the tab title
    document.title = "Drawaria Jump Game";
 
    // Change the tab icon
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = "/favicon-32x32.png";
    document.head.appendChild(link);
 
    // Add music when the game starts
    const audio = document.createElement('audio');
    audio.src = 'https://ia601307.us.archive.org/0/items/gdps-2.2-song-500476/500476.mp3';
    audio.loop = true;
    audio.autoplay = true;
    document.body.appendChild(audio);
 
    // Create the game area
    const gameArea = document.createElement('div');
    gameArea.id = 'gameArea';
    gameArea.style.position = 'relative';
    gameArea.style.width = '100vw';
    gameArea.style.height = '100vh';
    gameArea.style.overflow = 'hidden';
    document.body.appendChild(gameArea);
 
    // Style the game background with gray squares
    const shapesStyle = document.createElement('style');
    shapesStyle.innerHTML = `
        #gameArea {
            background: linear-gradient(#87ceeb, #f7f7f7);
            overflow: hidden;
        }
 
        .background-square {
            position: absolute;
            width: 80px;  /* Square size */
            height: 80px; /* Square size */
            background: rgba(128, 128, 128, 0.5); /* Gray color */
        }
 
        @keyframes moveShapes {
            0% {
                transform: translateY(0);
            }
            100% {
                transform: translateY(100vh);
            }
        }
    `;
    document.head.appendChild(shapesStyle);
 
    // Create the background with gray squares
    for (let i = 0; i < 50; i++) {
        const square = document.createElement('div');
        square.classList.add('background-square');
        square.style.left = Math.random() * 100 + 'vw';
        square.style.top = Math.random() * 100 + 'vh';
        gameArea.appendChild(square);
    }
 
    // Create the ground
    const ground = document.createElement('div');
    ground.id = 'ground';
    ground.style.position = 'absolute';
    ground.style.bottom = '0';
    ground.style.width = '100%';
    ground.style.height = '50px';
    ground.style.background = '#e0c568';
    ground.style.borderTop = '5px solid #a67c00';
    gameArea.appendChild(ground);
 
    // Create the dinosaur
    const dinosaur = document.createElement('div');
    dinosaur.style.position = 'absolute';
    dinosaur.style.bottom = '50px';
    dinosaur.style.left = '50px';
    dinosaur.style.width = '40px';
    dinosaur.style.height = '40px';
    dinosaur.style.backgroundColor = '#808080'; // Dark gray color
    dinosaur.style.transition = 'bottom 0.1s';
    gameArea.appendChild(dinosaur);
 
    // Create the game title and logo
 
 
    const titleDisplay = document.createElement('h1');
    titleDisplay.innerText = 'Drawaria Jump Game';
    titleDisplay.style.position = 'absolute';
    titleDisplay.style.top = '120px'; // Position title below logo
    titleDisplay.style.left = '50%';
    titleDisplay.style.transform = 'translateX(-50%)';
    titleDisplay.style.color = '#000'; // Text color
    gameArea.appendChild(titleDisplay);
 
    // Create score, time, and creator displays
    let score = 0;
    const scoreDisplay = document.createElement('div');
    scoreDisplay.style.position = 'absolute';
    scoreDisplay.style.top = '10px';
    scoreDisplay.style.left = '10px';
    scoreDisplay.style.fontSize = '20px';
    gameArea.appendChild(scoreDisplay);
 
    const timeDisplay = document.createElement('div');
    timeDisplay.style.position = 'absolute';
    timeDisplay.style.top = '40px';
    timeDisplay.style.left = '10px';
    timeDisplay.style.fontSize = '20px';
    gameArea.appendChild(timeDisplay);
 
    const creatorDisplay = document.createElement('div');
    creatorDisplay.style.position = 'absolute';
    creatorDisplay.style.top = '70px';
    creatorDisplay.style.left = '10px';
    creatorDisplay.style.fontSize = '20px';
    creatorDisplay.innerText = 'Creator: YouTube Drawaria';
    gameArea.appendChild(creatorDisplay);
 
    // Update score and time
    setInterval(() => {
        scoreDisplay.innerText = `Score: ${score}`;
        const now = new Date();
        timeDisplay.innerText = `Time: ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    }, 1000);
 
    // Create obstacles container
    const obstacles = document.createElement('div');
    obstacles.style.position = 'absolute';
    obstacles.style.width = '100%';
    obstacles.style.height = '100%';
    gameArea.appendChild(obstacles);
 
    // Create points container
    const pointItems = document.createElement('div');
    pointItems.style.position = 'absolute';
    pointItems.style.width = '100%';
    pointItems.style.height = '100%';
    pointItems.style.zIndex = '2';
    gameArea.appendChild(pointItems);
 
    // Create power-ups container
    const powerUps = document.createElement('div');
    powerUps.style.position = 'absolute';
    powerUps.style.width = '100%';
    powerUps.style.height = '100%';
    powerUps.style.zIndex = '2';
    gameArea.appendChild(powerUps);
 
    // Move the dinosaur
    let dinosaurPosition = 50;
    let isJumping = false;
 
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' || event.code === 'ArrowUp') {
            if (!isJumping) {
                isJumping = true;
                dinosaur.style.bottom = '200px';
                setTimeout(() => {
                    dinosaur.style.bottom = '50px';
                    isJumping = false;
                }, 800);
            }
        }
        if (event.code === 'ArrowRight') {
            dinosaurPosition += 10;
            dinosaur.style.left = dinosaurPosition + 'px';
        }
        if (event.code === 'ArrowLeft') {
            dinosaurPosition -= 10;
            dinosaur.style.left = dinosaurPosition + 'px';
        }
    });
 
    // Create obstacles
    const createObstacle = () => {
        const obstacle = document.createElement('div');
        obstacle.style.position = 'absolute';
        obstacle.style.width = '30px';
        obstacle.style.height = '60px';
        obstacle.style.backgroundColor = 'red';
        obstacle.style.bottom = '50px';
        obstacle.style.left = '100%';
        obstacles.appendChild(obstacle);
 
        let obstacleInterval = setInterval(() => {
            const obstaclePosition = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
            if (obstaclePosition < -60) {
                obstacle.remove();
                clearInterval(obstacleInterval);
            } else {
                obstacle.style.left = (obstaclePosition - 5) + 'px';
            }
            checkCollisionWithObstacle(obstacle);
        }, 30);
    };
 
    // Create points
    const createPoint = () => {
        const point = document.createElement('div');
        point.style.position = 'absolute';
        point.style.width = '20px';
        point.style.height = '20px';
        point.style.backgroundColor = 'yellow';
        point.style.borderRadius = '50%';
        point.style.bottom = '200px'; // Match max dinosaur jump height
        point.style.left = '100%';
        pointItems.appendChild(point);
 
        let pointInterval = setInterval(() => {
            const pointPosition = parseInt(window.getComputedStyle(point).getPropertyValue('left'));
            if (pointPosition < -20) {
                point.remove();
                clearInterval(pointInterval);
            } else {
                point.style.left = (pointPosition - 5) + 'px';
            }
            checkCollisionWithPoint(point);
        }, 30);
    };
 
    // Create power-up
    const createPowerUp = () => {
        const powerUp = document.createElement('div');
        powerUp.style.position = 'absolute';
        powerUp.style.width = '20px';
        powerUp.style.height = '20px';
        powerUp.style.backgroundColor = 'blue';
        powerUp.style.borderRadius = '50%';
        powerUp.style.bottom = '100px'; // Match dinosaur jump height
        powerUp.style.left = '100%';
        powerUps.appendChild(powerUp);
 
        let powerUpInterval = setInterval(() => {
            const powerUpPosition = parseInt(window.getComputedStyle(powerUp).getPropertyValue('left'));
            if (powerUpPosition < -20) {
                powerUp.remove();
                clearInterval(powerUpInterval);
            } else {
                powerUp.style.left = (powerUpPosition - 5) + 'px';
            }
            checkCollisionWithPowerUp(powerUp);
        }, 30);
    };
 
    // Check collision with obstacles
    const checkCollisionWithObstacle = (obstacle) => {
        const dinoRect = dinosaur.getBoundingClientRect();
        const obsRect = obstacle.getBoundingClientRect();
 
        if (
            dinoRect.left < obsRect.right &&
            dinoRect.right > obsRect.left &&
            dinoRect.bottom > obsRect.top &&
            dinoRect.top < obsRect.bottom
        ) {
            alert('You hit an obstacle! Your final score is: ' + score);
            location.reload();
        }
    };
 
    // Check collision with points
    const checkCollisionWithPoint = (point) => {
        const dinoRect = dinosaur.getBoundingClientRect();
        const pointRect = point.getBoundingClientRect();
 
        if (
            dinoRect.left < pointRect.right &&
            dinoRect.right > pointRect.left &&
            dinoRect.bottom > pointRect.top &&
            dinoRect.top < pointRect.bottom
        ) {
            score += 10;
            point.remove();
        }
    };
 
    // Check collision with power-ups
    const checkCollisionWithPowerUp = (powerUp) => {
        const dinoRect = dinosaur.getBoundingClientRect();
        const powerUpRect = powerUp.getBoundingClientRect();
 
        if (
            dinoRect.left < powerUpRect.right &&
            dinoRect.right > powerUpRect.left &&
            dinoRect.bottom > powerUpRect.top &&
            dinoRect.top < powerUpRect.bottom
        ) {
            score += 20; // Increase score for collecting power-up
            powerUp.remove();
        }
    };
 
    // Create obstacles, points, and power-ups periodically
    setInterval(createObstacle, 1500);
    setInterval(createPoint, 2000);
    setInterval(createPowerUp, 5000);
 
    // Display the score every second
    setInterval(() => {
        scoreDisplay.innerText = `Score: ${score}`;
    }, 1000);
})();