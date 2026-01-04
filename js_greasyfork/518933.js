// ==UserScript==
// @name         EvoWorld.io Esp Mod Menu
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds transparency, max-range enemy show with danger alerts, sees players in safe zones to EvoWorld.io, and toggleable menu with Tab.
// @author       Ice_Mod
// @match        https://evoworld.io/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518933/EvoWorldio%20Esp%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/518933/EvoWorldio%20Esp%20Mod%20Menu.meta.js
// ==/UserScript==
//Enable ESP In English - C

//sorry script test
(function() {
    alert("Beta Script By t.me/Ice_Mod");
    'use strict';

    function waitForGameLoad() {
        if (typeof game !== 'undefined' && game.canvas) {
            initScript();
        } else {
            setTimeout(waitForGameLoad, 500);
        }
    }

    function initScript() {
        console.log("Game loaded, initializing script...");

        // --- Feature Toggles ---
        let showEnemyLines = true;
        let emoteSpamEnabled = false;

        // --- Enemy Line Color ---
        let enemyLineColor = 'yellow';

        // --- Menu Container Creation ---
        const menuContainer = document.createElement('div');
        menuContainer.style.position = 'absolute';
        menuContainer.style.top = '10px';
        menuContainer.style.right = '10px';
        menuContainer.style.zIndex = '1000';
        menuContainer.style.backgroundColor = '#fff';
        menuContainer.style.padding = '10px';
        menuContainer.style.border = '1px solid #ccc';

        // --- Menu Toggle ---
        let menuOpen = true; // Start with menu open by default
        menuContainer.style.display = 'block';
        
         document.addEventListener("keyup", function (event) {
         if (event.key === "C" || event.key === "c") {
      showEnemyLines = !showEnemyLines;
    }
  });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                event.preventDefault();
                menuOpen = !menuOpen;
                menuContainer.style.display = menuOpen ? 'block' : 'none';
            }
        });

        // --- Menu Items ---
        const cloudSlider = createSlider('Cloud Transparency', 0, 1, 0.5);
        const swampSlider = createSlider('Swamp Transparency', 0, 1, 1);
        const bushSlider = createSlider('Bush Transparency', 0, 1, 1);
        const enemyLinesCheckbox = createCheckbox('Enemy Show', true);
        const emoteSpamCheckbox = createCheckbox('Emote Spam Beta', false);
        const colorPicker = createColorPicker('Enemy Line Color', enemyLineColor);

        menuContainer.appendChild(cloudSlider);
        menuContainer.appendChild(swampSlider);
        menuContainer.appendChild(bushSlider);
        menuContainer.appendChild(enemyLinesCheckbox);
        menuContainer.appendChild(emoteSpamCheckbox);
        menuContainer.appendChild(colorPicker);
        document.body.appendChild(menuContainer);

         // Helper functions to create menu elements
        function createSlider(label, min, max, defaultValue, step = 0.01) {
            const container = document.createElement('div');
            container.style.marginBottom = '5px';

            const labelElement = document.createElement('label');
            labelElement.textContent = label;
            container.appendChild(labelElement);

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = min;
            slider.max = max;
            slider.step = step;
            slider.value = defaultValue;
            container.appendChild(slider);

            return container;
        }

        function createCheckbox(label, checked) {
            const container = document.createElement('div');
            container.style.marginBottom = '5px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = checked;
            container.appendChild(checkbox);

            const labelElement = document.createElement('label');
            labelElement.textContent = label;
            container.appendChild(labelElement);

            return container;
        }

        function createColorPicker(label, defaultValue) {
            const container = document.createElement('div');
            container.style.marginBottom = '5px';

            const labelElement = document.createElement('label');
            labelElement.textContent = label;
            container.appendChild(labelElement);

            const picker = document.createElement('input');
            picker.type = 'color';
            picker.value = defaultValue;
            container.appendChild(picker);

            return container;
        }

        // Apply transparency
        function applyTransparency() {
            const cloudAlpha = parseFloat(cloudSlider.querySelector('input').value);
            const swampAlpha = parseFloat(swampSlider.querySelector('input').value);
            const bushAlpha = parseFloat(bushSlider.querySelector('input').value);

            Object.values(game.gameObjects).forEach(obj => {
                if (obj.name.includes('cloud')) {
                    obj.opacity = cloudAlpha;
                } else if (obj.name === 'swamp') {
                    obj.opacity = swampAlpha;
                } else if (obj.name.includes('bush')) {
                    obj.opacity = bushAlpha;
                }
            });
        }

        // --- Override game.isVisible to make players in safe zones visible ---
        const originalIsVisible = game.isVisible;
        game.isVisible = function(camera, obj, originalWidth, originalHeight) {
            if (obj.type === objectType.PLAYER && obj.inSafeZone) {
                // Use your desired logic to make them visible, for example:
                return true; // Always visible
                // Or calculate a custom visibility based on safe zone location 
            }
            return originalIsVisible.call(this, camera, obj, originalWidth, originalHeight);
        }

        // Draw enemy lines, distances, boxes, and danger labels
        function drawEnemyLines() {
            if (showEnemyLines) {
                const ctx = game.dynamicContext;
                ctx.strokeStyle = enemyLineColor;
                ctx.lineWidth = 2;
                ctx.font = '14px Arial';

                const extendedRenderDistance = game.worldWidth;

                Object.values(game.gameObjects).forEach(obj => {
                    if (obj.type === objectType.PLAYER && obj !== game.me &&
                        game.isVisible(game.camera, obj, extendedRenderDistance, extendedRenderDistance)) {
                        const myPos = game.getRenderPosition(game.me.position.x + game.me.width / 2, game.me.position.y + game.me.height / 2);
                        const enemyPos = game.getRenderPosition(obj.position.x + obj.width / 2, obj.position.y + obj.height / 2);
                        const distance = Math.round(getDistance(game.me.position.x, game.me.position.y, obj.position.x, obj.position.y));

                        // Draw line
                        drawDangerLine(ctx, myPos, enemyPos, obj);

                        // Draw distance
                        ctx.fillStyle = 'white';
                        ctx.fillText(`${distance}m`, (myPos.x + enemyPos.x) / 2, (myPos.y + enemyPos.y) / 2);

                        // Draw glowing box
                        ctx.shadowColor = 'cyan';
                        ctx.shadowBlur = 10;
                        const boxSize = 40;
                        ctx.strokeRect(enemyPos.x - boxSize / 2, enemyPos.y - boxSize / 2, boxSize, boxSize);
                        ctx.shadowBlur = 0;

                        // Draw danger label
                        drawDangerLabel(ctx, enemyPos, obj);
                    }
                });
            }
        }

        // Draw line with danger indicator
        function drawDangerLine(ctx, myPos, enemyPos, enemy) {
            ctx.beginPath();
            ctx.moveTo(myPos.x, myPos.y);
            ctx.lineTo(enemyPos.x, enemyPos.y);

            // Set line color based on danger
            if (canEat(enemy, game.me)) {
                ctx.strokeStyle = 'red'; // Dangerous enemy
            } else {
                ctx.strokeStyle = enemyLineColor; // Safe enemy
            }
            ctx.stroke();
        }

        // Draw Danger/Safe label above enemy
        function drawDangerLabel(ctx, enemyPos, enemy) {
            ctx.fillStyle = canEat(enemy, game.me) ? 'red' : 'green'; 
            ctx.font = 'bold 16px Arial';
            let label = canEat(enemy, game.me) ? 'Danger' : 'Safe';
            let textWidth = ctx.measureText(label).width;
            ctx.fillText(label, enemyPos.x - textWidth / 2, enemyPos.y - 55); // Moved label higher 
        }

        // --- Dynamic Transparency for Clouds/Bushes/Swamp ---
        const originalDrawObject = game.drawObject;
        game.drawObject = function (obj, staticCanvas) {
            if ((obj.name.includes('cloud') || obj.name === 'swamp' || obj.name.includes('bush')) && game.isVisible(game.camera, obj)) {
                obj.opacity = parseFloat(cloudSlider.querySelector('input').value);
                staticCanvas = false;
            }
            originalDrawObject.call(this, obj, staticCanvas);
        };

        // --- Emote Spam ---
        emoteSpamCheckbox.addEventListener('change', () => {
            emoteSpamEnabled = emoteSpamCheckbox.querySelector('input').checked;
            if (emoteSpamEnabled) {
                startEmoteSpam();
            } else {
                stopEmoteSpam();
            }
        });

        let emoteSpamInterval;
        function startEmoteSpam() {
            emoteSpamInterval = setInterval(() => {
                if (typeof gameServer !== 'undefined' && !imDead && joinedGame) {
                    const randomEmoteId = Math.floor(Math.random() * 13) + 1;
                    sendEmote(randomEmoteId);
                }
            }, 1000);
        }

        function stopEmoteSpam() {
            clearInterval(emoteSpamInterval);
        }

        // Event listeners for menu changes
        cloudSlider.addEventListener('input', applyTransparency);
        swampSlider.addEventListener('input', applyTransparency);
        bushSlider.addEventListener('input', applyTransparency);
        enemyLinesCheckbox.addEventListener('change', () => showEnemyLines = enemyLinesCheckbox.querySelector('input').checked);
        colorPicker.addEventListener('change', () => enemyLineColor = colorPicker.querySelector('input').value);

        // Add enemy lines to the game loop
        const originalBeforeDrawAllObjects = game.beforeDrawAllObjects;
        game.beforeDrawAllObjects = function () {
            originalBeforeDrawAllObjects.apply(this, arguments);
            drawEnemyLines();
        };

        // Set initial transparency
        applyTransparency();
    }

    // --- Helper Functions ---
    function getDistance(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // --- Food Eating Logic ---
    function canEat(eater, food) {
        if (foodChain[eater.name] && foodChain[eater.name].eats[food.name]) {
            return true;
        }
        return false;
    }

    waitForGameLoad();
})();