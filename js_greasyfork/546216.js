// ==UserScript==
// @name         Drawaria Animation Library
// @namespace    drawaria-animations
// @version      3.0
// @description  Complete animation library for Drawaria with all effects
// @author       DrawArtist
// @license      MIT
// @match        https://drawaria.online/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Verificar que getGameSocket esté disponible
    function getGameSocket() {
        return window.getGameSocket ? window.getGameSocket() : null;
    }
    
    // Core drawing animation functions
    const DRAWING_FUNCTIONS = {
        // Utility functions
        _delay: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        
        _getRandomColor: function(saturation = 70, lightness = 50) {
            const hue = Math.floor(Math.random() * 360);
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        },
        
        _sendDrawCmd: function(startPoint, endPoint, color, thickness) {
            try {
                const socket = getGameSocket();
                if (!socket || socket.readyState !== WebSocket.OPEN) {
                    console.warn('WebSocket not available or not open');
                    return false;
                }
                
                const cmd = `42["drawcmd",0,[${startPoint.toFixed(4)},${startPoint[1].toFixed(4)},${endPoint.toFixed(4)},${endPoint[1].toFixed(4)},false,${0-thickness},"${color}",0,0,{"2":0,"3":0.5,"4":0.5}]]`;
                socket.send(cmd);
                return true;
            } catch (error) {
                console.error('Error sending draw command:', error);
                return false;
            }
        },
        
        _drawPixel: async function(x, y, size, color, delay = 0) {
            const endX = x + size * 0.0001;
            const endY = y + size * 0.0001;
            const thickness = size * 1000;
            const result = this._sendDrawCmd([x, y], [endX, endY], color, thickness);
            if (delay > 0) await this._delay(delay);
            return result;
        },
        
        notify: function(type, message) {
            console.log(`[DRAWARIA-ANIMATIONS][${type.toUpperCase()}] ${message}`);
        },
        
        // State management
        _drawingActive: false,
        _globalFrameCount: 0,

        // Pixel font for text rendering
        _pixelFont: {
            'A': ["0110", "1001", "1111", "1001", "1001"],
            'B': ["1110", "1001", "1110", "1001", "1110"],
            'C': ["0110", "1000", "1000", "1000", "0110"],
            'D': ["1110", "1001", "1001", "1001", "1110"],
            'E': ["1111", "1000", "1110", "1000", "1111"],
            'G': ["0110", "1000", "1011", "1001", "0111"],
            'H': ["1001", "1001", "1111", "1001", "1001"],
            'I': ["111", "010", "010", "010", "111"],
            'K': ["1001", "1010", "1100", "1010", "1001"],
            'L': ["1000", "1000", "1000", "1000", "1111"],
            'M': ["10001", "11011", "10101", "10001", "10001"],
            'N': ["1001", "1101", "1011", "1001", "1001"],
            'O': ["0110", "1001", "1001", "1001", "0110"],
            'P': ["1110", "1001", "1110", "1000", "1000"],
            'R': ["1110", "1001", "1110", "1010", "1001"],
            'S': ["0111", "1000", "0110", "0001", "1110"],
            'U': ["1001", "1001", "1001", "1001", "0110"],
            'V': ["10001", "10001", "01010", "01010", "00100"],
            ' ': ["000", "000", "000", "000", "000"]
        },
        _charHeight: 5,

        async _drawPixelText(text, startX, startY, charPixelSize, color, textPixelDelay, letterSpacingFactor = 0.8) {
            let currentX = startX;
            text = text.toUpperCase();

            for (const char of text) {
                if (!this._drawingActive) return;
                const charData = this._pixelFont[char];
                if (charData) {
                    let charWidth = 0;
                    for (let y = 0; y < this._charHeight; y++) {
                        if (!this._drawingActive) return;
                        const row = charData[y];
                        charWidth = Math.max(charWidth, row.length);
                        for (let x = 0; x < row.length; x++) {
                            if (!this._drawingActive) return;
                            if (row[x] === '1') {
                                const dX = currentX + x * charPixelSize;
                                const dY = startY + y * charPixelSize;
                                if (!await this._drawPixel(dX, dY, charPixelSize, color, textPixelDelay)) return;
                            }
                        }
                    }
                    currentX += (charWidth + letterSpacingFactor) * charPixelSize;
                } else {
                    currentX += (3 + letterSpacingFactor) * charPixelSize;
                }
            }
        },

        // COMPLETE ANIMATION IMPLEMENTATIONS
        async pixelArtCharacters() {
            const socket = getGameSocket();
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                this.notify("error", "Not connected to game. Please be in a room.");
                return;
            }
            
            this._drawingActive = true;
            this.notify("info", "Starting Pixel Art Characters...");

            try {
                const Q_TOP_LEFT = { xMin: 0.0, yMin: 0.0, xMax: 0.5, yMax: 0.5 };
                const Q_TOP_RIGHT = { xMin: 0.5, yMin: 0.0, xMax: 1.0, yMax: 0.5 };
                const Q_BOTTOM_LEFT = { xMin: 0.0, yMin: 0.5, xMax: 0.5, yMax: 1.0 };
                const Q_BOTTOM_RIGHT = { xMin: 0.5, yMin: 0.5, xMax: 1.0, yMax: 1.0 };

                const marioSprite = {
                    name: "MARIO", nameColor: "#FF0000", width: 12,
                    data: ["____RRRRR___", "___RRRRRRR__", "___NNNYNY___", "__NSSYSYYN__", "__NSSYSYYYNN", "__NYYYYYYYYN", "____BBBB____", "__RBBBRBBR__", "_RBBRRRBBRR_", "RBBBBBRBBBB_", "BBBBBBRBBBBB", "BBBB__BBBB__", "NNN____NNN__", "_NN____NN___"],
                    colors: { R: "#E60000", N: "#7A3D03", Y: "#FBD000", S: "#FFCC99", B: "#0040FF" },
                    quadrant: Q_TOP_LEFT, textOffsetY: -0.08
                };

                const pikachuSprite = {
                    name: "PIKACHU", nameColor: "#FFA500", width: 13,
                    data: ["____PPPPP____", "___PKKKPKK___", "__PKKPKPKKK__", "_PKKPKKPKPKK_", "_PKKPOKPKPOKK", "PPKPKKKPKPKPP", "PPKPK_KPKPKPP", "_PKPKKKPKPKP_", "__PKKKKKPKP__", "___PPPPPPP___", "____PP_PP____"],
                    colors: { P: "#FFDE38", K: "#000000", O: "#FF4444", W: "#FFFFFF" },
                    quadrant: Q_TOP_RIGHT, textOffsetY: -0.08
                };

                const characters = [marioSprite, pikachuSprite];
                const pixelDrawDelay = 3;
                const textPixelDelay = 2;
                const textCharPixelSize = 0.008;

                // Draw dividing lines
                const lineThickness = 8;
                if (!this._sendDrawCmd([0, 0.5], [1, 0.5], marioSprite.colors.R, lineThickness)) { 
                    this._drawingActive = false; 
                    return; 
                }
                if (!this._sendDrawCmd([0.5, 0], [0.5, 1], pikachuSprite.colors.O, lineThickness)) { 
                    this._drawingActive = false; 
                    return; 
                }

                await this._delay(100);

                // Draw "VS" text
                if (this._drawingActive) {
                    const vsTextSize = 0.02;
                    const vsColor = "#000000";
                    await this._drawPixelText("VS", 0.5 - (vsTextSize * 5) / 2, 0.5 - (vsTextSize * this._charHeight) / 2, vsTextSize, vsColor, textPixelDelay);
                }

                await this._delay(100);

                // Draw characters
                for (const char of characters) {
                    if (!this._drawingActive) break;

                    const charHeightPx = char.data.length;
                    const charWidthPx = char.width;
                    const quadW = char.quadrant.xMax - char.quadrant.xMin;
                    const quadH = char.quadrant.yMax - char.quadrant.yMin;

                    const scaleFactor = 0.65;
                    const pixelSizeX = (quadW * scaleFactor) / charWidthPx;
                    const pixelSizeY = (quadH * scaleFactor) / charHeightPx;
                    const finalPixelSize = Math.min(pixelSizeX, pixelSizeY);

                    const totalSpriteW = charWidthPx * finalPixelSize;
                    const totalSpriteH = charHeightPx * finalPixelSize;
                    const startX = char.quadrant.xMin + (quadW - totalSpriteW) / 2;
                    const startY = char.quadrant.yMin + (quadH - totalSpriteH) / 2;

                    // Draw character name
                    const nameLenEst = char.name.length * 3 * textCharPixelSize;
                    const textStartX = char.quadrant.xMin + (quadW - nameLenEst) / 2;
                    let textStartY = startY + char.textOffsetY - (this._charHeight * textCharPixelSize);
                    textStartY = Math.max(char.quadrant.yMin + 0.01, Math.min(char.quadrant.yMax - 0.01 - (this._charHeight * textCharPixelSize), textStartY));

                    if (this._drawingActive) {
                        await this._drawPixelText(char.name, textStartX, textStartY, textCharPixelSize, char.nameColor, textPixelDelay);
                    }
                    
                    await this._delay(50);

                    // Draw sprite pixels
                    for (let y = 0; y < charHeightPx; y++) {
                        if (!this._drawingActive) break;
                        for (let x = 0; x < charWidthPx; x++) {
                            if (!this._drawingActive) break;
                            const colorChar = char.data[y][x];
                            if (colorChar !== "_" && char.colors[colorChar]) {
                                const dX = startX + x * finalPixelSize;
                                const dY = startY + y * finalPixelSize;
                                if (!await this._drawPixel(dX, dY, finalPixelSize, char.colors[colorChar], pixelDrawDelay)) {
                                    this._drawingActive = false;
                                    break;
                                }
                            }
                        }
                    }
                    if (!this._drawingActive) break;
                    await this._delay(200);
                }

                this._drawingActive = false;
                this.notify("success", "Pixel Art Characters finished.");
            } catch (error) {
                this._drawingActive = false;
                this.notify("error", "Animation failed: " + error.message);
            }
        },

        async pulsatingStainedGlass() {
            const socket = getGameSocket();
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                this.notify("error", "Not connected to game. Please be in a room.");
                return;
            }
            
            this._drawingActive = true;
            this.notify("info", "Starting Pulsating Stained Glass...");
            
            try {
                const gridX = 5 + Math.floor(Math.random() * 4);
                const gridY = 4 + Math.floor(Math.random() * 3);
                const cellW = 1 / gridX;
                const cellH = 1 / gridY;
                const animSteps = 150;
                const globalDelay = 50;
                const lineThickness = 3;
                const lineColor = "rgb(40,40,40)";
                let cells = [];

                // Create grid cells
                for (let r = 0; r < gridY; r++) {
                    for (let c = 0; c < gridX; c++) {
                        const cellType = Math.random();
                        let points = [];
                        const x = c * cellW, y = r * cellH, w = cellW, h = cellH;
                        
                        if (cellType < 0.33) {
                            points = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
                        } else if (cellType < 0.66) {
                            if (Math.random() < 0.5) {
                                points = [[x, y], [x + w, y], [x + w, y + h], [x, y], [x, y + h], [x + w, y + h]];
                            } else {
                                points = [[x, y], [x + w, y], [x, y + h], [x + w, y], [x + w, y + h], [x, y + h]];
                            }
                        } else {
                            const cx = x + w / 2, cy = y + h / 2;
                            points = [[x, y], [x + w, y], [cx, cy], [x + w, y], [x + w, y + h], [cx, cy], [x + w, y + h], [x, y + h], [cx, cy], [x, y + h], [x, y], [cx, cy]];
                        }
                        
                        cells.push({
                            basePoints: points,
                            hue: Math.random() * 360,
                            lightPhase: Math.random() * Math.PI * 2,
                            lightSpeed: 0.05 + Math.random() * 0.1
                        });
                    }
                }

                // Draw cell outlines
                for (const cell of cells) {
                    if (!this._drawingActive) break;
                    for (let i = 0; i < cell.basePoints.length; i += 3) {
                        if (!this._drawingActive || i + 2 >= cell.basePoints.length) break;
                        const p1 = cell.basePoints[i], p2 = cell.basePoints[i + 1], p3 = cell.basePoints[i + 2];
                        if (!this._sendDrawCmd(p1, p2, lineColor, lineThickness)) { this._drawingActive = false; break; }
                        if (!this._sendDrawCmd(p2, p3, lineColor, lineThickness)) { this._drawingActive = false; break; }
                        if (!this._sendDrawCmd(p3, p1, lineColor, lineThickness)) { this._drawingActive = false; break; }
                        await this._delay(5);
                    }
                }

                // Animate pulsating colors
                for (let frame = 0; frame < animSteps && this._drawingActive; frame++) {
                    for (const cell of cells) {
                        if (!this._drawingActive) break;
                        const currentLightness = 40 + 20 * Math.sin(cell.lightPhase + frame * cell.lightSpeed);
                        const color = `hsl(${cell.hue},80%,${currentLightness}%)`;
                        
                        for (let i = 0; i < cell.basePoints.length; i += 3) {
                            if (!this._drawingActive || i + 2 >= cell.basePoints.length) break;
                            const p1 = cell.basePoints[i], p2 = cell.basePoints[i + 1], p3 = cell.basePoints[i + 2];
                            const m12 = [(p1 + p2) / 2, (p1[1] + p2[1]) / 2];
                            const m23 = [(p2 + p3) / 2, (p2[1] + p3[1]) / 2];
                            
                            if (!this._sendDrawCmd(m12, p3, color, lineThickness * 3 + 2)) { this._drawingActive = false; break; }
                            if (!this._sendDrawCmd(m23, p1, color, lineThickness * 3 + 2)) { this._drawingActive = false; break; }
                        }
                    }
                    if (!this._drawingActive) break;
                    await this._delay(globalDelay);
                }
                
                this._drawingActive = false;
                this.notify("success", "Pulsating Stained Glass finished.");
            } catch (error) {
                this._drawingActive = false;
                this.notify("error", "Animation failed: " + error.message);
            }
        },

        async celestialBallet() {
            const socket = getGameSocket();
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                this.notify("error", "Not connected to game. Please be in a room.");
                return;
            }
            
            this._drawingActive = true;
            this.notify("info", "Starting Celestial Ballet...");
            
            try {
                const numDots = 8 + Math.floor(Math.random() * 5);
                const steps = 150;
                const thickness = 3;
                const baseDelay = 25;
                let dots = [];

                // Initialize dancing dots
                for (let i = 0; i < numDots; i++) {
                    dots.push({
                        x: 0.5, y: 0.5,
                        vx: (Math.random() - 0.5) * 0.02,
                        vy: (Math.random() - 0.5) * 0.02,
                        orbitCenterX: 0.5 + (Math.random() - 0.5) * 0.4,
                        orbitCenterY: 0.5 + (Math.random() - 0.5) * 0.4,
                        orbitSpeed: (Math.random() * 0.05 + 0.02) * (Math.random() < 0.5 ? 1 : -1),
                        hue: Math.random() * 360,
                        lastX: 0.5, lastY: 0.5
                    });
                }

                // Animate the celestial ballet
                for (let step = 0; step < steps && this._drawingActive; step++) {
                    for (const dot of dots) {
                        if (!this._drawingActive) break;
                        
                        // Store last position
                        dot.lastX = dot.x;
                        dot.lastY = dot.y;
                        
                        // Calculate orbital motion
                        const angleToOrbit = Math.atan2(dot.y - dot.orbitCenterY, dot.x - dot.orbitCenterX);
                        dot.vx += Math.cos(angleToOrbit + Math.PI / 2) * dot.orbitSpeed * 0.1;
                        dot.vy += Math.sin(angleToOrbit + Math.PI / 2) * dot.orbitSpeed * 0.1;
                        
                        // Add center attraction
                        dot.vx += (0.5 - dot.x) * 0.0005;
                        dot.vy += (0.5 - dot.y) * 0.0005;
                        
                        // Apply damping
                        dot.vx *= 0.97;
                        dot.vy *= 0.97;
                        
                        // Update position
                        dot.x += dot.vx;
                        dot.y += dot.vy;
                        
                        // Boundary collision
                        if (dot.x < 0.01 || dot.x > 0.99) dot.vx *= -0.8;
                        if (dot.y < 0.01 || dot.y > 0.99) dot.vy *= -0.8;
                        
                        // Keep in bounds
                        dot.x = Math.max(0.01, Math.min(0.99, dot.x));
                        dot.y = Math.max(0.01, Math.min(0.99, dot.y));
                        
                        // Update color
                        dot.hue = (dot.hue + 0.5) % 360;
                        const color = `hsl(${dot.hue},100%,70%)`;
                        
                        // Draw trail
                        if (!this._sendDrawCmd([dot.lastX, dot.lastY], [dot.x, dot.y], color, thickness)) {
                            this._drawingActive = false;
                            break;
                        }
                    }
                    if (baseDelay > 0 && this._drawingActive) await this._delay(baseDelay);
                }
                
                this._drawingActive = false;
                this.notify("success", "Celestial Ballet finished.");
            } catch (error) {
                this._drawingActive = false;
                this.notify("error", "Animation failed: " + error.message);
            }
        },

        async recursiveStarPolygonNova() {
            const socket = getGameSocket();
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                this.notify("error", "Not connected to game. Please be in a room.");
                return;
            }
            
            this._drawingActive = true;
            this.notify("info", "Starting Recursive Star Polygon Nova...");
            
            try {
                const centerX = 0.5, centerY = 0.5;
                const initialRadius = 0.25;
                const maxDepth = 3 + Math.floor(Math.random() * 1);
                const numPoints = 5 + Math.floor(Math.random() * 2) * 2;
                const skipFactor = 2 + Math.floor(Math.random() * 1);
                const recursiveScaleFactor = 0.4;
                const stepDelay = 15;
                const baseHue = Math.random() * 360;
                let globalRotation = this._globalFrameCount * 0.01;

                const drawStar = async (cx, cy, radius, points, skip, depth, currentHue, currentThickness, parentAngle) => {
                    if (!this._drawingActive || depth > maxDepth || radius < 0.005) return;
                    
                    const starCorners = [];
                    for (let i = 0; i < points; i++) {
                        const angle = (i / points) * 2 * Math.PI + parentAngle + globalRotation;
                        starCorners.push({
                            x: cx + radius * Math.cos(angle),
                            y: cy + radius * Math.sin(angle)
                        });
                    }
                    
                    const color = `hsl(${(currentHue + depth * 30) % 360},95%,${65 - depth * 10}%)`;
                    const thickness = Math.max(1, currentThickness);
                    
                    // Draw star lines
                    for (let i = 0; i < points && this._drawingActive; i++) {
                        const p1 = starCorners[i];
                        const p2 = starCorners[(i + skip) % points];
                        if (!this._sendDrawCmd([p1.x, p1.y], [p2.x, p2.y], color, thickness)) {
                            this._drawingActive = false;
                            return;
                        }
                        if (stepDelay > 0 && this._drawingActive) await this._delay(stepDelay);
                    }
                    
                    // Recursive calls
                    for (let i = 0; i < points && this._drawingActive; i++) {
                        const newAngle = (i / points) * 2 * Math.PI + parentAngle + Math.PI / points;
                        await drawStar(starCorners[i].x, starCorners[i].y, radius * recursiveScaleFactor, points, skip, depth + 1, currentHue, thickness * 0.7, newAngle);
                    }
                };

                await drawStar(centerX, centerY, initialRadius, numPoints, skipFactor, 1, baseHue, 6, 0);
                
                this._globalFrameCount++;
                this._drawingActive = false;
                this.notify("success", "Recursive Star Polygon Nova finished.");
            } catch (error) {
                this._drawingActive = false;
                this.notify("error", "Animation failed: " + error.message);
            }
        },

        async fractalBloomMandala() {
            const socket = getGameSocket();
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                this.notify("error", "Not connected to game. Please be in a room.");
                return;
            }
            
            this._drawingActive = true;
            this.notify("info", "Starting Fractal Bloom Mandala...");
            
            try {
                const centerX = 0.5, centerY = 0.5;
                const maxDepth = 4;
                const initialBranches = 6 + Math.floor(Math.random() * 3);
                const initialLength = 0.15;
                const lengthRatio = 0.65;
                const angleStep = Math.PI / (3 + Math.random() * 2);
                const delay = 20;
                const baseHue = Math.random() * 360;
                let globalRotation = this._globalFrameCount * 0.01;

                const drawBranch = async (cx, cy, angle, length, depth, currentHue, branchThickness) => {
                    if (!this._drawingActive || depth > maxDepth || length < 0.005) return;
                    
                    const x2 = cx + length * Math.cos(angle);
                    const y2 = cy + length * Math.sin(angle);
                    const thickness = Math.max(1, branchThickness * Math.pow(lengthRatio, depth - 1) * 2);
                    const color = `hsl(${(currentHue + depth * 20) % 360},${80 - depth * 10}%,${60 - depth * 8}%)`;
                    
                    if (!this._sendDrawCmd([cx, cy], [x2, y2], color, thickness)) {
                        this._drawingActive = false;
                        return;
                    }
                    if (delay > 0) await this._delay(delay);
                    if (!this._drawingActive) return;
                    
                    // Branch left and right
                    await drawBranch(x2, y2, angle - angleStep, length * lengthRatio, depth + 1, currentHue, branchThickness);
                    if (!this._drawingActive) return;
                    await drawBranch(x2, y2, angle + angleStep, length * lengthRatio, depth + 1, currentHue, branchThickness);
                    
                    // Sometimes add a middle branch
                    if (depth < maxDepth - 1 && Math.random() < 0.4) {
                        if (!this._drawingActive) return;
                        await drawBranch(x2, y2, angle, length * lengthRatio * 0.8, depth + 1, currentHue, branchThickness);
                    }
                };

                // Draw mandala branches
                for (let i = 0; i < initialBranches && this._drawingActive; i++) {
                    const angle = (i / initialBranches) * 2 * Math.PI + globalRotation;
                    await drawBranch(centerX, centerY, angle, initialLength, 1, (baseHue + i * (360 / initialBranches)) % 360, 10);
                    if (delay > 0 && this._drawingActive) await this._delay(delay * 3);
                }
                
                this._globalFrameCount++;
                this._drawingActive = false;
                this.notify("success", "Fractal Bloom Mandala finished.");
            } catch (error) {
                this._drawingActive = false;
                this.notify("error", "Animation failed: " + error.message);
            }
        },

        async directionalHueBlast() {
            const socket = getGameSocket();
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                this.notify("error", "Not connected to game. Please be in a room.");
                return;
            }
            
            this._drawingActive = true;
            this.notify("info", "Starting Directional Hue Blast...");
            
            try {
                const directions = [
                    { s: [0.5, 0], e: [0.5, 1] },   // Top to bottom
                    { s: [0.5, 1], e: [0.5, 0] },   // Bottom to top
                    { s: [0, 0.5], e: [1, 0.5] },   // Left to right
                    { s: [1, 0.5], e: [0, 0.5] }    // Right to left
                ];

                for (let i = 0; i < 100 && this._drawingActive; i++) {
                    for (let dir of directions) {
                        if (!this._drawingActive) break;
                        
                        let t = i / 100;
                        let x = dir.s + (dir.e - dir.s) * t;
                        let y = dir.s[1] + (dir.e[1] - dir.s[1]) * t;
                        
                        if (!this._sendDrawCmd([x, y], [x + 0.001, y + 0.001], `hsl(${i * 3.6},100%,50%)`, 10 + i * 0.5)) {
                            this._drawingActive = false;
                            break;
                        }
                    }
                    if (!this._drawingActive) break;
                    await this._delay(40);
                }
                
                this._drawingActive = false;
                this.notify("success", "Directional Hue Blast finished.");
            } catch (error) {
                this._drawingActive = false;
                this.notify("error", "Animation failed: " + error.message);
            }
        },

        async colorFestival() {
            const socket = getGameSocket();
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                this.notify("error", "Not connected to game. Please be in a room.");
                return;
            }
            
            this._drawingActive = true;
            this.notify("info", "Starting Color Festival...");
            
            try {
                const numShapes = 120;
                const frameDelay = 60;
                const shapeDelay = 10;
                
                for (let i = 0; i < numShapes && this._drawingActive; i++) {
                    let x = Math.random() * 0.8 + 0.1;
                    let y = Math.random() * 0.8 + 0.1;
                    let size = Math.random() * 0.08 + 0.03;
                    let color = this._getRandomColor(90, 55);
                    let thickness = Math.floor(Math.random() * 10) + 4;
                    let shapeType = Math.floor(Math.random() * 4);
                    
                    let success = true;
                    
                    if (shapeType === 0) {
                        // Rectangle lines
                        for (let j = 0; j < size * 100 && success && this._drawingActive; j += thickness / 2) {
                            let lineY = y - size / 2 + (j / 100);
                            if (lineY > y + size / 2) break;
                            success = this._sendDrawCmd([x - size / 2, lineY], [x + size / 2, lineY], color, thickness);
                            if (shapeDelay > 0 && success) await this._delay(shapeDelay);
                        }
                    } else if (shapeType === 1) {
                        // Triangle
                        const s = size;
                        success = this._sendDrawCmd([x, y - s / 2], [x + s / 2, y + s / 2], color, thickness);
                        if (success && this._drawingActive && shapeDelay > 0) await this._delay(shapeDelay);
                        if (!success || !this._drawingActive) break;
                        success = this._sendDrawCmd([x + s / 2, y + s / 2], [x - s / 2, y + s / 2], color, thickness);
                        if (success && this._drawingActive && shapeDelay > 0) await this._delay(shapeDelay);
                        if (!success || !this._drawingActive) break;
                        success = this._sendDrawCmd([x - s / 2, y + s / 2], [x, y - s / 2], color, thickness);
                    } else if (shapeType === 2) {
                        // Star pattern
                        const s = size * 0.7;
                        for (let k = 0; k < 8 && success && this._drawingActive; k++) {
                            const angle = (k / 8) * 2 * Math.PI;
                            success = this._sendDrawCmd([x, y], [x + s * Math.cos(angle), y + s * Math.sin(angle)], color, thickness);
                            if (shapeDelay > 0 && success) await this._delay(shapeDelay);
                        }
                    } else {
                        // Spiral
                        let lastX = x, lastY = y;
                        for (let k = 0; k <= 20 && success && this._drawingActive; k++) {
                            const angle = (k / 20) * 4 * Math.PI;
                            const radius = (k / 20) * size;
                            const currentX = x + radius * Math.cos(angle);
                            const currentY = y + radius * Math.sin(angle);
                            if (k > 0) success = this._sendDrawCmd([lastX, lastY], [currentX, currentY], color, thickness);
                            lastX = currentX;
                            lastY = currentY;
                            if (shapeDelay > 0 && success) await this._delay(shapeDelay);
                        }
                    }
                    
                    if (!success || !this._drawingActive) break;
                    if (frameDelay > 0) await this._delay(frameDelay);
                }
                
                this._drawingActive = false;
                this.notify("success", "Color Festival finished.");
            } catch (error) {
                this._drawingActive = false;
                this.notify("error", "Animation failed: " + error.message);
            }
        },

        async fireworks() {
            const socket = getGameSocket();
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                this.notify("error", "Not connected to game. Please be in a room.");
                return;
            }
            
            this._drawingActive = true;
            this.notify("info", "Starting Fireworks...");
            
            try {
                const numFireworks = 8;
                const fireworkDelay = 600;
                
                for (let i = 0; i < numFireworks && this._drawingActive; i++) {
                    // Launch trail
                    let startX = Math.random() * 0.6 + 0.2;
                    let startY = 0.95;
                    let peakX = startX + (Math.random() - 0.5) * 0.3;
                    let peakY = Math.random() * 0.4 + 0.05;
                    let launchColor = this._getRandomColor(100, 70);
                    let launchThickness = 6;
                    let particleCount = 40 + Math.floor(Math.random() * 40);
                    let particleThickness = 4 + Math.floor(Math.random() * 4);
                    let launchSteps = 25;
                    let launchStepDelay = 4;
                    let explosionParticleDelay = 8;
                    let success = true;

                    // Draw launch trail
                    for (let step = 0; step < launchSteps && success && this._drawingActive; step++) {
                        let progress = step / launchSteps;
                        let nextProgress = (step + 1) / launchSteps;
                        let currentX = startX + (peakX - startX) * progress;
                        let currentY = startY + (peakY - startY) * progress;
                        let nextX = startX + (peakX - startX) * nextProgress;
                        let nextY = startY + (peakY - startY) * nextProgress;
                        
                        success = this._sendDrawCmd([currentX, currentY], [nextX, nextY], launchColor, launchThickness);
                        if (launchStepDelay > 0 && success) await this._delay(launchStepDelay);
                    }
                    
                    if (!success || !this._drawingActive) break;
                    
                    // Explosion
                    const explosionHue = Math.random() * 360;
                    for (let j = 0; j < particleCount && success && this._drawingActive; j++) {
                        const angle = Math.random() * 2 * Math.PI;
                        const distance = Math.random() * 0.20 + 0.05;
                        const endX = peakX + distance * Math.cos(angle);
                        const endY = peakY + distance * Math.sin(angle);
                        
                        const particleHue = (explosionHue + (Math.random() - 0.5) * 60 + 360) % 360;
                        success = this._sendDrawCmd([peakX, peakY], [endX, endY], `hsl(${particleHue},100%,60%)`, particleThickness);
                        if (explosionParticleDelay > 0 && success) await this._delay(explosionParticleDelay);
                    }
                    
                    if (!success || !this._drawingActive) break;
                    if (fireworkDelay > 0) await this._delay(fireworkDelay);
                }
                
                this._drawingActive = false;
                this.notify("success", "Fireworks finished.");
            } catch (error) {
                this._drawingActive = false;
                this.notify("error", "Animation failed: " + error.message);
            }
        },

        stopDrawing() {
            this._drawingActive = false;
            this.notify("info", "Drawing stopped by user.");
        }
    };

    // Library interface
    window.DRAWARIA_ANIMATIONS = {
        getAnimations: function() {
            try {
                return Object.keys(DRAWING_FUNCTIONS).filter(key => 
                    typeof DRAWING_FUNCTIONS[key] === 'function' && 
                    !key.startsWith('_') && 
                    key !== 'notify' && 
                    key !== 'stopDrawing'
                );
            } catch (error) {
                console.error('Error getting animations:', error);
                return [];
            }
        },

        runAnimation: function(animationName) {
            try {
                if (typeof DRAWING_FUNCTIONS[animationName] === 'function') {
                    return DRAWING_FUNCTIONS[animationName].call(DRAWING_FUNCTIONS);
                } else {
                    console.error('Animation not found:', animationName);
                    return Promise.reject('Animation not found');
                }
            } catch (error) {
                console.error('Error running animation:', error);
                return Promise.reject(error);
            }
        },

        getRandomAnimation: function() {
            try {
                const animations = this.getAnimations();
                if (animations.length === 0) return null;
                return animations[Math.floor(Math.random() * animations.length)];
            } catch (error) {
                console.error('Error getting random animation:', error);
                return null;
            }
        },

        stop: function() {
            try {
                DRAWING_FUNCTIONS.stopDrawing();
            } catch (error) {
                console.error('Error stopping animation:', error);
            }
        },

        isDrawing: function() {
            return DRAWING_FUNCTIONS._drawingActive;
        },

        animations: DRAWING_FUNCTIONS
    };

    // Backward compatibility
    window.DRAWING_FUNCTIONS = DRAWING_FUNCTIONS;
    
    console.log('🎨 Drawaria Animation Library loaded successfully');
    console.log('Available animations:', window.DRAWARIA_ANIMATIONS.getAnimations());

})();
