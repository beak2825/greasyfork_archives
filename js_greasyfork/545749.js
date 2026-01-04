// ==UserScript==
// @name         Drawaria Cubic Drawer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Advanced cubic and geometric drawing system with isometric views, fractal cubes, and 3D-in-2D effects for drawaria.online!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/545749/Drawaria%20Cubic%20Drawer.user.js
// @updateURL https://update.greasyfork.org/scripts/545749/Drawaria%20Cubic%20Drawer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cubic drawing system state
    const cubicState = {
        drawMode: 'isometric',
        cubeSize: 40,
        autoRotate: false,
        fractalDepth: 4,
        gridSnap: true,
        perspective: true,
        colorScheme: 'rainbow',
        animationSpeed: 1,
        cubes: [],
        fractalCubes: [],
        rotation: { x: 0, y: 0, z: 0 },
        cameraAngle: 30,
        zoom: 1
    };

    // 3D Point class for cubic calculations
    class Point3D {
        constructor(x, y, z) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }

        // Convert 3D point to 2D isometric projection
        toIsometric() {
            const angle = Math.PI / 6; // 30 degrees
            const x2d = (this.x - this.z) * Math.cos(angle);
            const y2d = (this.x + this.z) * Math.sin(angle) - this.y;
            return { x: x2d, y: y2d };
        }

        // Convert 3D point to 2D perspective projection
        toPerspective(distance = 500) {
            const scale = distance / (distance + this.z);
            return { 
                x: this.x * scale, 
                y: this.y * scale,
                scale: scale
            };
        }

        // Rotate point around origin
        rotateX(angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const y = this.y * cos - this.z * sin;
            const z = this.y * sin + this.z * cos;
            return new Point3D(this.x, y, z);
        }

        rotateY(angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const x = this.x * cos + this.z * sin;
            const z = -this.x * sin + this.z * cos;
            return new Point3D(x, this.y, z);
        }

        rotateZ(angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const x = this.x * cos - this.y * sin;
            const y = this.x * sin + this.y * cos;
            return new Point3D(x, y, this.z);
        }
    }

    // Cubic shape class
    class Cube {
        constructor(x, y, z, size, color) {
            this.position = new Point3D(x, y, z);
            this.size = size || cubicState.cubeSize;
            this.color = color || this.generateColor();
            this.faces = this.generateFaces();
            this.rotation = { x: 0, y: 0, z: 0 };
            this.scale = 1;
            this.alpha = 1;
            this.animated = false;
            this.animationPhase = Math.random() * Math.PI * 2;
        }

        generateColor() {
            const schemes = {
                rainbow: `hsl(${Math.random() * 360}, 70%, 60%)`,
                neon: `hsl(${Math.random() * 360}, 100%, 50%)`,
                pastel: `hsl(${Math.random() * 360}, 50%, 80%)`,
                monochrome: `hsl(0, 0%, ${Math.random() * 100}%)`,
                sunset: `hsl(${Math.random() * 60 + 300}, 80%, 60%)`
            };
            return schemes[cubicState.colorScheme] || schemes.rainbow;
        }

        generateFaces() {
            const half = this.size / 2;
            const vertices = [
                new Point3D(-half, -half, -half), // 0: front bottom left
                new Point3D( half, -half, -half), // 1: front bottom right
                new Point3D( half,  half, -half), // 2: front top right
                new Point3D(-half,  half, -half), // 3: front top left
                new Point3D(-half, -half,  half), // 4: back bottom left
                new Point3D( half, -half,  half), // 5: back bottom right
                new Point3D( half,  half,  half), // 6: back top right
                new Point3D(-half,  half,  half)  // 7: back top left
            ];

            return [
                { vertices: [0, 1, 2, 3], color: this.color, normal: new Point3D(0, 0, -1) }, // front
                { vertices: [5, 4, 7, 6], color: this.adjustBrightness(this.color, -0.2), normal: new Point3D(0, 0, 1) }, // back
                { vertices: [4, 0, 3, 7], color: this.adjustBrightness(this.color, -0.1), normal: new Point3D(-1, 0, 0) }, // left
                { vertices: [1, 5, 6, 2], color: this.adjustBrightness(this.color, -0.3), normal: new Point3D(1, 0, 0) }, // right
                { vertices: [3, 2, 6, 7], color: this.adjustBrightness(this.color, 0.1), normal: new Point3D(0, 1, 0) }, // top
                { vertices: [4, 5, 1, 0], color: this.adjustBrightness(this.color, -0.4), normal: new Point3D(0, -1, 0) } // bottom
            ];
        }

        adjustBrightness(color, amount) {
            const hsl = color.match(/hsl$$(\d+),\s*(\d+)%,\s*(\d+)%$$/);
            if (hsl) {
                const lightness = Math.max(0, Math.min(100, parseInt(hsl[3]) + (amount * 100)));
                return `hsl(${hsl[1]}, ${hsl[2]}%, ${lightness}%)`;
            }
            return color;
        }

        update(time) {
            if (this.animated) {
                this.rotation.y += 0.02 * cubicState.animationSpeed;
                this.rotation.x = Math.sin(time * 0.001 + this.animationPhase) * 0.1;
                this.scale = 1 + Math.sin(time * 0.003 + this.animationPhase) * 0.1;
            }

            if (cubicState.autoRotate) {
                this.rotation.y += 0.01;
            }
        }

        getTransformedVertices() {
            const vertices = [];
            const half = this.size / 2 * this.scale;

            // Define cube vertices
            const rawVertices = [
                new Point3D(-half, -half, -half),
                new Point3D( half, -half, -half),
                new Point3D( half,  half, -half),
                new Point3D(-half,  half, -half),
                new Point3D(-half, -half,  half),
                new Point3D( half, -half,  half),
                new Point3D( half,  half,  half),
                new Point3D(-half,  half,  half)
            ];

            rawVertices.forEach(vertex => {
                let transformed = vertex
                    .rotateX(this.rotation.x + cubicState.rotation.x)
                    .rotateY(this.rotation.y + cubicState.rotation.y)
                    .rotateZ(this.rotation.z + cubicState.rotation.z);

                // Translate to cube position
                transformed.x += this.position.x;
                transformed.y += this.position.y;
                transformed.z += this.position.z;

                vertices.push(transformed);
            });

            return vertices;
        }

        draw(ctx, centerX, centerY) {
            const vertices = this.getTransformedVertices();
            const projectedVertices = vertices.map(v => {
                if (cubicState.perspective) {
                    const proj = v.toPerspective();
                    return {
                        x: centerX + proj.x * cubicState.zoom,
                        y: centerY + proj.y * cubicState.zoom,
                        z: v.z,
                        scale: proj.scale
                    };
                } else {
                    const iso = v.toIsometric();
                    return {
                        x: centerX + iso.x * cubicState.zoom,
                        y: centerY + iso.y * cubicState.zoom,
                        z: v.z,
                        scale: 1
                    };
                }
            });

            // Sort faces by z-depth for proper rendering
            const facesWithDepth = this.faces.map(face => {
                const avgZ = face.vertices.reduce((sum, vertexIndex) => {
                    return sum + vertices[vertexIndex].z;
                }, 0) / face.vertices.length;
                return { ...face, avgZ };
            });

            facesWithDepth.sort((a, b) => b.avgZ - a.avgZ);

            // Draw faces
            facesWithDepth.forEach(face => {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = face.color;
                ctx.strokeStyle = this.adjustBrightness(face.color, -0.5);
                ctx.lineWidth = 1;

                ctx.beginPath();
                face.vertices.forEach((vertexIndex, i) => {
                    const vertex = projectedVertices[vertexIndex];
                    if (i === 0) {
                        ctx.moveTo(vertex.x, vertex.y);
                    } else {
                        ctx.lineTo(vertex.x, vertex.y);
                    }
                });
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            });
        }
    }

    // Fractal cube generator
    class FractalCube {
        constructor(x, y, z, size, depth) {
            this.position = new Point3D(x, y, z);
            this.size = size;
            this.depth = depth;
            this.cubes = [];
            this.generate();
        }

        generate() {
            this.cubes = [];
            this.createFractal(this.position.x, this.position.y, this.position.z, this.size, this.depth);
        }

        createFractal(x, y, z, size, depth) {
            if (depth <= 0) return;

            // Create center cube
            const cube = new Cube(x, y, z, size);
            cube.animated = true;
            this.cubes.push(cube);

            if (depth > 1) {
                const newSize = size * 0.4;
                const offset = size * 0.7;

                // Create smaller cubes at the 8 corners
                const positions = [
                    [-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1],
                    [-1, -1,  1], [1, -1,  1], [-1, 1,  1], [1, 1,  1]
                ];

                positions.forEach(([dx, dy, dz]) => {
                    this.createFractal(
                        x + dx * offset,
                        y + dy * offset,
                        z + dz * offset,
                        newSize,
                        depth - 1
                    );
                });
            }
        }

        update(time) {
            this.cubes.forEach(cube => cube.update(time));
        }

        draw(ctx, centerX, centerY) {
            // Sort cubes by z-depth
            const sortedCubes = [...this.cubes].sort((a, b) => {
                return b.position.z - a.position.z;
            });

            sortedCubes.forEach(cube => cube.draw(ctx, centerX, centerY));
        }
    }

    // Create control panel
    function createCubicPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div id="cubic-panel" style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                padding: 25px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                color: white;
                font-family: 'Segoe UI', sans-serif;
                z-index: 10000;
                min-width: 350px;
                max-height: 85vh;
                overflow-y: auto;
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255,255,255,0.2);
            ">
                <h2 style="margin: 0 0 25px 0; text-align: center;">📦 Cubic Drawer Studio</h2>
                
                <!-- Drawing Controls -->
                <div class="cubic-section" style="
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                ">
                    <h3 style="margin: 0 0 15px 0; color: #e0e6ff; font-size: 14px;">🎯 DRAWING MODE</h3>
                    
                    <div style="margin: 10px 0;">
                        <label>Draw Mode:</label>
                        <select id="draw-mode" style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 5px;">
                            <option value="isometric">📐 Isometric</option>
                            <option value="perspective">👁️ Perspective</option>
                            <option value="orthographic">📏 Orthographic</option>
                            <option value="fractal">🌀 Fractal</option>
                        </select>
                    </div>
                    
                    <div style="margin: 10px 0;">
                        <label>Cube Size: <span id="size-display">40</span></label>
                        <input type="range" id="cube-size" min="10" max="100" value="40" style="width: 100%;">
                    </div>
                    
                    <div style="margin: 10px 0;">
                        <label>Fractal Depth: <span id="depth-display">4</span></label>
                        <input type="range" id="fractal-depth" min="1" max="7" value="4" style="width: 100%;">
                    </div>
                </div>

                <!-- View Controls -->
                <div class="cubic-section" style="
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                ">
                    <h3 style="margin: 0 0 15px 0; color: #e0e6ff; font-size: 14px;">🔄 VIEW CONTROLS</h3>
                    
                    <div style="margin: 10px 0;">
                        <label>Zoom: <span id="zoom-display">1.0</span>x</label>
                        <input type="range" id="zoom-level" min="0.5" max="3" step="0.1" value="1" style="width: 100%;">
                    </div>
                    
                    <div style="margin: 10px 0;">
                        <label>Camera Angle: <span id="angle-display">30</span>°</label>
                        <input type="range" id="camera-angle" min="0" max="90" value="30" style="width: 100%;">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 15px 0;">
                        <button id="auto-rotate">🔄 Auto Rotate</button>
                        <button id="grid-snap">🔲 Grid Snap</button>
                        <button id="reset-view">🎯 Reset View</button>
                        <button id="perspective-toggle">👁️ Perspective</button>
                    </div>
                </div>

                <!-- Style Controls -->
                <div class="cubic-section" style="
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                ">
                    <h3 style="margin: 0 0 15px 0; color: #e0e6ff; font-size: 14px;">🎨 STYLE CONTROLS</h3>
                    
                    <div style="margin: 10px 0;">
                        <label>Color Scheme:</label>
                        <select id="color-scheme" style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 5px;">
                            <option value="rainbow">🌈 Rainbow</option>
                            <option value="neon">💡 Neon</option>
                            <option value="pastel">🎀 Pastel</option>
                            <option value="monochrome">⚫ Monochrome</option>
                            <option value="sunset">🌅 Sunset</option>
                        </select>
                    </div>
                    
                    <div style="margin: 10px 0;">
                        <label>Animation Speed: <span id="anim-speed-display">1</span>x</label>
                        <input type="range" id="animation-speed" min="0" max="3" step="0.1" value="1" style="width: 100%;">
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="cubic-section" style="
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                ">
                    <h3 style="margin: 0 0 15px 0; color: #e0e6ff; font-size: 14px;">⚡ QUICK ACTIONS</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <button id="random-cubes">🎲 Random Cubes</button>
                        <button id="cube-tower">🏗️ Build Tower</button>
                        <button id="cube-spiral">🌀 Spiral</button>
                        <button id="cube-explosion">💥 Explosion</button>
                        <button id="clear-cubes">🗑️ Clear All</button>
                        <button id="save-scene">💾 Save Scene</button>
                    </div>
                </div>

                <!-- Presets -->
                <div class="cubic-section" style="
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 12px;
                ">
                    <h3 style="margin: 0 0 15px 0; color: #e0e6ff; font-size: 14px;">🎪 PRESETS</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <button class="cubic-preset" data-preset="minecraft">⛏️ Minecraft</button>
                        <button class="cubic-preset" data-preset="cyberpunk">🌆 Cyberpunk</button>
                        <button class="cubic-preset" data-preset="retro">🕹️ Retro</button>
                        <button class="cubic-preset" data-preset="minimal">◻️ Minimal</button>
                    </div>
                </div>

                <!-- Stats -->
                <div style="
                    background: rgba(0,0,0,0.2);
                    padding: 10px;
                    border-radius: 8px;
                    margin-top: 20px;
                    font-size: 12px;
                ">
                    <div>Active Cubes: <span id="cube-count">0</span></div>
                    <div>Fractal Elements: <span id="fractal-count">0</span></div>
                    <div>Total Vertices: <span id="vertex-count">0</span></div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #cubic-panel button, #cubic-panel select {
                background: rgba(255, 255, 255, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 11px;
                padding: 6px 8px;
            }
            #cubic-panel button:hover {
                background: rgba(255, 255, 255, 0.25);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            #cubic-panel button.active {
                background: rgba(46, 213, 115, 0.4);
                border-color: #2ed573;
            }
            .cubic-preset {
                padding: 8px 4px !important;
                font-size: 10px !important;
            }
            #cubic-panel input[type="range"] {
                background: rgba(255, 255, 255, 0.2);
                height: 6px;
                border-radius: 3px;
                margin: 5px 0;
            }
            .cubic-section {
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(panel);
        return panel;
    }

    // Main cubic drawing engine
    class CubicDrawingEngine {
        constructor() {
            this.canvas = this.createCanvas();
            this.ctx = this.canvas.getContext('2d');
            this.centerX = window.innerWidth / 2;
            this.centerY = window.innerHeight / 2;
            this.mouseX = 0;
            this.mouseY = 0;
            this.isDrawing = false;
            this.gridSize = 50;
            this.lastPlaceTime = 0;
            
            this.setupEventListeners();
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
                this.canvas.style.pointerEvents = 'auto';
                this.isDrawing = true;
            });

            document.addEventListener('mouseup', () => {
                this.canvas.style.pointerEvents = 'none';
                this.isDrawing = false;
            });

            document.addEventListener('click', (e) => {
                if (Date.now() - this.lastPlaceTime > 200) {
                    this.placeCube(e.clientX, e.clientY);
                    this.lastPlaceTime = Date.now();
                }
            });

            window.addEventListener('resize', () => {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                this.centerX = window.innerWidth / 2;
                this.centerY = window.innerHeight / 2;
            });

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'r': this.createRandomCubes(); break;
                    case 'c': this.clearCubes(); break;
                    case 't': this.buildTower(); break;
                    case 'f': this.createFractal(); break;
                }
            });
        }

        placeCube(screenX, screenY) {
            const worldPos = this.screenToWorld(screenX, screenY);
            
            if (cubicState.gridSnap) {
                worldPos.x = Math.round(worldPos.x / this.gridSize) * this.gridSize;
                worldPos.y = Math.round(worldPos.y / this.gridSize) * this.gridSize;
                worldPos.z = Math.round(worldPos.z / this.gridSize) * this.gridSize;
            }

            if (cubicState.drawMode === 'fractal') {
                const fractal = new FractalCube(worldPos.x, worldPos.y, worldPos.z, cubicState.cubeSize, cubicState.fractalDepth);
                cubicState.fractalCubes.push(fractal);
            } else {
                const cube = new Cube(worldPos.x, worldPos.y, worldPos.z, cubicState.cubeSize);
                cube.animated = true;
                cubicState.cubes.push(cube);
            }
        }

        screenToWorld(screenX, screenY) {
            // Convert screen coordinates to world coordinates
            const relX = (screenX - this.centerX) / cubicState.zoom;
            const relY = (screenY - this.centerY) / cubicState.zoom;
            
            // Simple approximation for 3D placement
            return new Point3D(relX, -relY, 0);
        }

        createRandomCubes() {
            for (let i = 0; i < 20; i++) {
                const x = (Math.random() - 0.5) * 400;
                const y = (Math.random() - 0.5) * 400;
                const z = (Math.random() - 0.5) * 200;
                const size = Math.random() * 50 + 20;
                const cube = new Cube(x, y, z, size);
                cube.animated = true;
                cubicState.cubes.push(cube);
            }
        }

        buildTower() {
            const height = 10;
            for (let i = 0; i < height; i++) {
                const cube = new Cube(0, -i * cubicState.cubeSize, 0, cubicState.cubeSize);
                cube.animated = true;
                cubicState.cubes.push(cube);
            }
        }

        createSpiral() {
            const count = 30;
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 4;
                const radius = i * 5;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = -i * 10;
                
                const cube = new Cube(x, y, z, cubicState.cubeSize * 0.8);
                cube.animated = true;
                cubicState.cubes.push(cube);
            }
        }

        createExplosion() {
            const count = 50;
            for (let i = 0; i < count; i++) {
                const angle1 = Math.random() * Math.PI * 2;
                const angle2 = Math.random() * Math.PI;
                const radius = Math.random() * 300 + 100;
                
                const x = Math.cos(angle1) * Math.sin(angle2) * radius;
                const y = Math.cos(angle2) * radius;
                const z = Math.sin(angle1) * Math.sin(angle2) * radius;
                
                const cube = new Cube(x, y, z, Math.random() * 30 + 10);
                cube.animated = true;
                cube.alpha = 0.7;
                cubicState.cubes.push(cube);
            }
        }

        clearCubes() {
            cubicState.cubes = [];
            cubicState.fractalCubes = [];
        }

        applyPreset(presetName) {
            this.clearCubes();
            
            switch(presetName) {
                case 'minecraft':
                    cubicState.colorScheme = 'rainbow';
                    cubicState.cubeSize = 30;
                    cubicState.perspective = false;
                    this.buildTower();
                    break;
                case 'cyberpunk':
                    cubicState.colorScheme = 'neon';
                    cubicState.cubeSize = 25;
                    cubicState.perspective = true;
                    cubicState.autoRotate = true;
                    this.createRandomCubes();
                    break;
                case 'retro':
                    cubicState.colorScheme = 'sunset';
                    cubicState.cubeSize = 40;
                    cubicState.perspective = false;
                    this.createSpiral();
                    break;
                case 'minimal':
                    cubicState.colorScheme = 'monochrome';
                    cubicState.cubeSize = 50;
                    cubicState.perspective = true;
                    for (let i = 0; i < 5; i++) {
                        const cube = new Cube(i * 60 - 120, 0, 0, 50);
                        cubicState.cubes.push(cube);
                    }
                    break;
            }
            this.updateUI();
        }

        updateUI() {
            document.getElementById('color-scheme').value = cubicState.colorScheme;
            document.getElementById('cube-size').value = cubicState.cubeSize;
            document.getElementById('size-display').textContent = cubicState.cubeSize;
        }

        drawGrid() {
            if (!cubicState.gridSnap) return;

            this.ctx.save();
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            this.ctx.lineWidth = 1;

            const gridSpacing = this.gridSize * cubicState.zoom;
            const startX = this.centerX % gridSpacing;
            const startY = this.centerY % gridSpacing;

            for (let x = startX; x < this.canvas.width; x += gridSpacing) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
            }

            for (let y = startY; y < this.canvas.height; y += gridSpacing) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }

            this.ctx.restore();
        }

        updateStats() {
            const totalCubes = cubicState.cubes.length;
            const fractalElements = cubicState.fractalCubes.reduce((sum, fractal) => sum + fractal.cubes.length, 0);
            const totalVertices = (totalCubes + fractalElements) * 8;

            document.getElementById('cube-count').textContent = totalCubes;
            document.getElementById('fractal-count').textContent = fractalElements;
            document.getElementById('vertex-count').textContent = totalVertices;
        }

        animate() {
            const time = Date.now();
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw grid
            this.drawGrid();

            // Update and draw cubes
            cubicState.cubes.forEach(cube => {
                cube.update(time);
                cube.draw(this.ctx, this.centerX, this.centerY);
            });

            // Update and draw fractal cubes
            cubicState.fractalCubes.forEach(fractal => {
                fractal.update(time);
                fractal.draw(this.ctx, this.centerX, this.centerY);
            });

            // Update rotation
            if (cubicState.autoRotate) {
                cubicState.rotation.y += 0.005;
            }

            // Update stats
            this.updateStats();

            requestAnimationFrame(() => this.animate());
        }
    }

    // Initialize the system
    function init() {
        const panel = createCubicPanel();
        const engine = new CubicDrawingEngine();

        // Event listeners for controls
        document.getElementById('draw-mode').onchange = (e) => {
            cubicState.drawMode = e.target.value;
        };

        document.getElementById('cube-size').oninput = (e) => {
            cubicState.cubeSize = parseInt(e.target.value);
            document.getElementById('size-display').textContent = e.target.value;
        };

        document.getElementById('fractal-depth').oninput = (e) => {
            cubicState.fractalDepth = parseInt(e.target.value);
            document.getElementById('depth-display').textContent = e.target.value;
        };

        document.getElementById('zoom-level').oninput = (e) => {
            cubicState.zoom = parseFloat(e.target.value);
            document.getElementById('zoom-display').textContent = e.target.value;
        };

        document.getElementById('camera-angle').oninput = (e) => {
            cubicState.cameraAngle = parseInt(e.target.value);
            document.getElementById('angle-display').textContent = e.target.value;
        };

        document.getElementById('color-scheme').onchange = (e) => {
            cubicState.colorScheme = e.target.value;
        };

        document.getElementById('animation-speed').oninput = (e) => {
            cubicState.animationSpeed = parseFloat(e.target.value);
            document.getElementById('anim-speed-display').textContent = e.target.value;
        };

        // Toggle buttons
        const toggleButton = (buttonId, stateKey) => {
            const button = document.getElementById(buttonId);
            button.onclick = () => {
                cubicState[stateKey] = !cubicState[stateKey];
                button.classList.toggle('active', cubicState[stateKey]);
            };
        };

        toggleButton('auto-rotate', 'autoRotate');
        toggleButton('grid-snap', 'gridSnap');
        toggleButton('perspective-toggle', 'perspective');

        // Action buttons
        document.getElementById('random-cubes').onclick = () => engine.createRandomCubes();
        document.getElementById('cube-tower').onclick = () => engine.buildTower();
        document.getElementById('cube-spiral').onclick = () => engine.createSpiral();
        document.getElementById('cube-explosion').onclick = () => engine.createExplosion();
        document.getElementById('clear-cubes').onclick = () => engine.clearCubes();
        document.getElementById('reset-view').onclick = () => {
            cubicState.rotation = { x: 0, y: 0, z: 0 };
            cubicState.zoom = 1;
            engine.updateUI();
        };

        // Preset buttons
        document.querySelectorAll('.cubic-preset').forEach(button => {
            button.onclick = () => {
                engine.applyPreset(button.dataset.preset);
                document.querySelectorAll('.cubic-preset').forEach(b => b.classList.remove('active'));
                button.classList.add('active');
            };
        });

        // Initialize grid snap as active
        document.getElementById('grid-snap').classList.add('active');

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
                    animation: cubicWelcome 6s ease-in-out forwards;
                ">
                    <h2>📦 Cubic Drawer Studio Activated! 📦</h2>
                    <p>🖱️ Click to place cubes in 3D space!</p>
                    <p>🌀 Try fractal mode for mind-bending patterns!</p>
                    <p>⌨️ Use keyboard shortcuts: R=Random, T=Tower, F=Fractal</p>
                    <p>🎮 Experiment with different view modes!</p>
                </div>
            `;

            const welcomeStyle = document.createElement('style');
            welcomeStyle.textContent = `
                @keyframes cubicWelcome {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.2) rotateX(90deg); }
                    15% { opacity: 1; transform: translate(-50%, -50%) scale(1.1) rotateX(-5deg); }
                    25% { transform: translate(-50%, -50%) scale(0.9) rotateX(2deg); }
                    35% { transform: translate(-50%, -50%) scale(1.05) rotateX(-1deg); }
                    45% { transform: translate(-50%, -50%) scale(1) rotateX(0deg); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotateX(0deg); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8) rotateX(-90deg); }
                }
            `;
            document.head.appendChild(welcomeStyle);
            document.body.appendChild(welcome);

            setTimeout(() => welcome.remove(), 6000);
        }, 2000);

        console.log('📦 Cubic Drawer Studio initialized!');
    }

    // Start the cubic drawing system
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
