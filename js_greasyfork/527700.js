// ==UserScript==
// @name         Drawaria Football Game
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add football/soccer game features to drawaria.online
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg
// @downloadURL https://update.greasyfork.org/scripts/527700/Drawaria%20Football%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/527700/Drawaria%20Football%20Game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Game state
    let balls = [];
    let soccerField = null;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    // Ball physics constants
    const FRICTION = 0.98;
    const KICK_POWER = 15;
    const GRAVITY = 0.5;

    // Create menu UI
    const menu = document.createElement('div');
    menu.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: linear-gradient(45deg, #2196F3, #4CAF50);
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        cursor: move;
        user-select: none;
        color: white;
        font-family: Arial, sans-serif;
    `;
    menu.innerHTML = `
        <h3 style="margin: 0 0 10px 0;">⚽ Football Game Menu</h3>
        <button id="addBall" style="margin: 5px; padding: 8px; background: #FFC107; border: none; border-radius: 5px; cursor: pointer;">Add Ball</button>
        <button id="toggleField" style="margin: 5px; padding: 8px; background: #FF5722; border: none; border-radius: 5px; cursor: pointer;">Toggle Field</button>
        <button id="clearBalls" style="margin: 5px; padding: 8px; background: #E91E63; border: none; border-radius: 5px; cursor: pointer;">Clear Balls</button>
    `;

    // Ball class
    class Ball {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = 0;
            this.vy = 0;
            this.radius = 15;
            this.active = true;
        }

        update() {
            if (!this.active) return;

            this.x += this.vx;
            this.y += this.vy;
            this.vy += GRAVITY;
            this.vx *= FRICTION;
            this.vy *= FRICTION;

            // Bounce off walls
            if (this.y + this.radius > window.innerHeight) {
                this.y = window.innerHeight - this.radius;
                this.vy *= -0.8;
            }
            if (this.x + this.radius > window.innerWidth) {
                this.x = window.innerWidth - this.radius;
                this.vx *= -0.8;
            }
            if (this.x - this.radius < 0) {
                this.x = this.radius;
                this.vx *= -0.8;
            }
        }

        draw(ctx) {
            if (!this.active) return;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        kick(mouseX, mouseY) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius) {
                this.vx = (mouseX - this.x) / distance * KICK_POWER;
                this.vy = (mouseY - this.y) / distance * KICK_POWER;
            }
        }
    }

    // Make menu draggable
    menu.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX - menu.offsetLeft;
        dragStartY = e.clientY - menu.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            menu.style.left = (e.clientX - dragStartX) + 'px';
            menu.style.top = (e.clientY - dragStartY) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Add event listeners for buttons
    document.body.appendChild(menu);
    document.getElementById('addBall').addEventListener('click', () => {
        balls.push(new Ball(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
    });

    document.getElementById('toggleField').addEventListener('click', () => {
        soccerField = !soccerField;
    });

    document.getElementById('clearBalls').addEventListener('click', () => {
        balls = [];
    });

    // Create canvas for drawing
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999';
    document.body.appendChild(canvas);

    // Handle window resize
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Main game loop
    function gameLoop() {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw soccer field
        if (soccerField) {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 5;
            ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

            // Draw goals
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(20, canvas.height/2 - 100, 30, 200);
            ctx.fillRect(canvas.width - 50, canvas.height/2 - 100, 30, 200);
        }

        // Update and draw balls
        balls.forEach(ball => {
            ball.update();
            ball.draw(ctx);
        });

        requestAnimationFrame(gameLoop);
    }

    // Start game loop
    gameLoop();

    // Handle ball kicking
    document.addEventListener('click', (e) => {
        balls.forEach(ball => {
            ball.kick(e.clientX, e.clientY);
        });
    });
})();