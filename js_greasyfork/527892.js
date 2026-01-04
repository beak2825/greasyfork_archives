// ==UserScript==
// @name         Drawaria Sky Sanctuary Zone
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Professional recreation of Sky Sanctuary Zone with detailed elements
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527892/Drawaria%20Sky%20Sanctuary%20Zone.user.js
// @updateURL https://update.greasyfork.org/scripts/527892/Drawaria%20Sky%20Sanctuary%20Zone.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForCanvas() {
        if (document.querySelector('canvas')) {
            initSkySanctuary();
        } else {
            setTimeout(waitForCanvas, 1000);
        }
    }

    function initSkySanctuary() {
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');

        const colors = {
            skyTop: '#4080c0',        // Darker, more realistic sky
            skyBottom: '#80b0e0',     // Lighter blue
            clouds: '#ffffff',
            cloudShadow: '#e0e0e0',   // Grayer shadow
            pillarLight: '#f0e68c',    // Khaki
            pillarMid: '#d4c4a8',     // Light Brown
            pillarShade: '#a08060',    // Darker Brown
            pillarDark: '#604020',    // Very Dark Brown
            grass: '#30a040',         // Darker, richer green
            grassShade: '#208030',    // Even darker green
            stone: '#c0c0c0',        // Silver
            stoneDark: '#808080',     // Gray
            decorGold: '#ffd700',
            ruins: '#b0a080',        // More muted ruins
            vineGreen: '#2e8b57',     // Sea Green
            vineDark: '#196127',      // Darker Sea Green
            castleLight: 'rgba(200, 190, 170, 0.4)',  // Slightly more opaque
            castleDark: 'rgba(150, 140, 120, 0.3)',   // Darker and more opaque
            leaves: '#388e3c',       // Darker Green
            flowerGold: '#ffd700',
            flowerWhite: '#ffffff',
            particle: 'rgba(255, 255, 255, 0.6)' // White with some opacity
        };

        // Utility function for creating gradients
        function createVerticalGradient(ctx, topColor, bottomColor, startY, endY) {
            const gradient = ctx.createLinearGradient(0, startY, 0, endY);
            gradient.addColorStop(0, topColor);
            gradient.addColorStop(1, bottomColor);
            return gradient;
        }



        class ParallaxElement {
            constructor(x, y, speed, depth) {
                this.x = x;
                this.y = y;
                this.speed = speed;
                this.depth = depth;
                this.originalX = x;  // Store original X for resetting
                this.originalY = y;  // Store original Y for parallax relative to the canvas bottom.
            }

            update(deltaTime, cameraX = 0) {
                // Parallax scrolling.
                this.x = this.originalX - cameraX * this.depth;

                // Wrap around when going off-screen.
                if (this.x + 1000 < cameraX * this.depth ) {
                    this.x = this.originalX + canvas.width;  // Reset at the far right.
                    this.originalX = this.x;  // *Important*: Update originalX
                }
            }

            reset() {
              this.x = this.originalX;
              this.y = this.originalY;
            }
        }



        class DetailedPillar extends ParallaxElement {
            constructor(x, y, width, height, depth) {
                super(x, y, 0.04, depth); // Increased speed slightly
                this.width = width;
                this.height = height;
                this.decorations = this.generateDecorations();
                this.cracks = this.generateCracks(); // Add cracks
            }

            generateDecorations() {
                const decorations = [];
                const numDecorations = Math.floor(5 + Math.random() * 5); // More decorations
                for (let i = 0; i < numDecorations; i++) {
                    decorations.push({
                        x: Math.random() * this.width,
                        y: Math.random() * this.height,
                        size: 7 + Math.random() * 8, // Slightly larger sizes
                        type: Math.random() < 0.7 ? 'circle' : 'square' // Different shapes
                    });
                }
                return decorations;
            }

            generateCracks() {
                const cracks = [];
                const numCracks = Math.floor(2 + Math.random() * 4); // Add a few cracks
                for (let i = 0; i < numCracks; i++) {
                    cracks.push({
                        startX: this.width * (0.2 + Math.random() * 0.6), // Random within pillar
                        startY: this.height * (0.1 + Math.random() * 0.8),
                        length: 20 + Math.random() * 40,
                        angle: (Math.random() - 0.5) * Math.PI / 4 // +/- 45 degrees
                    });
                }
                return cracks;
            }

            draw(ctx) {
                const perspective = 0.4 * this.depth; // Increased perspective
                const topWidth = this.width * (1 - perspective);

                this.drawPillarBody(ctx, topWidth);
                this.drawPillarDetails(ctx, topWidth);
                this.drawDecorations(ctx);
                this.drawCracks(ctx); // Draw cracks
                this.drawCapital(ctx, topWidth);
            }


            drawPillarBody(ctx, topWidth) {
              //  console.log(`Pillar: x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}`);
                ctx.beginPath();
                ctx.moveTo(this.x, this.y); // Start from the top-left
                ctx.lineTo(this.x + this.width, this.y); // Top-right
                ctx.lineTo(this.x + this.width/2 + topWidth/2, this.y - this.height); // Top perspective point
                ctx.lineTo(this.x + this.width/2 - topWidth/2, this.y- this.height); // Bottom perspective point
                ctx.closePath();


                const gradient = ctx.createLinearGradient(this.x, this.y - this.height, this.x, this.y);
                gradient.addColorStop(0, colors.pillarLight); // Lighter at the top
                gradient.addColorStop(0.5, colors.pillarMid);
                gradient.addColorStop(1, colors.pillarShade); // Darker at the bottom
                ctx.fillStyle = gradient;
                ctx.globalAlpha = 0.8; // Slightly more opaque
                ctx.fill();
                ctx.globalAlpha = 1;

                // Add shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Dark, semi-transparent shadow
                ctx.beginPath();
                ctx.moveTo(this.x + this.width, this.y);
                ctx.lineTo(this.x + this.width * 1.1, this.y - 20); // Shadow extends slightly
                ctx.lineTo(this.x + this.width/2 + topWidth/2 + 20, this.y - this.height - 10);
                ctx.lineTo(this.x + this.width/2 + topWidth/2, this.y - this.height);
                ctx.closePath();
                ctx.fill();
            }

            drawPillarDetails(ctx, topWidth) {
                for (let i = 0.2; i <= 0.8; i += 0.2) {
                    ctx.fillStyle = colors.pillarShade;
                    ctx.beginPath();
                    ctx.moveTo(this.x + this.width * i, this.y);
                    ctx.lineTo(this.x + this.width * (i + 0.05), this.y);
                    ctx.lineTo(this.x + this.width/2 + topWidth * (i - 0.5) + topWidth * 0.025, this.y-this.height);
                    ctx.lineTo(this.x + this.width/2 + topWidth * (i - 0.5), this.y-this.height);
                    ctx.closePath();
                    ctx.fill();
                }
            }

            drawDecorations(ctx) {

                this.decorations.forEach(dec => {
                    ctx.fillStyle = colors.decorGold;
                    if (dec.type === 'circle') {
                        ctx.beginPath();
                        ctx.arc(this.x + dec.x, this.y - this.height + dec.y, dec.size, 0, Math.PI * 2);
                        ctx.fill();
                    } else { // Square
                        ctx.fillRect(this.x + dec.x - dec.size / 2, this.y - this.height + dec.y - dec.size / 2, dec.size, dec.size);
                    }
                });
            }


            drawCracks(ctx) {
                ctx.strokeStyle = colors.pillarDark;
                ctx.lineWidth = 2;
                this.cracks.forEach(crack => {
                    ctx.beginPath();
                    ctx.moveTo(this.x + crack.startX, this.y - this.height + crack.startY);
                    ctx.lineTo(this.x + crack.startX + Math.cos(crack.angle) * crack.length,
                               this.y - this.height + crack.startY + Math.sin(crack.angle) * crack.length);
                    ctx.stroke();
                });
            }

            drawCapital(ctx, topWidth) {
                const capitalHeight = this.height * 0.15; // Larger capital
                ctx.fillStyle = colors.stone;

                ctx.beginPath();
                ctx.moveTo(this.x - this.width * 0.3, this.y - this.height); // Wider
                ctx.lineTo(this.x + this.width * 1.3, this.y - this.height); // Wider
                ctx.lineTo(this.x + this.width / 2 + topWidth *1.2, this.y - this.height - capitalHeight);
                ctx.lineTo(this.x + this.width / 2 - topWidth*1.2, this.y - this.height - capitalHeight);
                ctx.closePath();
                ctx.fill();

                // Add detailed carvings to the capital
                ctx.fillStyle = colors.decorGold;
                for (let i = 0; i < 7; i++) { // More carvings
                    const carvingX = this.x + this.width * (-0.2 + i * 0.2);
                    const carvingY = this.y - this.height - capitalHeight / 2;
                    ctx.beginPath();

                    if(i % 2 === 0){
                        ctx.arc(carvingX, carvingY, capitalHeight / 5, 0, Math.PI * 2);
                    } else {
                        ctx.moveTo(carvingX - capitalHeight/6, carvingY);
                        ctx.lineTo(carvingX, carvingY - capitalHeight/4);
                        ctx.lineTo(carvingX + capitalHeight/6, carvingY);
                        ctx.closePath();

                    }
                    ctx.fill();
                }
            }
        }



        class Cloud extends ParallaxElement {
            constructor(x, y, size, depth) {
                super(x, y, 0.015, depth); // Slightly faster clouds
                this.size = size;
                this.segments = this.generateSegments();
            }

            generateSegments() {
                const segments = [];
                const numSegments = Math.floor(4 + Math.random() * 3); // Varying number of segments
                for (let i = 0; i < numSegments; i++) {
                    segments.push({
                        xOffset: (Math.random() - 0.5) * this.size * 2.5, // Wider spread
                        yOffset: (Math.random() - 0.5) * this.size * 1.5, // More vertical variation
                        size: this.size * (0.6 + Math.random() * 0.4) // Slightly larger segments
                    });
                }
                return segments;
            }

            draw(ctx) {
                // Shadow first (darker and offset)
                ctx.fillStyle = colors.cloudShadow;
                this.segments.forEach(seg => {
                    ctx.beginPath();
                    ctx.arc(this.x + seg.xOffset + 10, this.y + seg.yOffset + 15, // Shadow offset
                           seg.size * 1.1, 0, Math.PI * 2); // Slightly larger shadow
                    ctx.fill();
                });

                // Then the cloud itself
                ctx.fillStyle = colors.clouds;
                this.segments.forEach(seg => {
                    ctx.beginPath();
                    ctx.arc(this.x + seg.xOffset, this.y + seg.yOffset,
                           seg.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
        }


       class BackgroundCastle extends ParallaxElement {
          constructor(x, y, width, height, depth) {
            super(x, y, 0.008, depth);  //Slightly increased speed
            this.width = width;
            this.height = height;
            this.towers = this.generateTowers(); // Generate towers
            this.windows = this.generateWindows();  // Generate windows
          }
          generateTowers() {
            const towers = [];
            const numTowers = Math.floor(4 + Math.random() * 3); // 4-6 towers
            for (let i = 0; i < numTowers; i++) {
              towers.push({
                x: this.width * (0.1 + i * 0.2 + (Math.random() - 0.5) * 0.1), // Some x variation
                height: this.height * (0.4 + Math.random() * 0.3), // Varying heights
                width: 20 + Math.random() * 20, // Varying widths
                roofType: Math.random() < 0.6 ? 'pointed' : 'flat' // Different roof types
              });
            }
              return towers;
          }

           generateWindows(){
              const windows = [];
              const numWindows = Math.floor(10 + Math.random() * 15);
               for(let i = 0; i < numWindows; i++){
                  windows.push({
                    x: this.width * Math.random(),
                    y: this.height * (0.2 + Math.random() * 0.6),
                    size: 4 + Math.random() * 4
                  });
               }
             return windows;
           }

          draw(ctx) {

            this.drawMainStructure(ctx);
            this.drawTowers(ctx);
            this.drawDetails(ctx);
            this.drawWindows(ctx);
          }


            drawMainStructure(ctx) {
              ctx.fillStyle = colors.castleLight;
              ctx.beginPath();
              ctx.moveTo(this.x, this.y);
              ctx.lineTo(this.x + this.width, this.y);
              ctx.lineTo(this.x + this.width, this.y - this.height * 0.7); // Increased height
              ctx.lineTo(this.x + this.width * 0.8, this.y - this.height * 0.8);
              ctx.lineTo(this.x + this.width * 0.6, this.y - this.height);  //Main point
              ctx.lineTo(this.x + this.width * 0.4, this.y - this.height * 0.9);
              ctx.lineTo(this.x + this.width * 0.2, this.y - this.height * 0.8);
              ctx.lineTo(this.x, this.y - this.height * 0.7);
              ctx.closePath();
              ctx.fill();


              // Add a subtle gradient for depth
              const gradient = ctx.createLinearGradient(this.x, this.y - this.height, this.x, this.y);
              gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)'); // Lighter at the top
              gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');    // Darker at the bottom
              ctx.fillStyle = gradient;
              ctx.fill();
          }

          drawTowers(ctx) {
                ctx.fillStyle = colors.castleLight;
                this.towers.forEach(tower => {
                const towerX = this.x + tower.x;
                ctx.beginPath();
                ctx.moveTo(towerX, this.y);
                ctx.lineTo(towerX + tower.width, this.y);
                ctx.lineTo(towerX + tower.width, this.y - tower.height);
                if (tower.roofType === 'pointed') {
                    ctx.lineTo(towerX + tower.width / 2, this.y - tower.height * 1.2); // Pointed roof
                    ctx.lineTo(towerX, this.y - tower.height);
                } else {
                    ctx.lineTo(towerX, this.y - tower.height); // Flat roof
                    // Add battlements for flat roofs
                    for (let i = 0; i < tower.width; i += 10) {
                        ctx.fillRect(towerX + i, this.y - tower.height - 5, 5, 5);
                    }
                }

                ctx.closePath();
                ctx.fill();
            });
          }

          drawDetails(ctx) {
            ctx.fillStyle = colors.castleDark;
            for (let i = 0; i < this.width; i += 40) { // More details
              ctx.fillRect(this.x + i, this.y - this.height * 0.4, 30, this.height * 0.3);
            }
          }

           drawWindows(ctx){
              ctx.fillStyle = 'rgba(255, 255, 0, 0.4)'; // Yellowish glow
              this.windows.forEach(window => {
                  ctx.fillRect(this.x + window.x, this.y - window.y, window.size, window.size);
              });
           }
        }

        class Vegetation {
            constructor(x, y, type) {
                this.x = x;
                this.y = y;
                this.type = type;
                this.swayOffset = Math.random() * Math.PI * 2;
                this.leafDetails = this.generateLeafDetails(); // For vines
            }

            generateLeafDetails() {
                if (this.type !== 'vine') return [];
                return Array(5).fill().map(() => ({
                    offset: Math.random() * 20 - 10, // x offset for each leaf
                    size: 4 + Math.random() * 4 // Leaf size variation
                }));
            }

            draw(ctx, time) {
                switch(this.type) {
                    case 'vine':
                        this.drawVine(ctx, time);
                        break;
                    case 'flower':
                        this.drawFlower(ctx);
                        break;
                    case 'bush':
                        this.drawBush(ctx);
                        break;
                }
            }

            drawVine(ctx, time) {
                const sway = Math.sin(time * 0.0015 + this.swayOffset) * 8; // Increased sway
                ctx.strokeStyle = colors.vineGreen;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);

                // More realistic vine curves
                for (let i = 0; i < 5; i++) {
                    const curveX = this.x + sway * (i % 2 ? 1.2 : -0.8); // More variation in sway
                    const curveY = this.y - i * 25; // Taller vines
                    ctx.quadraticCurveTo(
                        curveX, curveY,
                        this.x + sway * (i % 2 ? 0.5 : -0.3), this.y - (i + 1) * 25 // Vary next point
                    );
                }
                ctx.stroke();


                // Leaves with more detail
                 for (let i = 1; i < 5; i++) {
                    ctx.fillStyle = colors.leaves;
                    const leafX = this.x + sway * (i % 2 ? 1 : -1) + this.leafDetails[i-1].offset;
                    const leafY = this.y - i * 25;

                    ctx.beginPath();
                    ctx.ellipse(leafX, leafY,
                                8, this.leafDetails[i-1].size * 2, // Use generated size
                                Math.PI / 4 * (i % 2 ? 1 : -1), 0, Math.PI * 2);
                    ctx.fill();

                    // Add a small line for leaf vein
                    ctx.strokeStyle = colors.vineDark;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(leafX, leafY);
                    ctx.lineTo(leafX + 4 * (i % 2 ? 1 : -1), leafY - 4);
                    ctx.stroke();
                }
            }

            drawFlower(ctx) {
                // More detailed flower center
                ctx.fillStyle = colors.flowerGold;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 6, 0, Math.PI * 2); // Larger center
                ctx.fill();

                // More detailed petals
                ctx.fillStyle = colors.flowerWhite;
                for (let i = 0; i < 8; i++) { // More petals
                    const angle = (i / 8) * Math.PI * 2; // Evenly spaced
                    ctx.beginPath();
                    ctx.ellipse(
                        this.x + Math.cos(angle) * 10, // Larger petals
                        this.y + Math.sin(angle) * 10,
                        8, 5, // More elongated petals
                        angle,
                        0, Math.PI * 2
                    );
                    ctx.fill();

                     // Add a small line for petal detail
                    ctx.strokeStyle = colors.vineDark;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(this.x + Math.cos(angle) * 10, this.y + Math.sin(angle) * 10);
                    ctx.lineTo(this.x + Math.cos(angle) * 15, this.y + Math.sin(angle) * 15);
                    ctx.stroke();
                }
            }

            drawBush(ctx) {
                ctx.fillStyle = colors.grass;
                for (let i = 0; i < 7; i++) { // More bush segments
                    ctx.beginPath();
                    ctx.arc(
                        this.x + (i - 3) * 12, // Wider bush
                        this.y - Math.abs(i - 3) * 6, // Taller
                        12, // Larger segments
                        0, Math.PI * 2
                    );
                    ctx.fill();
                }

                // Add darker spots for depth
                ctx.fillStyle = colors.grassShade;
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.arc(
                        this.x + (Math.random() - 0.5) * 30,
                        this.y - Math.random() * 10,
                        5 + Math.random() * 5, // Random size and position
                        0, Math.PI * 2
                    );
                    ctx.fill();
                }
            }
        }

        class Particle {
            constructor(x, y, size, speed, depth) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.speed = speed;
                this.depth = depth;
                this.alpha = 0.2 + Math.random() * 0.6;  // Random initial opacity.
            }

            update(deltaTime, cameraX) {
                this.x -= this.speed * deltaTime * this.depth;
                this.y += Math.sin(this.x * 0.01) * 0.5;  // Slight wavy movement.
                this.alpha -= 0.005 * deltaTime; // Fade out over time.

                if (this.x < cameraX - this.size || this.alpha <= 0) {
                    this.reset(cameraX);
                }
            }

            reset(cameraX) {
                this.x = cameraX + canvas.width + Math.random() * 200; // Reset beyond the right edge.
                this.y = Math.random() * canvas.height;
                this.size = 2 + Math.random() * 3;
                this.speed = 0.01 + Math.random() * 0.02;
                this.alpha = 0.2 + Math.random() * 0.6;
                this.depth = 0.5 + Math.random() * 0.8;
            }

            draw(ctx) {
              ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;  // Use dynamic alpha.
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }



        const pillars = [];
        const clouds = [];
        const castles = [];
        const vegetation = [];
        const particles = [];
        let lastTime = 0;
        let cameraX = 0; // Camera position for parallax

        function initializeScene() {
           // Clear existing elements (important for reset)
            pillars.length = 0;
            clouds.length = 0;
            castles.length = 0;
            vegetation.length = 0;
            particles.length = 0;

            for (let i = 0; i < 8; i++) {
                const depth = 0.6 + Math.random() * 0.4; // Deeper pillars
                pillars.push(new DetailedPillar(
                    200 + i * 500,  // Wider spacing
                    canvas.height - 150, // Pillars anchored to a consistent y-position
                    150,          // Wider pillars
                    400 - depth * 50,
                    depth
                ));
            }

            for (let i = 0; i < 15; i++) { // More clouds
                const depth = 0.3 + Math.random() * 0.4; // Wider depth range
                clouds.push(new Cloud(
                    Math.random() * canvas.width,
                    50 + Math.random() * 250, // Taller cloud area
                    40 + Math.random() * 30, // Larger clouds
                    depth
                ));
            }

            for (let i = 0; i < 3; i++) {
              const depth = 0.2 + (i * 0.15); // Increased depth difference
              castles.push(new BackgroundCastle(
                300 + i * 1200, // Increased spacing
                canvas.height - 150,  // Consistent y-position for the castle base
                600,        // Much wider castles
                450,        // Taller castles
                depth
              ));
            }


            for (let i = 0; i < 40; i++) { // More vegetation
                vegetation.push(new Vegetation(
                    Math.random() * canvas.width,
                    canvas.height - 100 + Math.random() * 30, // Consistent y-range
                    ['vine', 'flower', 'bush'][Math.floor(Math.random() * 3)]
                ));
            }

            for (let i = 0; i < 50; i++) { // Add particles
                particles.push(new Particle(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    2 + Math.random() * 3,
                    0.01 + Math.random() * 0.02,
                    0.5 + Math.random()* 0.8
                ));
            }
            // Reset camera
            cameraX = 0;
        }

       function drawBackground(ctx) {
            const gradient = createVerticalGradient(ctx, colors.skyTop, colors.skyBottom, 0, canvas.height);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function drawGround(ctx) {
            const platformHeight = 120; // Slightly taller
            const gradient = createVerticalGradient(ctx, colors.stone, colors.stoneDark, canvas.height - platformHeight, canvas.height);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, canvas.height - platformHeight, canvas.width, platformHeight);

            // Ground details (more detailed and varied)
            for (let i = 0; i < canvas.width; i += 25) {
                ctx.fillStyle = colors.grass;
                ctx.beginPath();
                ctx.moveTo(i, canvas.height - platformHeight);
                ctx.lineTo(i + 15 + Math.random() * 10, canvas.height - platformHeight); // Varying widths
                ctx.lineTo(i + 7.5 + Math.random() * 5, canvas.height - platformHeight - (20 + Math.random() * 10)); // Varying heights
                ctx.closePath();
                ctx.fill();
            }

             // Add some cracks in the stone
            ctx.strokeStyle = colors.stoneDark;
            ctx.lineWidth = 2;
            for (let i = 0; i < canvas.width; i += 50 + Math.random() * 50) {
                ctx.beginPath();
                ctx.moveTo(i, canvas.height - platformHeight + 5);
                ctx.lineTo(i + (Math.random() - 0.5) * 20, canvas.height - platformHeight + 20 + Math.random() * 10);
                ctx.stroke();
            }
        }



        function drawScene(timestamp) {
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;

             // Camera movement (smooth)
            cameraX += deltaTime * 0.05;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background and elements, with parallax
            drawBackground(ctx);

             castles.forEach(castle => {
                castle.update(deltaTime, cameraX);
                castle.draw(ctx);
            });

            clouds.forEach(cloud => {
                cloud.update(deltaTime, cameraX);
                cloud.draw(ctx);
            });


            pillars.sort((a, b) => b.depth - a.depth); // Depth sorting
            pillars.forEach(pillar => {
                pillar.update(deltaTime, cameraX);  // Pass cameraX for parallax.
                pillar.draw(ctx);
            });

             drawGround(ctx);

             vegetation.forEach(plant => {
                plant.x = plant.x - cameraX * 0.1;
                plant.draw(ctx, timestamp);
                plant.x = plant.x + cameraX * 0.1;
            });


            particles.forEach(particle => {
                particle.update(deltaTime, cameraX);
                particle.draw(ctx);
            });


            requestAnimationFrame(drawScene);
        }


        // UI controls
        function createControls() {
            const controlPanel = document.createElement('div');
            controlPanel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
                background: rgba(0, 0, 0, 0.7);
                padding: 10px;
                border-radius: 5px;
                color: white;
                font-family: sans-serif;
            `;

            const startButton = document.createElement('button');
            startButton.textContent = 'Draw Sky Sanctuary';
            startButton.style.cssText = 'padding: 8px 12px; margin-right: 5px; cursor: pointer;';
            startButton.onclick = () => {
                initializeScene();
                requestAnimationFrame(drawScene);
            };

            const resetButton = document.createElement('button');
            resetButton.textContent = 'Reset Scene';
            resetButton.style.cssText = 'padding: 8px 12px; cursor: pointer;';
            resetButton.onclick = () => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              initializeScene(); // Re-initialize, don't just clear arrays.
              requestAnimationFrame(drawScene); // start drawing again

            };



            controlPanel.appendChild(startButton);
            controlPanel.appendChild(resetButton);
            document.body.appendChild(controlPanel);
        }

        createControls();
    }

    waitForCanvas();
})();