// ==UserScript==
// @name         Drawaria Hearts Love Mod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds comets with falling hearts and particle effects along with beautiful SVG decorations to drawaria.online.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         data:image/png;base64,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
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526925/Drawaria%20Hearts%20Love%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/526925/Drawaria%20Hearts%20Love%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a canvas overlay covering the page.
    const canvas = document.createElement('canvas');
    canvas.id = 'heartsCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Resize canvas to match window size.
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Arrays to hold comet and heart particles.
    const comets = [];
    const hearts = [];

    // Utility: random value between min and max.
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Define a comet that moves diagonally across the canvas.
    class Comet {
        constructor() {
            // Start at a random position at the top of the screen.
            this.x = rand(-100, canvas.width);
            this.y = rand(-50, 0);
            // Velocity moving diagonally down and right.
            this.vx = rand(2, 5);
            this.vy = rand(2, 4);
            // Lifespan for when to remove the comet.
            this.life = rand(150, 250);
            this.spawnRate = rand(5, 10); // How many frames between spawning hearts.
            this.frameCounter = 0;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
            this.frameCounter++;
            // Periodically spawn a heart particle.
            if (this.frameCounter >= this.spawnRate) {
                this.frameCounter = 0;
                hearts.push(new Heart(this.x, this.y));
            }
        }

        draw(ctx) {
            // Draw comet core (a glowing circle)
            ctx.save();
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(255,255,255,0.8)';
            ctx.fillStyle = 'rgba(255, 200, 50, 0.9)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            // Draw comet tail (fading streak)
            ctx.save();
            const grad = ctx.createLinearGradient(this.x, this.y, this.x - this.vx * 10, this.y - this.vy * 10);
            grad.addColorStop(0, 'rgba(255,200,50,0.8)');
            grad.addColorStop(1, 'rgba(255,200,50,0)');
            ctx.strokeStyle = grad;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.vx * 10, this.y - this.vy * 10);
            ctx.stroke();
            ctx.restore();
        }
    }

    // Define a heart particle that falls and rotates.
    class Heart {
        constructor(x, y) {
            // Start position is given by the comet.
            this.x = x;
            this.y = y;
            // Heart particle falls gradually with a slight drift.
            this.vx = rand(-1, 1);
            this.vy = rand(1, 3);
            this.rotation = rand(0, Math.PI * 2);
            this.rotationSpeed = rand(-0.1, 0.1);
            this.size = rand(10, 20);
            this.life = 100; // Frames to live
            this.opacity = 1;
            // Random color for flair.
            const r = Math.floor(rand(150, 255));
            const g = Math.floor(rand(50, 150));
            const b = Math.floor(rand(150, 255));
            this.color = `rgba(${r}, ${g}, ${b},`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            this.life--;
            this.opacity = this.life / 100;
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(this.size/25, this.size/25);
            ctx.beginPath();
            // Draw a heart shape using bezier curves.
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(0, -3, -5, -15, -25, -15);
            ctx.bezierCurveTo(-55, -15, -55, 22.5, -55, 22.5);
            ctx.bezierCurveTo(-55, 40, -35, 62, 0, 80);
            ctx.bezierCurveTo(35, 62, 55, 40, 55, 22.5);
            ctx.bezierCurveTo(55, 22.5, 55, -15, 25, -15);
            ctx.bezierCurveTo(10, -15, 0, -3, 0, 0);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
            ctx.restore();
        }
    }

    // Create decorative background SVG elements.
    function addSVGDecorations() {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.position = 'fixed';
        svg.style.top = 0;
        svg.style.left = 0;
        svg.style.zIndex = '0';
        svg.style.pointerEvents = 'none';
        svg.innerHTML = `
            <defs>
                <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:rgba(255,255,255,0.8);stop-opacity:1"/>
                    <stop offset="100%" style="stop-color:rgba(0,150,255,0.2);stop-opacity:0"/>
                </radialGradient>
            </defs>
            <!-- Star-like circles -->
            <circle cx="10%" cy="20%" r="50" fill="url(#grad1)" />
            <circle cx="80%" cy="30%" r="70" fill="url(#grad1)" />
            <circle cx="30%" cy="70%" r="40" fill="url(#grad1)" />
            <circle cx="90%" cy="80%" r="60" fill="url(#grad1)" />
            <!-- Decorative paths -->
            <path d="M0,100 Q50,150 100,100 T200,100" stroke="rgba(255, 255, 255, 0.2)" stroke-width="4" fill="none"/>
        `;
        document.body.insertBefore(svg, canvas);
    }

    addSVGDecorations();

    // Main animation loop.
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw comets.
        for (let i = comets.length - 1; i >= 0; i--) {
            const comet = comets[i];
            comet.update();
            comet.draw(ctx);
            // Remove comet if its lifespan is over or it goes out of view.
            if (comet.life <= 0 || comet.x > canvas.width + 50 || comet.y > canvas.height + 50) {
                comets.splice(i, 1);
            }
        }

        // Update and draw heart particles.
        for (let i = hearts.length - 1; i >= 0; i--) {
            const heart = hearts[i];
            heart.update();
            heart.draw(ctx);
            if (heart.life <= 0) {
                hearts.splice(i, 1);
            }
        }

        // Randomly add new comets.
        if (Math.random() < 0.02) { // adjust spawn rate here
            comets.push(new Comet());
        }

        requestAnimationFrame(animate);
    }

    animate();

})();