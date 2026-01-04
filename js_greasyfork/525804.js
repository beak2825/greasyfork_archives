// ==UserScript==
// @name         Drawaria.online Bird Game
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a detailed parallax bird game to drawaria.online
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg
// @downloadURL https://update.greasyfork.org/scripts/525804/Drawariaonline%20Bird%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/525804/Drawariaonline%20Bird%20Game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container for the game
    const gameContainer = document.createElement('div');
    gameContainer.id = 'gameContainer';
    gameContainer.style.position = 'fixed';
    gameContainer.style.top = '0';
    gameContainer.style.left = '0';
    gameContainer.style.width = '100vw';
    gameContainer.style.height = '100vh';
    gameContainer.style.zIndex = '1000';
    gameContainer.style.pointerEvents = 'auto';
    document.body.appendChild(gameContainer);

    // Create the canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    canvas.width = 800;
    canvas.height = 600;
    gameContainer.appendChild(canvas);

    // Create the game over overlay
    const overlay = document.createElement('div');
    overlay.id = 'gameOverOverlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0, 0, 0, 0.5)';
    overlay.style.color = '#fff';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.fontSize = '2rem';
    overlay.style.zIndex = '10';
    overlay.style.visibility = 'hidden';
    gameContainer.appendChild(overlay);

    const gameOverText = document.createElement('div');
    gameOverText.innerText = 'Game Over';
    overlay.appendChild(gameOverText);

    const restartBtn = document.createElement('button');
    restartBtn.id = 'restartBtn';
    restartBtn.innerText = 'Restart';
    restartBtn.style.marginTop = '20px';
    restartBtn.style.padding = '10px 20px';
    restartBtn.style.fontSize = '1rem';
    restartBtn.style.cursor = 'pointer';
    restartBtn.style.border = 'none';
    restartBtn.style.borderRadius = '5px';
    restartBtn.style.backgroundColor = '#ff5050';
    restartBtn.style.color = '#fff';
    overlay.appendChild(restartBtn);

    const ctx = canvas.getContext('2d');

    // Game Variables
    let bird, obstacles, frameCount, gameOver;
    let gravity, jumpForce, obstacleSpeed, obstacleGap, obstacleWidth, obstacleInterval;

    // Parallax background variables
    let mountainPoints = [];
    let hillsPoints = [];
    let mountainOffset = 0;
    let hillsOffset = 0;
    let clouds = [];

    // Speeds for parallax layers (relative multipliers)
    const mountainSpeedMultiplier = 0.2;
    const hillsSpeedMultiplier = 0.5;
    const cloudSpeedMultiplier = 0.3;

    // Utility to generate terrain points for mountains/hills
    function generateTerrain(totalWidth, step, base, variation) {
      const points = [];
      for (let x = -step; x <= totalWidth; x += step) {
        const y = base + Math.random() * variation - variation / 2;
        points.push({ x, y });
      }
      return points;
    }

    // Initialize clouds array
    function initClouds() {
      clouds = [];
      const cloudCount = 8;
      for (let i = 0; i < cloudCount; i++) {
        clouds.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.3,
          scale: Math.random() * 0.5 + 0.5
        });
      }
    }

    function init() {
      // Bird properties
      bird = {
        x: 100,
        y: canvas.height / 2,
        width: 30,
        height: 30,
        velocity: 0
      };

      obstacles = [];
      frameCount = 0;
      gameOver = false;
      gravity = 0.5;
      jumpForce = -9;
      obstacleSpeed = 3;
      obstacleGap = 150;
      obstacleWidth = 60;
      obstacleInterval = 90; // frames between obstacles

      // Initialize parallax backgrounds
      mountainPoints = generateTerrain(canvas.width * 2, 50, canvas.height * 0.4, 80);
      hillsPoints = generateTerrain(canvas.width * 2, 50, canvas.height * 0.75, 40);
      mountainOffset = 0;
      hillsOffset = 0;
      initClouds();

      overlay.style.visibility = 'hidden';
    }

    function resetGame() {
      init();
      loop();
    }

    // Event listeners for controls
    document.addEventListener('keydown', function(e) {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameOver) {
          resetGame();
        } else {
          bird.velocity = jumpForce;
        }
      }
    });

    canvas.addEventListener('mousedown', function() {
      if (!gameOver) {
        bird.velocity = jumpForce;
      }
    });

    restartBtn.addEventListener('click', resetGame);

    // Spawn an obstacle (pipe pair)
    function spawnObstacle() {
      const minGapY = 50;
      const maxGapY = canvas.height - obstacleGap - 50;
      const gapY = Math.floor(Math.random() * (maxGapY - minGapY + 1)) + minGapY;
      obstacles.push({ x: canvas.width, gapY });
    }

    // Update game objects
    function update() {
      // Update bird
      bird.velocity += gravity;
      bird.y += bird.velocity;

      // Spawn obstacles at intervals
      if (frameCount % obstacleInterval === 0) {
        spawnObstacle();
      }

      // Update obstacles positions
      obstacles.forEach(obstacle => {
        obstacle.x -= obstacleSpeed;
      });
      obstacles = obstacles.filter(obstacle => obstacle.x + obstacleWidth > 0);

      // Check collision with top/bottom
      if (bird.y < 0 || bird.y + bird.height > canvas.height) {
        gameOver = true;
      }

      // Collision with obstacles
      obstacles.forEach(obstacle => {
        if (
          bird.x + bird.width > obstacle.x &&
          bird.x < obstacle.x + obstacleWidth
        ) {
          if (bird.y < obstacle.gapY || bird.y + bird.height > obstacle.gapY + obstacleGap) {
            gameOver = true;
          }
        }
      });

      // Update parallax backgrounds
      mountainOffset = (mountainOffset + obstacleSpeed * mountainSpeedMultiplier) % canvas.width;
      hillsOffset = (hillsOffset + obstacleSpeed * hillsSpeedMultiplier) % canvas.width;
      clouds.forEach(cloud => {
        cloud.x -= obstacleSpeed * cloudSpeedMultiplier;
        if (cloud.x + 100 * cloud.scale < 0) { // if cloud moves off the left edge
          cloud.x = canvas.width + Math.random() * canvas.width;
          cloud.y = Math.random() * canvas.height * 0.3;
        }
      });

      frameCount++;
    }

    // Draw sky background gradient on canvas
    function drawSky() {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#fff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw clouds with soft edges
    function drawCloud(x, y, scale) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(0, 0, 20, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(25, -10, 25, Math.PI * 1, Math.PI * 1.85);
      ctx.arc(55, 0, 20, Math.PI * 1.37, Math.PI * 1.91);
      ctx.arc(40, 10, 25, Math.PI * 1.5, Math.PI * 0.5);
      ctx.arc(15, 10, 20, Math.PI * 1.15, Math.PI * 1.9);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Draw all clouds
    function drawClouds() {
      clouds.forEach(cloud => {
        drawCloud(cloud.x, cloud.y, cloud.scale);
      });
    }

    // Draw mountain range based on pre-generated points
    function drawMountains(offset) {
      ctx.save();
      ctx.fillStyle = '#708090'; // Slate gray for distant mountains
      ctx.beginPath();
      ctx.moveTo(-offset, canvas.height);
      mountainPoints.forEach(pt => {
        ctx.lineTo(pt.x - offset, pt.y);
      });
      ctx.lineTo(canvas.width + 100, canvas.height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Draw hills in the foreground
    function drawHills(offset) {
      ctx.save();
      ctx.fillStyle = '#228B22'; // Forest green for hills
      ctx.beginPath();
      ctx.moveTo(-offset, canvas.height);
      hillsPoints.forEach(pt => {
        ctx.lineTo(pt.x - offset, pt.y);
      });
      ctx.lineTo(canvas.width + 100, canvas.height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Draw obstacles (pipes)
    function drawObstacles() {
      ctx.fillStyle = '#006400'; // Dark green for pipes
      obstacles.forEach(obstacle => {
        // Upper pipe
        ctx.fillRect(obstacle.x, 0, obstacleWidth, obstacle.gapY);
        // Lower pipe
        ctx.fillRect(obstacle.x, obstacle.gapY + obstacleGap, obstacleWidth, canvas.height - obstacle.gapY - obstacleGap);
      });
    }

    // Draw the bird with slight rotation based on velocity
    function drawBird() {
      ctx.save();
      // Determine rotation angle (capped for visual effect)
      const angle = Math.min(Math.max(bird.velocity / 10, -0.5), 1);
      ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
      ctx.rotate(angle);

      // Draw bird body (a yellow circle with a red beak)
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(0, 0, bird.width / 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw eye
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(-5, -5, 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw beak
      ctx.fillStyle = '#FF4500';
      ctx.beginPath();
      ctx.moveTo(bird.width / 2, 0);
      ctx.lineTo(bird.width / 2 + 10, -5);
      ctx.lineTo(bird.width / 2 + 10, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function draw() {
      // Draw sky background gradient
      drawSky();
      // Draw parallax layers in order
      drawClouds();
      drawMountains(mountainOffset);
      drawHills(hillsOffset);
      // Draw obstacles and bird
      drawObstacles();
      drawBird();
    }

    function loop() {
      if (gameOver) {
        overlay.style.visibility = 'visible';
        return;
      }
      update();
      draw();
      requestAnimationFrame(loop);
    }

    // Start the game
    init();
    loop();
})();
