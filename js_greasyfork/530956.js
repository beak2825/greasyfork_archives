// ==UserScript==
// @name         Slither Full Auto Bot 2025 (Zoom Dezoom enabled)
// @namespace    http://slither.com/io
// @version      1.6
// @description  Detects and avoid enemies, Zoom Dezoom, Automatically collects food strategically and use strategic pathfinding. Enhanced and responsive overlay.
// @author       EliottValette
// @match        http://slither.com/io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530956/Slither%20Full%20Auto%20Bot%202025%20%28Zoom%20Dezoom%20enabled%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530956/Slither%20Full%20Auto%20Bot%202025%20%28Zoom%20Dezoom%20enabled%29.meta.js
// ==/UserScript==

/*
===================================================
Section 1: Utility Functions and Debugging
===================================================
*/

// Custom log function (only displays if "logDebugging" is enabled)
window.log = (...args) => window.logDebugging && console.log(...args);

// Functions to save and load preferences in localStorage
const savePreference = (key, value) => localStorage.setItem(key, value);
const loadPreference = (key, def) => JSON.parse(localStorage.getItem(key)) ?? def;

let Logger = 0;
let IsBotActive = true;
let targetFood = null;
let targetFoodTimestamp = 0;
let blacklistedFoods = {};
let criticDanger = false;

// Ajout des variables et fonctions pour le zoom
window.zoomMultiplier = 1.0;

window.updateZoom = function() {
    window.gsc = window.zoomMultiplier;
    const zoomElement = document.getElementById("bot_zoom_overlay");
    if (zoomElement) {
        zoomElement.textContent = `Zoom: ${window.zoomMultiplier.toFixed(1)} (a to zoom, e to zoom out, z to reset)`;
    }
};

window.recursiveZoomUpdate = function() {
    window.gsc = window.zoomMultiplier;
    requestAnimationFrame(window.recursiveZoomUpdate);
};

window.resetZoom = function() {
    window.zoomMultiplier = 1.0;
    window.updateZoom();
};

window.adjustZoom = function(amount) {
    window.zoomMultiplier = Math.max(0.2, Math.min(3.0, window.zoomMultiplier + amount));
    window.updateZoom();
};

// Add listener to memorize real mouse position
window.mousePos = { x: 0, y: 0 };
document.addEventListener('mousemove', function(e) {
    window.mousePos = { x: e.clientX, y: e.clientY };
});

// Variable to memorize bot target position (the "bot mouse pose")
window.botTargetPos = null;

console.log('Bot Starting');

/*
===================================================
Section 2: Window Object Debug Scan
===================================================
After 5 seconds, scans the window object to find
potential snake objects (presence of xx and yy)
*/
setTimeout(() => {
    for (let key in window) {
        try {
            let val = window[key];
            if (val && typeof val === 'object') {
                // Checks if the object has coordinates
                if ('xx' in val && 'yy' in val) {
                    console.log(`🟢 Snake? -> window.${key}`, val);
                }
                // Checks if the object is an array of objects with coordinates
                if (Array.isArray(val) && val.length > 0 && val[0] && 'xx' in val[0] && 'yy' in val[0]) {
                    console.log(`🍏 Array of objects with coords? -> window.${key}`, val);
                }
            }
        } catch (e) {
            // In case of error, move to next property
        }
    }
}, 5000);

/*
===================================================
Section 3: Improved Interface Overlay
===================================================
Creation of a unique container that displays bot status,
coordinates and enemy count in real-time.
*/
(function setupOverlayUI() {
    // Creation of main container with semi-transparent background
    const overlayContainer = document.createElement('div');
    overlayContainer.id = 'bot-overlay-container';
    overlayContainer.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.5);
        padding: 10px;
        border-radius: 5px;
        z-index: 9999;
        font-family: Arial, sans-serif;
        color: #FFF;
        font-size: 14px;
    `;
    document.body.appendChild(overlayContainer);

    // Creation of sub-elements for status, coordinates and enemy count
    const statusDiv = document.createElement('div');
    statusDiv.id = 'bot_status_overlay';
    statusDiv.textContent = 'Status: BOT ON (To Toggle - Press t)';
    overlayContainer.appendChild(statusDiv);

    // Ajout de l'élément de zoom dans le conteneur principal
    const zoomDiv = document.createElement('div');
    zoomDiv.id = 'bot_zoom_overlay';
    zoomDiv.textContent = `Zoom: ${window.zoomMultiplier.toFixed(1)} (a to zoom, e to zoom out, z to reset)`;
    overlayContainer.appendChild(zoomDiv);

    const coordsDiv = document.createElement('div');
    coordsDiv.id = 'bot_coords_overlay';
    coordsDiv.textContent = 'Coords: loading...';
    overlayContainer.appendChild(coordsDiv);

    const enemyDiv = document.createElement('div');
    enemyDiv.id = 'bot_enemies_overlay';
    enemyDiv.textContent = 'Enemies: loading...';
    overlayContainer.appendChild(enemyDiv);

    const nearEnemiesDiv = document.createElement('div');
    nearEnemiesDiv.id = 'bot_enemies_near_overlay';
    nearEnemiesDiv.textContent = 'Enemies (Near): loading...';
    overlayContainer.appendChild(nearEnemiesDiv);

    const midEnemiesDiv = document.createElement('div');
    midEnemiesDiv.id = 'bot_enemies_mid_overlay';
    midEnemiesDiv.textContent = 'Enemies (Mid): loading...';
    overlayContainer.appendChild(midEnemiesDiv);

    const farEnemiesDiv = document.createElement('div');
    farEnemiesDiv.id = 'bot_enemies_far_overlay';
    farEnemiesDiv.textContent = 'Enemies (Far): loading...';
    overlayContainer.appendChild(farEnemiesDiv);

    const criticDangerDiv = document.createElement('div');
    criticDangerDiv.id = 'bot_critic_danger_overlay';
    criticDangerDiv.textContent = 'Danger: loading...';
    overlayContainer.appendChild(criticDangerDiv);

    // Continuous overlay update via requestAnimationFrame
    function updateOverlay() {
        if (window.slither && typeof window.slither.xx === 'number') {
            statusDiv.textContent = IsBotActive ? 'Status: BOT ON (To Turn OFF - Press t)' : 'Status: BOT OFF (To Turn ON - Press t)';
            coordsDiv.textContent = `Coords: ${Math.round(window.slither.xx)} / ${Math.round(window.slither.yy)}`;
            criticDangerDiv.textContent = `Danger: ${criticDanger}`;
        }
        if (Array.isArray(window.slithers) && window.slither) {
            const self = window.slither;
            // Building enemy lists based on distance from their body points
            const nearEnemies = [];
            const midEnemies = [];
            const farEnemies = [];
            window.slithers.forEach(e => {
                if (!e || typeof e.xx !== 'number' || typeof e.yy !== 'number' || e.xx === self.xx)
                    return;
                const bodyPoints = getEnemyBodyPoints(e);
                let minDistance = Infinity;
                let closestPoint = null;
                bodyPoints.forEach(p => {
                    const dx = p.xx - self.xx;
                    const dy = p.yy - self.yy;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < minDistance) {
                        minDistance = dist;
                        closestPoint = p;
                    }
                });
                if (closestPoint) {
                    if (minDistance < 300) {
                        nearEnemies.push({ enemy: e, dist: minDistance, point: closestPoint });
                    } else if (minDistance >= 300 && minDistance <= 700) {
                        midEnemies.push({ enemy: e, dist: minDistance, point: closestPoint });
                    } else if (minDistance > 700) {
                        farEnemies.push({ enemy: e, dist: minDistance, point: closestPoint });
                    }
                }
            });
            enemyDiv.textContent = 'Enemies: ' + window.slithers.length;
            nearEnemiesDiv.textContent = 'Enemies (Near): ' + nearEnemies.map(e => e.enemy.id || `(${Math.round(e.point.xx)},${Math.round(e.point.yy)})`).join(', ');
            midEnemiesDiv.textContent = 'Enemies (Mid): ' + midEnemies.map(e => e.enemy.id || `(${Math.round(e.point.xx)},${Math.round(e.point.yy)})`).join(', ');
            farEnemiesDiv.textContent = 'Enemies (Far): ' + farEnemies.map(e => e.enemy.id || `(${Math.round(e.point.xx)},${Math.round(e.point.yy)})`).join(', ');
        }
        requestAnimationFrame(updateOverlay);
    }
    requestAnimationFrame(updateOverlay);
})();

/*
===================================================
Section 4: World to Screen Coordinate Conversion
===================================================
Utility function to convert game coordinates
(in "world") to screen coordinates.
*/
const worldToScreen = (xx, yy) => {
    const mapX = (xx - window.view_xx) * window.gsc + window.mww2;
    const mapY = (yy - window.view_yy) * window.gsc + window.mhh2;
    return { x: mapX, y: mapY };
};

/*
===================================================
Section 5: Enemy Processing
===================================================
Functions to extract enemy body points and
calculate line color based on distance.
*/

// Gets enemy body points by traversing its segments
function getEnemyBodyPoints(enemy) {
    const points = [];
    if (!enemy.pts) return points;

    for (const segment of enemy.pts) {
        if (!segment.fxs || !segment.fys) continue;

        // Sampling: we get about 10% of the segment points
        const step = Math.max(1, Math.floor(segment.fxs.length / 10));
        for (let i = 0; i < segment.fxs.length; i += step) {
            const x = segment.xx + segment.fxs[i];
            const y = segment.yy + segment.fys[i];

            if (isFinite(x) && isFinite(y)) {
                points.push({ xx: x, yy: y });
            }
        }
    }
    return points;
}

// Calculates a color transitioning from red (close) to green (far)
function DangerColor(start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 3000; // Maximum distance to fully transition to green
    const dangerRatio = Math.max(0, Math.min(1, 1 - dist / maxDist));
    const r = Math.floor(255 * dangerRatio);
    const g = Math.floor(255 * (1 - dangerRatio));
    return `rgb(${r},${g},0)`;
}

/*
===================================================
Section 6: Drawing Lines to Enemies and Food
===================================================
Two functions to draw lines between the player and:
- Enemies (by choosing the closest point of each enemy)
- Food (with a custom color)
*/
// Draws lines connecting the player to enemies
function drawAllEnemyLines(start, enemyList) {
    let canvas = document.getElementById('bot-line-overlay');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'bot-line-overlay';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 9998;
        `;
        document.body.appendChild(canvas);

        // Resize canvas when window is resized
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Si le bot est OFF, on trie les ennemis par distance et on garde les 5 plus proches
    let enemiesToDraw = enemyList;
    if (!IsBotActive) {
        enemiesToDraw = enemyList
            .map(enemy => {
                const body_points = getEnemyBodyPoints(enemy);
                let min_dist = Infinity;
                body_points.forEach(p => {
                    const dx = p.xx - window.slither.xx;
                    const dy = p.yy - window.slither.yy;
                    const d = dx * dx + dy * dy;
                    if (d < min_dist) min_dist = d;
                });
                return { enemy, min_dist };
            })
            .sort((a, b) => a.min_dist - b.min_dist)
            .slice(0, 5)
            .map(obj => obj.enemy);
    }

    enemiesToDraw.forEach(enemy => {
        const body_points = getEnemyBodyPoints(enemy);
        let min_dist = Infinity;
        let min_dist_point = null;
        body_points.forEach(p => {
            const screenPoint = worldToScreen(p.xx, p.yy);
            const dx = screenPoint.x - start.x;
            const dy = screenPoint.y - start.y;
            const d = dx * dx + dy * dy;
            if (d < min_dist && d > 0) {
                min_dist = d;
                min_dist_point = screenPoint;
            }
        });
        if (Logger < 100) {
            console.log('min_dist', min_dist);
            Logger++;
        }
        if (min_dist_point) {
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(min_dist_point.x, min_dist_point.y);
            ctx.strokeStyle = DangerColor(start, min_dist_point);
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    });
}


// Draws lines connecting the player to food particles
function drawAllFoodLines(start, foodList) {
    let canvas = document.getElementById('bot-line-overlay-food');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'bot-line-overlay-food';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 9997;
        `;
        document.body.appendChild(canvas);

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    foodList.forEach(food => {
        const end = worldToScreen(food.xx, food.yy);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = 'cyan';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
}

/*
===================================================
Section 7: Animation Loop for Line Drawing
===================================================
Uses requestAnimationFrame for smooth animation.
*/
(function updateEnemyLines() {
    function update() {
        if (
            window.slither &&
            window.slither.xx !== undefined &&
            window.view_xx !== undefined &&
            Array.isArray(window.slithers)
        ) {
            const selfScreen = worldToScreen(window.slither.xx, window.slither.yy);
            const validEnemies = window.slithers.filter(e =>
                e &&
                typeof e.xx === 'number' &&
                typeof e.yy === 'number' &&
                window.slither.xx !== e.xx
            );
            drawAllEnemyLines(selfScreen, validEnemies);
        }
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
})();

(function updateFoodTargetLine() {
    let canvas = document.getElementById('bot-line-overlay-food');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'bot-line-overlay-food';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 9997;
        `;
        document.body.appendChild(canvas);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    function update() {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (window.slither && typeof window.slither.xx === 'number' && targetFood) {
            const selfScreen = worldToScreen(window.slither.xx, window.slither.yy);
            const end = worldToScreen(targetFood.xx, targetFood.yy);
            ctx.beginPath();
            ctx.moveTo(selfScreen.x, selfScreen.y);
            ctx.lineTo(end.x, end.y);
            ctx.strokeStyle = 'cyan';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
})();

/*
===================================================
Section 8: Line between Snake and Real Mouse
===================================================
Draws a magenta line between the snake and the real mouse position.
*/
(function updateMouseLine() {
    let canvas = document.getElementById('bot-line-mouse');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'bot-line-mouse';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 9996;
        `;
        document.body.appendChild(canvas);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    function update() {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (window.slither && typeof window.slither.xx === 'number' && window.mousePos) {
            const selfScreen = worldToScreen(window.slither.xx, window.slither.yy);
            ctx.beginPath();
            ctx.moveTo(selfScreen.x, selfScreen.y);
            ctx.lineTo(window.mousePos.x, window.mousePos.y);
            ctx.strokeStyle = 'magenta';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
})();

/*
===================================================
Section 9: Line between Snake and Bot Mouse Position
===================================================
Draws a yellow line between the snake and the bot's target position.
*/
(function updateBotMouseLine() {
    let canvas = document.getElementById('bot-line-botmouse');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'bot-line-botmouse';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 9995;
        `;
        document.body.appendChild(canvas);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    function update() {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (window.slither && typeof window.slither.xx === 'number' && window.botTargetPos) {
            const selfScreen = worldToScreen(window.slither.xx, window.slither.yy);
            const targetScreen = worldToScreen(window.botTargetPos.x, window.botTargetPos.y);
            ctx.beginPath();
            ctx.moveTo(selfScreen.x, selfScreen.y);
            ctx.lineTo(targetScreen.x, targetScreen.y);
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
})();

/*
===================================================
Section 10: FoodBot - Automatic Movement Towards Food
===================================================
Detects the closest enemy and chooses a food particle
located in the opposite direction to move the mouse (and thus the snake).
*/

// Simulates a mouse movement event towards a given position in the world
function moveMouseToward(worldX, worldY) {
    // Updates the bot's target position
    window.botTargetPos = { x: worldX, y: worldY };

    const screenX = (worldX - window.view_xx) * window.gsc + window.mww2;
    const screenY = (worldY - window.view_yy) * window.gsc + window.mhh2;

    const event = new MouseEvent('mousemove', {
        clientX: screenX,
        clientY: screenY,
        bubbles: true
    });
    window.dispatchEvent(event);
}

// Declare a variable for the FoodBot interval
let foodBotInterval = null;

// The function containing the FoodBot update code
function foodBotUpdate() {
    if (
        window.slither &&
        typeof window.slither.xx === 'number' &&
        Array.isArray(window.foods)
    ) {
        const self = window.slither;
        const now = Date.now();

        // Building the list of enemies with their closest body point
        let enemyList = [];
        if (Array.isArray(window.slithers)) {
            window.slithers.forEach(enemy => {
                if (!enemy || typeof enemy.xx !== 'number' || typeof enemy.yy !== 'number' || enemy.xx === self.xx)
                    return;
                const bodyPoints = getEnemyBodyPoints(enemy);
                if (bodyPoints.length === 0) return;
                let bestPoint = null;
                let bestDistance = Infinity;
                let bestDx = 0, bestDy = 0;
                bodyPoints.forEach(p => {
                    const dx = p.xx - self.xx;
                    const dy = p.yy - self.yy;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < bestDistance) {
                        bestDistance = d;
                        bestPoint = p;
                        bestDx = dx;
                        bestDy = dy;
                    }
                });
                if (bestPoint) {
                    enemyList.push({ point: bestPoint, distance: bestDistance, dx: bestDx, dy: bestDy });
                }
            });
        }

        // Utility function to choose the best food in SAFE mode
        // This targets foods with the largest size and high local density (grouping)
        function chooseBestFood(foods) {
            // D'abord, filtrer les nourritures pour ne garder que celles à moins de 100 pixels du joueur
            const maxPlayerDistance = 300;
            const nearbyFoods = foods.filter(f => {
                if (!f || typeof f.xx !== 'number' || typeof f.yy !== 'number') return false;
                const dx = f.xx - self.xx;
                const dy = f.yy - self.yy;
                const d = Math.sqrt(dx * dx + dy * dy);
                return d <= maxPlayerDistance;
            });

            // Si aucune nourriture à proximité, retourner null
            if (nearbyFoods.length === 0) return null;

            let bestFood = null;
            let bestScore = -Infinity;
            const groupRadius = 60; // rayon pour déterminer le groupement

            nearbyFoods.forEach(f => {
                if (!f || typeof f.xx !== 'number' || typeof f.yy !== 'number' || typeof f.sz !== 'number') return;
                let groupCount = 0;

                // Compter combien d'autres nourritures sont proches de celle-ci
                nearbyFoods.forEach(other => {
                    if (other === f) return;
                    const dx = other.xx - f.xx;
                    const dy = other.yy - f.yy;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < groupRadius) {
                        groupCount++;
                        groupCount += 1/(d+1e-5) * 100;
                    }
                });

                const score = f.sz + groupCount; // combine taille et densité
                if (score > bestScore) {
                    bestScore = score;
                    bestFood = f;
                }
            });

            return bestFood;
        }

        // Filter the food list to exclude blacklisted ones
        let availableFoods = window.foods.filter(f => {
            return (
                f &&
                typeof f.xx === 'number' &&
                typeof f.yy === 'number' &&
                !(blacklistedFoods[`${f.xx}_${f.yy}`] && now < blacklistedFoods[`${f.xx}_${f.yy}`])
            );
        });

        let target = null;

        if (enemyList.length === 0) {
            // No nearby enemies (safe mode): target food with highest value (size + grouping)
            target = chooseBestFood(availableFoods);
        } else {
            // Separate enemies by distance
            const enemiesWithin300 = enemyList.filter(e => e.distance < 300);
            const enemiesBetween300And700 = enemyList.filter(e => e.distance >= 300 && e.distance <= 700);
            // Case 3: If there are one or more enemies in the <300 range, run away
            if (enemiesWithin300.length > 0) {
                let totalWeight = 0;
                let avgX = 0;
                let avgY = 0;

                enemiesWithin300.forEach(e => {
                    const weight = 1 / (e.distance + 1e-5); // Closer = more weight
                    const normX = e.dx / e.distance;
                    const normY = e.dy / e.distance;
                    avgX += normX * weight;
                    avgY += normY * weight;
                    totalWeight += weight;
                });

                if (totalWeight > 0) {
                    avgX /= totalWeight;
                    avgY /= totalWeight;
                }

                const scale = 150;
                const runAwayX = self.xx - avgX * scale;
                const runAwayY = self.yy - avgY * scale;
                moveMouseToward(runAwayX, runAwayY);
                targetFood = null;
                return;
            }

            // Case 2: No critical enemies (<300) but at least one between 300 and 700
            if (enemiesBetween300And700.length > 0) {
                enemiesBetween300And700.sort((a, b) => a.distance - b.distance);
                const closest = enemiesBetween300And700[0];
                // Calculate opposite vector from enemy body point
                const vecX = self.xx - closest.point.xx;
                const vecY = self.yy - closest.point.yy;
                const vecLength = Math.sqrt(vecX * vecX + vecY * vecY);
                const normX = vecLength ? vecX / vecLength : 0;
                const normY = vecLength ? vecY / vecLength : 0;
                // Only keep foods in the opposite direction
                const filteredFoods = availableFoods.filter(f => {
                    const foodVecX = f.xx - self.xx;
                    const foodVecY = f.yy - self.yy;
                    const dot = foodVecX * normX + foodVecY * normY;
                    return dot > 0;
                });
                target = filteredFoods.length ? chooseBestFood(filteredFoods) : chooseBestFood(availableFoods);
            } else {
                // Case 1: All enemies are beyond 700: choose nearest food
                target = chooseBestFood(availableFoods);
            }
        }

        // Blacklist mechanism if the same target is aimed at for more than 2 seconds
        if (
            target &&
            targetFood &&
            target.xx === targetFood.xx &&
            target.yy === targetFood.yy
        ) {
            if (now - targetFoodTimestamp >= 2000) {
                const key = `${targetFood.xx}_${targetFood.yy}`;
                blacklistedFoods[key] = now + 2000;
                const alternatives = availableFoods.filter(
                    f => !(f.xx === targetFood.xx && f.yy === targetFood.yy)
                );
                if (alternatives.length > 0) {
                    target = chooseBestFood(alternatives);
                    targetFoodTimestamp = now;
                } else {
                    target = null;
                }
            }
        } else {
            targetFoodTimestamp = now;
        }

        if (target) {
            moveMouseToward(target.xx, target.yy);
            targetFood = target;
        }
    }
}

// Start FoodBot by launching the setInterval
function startFoodBot() {
    if (!foodBotInterval) {
        foodBotInterval = setInterval(foodBotUpdate, 20);
    }
}

// Stop FoodBot
function stopFoodBot() {
    if (foodBotInterval) {
        clearInterval(foodBotInterval);
        foodBotInterval = null;
    }
}

// On startup, if bot is enabled, launch FoodBot
if (IsBotActive) {
    startFoodBot();

    // Initialise Zoom overlay
    window.recursiveZoomUpdate();
}

// Modifier le gestionnaire d'événements de touches pour ajouter les commandes de zoom
document.addEventListener('keydown', (e) => {
    // Here we use the "t" key to toggle the bot (you can modify according to your needs)
    if (e.key.toLowerCase() === 't') {
        IsBotActive = !IsBotActive;
        if (IsBotActive) {
            startFoodBot();
        } else {
            stopFoodBot();
        }
    }

    // Ajout des touches pour le zoom
    if (e.key.toLowerCase() === 'a') {
        window.adjustZoom(0.1);
    } else if (e.key.toLowerCase() === 'e') {
        window.adjustZoom(-0.1);
    } else if (e.key.toLowerCase() === 'z') {
        window.resetZoom();
    }
});