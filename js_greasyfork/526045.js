// ==UserScript==
// @name         Drawaria Magic Effects & Tools
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds magical particle effects, rainbow cursor trail, and useful drawing tools to drawaria.online!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/526045/Drawaria%20Magic%20Effects%20%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/526045/Drawaria%20Magic%20Effects%20%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const config = {
        particlesEnabled: true,
        rainbowTrailEnabled: true,
        magicButtonsEnabled: true,
        floatingHeartsEnabled: true
    };

    // Particle system
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = (Math.random() - 0.5) * 4;
            this.life = 1.0;
            this.decay = Math.random() * 0.02 + 0.01;
            this.size = Math.random() * 4 + 2;
            this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            this.size *= 0.98;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Create particle canvas
    function createParticleCanvas() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        return canvas;
    }

    // Rainbow cursor trail
    function createRainbowTrail() {
        const trailPoints = [];
        let hue = 0;

        document.addEventListener('mousemove', (e) => {
            if (!config.rainbowTrailEnabled) return;

            trailPoints.push({
                x: e.clientX,
                y: e.clientY,
                hue: hue,
                life: 20
            });

            hue = (hue + 5) % 360;

            if (trailPoints.length > 15) {
                trailPoints.shift();
            }
        });

        return trailPoints;
    }

    // Create magic control panel
    function createMagicPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 15px;
                padding: 15px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                color: white;
                font-family: 'Arial', sans-serif;
                z-index: 10000;
                min-width: 200px;
                backdrop-filter: blur(10px);
            ">
                <h3 style="margin: 0 0 15px 0; text-align: center;">✨ Magic Tools ✨</h3>
                <button id="toggleParticles" style="
                    width: 100%;
                    padding: 8px;
                    margin: 5px 0;
                    border: none;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s;
                ">🌟 Toggle Particles</button>
                <button id="toggleTrail" style="
                    width: 100%;
                    padding: 8px;
                    margin: 5px 0;
                    border: none;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s;
                ">🌈 Toggle Rainbow Trail</button>
                <button id="heartRain" style="
                    width: 100%;
                    padding: 8px;
                    margin: 5px 0;
                    border: none;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s;
                ">💖 Heart Rain</button>
                <button id="fireworks" style="
                    width: 100%;
                    padding: 8px;
                    margin: 5px 0;
                    border: none;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s;
                ">🎆 Fireworks</button>
            </div>
        `;
        document.body.appendChild(panel);
        return panel;
    }

    // Fireworks effect
    function createFireworks(x, y) {
        const particles = [];
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle(x, y));
        }
        return particles;
    }

    // Heart rain effect
    function createHeartRain() {
        const hearts = [];
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '💖';
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = '-50px';
            heart.style.fontSize = Math.random() * 20 + 20 + 'px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '9998';
            heart.style.transition = 'transform 3s linear';
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.style.transform = `translateY(${window.innerHeight + 100}px) rotate(360deg)`;
            }, i * 200);
            
            setTimeout(() => {
                heart.remove();
            }, 3500 + i * 200);
        }
    }

    // Initialize everything
    function init() {
        // Create particle system
        const canvas = createParticleCanvas();
        const ctx = canvas.getContext('2d');
        const particles = [];
        const trailPoints = createRainbowTrail();

        // Create control panel
        const panel = createMagicPanel();

        // Add event listeners
        document.getElementById('toggleParticles').onclick = () => {
            config.particlesEnabled = !config.particlesEnabled;
        };

        document.getElementById('toggleTrail').onclick = () => {
            config.rainbowTrailEnabled = !config.rainbowTrailEnabled;
        };

        document.getElementById('heartRain').onclick = createHeartRain;

        document.getElementById('fireworks').onclick = () => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            particles.push(...createFireworks(centerX, centerY));
        };

        // Mouse click particles
        document.addEventListener('click', (e) => {
            if (config.particlesEnabled) {
                particles.push(...createFireworks(e.clientX, e.clientY));
            }
        });

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            if (config.particlesEnabled) {
                for (let i = particles.length - 1; i >= 0; i--) {
                    particles[i].update();
                    particles[i].draw(ctx);
                    
                    if (particles[i].life <= 0) {
                        particles.splice(i, 1);
                    }
                }
            }

            // Draw rainbow trail
            if (config.rainbowTrailEnabled) {
                for (let i = 0; i < trailPoints.length; i++) {
                    const point = trailPoints[i];
                    ctx.save();
                    ctx.globalAlpha = point.life / 20;
                    ctx.fillStyle = `hsl(${point.hue}, 70%, 60%)`;
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, (point.life / 20) * 8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                    
                    point.life--;
                    if (point.life <= 0) {
                        trailPoints.splice(i, 1);
                        i--;
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        animate();

        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // Add welcome message
        setTimeout(() => {
            const welcomeMsg = document.createElement('div');
            welcomeMsg.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
                color: white;
                padding: 20px;
                border-radius: 15px;
                text-align: center;
                z-index: 10001;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: fadeInOut 4s ease-in-out forwards;
            `;
            welcomeMsg.innerHTML = `
                <h2>🎨 Magic Drawaria Tools Activated! 🎨</h2>
                <p>Click anywhere for fireworks! ✨</p>
                <p>Use the control panel to toggle effects! 🌈</p>
            `;

            // Add CSS animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(welcomeMsg);

            setTimeout(() => welcomeMsg.remove(), 4000);
        }, 1000);

        console.log('🎉 Drawaria Magic Effects loaded successfully!');
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
