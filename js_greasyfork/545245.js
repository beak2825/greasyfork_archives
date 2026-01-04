// ==UserScript==
// @name         Drawaria Generative Art & Particle Reactor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Real-time generative art system with particle reactions, procedural patterns, and interactive visual effects for drawaria.online!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/545245/Drawaria%20Generative%20Art%20%20Particle%20Reactor.user.js
// @updateURL https://update.greasyfork.org/scripts/545245/Drawaria%20Generative%20Art%20%20Particle%20Reactor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Generative art system state
    const artState = {
        mode: 'reactive',
        generationSpeed: 50,
        particleCount: 1000,
        colorPalette: 'rainbow',
        pattern: 'fibonacci',
        reactToDrawing: true,
        autoGenerate: false,
        brushReaction: true,
        geometryMode: 'organic',
        flowField: {
            enabled: false,
            strength: 1,
            scale: 0.01
        }
    };

    // Particle class for reactive effects
    class ReactiveParticle {
        constructor(x, y, sourceData = null) {
            this.x = x || Math.random() * window.innerWidth;
            this.y = y || Math.random() * window.innerHeight;
            this.originalX = this.x;
            this.originalY = this.y;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.size = Math.random() * 4 + 1;
            this.life = 1.0;
            this.decay = Math.random() * 0.01 + 0.005;
            this.hue = Math.random() * 360;
            this.brightness = Math.random() * 50 + 50;
            this.reactRadius = Math.random() * 100 + 50;
            this.sourceData = sourceData;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 2 + 0.5;
        }

        update(mouseX, mouseY, flowField) {
            // Flow field influence
            if (artState.flowField.enabled && flowField) {
                const fieldX = Math.floor(this.x * artState.flowField.scale);
                const fieldY = Math.floor(this.y * artState.flowField.scale);
                const index = (fieldX + fieldY * Math.floor(window.innerWidth * artState.flowField.scale)) % flowField.length;
                
                if (flowField[index]) {
                    this.vx += Math.cos(flowField[index]) * artState.flowField.strength * 0.1;
                    this.vy += Math.sin(flowField[index]) * artState.flowField.strength * 0.1;
                }
            }

            // Mouse reaction
            if (artState.brushReaction && mouseX !== undefined && mouseY !== undefined) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.reactRadius) {
                    const force = (this.reactRadius - distance) / this.reactRadius;
                    this.vx += (dx / distance) * force * 0.5;
                    this.vy += (dy / distance) * force * 0.5;
                    this.hue = (this.hue + 2) % 360;
                    this.size = Math.min(this.size * 1.1, 8);
                }
            }

            // Update position
            this.x += this.vx;
            this.y += this.vy;

            // Apply friction
            this.vx *= 0.98;
            this.vy *= 0.98;

            // Boundary behavior
            if (this.x < 0 || this.x > window.innerWidth) this.vx *= -0.8;
            if (this.y < 0 || this.y > window.innerHeight) this.vy *= -0.8;
            
            this.x = Math.max(0, Math.min(window.innerWidth, this.x));
            this.y = Math.max(0, Math.min(window.innerHeight, this.y));

            // Life decay
            this.life -= this.decay;
            this.size *= 0.999;

            return this.life > 0 && this.size > 0.1;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.life;
            
            const color = this.getColor();
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            
            ctx.beginPath();
            
            if (artState.geometryMode === 'organic') {
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (artState.geometryMode === 'geometric') {
                const sides = 6;
                const radius = this.size;
                ctx.beginPath();
                for (let i = 0; i < sides; i++) {
                    const angle = (i / sides) * Math.PI * 2;
                    const x = this.x + Math.cos(angle) * radius;
                    const y = this.y + Math.sin(angle) * radius;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
            } else if (artState.geometryMode === 'lines') {
                ctx.lineWidth = this.size * 0.5;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + this.vx * 10, this.y + this.vy * 10);
                ctx.stroke();
            }
            
            ctx.restore();
        }

        getColor() {
            switch(artState.colorPalette) {
                case 'rainbow':
                    return `hsl(${this.hue}, 70%, ${this.brightness}%)`;
                case 'fire':
                    const fireHue = Math.max(0, Math.min(60, this.hue % 60));
                    return `hsl(${fireHue}, 90%, ${this.brightness}%)`;
                case 'ocean':
                    const oceanHue = 180 + (this.hue % 120);
                    return `hsl(${oceanHue}, 80%, ${this.brightness}%)`;
                case 'sunset':
                    const sunsetHue = 300 + (this.hue % 120);
                    return `hsl(${sunsetHue}, 85%, ${this.brightness}%)`;
                case 'monochrome':
                    return `hsl(0, 0%, ${this.brightness}%)`;
                default:
                    return `hsl(${this.hue}, 70%, ${this.brightness}%)`;
            }
        }
    }

    // Generative pattern generators
    class PatternGenerator {
        static fibonacci(ctx, centerX, centerY, time) {
            const goldenAngle = Math.PI * (3 - Math.sqrt(5));
            const numPoints = 200;
            
            for (let i = 0; i < numPoints; i++) {
                const angle = i * goldenAngle + time * 0.001;
                const radius = Math.sqrt(i) * 3;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                const hue = (i * 137.5 + time * 0.1) % 360;
                const size = Math.sin(i * 0.1 + time * 0.01) * 2 + 3;
                
                ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        static mandala(ctx, centerX, centerY, time) {
            const layers = 8;
            const petals = 16;
            
            for (let layer = 1; layer <= layers; layer++) {
                const radius = layer * 20 + Math.sin(time * 0.001) * 10;
                
                for (let petal = 0; petal < petals; petal++) {
                    const angle = (petal / petals) * Math.PI * 2 + time * 0.0005 * layer;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    
                    const hue = (layer * 45 + petal * 22.5 + time * 0.05) % 360;
                    const alpha = 0.7 - (layer * 0.08);
                    
                    ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(x, y, 8 - layer, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        static voronoi(ctx, width, height, time) {
            const sites = [];
            const numSites = 12;
            
            for (let i = 0; i < numSites; i++) {
                const angle = (i / numSites) * Math.PI * 2 + time * 0.0003;
                const radius = Math.sin(time * 0.0002 + i) * 100 + 200;
                sites.push({
                    x: width/2 + Math.cos(angle) * radius,
                    y: height/2 + Math.sin(angle) * radius,
                    hue: (i * 30 + time * 0.02) % 360
                });
            }
            
            const imageData = ctx.createImageData(width/4, height/4);
            const data = imageData.data;
            
            for (let y = 0; y < height/4; y++) {
                for (let x = 0; x < width/4; x++) {
                    let minDist = Infinity;
                    let closestSite = sites;
                    
                    for (const site of sites) {
                        const dist = Math.sqrt((x*4 - site.x)**2 + (y*4 - site.y)**2);
                        if (dist < minDist) {
                            minDist = dist;
                            closestSite = site;
                        }
                    }
                    
                    const index = (y * width/4 + x) * 4;
                    const rgb = PatternGenerator.hslToRgb(closestSite.hue, 70, 60);
                    data[index] = rgb;
                    data[index + 1] = rgb[1];
                    data[index + 2] = rgb[2];
                    data[index + 3] = 150;
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
        }

        static hslToRgb(h, s, l) {
            h /= 360; s /= 100; l /= 100;
            const a = s * Math.min(l, 1 - l);
            const f = n => {
                const k = (n + h * 12) % 12;
                return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            };
            return [Math.floor(f(0) * 255), Math.floor(f(8) * 255), Math.floor(f(4) * 255)];
        }
    }

    // Create control panel
    function createGenerativePanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div id="generative-panel" style="
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                padding: 25px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                color: white;
                font-family: 'Segoe UI', sans-serif;
                z-index: 10000;
                min-width: 600px;
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255,255,255,0.2);
            ">
                <h2 style="margin: 0 0 25px 0; text-align: center; color: #ffffff;">🎨 Generative Art Studio</h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                    <!-- Art Generation -->
                    <div class="control-section">
                        <h3 style="color: #e0e6ff; margin: 0 0 15px 0; font-size: 14px;">🌀 GENERATION</h3>
                        <div style="margin: 10px 0;">
                            <label>Pattern:</label>
                            <select id="pattern-type" style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 5px;">
                                <option value="fibonacci">🌻 Fibonacci</option>
                                <option value="mandala">🕉️ Mandala</option>
                                <option value="voronoi">🔷 Voronoi</option>
                                <option value="particles">✨ Particles</option>
                            </select>
                        </div>
                        <div style="margin: 10px 0;">
                            <label>Speed: <span id="speed-display">50</span></label>
                            <input type="range" id="generation-speed" min="1" max="100" value="50" style="width: 100%;">
                        </div>
                        <button id="auto-generate" style="width: 100%; padding: 8px; margin: 5px 0;">🔄 Auto Generate</button>
                    </div>

                    <!-- Particle System -->
                    <div class="control-section">
                        <h3 style="color: #e0e6ff; margin: 0 0 15px 0; font-size: 14px;">⚛️ PARTICLES</h3>
                        <div style="margin: 10px 0;">
                            <label>Count: <span id="particle-count-display">1000</span></label>
                            <input type="range" id="particle-count" min="100" max="3000" value="1000" style="width: 100%;">
                        </div>
                        <div style="margin: 10px 0;">
                            <label>Geometry:</label>
                            <select id="geometry-mode" style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 5px;">
                                <option value="organic">⭕ Organic</option>
                                <option value="geometric">🔶 Geometric</option>
                                <option value="lines">📏 Lines</option>
                            </select>
                        </div>
                        <button id="brush-reaction" style="width: 100%; padding: 8px; margin: 5px 0;">🖌️ Brush Reaction</button>
                    </div>

                    <!-- Visual Effects -->
                    <div class="control-section">
                        <h3 style="color: #e0e6ff; margin: 0 0 15px 0; font-size: 14px;">🎭 EFFECTS</h3>
                        <div style="margin: 10px 0;">
                            <label>Color Palette:</label>
                            <select id="color-palette" style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 5px;">
                                <option value="rainbow">🌈 Rainbow</option>
                                <option value="fire">🔥 Fire</option>
                                <option value="ocean">🌊 Ocean</option>
                                <option value="sunset">🌅 Sunset</option>
                                <option value="monochrome">⚫ Mono</option>
                            </select>
                        </div>
                        <button id="flow-field" style="width: 100%; padding: 8px; margin: 5px 0;">🌊 Flow Field</button>
                        <button id="clear-canvas" style="width: 100%; padding: 8px; margin: 5px 0;">🗑️ Clear</button>
                    </div>
                </div>

                <!-- Quick Presets -->
                <div style="margin-top: 20px;">
                    <h3 style="color: #e0e6ff; margin: 0 0 15px 0; font-size: 14px; text-align: center;">⚡ QUICK PRESETS</h3>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                        <button class="art-preset" data-preset="psychedelic">🌀 Psychedelic</button>
                        <button class="art-preset" data-preset="zen">☯️ Zen Garden</button>
                        <button class="art-preset" data-preset="cosmic">🌌 Cosmic</button>
                        <button class="art-preset" data-preset="organic">🌿 Organic</button>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #generative-panel button, #generative-panel select {
                background: rgba(255, 255, 255, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            #generative-panel button:hover {
                background: rgba(255, 255, 255, 0.25);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            .art-preset {
                padding: 8px 4px !important;
                font-size: 12px !important;
            }
            #generative-panel input[type="range"] {
                background: rgba(255, 255, 255, 0.2);
                height: 6px;
                border-radius: 3px;
            }
            .control-section {
                background: rgba(255, 255, 255, 0.1);
                padding: 15px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(panel);
        return panel;
    }

    // Main generative art engine
    class GenerativeEngine {
        constructor() {
            this.canvas = this.createCanvas();
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.flowField = [];
            this.mouseX = 0;
            this.mouseY = 0;
            this.startTime = Date.now();
            this.backgroundCanvas = this.createBackgroundCanvas();
            this.backgroundCtx = this.backgroundCanvas.getContext('2d');
            
            this.setupEventListeners();
            this.generateFlowField();
            this.initializeParticles();
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
                z-index: 9997;
                mix-blend-mode: screen;
            `;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            document.body.appendChild(canvas);
            return canvas;
        }

        createBackgroundCanvas() {
            const canvas = document.createElement('canvas');
            canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
                z-index: 9996;
                opacity: 0.7;
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

            window.addEventListener('resize', () => {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                this.backgroundCanvas.width = window.innerWidth;
                this.backgroundCanvas.height = window.innerHeight;
                this.generateFlowField();
            });
        }

        generateFlowField() {
            const cols = Math.floor(window.innerWidth * artState.flowField.scale);
            const rows = Math.floor(window.innerHeight * artState.flowField.scale);
            
            this.flowField = [];
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const angle = Math.cos(x * 0.1) + Math.sin(y * 0.1);
                    this.flowField.push(angle);
                }
            }
        }

        initializeParticles() {
            this.particles = [];
            for (let i = 0; i < artState.particleCount; i++) {
                this.particles.push(new ReactiveParticle());
            }
        }

        spawnParticlesAroundMouse() {
            if (artState.brushReaction) {
                for (let i = 0; i < 5; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 50;
                    const x = this.mouseX + Math.cos(angle) * distance;
                    const y = this.mouseY + Math.sin(angle) * distance;
                    this.particles.push(new ReactiveParticle(x, y));
                }
                
                // Remove excess particles
                if (this.particles.length > artState.particleCount * 2) {
                    this.particles.splice(0, this.particles.length - artState.particleCount);
                }
            }
        }

        updateParticles() {
            const flowField = artState.flowField.enabled ? this.flowField : null;
            
            this.particles = this.particles.filter(particle => 
                particle.update(this.mouseX, this.mouseY, flowField)
            );

            // Maintain minimum particle count
            while (this.particles.length < artState.particleCount) {
                this.particles.push(new ReactiveParticle());
            }
        }

        drawGenerativePattern() {
            if (!artState.autoGenerate) return;

            const time = Date.now() - this.startTime;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            this.backgroundCtx.globalAlpha = 0.05;
            this.backgroundCtx.fillStyle = '#000000';
            this.backgroundCtx.fillRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
            this.backgroundCtx.globalAlpha = 1;

            switch(artState.pattern) {
                case 'fibonacci':
                    PatternGenerator.fibonacci(this.backgroundCtx, centerX, centerY, time);
                    break;
                case 'mandala':
                    PatternGenerator.mandala(this.backgroundCtx, centerX, centerY, time);
                    break;
                case 'voronoi':
                    PatternGenerator.voronoi(this.backgroundCtx, this.backgroundCanvas.width, this.backgroundCanvas.height, time);
                    break;
            }
        }

        animate() {
            // Clear main canvas
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Generate background patterns
            this.drawGenerativePattern();

            // Update and draw particles
            this.updateParticles();
            this.particles.forEach(particle => particle.draw(this.ctx));

            // Spawn particles on mouse movement
            if (Math.random() < 0.3) {
                this.spawnParticlesAroundMouse();
            }

            requestAnimationFrame(() => this.animate());
        }

        clearAll() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.backgroundCtx.clearRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
            this.particles = [];
        }

        applyPreset(presetName) {
            switch(presetName) {
                case 'psychedelic':
                    artState.pattern = 'mandala';
                    artState.colorPalette = 'rainbow';
                    artState.geometryMode = 'organic';
                    artState.flowField.enabled = true;
                    artState.autoGenerate = true;
                    break;
                case 'zen':
                    artState.pattern = 'fibonacci';
                    artState.colorPalette = 'monochrome';
                    artState.geometryMode = 'lines';
                    artState.flowField.enabled = false;
                    artState.autoGenerate = true;
                    break;
                case 'cosmic':
                    artState.pattern = 'voronoi';
                    artState.colorPalette = 'sunset';
                    artState.geometryMode = 'geometric';
                    artState.flowField.enabled = true;
                    artState.autoGenerate = true;
                    break;
                case 'organic':
                    artState.pattern = 'particles';
                    artState.colorPalette = 'ocean';
                    artState.geometryMode = 'organic';
                    artState.flowField.enabled = true;
                    artState.autoGenerate = false;
                    break;
            }
            this.updateUI();
        }

        updateUI() {
            document.getElementById('pattern-type').value = artState.pattern;
            document.getElementById('color-palette').value = artState.colorPalette;
            document.getElementById('geometry-mode').value = artState.geometryMode;
        }
    }

    // Initialize the system
    function init() {
        const panel = createGenerativePanel();
        const engine = new GenerativeEngine();

        // Event listeners
        document.getElementById('pattern-type').onchange = (e) => {
            artState.pattern = e.target.value;
        };

        document.getElementById('generation-speed').oninput = (e) => {
            artState.generationSpeed = parseInt(e.target.value);
            document.getElementById('speed-display').textContent = e.target.value;
        };

        document.getElementById('particle-count').oninput = (e) => {
            artState.particleCount = parseInt(e.target.value);
            document.getElementById('particle-count-display').textContent = e.target.value;
        };

        document.getElementById('color-palette').onchange = (e) => {
            artState.colorPalette = e.target.value;
        };

        document.getElementById('geometry-mode').onchange = (e) => {
            artState.geometryMode = e.target.value;
        };

        document.getElementById('auto-generate').onclick = () => {
            artState.autoGenerate = !artState.autoGenerate;
            document.getElementById('auto-generate').style.background = 
                artState.autoGenerate ? 'rgba(46, 213, 115, 0.3)' : 'rgba(255, 255, 255, 0.15)';
        };

        document.getElementById('brush-reaction').onclick = () => {
            artState.brushReaction = !artState.brushReaction;
            document.getElementById('brush-reaction').style.background = 
                artState.brushReaction ? 'rgba(46, 213, 115, 0.3)' : 'rgba(255, 255, 255, 0.15)';
        };

        document.getElementById('flow-field').onclick = () => {
            artState.flowField.enabled = !artState.flowField.enabled;
            document.getElementById('flow-field').style.background = 
                artState.flowField.enabled ? 'rgba(46, 213, 115, 0.3)' : 'rgba(255, 255, 255, 0.15)';
            engine.generateFlowField();
        };

        document.getElementById('clear-canvas').onclick = () => {
            engine.clearAll();
        };

        // Preset buttons
        document.querySelectorAll('.art-preset').forEach(btn => {
            btn.onclick = () => {
                engine.applyPreset(btn.dataset.preset);
            };
        });

        // Welcome animation
        setTimeout(() => {
            const welcome = document.createElement('div');
            welcome.innerHTML = `
                <div style="
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    color: white;
                    padding: 20px 40px;
                    border-radius: 15px;
                    text-align: center;
                    z-index: 10001;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.3);
                    animation: artWelcome 6s ease-in-out forwards;
                ">
                    <h3>🎨 Generative Art Studio Activated! 🎨</h3>
                    <p>✨ Watch particles react to your drawing!</p>
                    <p>🌀 Try the psychedelic preset for a trip!</p>
                </div>
            `;

            const welcomeStyle = document.createElement('style');
            welcomeStyle.textContent = `
                @keyframes artWelcome {
                    0% { opacity: 0; transform: translateX(-50%) translateY(100px); }
                    15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    85% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-100px); }
                }
            `;
            document.head.appendChild(welcomeStyle);
            document.body.appendChild(welcome);

            setTimeout(() => welcome.remove(), 6000);
        }, 2000);

        console.log('🎨 Generative Art System initialized!');
    }

    // Start when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
