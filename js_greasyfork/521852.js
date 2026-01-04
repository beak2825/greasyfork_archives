// ==UserScript==
// @name         Drawaria Liquid Bubble Canvas & Interactive Physics
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Advanced liquid physics simulation with interactive bubbles, fluid dynamics, and collaborative drawing effects for drawaria.online!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/521852/Drawaria%20Liquid%20Bubble%20Canvas%20%20Interactive%20Physics.user.js
// @updateURL https://update.greasyfork.org/scripts/521852/Drawaria%20Liquid%20Bubble%20Canvas%20%20Interactive%20Physics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Physics simulation state
    const physicsState = {
        bubbles: [],
        liquidDrops: [],
        gravityStrength: 0.1,
        viscosity: 0.99,
        tension: 0.1,
        interactionRadius: 80,
        maxBubbles: 50,
        liquidMode: true,
        magneticMode: false,
        antigravityMode: false,
        colorMixing: true,
        trailMode: false
    };

    // Advanced bubble with liquid physics
    class LiquidBubble {
        constructor(x, y, radius = null, color = null) {
            this.x = x || Math.random() * window.innerWidth;
            this.y = y || Math.random() * window.innerHeight;
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = (Math.random() - 0.5) * 4;
            this.radius = radius || Math.random() * 30 + 15;
            this.originalRadius = this.radius;
            this.mass = this.radius * 0.1;
            this.color = color || this.generateColor();
            this.alpha = Math.random() * 0.6 + 0.4;
            this.life = 1.0;
            this.age = 0;
            this.elasticity = 0.8;
            this.temperature = Math.random() * 100 + 50;
            this.magneticCharge = Math.random() > 0.5 ? 1 : -1;
            this.trailPoints = [];
            this.maxTrailLength = 20;
            this.connections = [];
            this.vibrationPhase = Math.random() * Math.PI * 2;
        }

        generateColor() {
            const colors = [
                'rgba(64, 224, 255, 0.7)',   // Deep sky blue
                'rgba(255, 105, 180, 0.7)',  // Hot pink
                'rgba(50, 255, 126, 0.7)',   // Spring green
                'rgba(255, 215, 0, 0.7)',    // Gold
                'rgba(138, 43, 226, 0.7)',   // Blue violet
                'rgba(255, 69, 0, 0.7)'      // Red orange
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update(bubbles, mouseX, mouseY) {
            this.age++;
            
            // Update trail
            if (physicsState.trailMode) {
                this.trailPoints.push({ x: this.x, y: this.y, alpha: 0.8 });
                if (this.trailPoints.length > this.maxTrailLength) {
                    this.trailPoints.shift();
                }
                // Fade trail points
                this.trailPoints.forEach((point, index) => {
                    point.alpha *= 0.95;
                });
            }

            // Mouse interaction
            if (mouseX !== undefined && mouseY !== undefined) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < physicsState.interactionRadius) {
                    const force = (physicsState.interactionRadius - distance) / physicsState.interactionRadius;
                    const angle = Math.atan2(dy, dx);
                    
                    if (physicsState.magneticMode) {
                        // Magnetic attraction/repulsion
                        const magneticForce = force * this.magneticCharge * 2;
                        this.vx += Math.cos(angle) * magneticForce;
                        this.vy += Math.sin(angle) * magneticForce;
                    } else {
                        // Normal repulsion
                        this.vx += Math.cos(angle) * force * 3;
                        this.vy += Math.sin(angle) * force * 3;
                    }
                    
                    // Change temperature based on interaction
                    this.temperature += force * 10;
                    this.radius = this.originalRadius + Math.sin(this.age * 0.1) * 5;
                }
            }

            // Gravity or anti-gravity
            if (physicsState.antigravityMode) {
                this.vy -= physicsState.gravityStrength;
            } else {
                this.vy += physicsState.gravityStrength;
            }

            // Bubble-to-bubble interactions
            this.connections = [];
            bubbles.forEach(other => {
                if (other !== this) {
                    const dx = other.x - this.x;
                    const dy = other.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDistance = this.radius + other.radius;
                    
                    if (distance < minDistance + 30) {
                        // Surface tension effect
                        const overlap = minDistance - distance;
                        if (overlap > 0) {
                            const force = overlap * physicsState.tension;
                            const angle = Math.atan2(dy, dx);
                            
                            this.vx -= Math.cos(angle) * force * 0.5;
                            this.vy -= Math.sin(angle) * force * 0.5;
                            
                            // Color mixing on collision
                            if (physicsState.colorMixing && overlap > 10) {
                                this.mixColors(other);
                            }
                        }
                        
                        // Create connection for visual effect
                        if (distance < minDistance + 50) {
                            this.connections.push({
                                bubble: other,
                                distance: distance,
                                strength: 1 - (distance / (minDistance + 50))
                            });
                        }
                    }
                }
            });

            // Apply viscosity (liquid resistance)
            this.vx *= physicsState.viscosity;
            this.vy *= physicsState.viscosity;

            // Update position
            this.x += this.vx;
            this.y += this.vy;

            // Temperature cooling
            this.temperature *= 0.995;
            
            // Size pulsation based on temperature
            const tempFactor = (this.temperature - 50) / 100;
            this.radius = this.originalRadius + tempFactor * 10 + Math.sin(this.vibrationPhase + this.age * 0.1) * 2;
            this.vibrationPhase += 0.1;

            // Wall collision with liquid deformation
            if (this.x - this.radius < 0 || this.x + this.radius > window.innerWidth) {
                this.vx *= -this.elasticity;
                this.x = Math.max(this.radius, Math.min(window.innerWidth - this.radius, this.x));
                this.deform();
            }
            
            if (this.y - this.radius < 0 || this.y + this.radius > window.innerHeight) {
                this.vy *= -this.elasticity;
                this.y = Math.max(this.radius, Math.min(window.innerHeight - this.radius, this.y));
                this.deform();
            }

            // Life decay
            if (this.age > 2000) {
                this.life *= 0.999;
            }

            return this.life > 0.1;
        }

        mixColors(other) {
            // Simple color mixing algorithm
            const thisColor = this.parseColor(this.color);
            const otherColor = other.parseColor(other.color);
            
            if (thisColor && otherColor) {
                const newR = Math.floor((thisColor.r + otherColor.r) / 2);
                const newG = Math.floor((thisColor.g + otherColor.g) / 2);
                const newB = Math.floor((thisColor.b + otherColor.b) / 2);
                
                this.color = `rgba(${newR}, ${newG}, ${newB}, 0.7)`;
            }
        }

        parseColor(color) {
            const match = color.match(/rgba?$$(\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
                return {
                    r: parseInt(match[1]),
                    g: parseInt(match[2]),
                    b: parseInt(match[3])
                };
            }
            return null;
        }

        deform() {
            // Temporary deformation effect
            this.radius *= 1.2;
            setTimeout(() => {
                this.radius = this.originalRadius;
            }, 100);
        }

        draw(ctx) {
            ctx.save();
            
            // Draw trail
            if (physicsState.trailMode && this.trailPoints.length > 1) {
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.moveTo(this.trailPoints.x, this.trailPoints.y);
                for (let i = 1; i < this.trailPoints.length; i++) {
                    ctx.lineTo(this.trailPoints[i].x, this.trailPoints[i].y);
                }
                ctx.stroke();
            }

            // Draw connections
            this.connections.forEach(conn => {
                ctx.globalAlpha = conn.strength * 0.3;
                ctx.strokeStyle = this.color;
                ctx.lineWidth = conn.strength * 3;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(conn.bubble.x, conn.bubble.y);
                ctx.stroke();
            });

            // Main bubble
            ctx.globalAlpha = this.alpha * this.life;
            
            // Gradient fill for liquid effect
            const gradient = ctx.createRadialGradient(
                this.x - this.radius * 0.3, this.y - this.radius * 0.3, 0,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, this.color.replace('0.7', '0.9'));
            gradient.addColorStop(0.7, this.color);
            gradient.addColorStop(1, this.color.replace('0.7', '0.3'));
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();

            // Highlight for 3D effect
            ctx.globalAlpha = this.alpha * this.life * 0.6;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
            ctx.fill();

            // Temperature indicator
            if (this.temperature > 80) {
                ctx.globalAlpha = (this.temperature - 80) / 100;
                ctx.strokeStyle = '#ff4444';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.restore();
        }
    }

    // Liquid drop class for additional effects
    class LiquidDrop {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 6;
            this.vy = Math.random() * -8 - 2;
            this.size = Math.random() * 8 + 4;
            this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
            this.life = 1.0;
            this.gravity = 0.3;
        }

        update() {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.life -= 0.02;
            this.size *= 0.98;

            return this.y < window.innerHeight && this.life > 0;
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

    // Control panel creation
    function createPhysicsPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div id="physics-panel" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                padding: 25px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                color: white;
                font-family: 'Segoe UI', sans-serif;
                z-index: 10000;
                min-width: 320px;
                max-height: 80vh;
                overflow-y: auto;
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255,255,255,0.2);
            ">
                <h2 style="margin: 0 0 25px 0; text-align: center;">🫧 Liquid Physics Lab</h2>
                
                <!-- Physics Controls -->
                <div class="physics-section" style="
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                ">
                    <h3 style="margin: 0 0 15px 0; color: #e0e6ff; font-size: 14px;">⚡ PHYSICS ENGINE</h3>
                    
                    <div style="margin: 10px 0;">
                        <label>Gravity: <span id="gravity-display">0.1</span></label>
                        <input type="range" id="gravity-strength" min="0" max="0.5" step="0.01" value="0.1" style="width: 100%;">
                    </div>
                    
                    <div style="margin: 10px 0;">
                        <label>Viscosity: <span id="viscosity-display">0.99</span></label>
                        <input type="range" id="viscosity" min="0.9" max="1" step="0.001" value="0.99" style="width: 100%;">
                    </div>
                    
                    <div style="margin: 10px 0;">
                        <label>Surface Tension: <span id="tension-display">0.1</span></label>
                        <input type="range" id="surface-tension" min="0" max="0.5" step="0.01" value="0.1" style="width: 100%;">
                    </div>
                    
                    <div style="margin: 10px 0;">
                        <label>Interaction Radius: <span id="radius-display">80</span></label>
                        <input type="range" id="interaction-radius" min="30" max="150" value="80" style="width: 100%;">
                    </div>
                </div>

                <!-- Bubble Controls -->
                <div class="physics-section" style="
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                ">
                    <h3 style="margin: 0 0 15px 0; color: #e0e6ff; font-size: 14px;">🫧 BUBBLE SYSTEM</h3>
                    
                    <div style="margin: 10px 0;">
                        <label>Max Bubbles: <span id="bubbles-display">50</span></label>
                        <input type="range" id="max-bubbles" min="10" max="100" value="50" style="width: 100%;">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 15px 0;">
                        <button id="add-bubble" style="padding: 8px; font-size: 12px;">➕ Add Bubble</button>
                        <button id="clear-bubbles" style="padding: 8px; font-size: 12px;">🗑️ Clear All</button>
                        <button id="bubble-explosion" style="padding: 8px; font-size: 12px;">💥 Explosion</button>
                        <button id="rainbow-mode" style="padding: 8px; font-size: 12px;">🌈 Rainbow</button>
                    </div>
                </div>

                <!-- Special Modes -->
                <div class="physics-section" style="
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                ">
                    <h3 style="margin: 0 0 15px 0; color: #e0e6ff; font-size: 14px;">🔬 SPECIAL MODES</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                        <button id="magnetic-mode" style="padding: 10px;">🧲 Magnetic Field</button>
                        <button id="antigravity-mode" style="padding: 10px;">🚀 Anti-Gravity</button>
                        <button id="color-mixing" style="padding: 10px;">🎨 Color Mixing</button>
                        <button id="trail-mode" style="padding: 10px;">✨ Particle Trails</button>
                    </div>
                </div>

                <!-- Environmental Presets -->
                <div class="physics-section" style="
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 12px;
                ">
                    <h3 style="margin: 0 0 15px 0; color: #e0e6ff; font-size: 14px;">🌍 ENVIRONMENTS</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <button class="env-preset" data-env="water">🌊 Water</button>
                        <button class="env-preset" data-env="space">🌌 Space</button>
                        <button class="env-preset" data-env="lava">🌋 Lava</button>
                        <button class="env-preset" data-env="ice">🧊 Ice</button>
                    </div>
                </div>

                <!-- Real-time Stats -->
                <div style="
                    background: rgba(0,0,0,0.2);
                    padding: 10px;
                    border-radius: 8px;
                    margin-top: 20px;
                    font-size: 12px;
                ">
                    <div>Active Bubbles: <span id="bubble-count">0</span></div>
                    <div>Liquid Drops: <span id="drops-count">0</span></div>
                    <div>Total Interactions: <span id="interactions-count">0</span></div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #physics-panel button {
                background: rgba(255, 255, 255, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            #physics-panel button:hover {
                background: rgba(255, 255, 255, 0.25);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            #physics-panel button.active {
                background: rgba(46, 213, 115, 0.4);
                border-color: #2ed573;
            }
            .env-preset {
                padding: 8px 4px !important;
                font-size: 11px !important;
            }
            #physics-panel input[type="range"] {
                background: rgba(255, 255, 255, 0.2);
                height: 6px;
                border-radius: 3px;
                margin: 5px 0;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(panel);
        return panel;
    }

    // Main physics engine
    class LiquidPhysicsEngine {
        constructor() {
            this.canvas = this.createCanvas();
            this.ctx = this.canvas.getContext('2d');
            this.mouseX = 0;
            this.mouseY = 0;
            this.isMousePressed = false;
            this.lastBubbleSpawn = 0;
            this.interactionCount = 0;
            
            this.setupEventListeners();
            this.initializeBubbles();
            this.animate();
        }

        createCanvas() {
            const canvas = document.createElement('canvas');
            canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
                z-index: 9999;
                background: transparent;
            `;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            document.body.appendChild(canvas);
            return canvas;
        }

        setupEventListeners() {
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });

            document.addEventListener('mousedown', () => {
                this.isMousePressed = true;
            });

            document.addEventListener('mouseup', () => {
                this.isMousePressed = false;
            });

            document.addEventListener('click', (e) => {
                // Spawn liquid drops on click
                for (let i = 0; i < 8; i++) {
                    physicsState.liquidDrops.push(new LiquidDrop(e.clientX, e.clientY));
                }
            });

            window.addEventListener('resize', () => {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            });
        }

        initializeBubbles() {
            physicsState.bubbles = [];
            for (let i = 0; i < 20; i++) {
                physicsState.bubbles.push(new LiquidBubble());
            }
        }

        spawnBubble(x, y, radius, color) {
            if (physicsState.bubbles.length < physicsState.maxBubbles) {
                physicsState.bubbles.push(new LiquidBubble(x, y, radius, color));
            }
        }

        createExplosion(x, y) {
            for (let i = 0; i < 15; i++) {
                const angle = (i / 15) * Math.PI * 2;
                const radius = Math.random() * 20 + 10;
                const bubbleX = x + Math.cos(angle) * (Math.random() * 100 + 50);
                const bubbleY = y + Math.sin(angle) * (Math.random() * 100 + 50);
                this.spawnBubble(bubbleX, bubbleY, radius);
            }
        }

        applyEnvironment(env) {
            switch(env) {
                case 'water':
                    physicsState.gravityStrength = 0.05;
                    physicsState.viscosity = 0.98;
                    physicsState.tension = 0.2;
                    break;
                case 'space':
                    physicsState.gravityStrength = 0;
                    physicsState.viscosity = 1;
                    physicsState.tension = 0.05;
                    break;
                case 'lava':
                    physicsState.gravityStrength = 0.15;
                    physicsState.viscosity = 0.95;
                    physicsState.tension = 0.3;
                    break;
                case 'ice':
                    physicsState.gravityStrength = 0.2;
                    physicsState.viscosity = 0.99;
                    physicsState.tension = 0.1;
                    break;
            }
            this.updateUIValues();
        }

        updateUIValues() {
            document.getElementById('gravity-display').textContent = physicsState.gravityStrength;
            document.getElementById('viscosity-display').textContent = physicsState.viscosity;
            document.getElementById('tension-display').textContent = physicsState.tension;
            document.getElementById('gravity-strength').value = physicsState.gravityStrength;
            document.getElementById('viscosity').value = physicsState.viscosity;
            document.getElementById('surface-tension').value = physicsState.tension;
        }

        updateStats() {
            document.getElementById('bubble-count').textContent = physicsState.bubbles.length;
            document.getElementById('drops-count').textContent = physicsState.liquidDrops.length;
            document.getElementById('interactions-count').textContent = this.interactionCount;
        }

        animate() {
            // Clear canvas with fade effect
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Update and count interactions
            this.interactionCount = 0;

            // Update bubbles
            physicsState.bubbles = physicsState.bubbles.filter(bubble => {
                const alive = bubble.update(physicsState.bubbles, this.mouseX, this.mouseY);
                if (alive) {
                    bubble.draw(this.ctx);
                    this.interactionCount += bubble.connections.length;
                }
                return alive;
            });

            // Update liquid drops
            physicsState.liquidDrops = physicsState.liquidDrops.filter(drop => {
                const alive = drop.update();
                if (alive) drop.draw(this.ctx);
                return alive;
            });

            // Spawn bubbles during mouse press
            if (this.isMousePressed && Date.now() - this.lastBubbleSpawn > 200) {
                this.spawnBubble(this.mouseX, this.mouseY, Math.random() * 25 + 15);
                this.lastBubbleSpawn = Date.now();
            }

            // Update stats
            this.updateStats();

            requestAnimationFrame(() => this.animate());
        }
    }

    // Initialize the system
    function init() {
        const panel = createPhysicsPanel();
        const engine = new LiquidPhysicsEngine();

        // Physics control event listeners
        document.getElementById('gravity-strength').oninput = (e) => {
            physicsState.gravityStrength = parseFloat(e.target.value);
            document.getElementById('gravity-display').textContent = e.target.value;
        };

        document.getElementById('viscosity').oninput = (e) => {
            physicsState.viscosity = parseFloat(e.target.value);
            document.getElementById('viscosity-display').textContent = e.target.value;
        };

        document.getElementById('surface-tension').oninput = (e) => {
            physicsState.tension = parseFloat(e.target.value);
            document.getElementById('tension-display').textContent = e.target.value;
        };

        document.getElementById('interaction-radius').oninput = (e) => {
            physicsState.interactionRadius = parseInt(e.target.value);
            document.getElementById('radius-display').textContent = e.target.value;
        };

        document.getElementById('max-bubbles').oninput = (e) => {
            physicsState.maxBubbles = parseInt(e.target.value);
            document.getElementById('bubbles-display').textContent = e.target.value;
        };

        // Bubble controls
        document.getElementById('add-bubble').onclick = () => {
            engine.spawnBubble(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
        };

        document.getElementById('clear-bubbles').onclick = () => {
            physicsState.bubbles = [];
            physicsState.liquidDrops = [];
        };

        document.getElementById('bubble-explosion').onclick = () => {
            engine.createExplosion(window.innerWidth / 2, window.innerHeight / 2);
        };

        document.getElementById('rainbow-mode').onclick = () => {
            physicsState.bubbles.forEach(bubble => {
                bubble.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
            });
        };

        // Special modes
        const toggleMode = (buttonId, stateKey) => {
            const button = document.getElementById(buttonId);
            button.onclick = () => {
                physicsState[stateKey] = !physicsState[stateKey];
                button.classList.toggle('active', physicsState[stateKey]);
            };
        };

        toggleMode('magnetic-mode', 'magneticMode');
        toggleMode('antigravity-mode', 'antigravityMode');
        toggleMode('color-mixing', 'colorMixing');
        toggleMode('trail-mode', 'trailMode');

        // Environment presets
        document.querySelectorAll('.env-preset').forEach(button => {
            button.onclick = () => {
                engine.applyEnvironment(button.dataset.env);
                document.querySelectorAll('.env-preset').forEach(b => b.classList.remove('active'));
                button.classList.add('active');
            };
        });

        // Welcome message
        setTimeout(() => {
            const welcome = document.createElement('div');
            welcome.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    padding: 30px;
                    border-radius: 20px;
                    text-align: center;
                    z-index: 10001;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.4);
                    animation: liquidWelcome 6s ease-in-out forwards;
                ">
                    <h2>🫧 Liquid Physics Lab Activated! 🫧</h2>
                    <p>🖱️ Click and drag to create bubbles!</p>
                    <p>🧲 Try magnetic mode for crazy interactions!</p>
                    <p>🌊 Experiment with different environments!</p>
                    <p>💥 Create bubble explosions and watch them mix!</p>
                </div>
            `;

            const welcomeStyle = document.createElement('style');
            welcomeStyle.textContent = `
                @keyframes liquidWelcome {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.3) rotate(10deg); }
                    15% { opacity: 1; transform: translate(-50%, -50%) scale(1.05) rotate(-2deg); }
                    25% { transform: translate(-50%, -50%) scale(0.95) rotate(1deg); }
                    35% { transform: translate(-50%, -50%) scale(1.02) rotate(-0.5deg); }
                    45% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.7) rotate(5deg); }
                }
            `;
            document.head.appendChild(welcomeStyle);
            document.body.appendChild(welcome);

            setTimeout(() => welcome.remove(), 6000);
        }, 2000);

        console.log('🫧 Liquid Physics Lab initialized!');
    }

    // Start the liquid physics system
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
