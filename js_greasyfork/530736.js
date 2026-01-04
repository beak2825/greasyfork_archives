// ==UserScript==
// @name         Tank Trouble Laser Pointer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a laser pointer showing shot trajectories in Tank Trouble!
// @author       You
// @match        https://tanktrouble.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530736/Tank%20Trouble%20Laser%20Pointer.user.js
// @updateURL https://update.greasyfork.org/scripts/530736/Tank%20Trouble%20Laser%20Pointer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for game to load
    function waitForGame() {
        return new Promise(resolve => {
            const check = setInterval(() => {
                if (typeof window.game !== 'undefined') {
                    clearInterval(check);
                    resolve();
                }
            }, 100);
        });
    }

    // Helper functions
    function getTankPosition() {
        return {
            x: window.game.tank.x,
            y: window.game.tank.y,
            direction: window.game.tank.direction
        };
    }

    function calculateTrajectory(startX, startY, direction) {
        const trajectory = [];
        const speed = 500; // Bullet speed
        let x = startX;
        let y = startY;
        let vx = Math.cos(direction) * speed;
        let vy = Math.sin(direction) * speed;

        // Calculate trajectory points
        while (x >= 0 && x <= window.game.canvas.width &&
               y >= 0 && y <= window.game.canvas.height) {
            trajectory.push({x, y});

            // Check for wall collisions
            const wall = checkWallCollision(x, y);
            if (wall) {
                // Calculate reflection
                if (wall.horizontal) {
                    vy = -vy * 0.8; // Energy loss on bounce
                } else {
                    vx = -vx * 0.8;
                }
            }

            x += vx * 0.016; // Update position
            y += vy * 0.016;
        }

        return trajectory;
    }

    function checkWallCollision(x, y) {
        // Check walls (simplified collision detection)
        const padding = 20;
        if (x <= padding) return { horizontal: false, vertical: true };
        if (x >= window.game.canvas.width - padding) return { horizontal: false, vertical: true };
        if (y <= padding) return { horizontal: true, vertical: false };
        if (y >= window.game.canvas.height - padding) return { horizontal: true, vertical: false };
        return null;
    }

    // Main enhancement function
    async function enhanceGame() {
        await waitForGame();

        // Store original draw function
        const originalDraw = window.game.draw;

        // Override draw function with enhanced visibility
        window.game.draw = function() {
            originalDraw.call(window.game);

            // Draw laser pointer with enhanced visibility
            const ctx = window.game.canvas.getContext('2d');
            const tank = getTankPosition();
            const trajectory = calculateTrajectory(tank.x, tank.y, tank.direction);

            // Draw trajectory with multiple styles for better visibility
            ctx.beginPath();
            ctx.moveTo(tank.x, tank.y);
            trajectory.forEach(point => {
                ctx.lineTo(point.x, point.y);
            });

            // Draw with glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Draw with solid line
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw starting point
            ctx.beginPath();
            ctx.arc(tank.x, tank.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.fill();
        };
    }

    // Start enhancements when page loads
    enhanceGame();
})();