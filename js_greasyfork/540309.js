// ==UserScript==
// @name         Chrome Dino Mod Menu [15.3]
// @namespace    http://tampermonkey.net/
// @version      15.3
// @description  Best Chrome Dino Mod Menu
// @author       Jadob Lane
// @match        https://chromedino.com/
// @match        https://dino-chrome.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540309/Chrome%20Dino%20Mod%20Menu%20%5B153%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/540309/Chrome%20Dino%20Mod%20Menu%20%5B153%5D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Shared state ---
    let flyHackActive = false;
    let flying = false;
    let flyAnimationId = null;
    let obstacleInterval = null;
    let rainbowGlowEnabled = false;
    let glowElement = null;
    let glowAnimation = null;
    let originalGravity = null;
    let rainbowStyleElement = null;
    let originalBgColor = null;
    let obsESPOverlay = null;
    let obsESPContext = null;
    let obsESPDrawHook = null;
    let removeCloudsInterval = null;
    let rainCloudsEnabled = false;
    let rainCloudsAnimationId = null;
    let rainCloudCanvas = null;
    let rainCloudContext = null;

    let autoPlayEnabled = false;
    let autoPlayInterval = null;

    // Obstacle Tracers variables
    let obsTracerOverlay = null;
    let obsTracerContext = null;
    let obsTracerInterval = null;

    // Teleport Past Obstacles interval
    let teleportInterval = null;

    // Air Jump variables
    let airJumping = false;
    let airJumpInterval = null;

    // --- Mod Menu UI ---
    function createModMenu() {
        const menu = document.createElement('div');
        menu.id = 'modMenu';
        menu.style = `
            position: fixed;
            top: 20px;
            left: 20px;
            padding: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            color: #fff;
            font-family: Arial, sans-serif;
            font-size: 14px;
            border-radius: 8px;
            z-index: 9999;
            user-select: none;
            pointer-events: auto;
            max-width: 200px;
        `;

        const title = document.createElement('div');
        title.textContent = '🦖Chrome Dino Mod Menu';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '8px';
        menu.appendChild(title);

        function addToggle(labelText, onToggle) {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '6px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.marginRight = '6px';
            checkbox.addEventListener('click', e => e.stopPropagation());
            checkbox.addEventListener('change', function () {
                onToggle(this.checked);
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(labelText));
            menu.appendChild(label);
        }

        addToggle('God Mode', toggleGodMode);
        addToggle('Speed Hack', applySpeedHack);
        addToggle('Super Jump', toggleSuperJump);
        addToggle('Fly Hack [F]', toggleFlyHack);
        addToggle('Remove Obstacles', toggleRemoveObstacles);
        addToggle('Remove Clouds', toggleRemoveClouds);
        addToggle('Rain Clouds', toggleRainClouds);
        addToggle('Clone Game', toggleBigDino);
        addToggle('Rainbow Glow', toggleRainbowGlow);
        addToggle('Low Gravity', toggleLowGravity);
        addToggle('Rainbow Background', toggleRainbowBackground);
        addToggle('Night Mode', toggleNightMode);
        addToggle('Obstacle ESP', toggleObstacleESP);
        addToggle('Obstacle Tracers', toggleObsTracers);
        addToggle('Auto Play', toggleAutoPlay);
        addToggle('Teleport Past Obstacles', toggleTeleportPastObstacles);

        // New Air Jump toggle added here
        addToggle('Air Jump', toggleAirJump);

        document.body.appendChild(menu);
        // --- Feature implementations ---
    function toggleGodMode(enabled) {
        const proto = Runner.prototype;
        if (enabled) {
            if (!proto._origGameOver) proto._origGameOver = proto.gameOver;
            proto.gameOver = () => {};
        } else if (proto._origGameOver) {
            proto.gameOver = proto._origGameOver;
        }
    }

    function applySpeedHack(enabled) {
        const inst = Runner.instance_;
        if (inst?.setSpeed) inst.setSpeed(enabled ? 1000 : 6);
    }

   function toggleSuperJump(enabled) {
    const trex = Runner.instance_?.tRex;
    if (!trex?.setJumpVelocity) return;

    if (enabled) {
        trex.setJumpVelocity(100); // super jump
    } else {
        trex.setJumpVelocity(10); // reduced / normal jump height
    }
}


   function toggleFlyHack(enabled) {
  const FLY_SPEED = 5;

  if (enabled && !flyHackActive) {
    flyHackActive = true;

    // Key event handlers
    function onKeyDown(e) {
      if (e.key.toLowerCase() === 'f') flying = true;
    }
    function onKeyUp(e) {
      if (e.key.toLowerCase() === 'f') flying = false;
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Fly animation loop
    function flyUp() {
      const trex = window.Runner?.instance_?.tRex;
      if (flying && trex && trex.yPos > 0) {
        trex.yPos = Math.max(0, trex.yPos - FLY_SPEED);
      }
      flyAnimationId = requestAnimationFrame(flyUp);
    }

    flyUp();

    // Save handlers so we can remove later
    toggleFlyHack.onKeyDown = onKeyDown;
    toggleFlyHack.onKeyUp = onKeyUp;

  } else if (!enabled && flyHackActive) {
    flyHackActive = false;
    flying = false;

    // Remove event listeners
    document.removeEventListener('keydown', toggleFlyHack.onKeyDown);
    document.removeEventListener('keyup', toggleFlyHack.onKeyUp);

    // Cancel animation frame
    if (flyAnimationId) {
      cancelAnimationFrame(flyAnimationId);
      flyAnimationId = null;
    }
  }
}
    function toggleRemoveObstacles(enabled) {
        const r = Runner.instance_;
        if (!r) return;
        if (enabled) {
            obstacleInterval = setInterval(() => { r.horizon.obstacles = []; }, 30);
        } else {
            clearInterval(obstacleInterval);
        }
    }

    function toggleRemoveClouds(enabled) {
        const r = Runner.instance_;
        if (!r) return;
        if (enabled) {
            removeCloudsInterval = setInterval(() => { r.horizon.clouds = []; }, 30);
        } else {
            clearInterval(removeCloudsInterval);
        }
    }

    function toggleRainClouds(enabled) {
        const runner = Runner.instance_;
        if (!runner) return;

        const cloudColor = 'rgba(200,200,200,0.7)';
        const cloudCount = 8;
        const clouds = [];

        if (enabled) {
            rainCloudsEnabled = true;
            rainCloudCanvas = document.createElement('canvas');
            rainCloudCanvas.style.cssText = 'position:absolute;pointer-events:none;z-index:10;';
            document.body.appendChild(rainCloudCanvas);
            rainCloudContext = rainCloudCanvas.getContext('2d');

            for (let i = 0; i < cloudCount; i++) {
                clouds.push({ x: Math.random()*window.innerWidth, y: Math.random()*40+10, r: Math.random()*10+10, s: 0.15+Math.random()*0.1 });
            }

            function animate() {
                if (!rainCloudsEnabled) return;
                const rect = runner.canvas.getBoundingClientRect();
                rainCloudCanvas.width = rect.width;
                rainCloudCanvas.height = rect.height;
                rainCloudCanvas.style.top = rect.top+'px';
                rainCloudCanvas.style.left = rect.left+'px';
                rainCloudContext.clearRect(0,0,rect.width,rect.height);

                for (const c of clouds) {
                    c.x += c.s;
                    if (c.x - c.r*2 > rect.width) { c.x = -c.r*2; c.y = Math.random()*40+10; }
                    rainCloudContext.beginPath();
                    rainCloudContext.fillStyle = cloudColor;
                    rainCloudContext.arc(c.x,c.y,c.r,0,2*Math.PI);
                    rainCloudContext.arc(c.x+c.r*0.6,c.y-c.r*0.3,c.r*0.7,0,2*Math.PI);
                    rainCloudContext.arc(c.x+c.r*1.2,c.y,c.r,0,2*Math.PI);
                    rainCloudContext.fill();
                }

                rainCloudsAnimationId = requestAnimationFrame(animate);
            }
            animate();
        } else {
            rainCloudsEnabled = false;
            cancelAnimationFrame(rainCloudsAnimationId);
            rainCloudCanvas.remove();
        }
    }

    function toggleBigDino(enabled) {
        const interval = setInterval(() => {
            const gameCanvas = document.querySelector('canvas');
            const runner = window.Runner?.instance_;

            if (!gameCanvas || !runner) return;

            clearInterval(interval);

            // Create cloned canvas
            const cloneCanvas = document.createElement('canvas');
            cloneCanvas.width = gameCanvas.width;
            cloneCanvas.height = gameCanvas.height;
            cloneCanvas.style.position = 'absolute';
            cloneCanvas.style.left = gameCanvas.offsetLeft + gameCanvas.width + 20 + 'px';
            cloneCanvas.style.top = gameCanvas.offsetTop + 'px';
            cloneCanvas.style.zIndex = 1000;
            document.body.appendChild(cloneCanvas);

            const cloneCtx = cloneCanvas.getContext('2d');
            const originalCtx = gameCanvas.getContext('2d');

            // Copy the game canvas to the clone every frame
            function updateClone() {
                try {
                    cloneCtx.clearRect(0, 0, cloneCanvas.width, cloneCanvas.height);
                    cloneCtx.drawImage(gameCanvas, 0, 0);
                } catch (e) {
                    console.warn('Clone draw failed:', e);
                }
                requestAnimationFrame(updateClone);
            }

            updateClone();
        }, 100);
    }

    function toggleRainbowGlow(enabled) {
        const r = Runner.instance_;
        const canvas = document.querySelector('.runner-canvas');
        if (!r || !canvas) return;

        const container = canvas.parentElement;
        container.style.position = 'relative';

        if (enabled) {
            if (!glowElement) {
                glowElement = document.createElement('div');
                glowElement.style.cssText = 'position:absolute;pointer-events:none;z-index:9999;';
                container.appendChild(glowElement);
            }
            rainbowGlowEnabled = true;
            let hue = 0;
            glowAnimation = setInterval(() => {
                hue = (hue + 3) % 360;
                glowElement.style.boxShadow = `0 0 8px 4px hsl(${hue},100%,60%)`;
            }, 50);

            (function update() {
                if (!rainbowGlowEnabled) return;
                const d = r.tRex;
                glowElement.style.left  = d.xPos + 'px';
                glowElement.style.top   = d.yPos + 'px';
                glowElement.style.width = d.config.WIDTH + 'px';
                glowElement.style.height= d.config.HEIGHT + 'px';
                requestAnimationFrame(update);
            })();
        } else {
            rainbowGlowEnabled = false;
            clearInterval(glowAnimation);
            glowElement?.remove();
            glowElement = null;
        }
    }

    function toggleLowGravity(enabled) {
        const t = Runner.instance_?.tRex;
        if (!t) return;
        if (enabled) {
            if (originalGravity === null) originalGravity = t.config.GRAVITY;
            t.config.GRAVITY = 0.1;
        } else if (originalGravity !== null) {
            t.config.GRAVITY = originalGravity;
        }
    }

    function toggleRainbowBackground(enabled) {
        if (enabled) {
            rainbowStyleElement = document.createElement('style');
            rainbowStyleElement.textContent = `
                @keyframes rainbowBackground {
                    0% { background-color: red; }
                    16% { background-color: orange; }
                    33% { background-color: yellow; }
                    50% { background-color: green; }
                    66% { background-color: blue; }
                    83% { background-color: indigo; }
                    100% { background-color: violet; }
                }
                body { animation: rainbowBackground 5s linear infinite !important; }
            `;
            document.head.appendChild(rainbowStyleElement);
        } else {
            rainbowStyleElement?.remove();
            document.body.style.animation = 'none';
        }
    }

    function toggleNightMode(enabled) {
        if (enabled) {
            originalBgColor = document.body.style.backgroundColor;
            document.body.style.backgroundColor = 'black';
        } else {
            document.body.style.backgroundColor = originalBgColor || '';
        }
    }

    function toggleObstacleESP(enabled) {
        const r = Runner.instance_;
        const base = r?.canvas;
        if (!base) return;

        if (enabled) {
            if (!obsESPOverlay) {
                obsESPOverlay = document.createElement('canvas');
                obsESPOverlay.width  = base.width;
                obsESPOverlay.height = base.height;
                obsESPOverlay.style.cssText = `
                    position:absolute;
                    left:${base.offsetLeft}px;
                    top:${base.offsetTop}px;
                    pointer-events:none;
                    z-index:9998;
                `;
                base.parentNode.appendChild(obsESPOverlay);
                obsESPContext = obsESPOverlay.getContext('2d');
            }
            obsESPDrawHook = setInterval(() => {
                obsESPContext.clearRect(0,0,obsESPOverlay.width,obsESPOverlay.height);
                for (const o of r.horizon.obstacles) {
                    obsESPContext.strokeStyle = 'blue';
                    obsESPContext.lineWidth = 2;
                    obsESPContext.strokeRect(o.xPos, o.yPos, o.width, o.typeConfig.height);
                }
            }, 16);
        } else {
            clearInterval(obsESPDrawHook);
            obsESPOverlay?.remove();
            obsESPOverlay = null;
        }
    }

    // --- Obstacle Tracers: red lines from dino center to obstacles ---
    function toggleObsTracers(enabled) {
        const r = Runner.instance_;
        const base = r?.canvas;
        if (!base) return;

        if (enabled) {
            if (!obsTracerOverlay) {
                obsTracerOverlay = document.createElement('canvas');
                obsTracerOverlay.width = base.width;
                obsTracerOverlay.height = base.height;
                obsTracerOverlay.style.cssText = `
                    position:absolute;
                    left:${base.offsetLeft}px;
                    top:${base.offsetTop}px;
                    pointer-events:none;
                    z-index:9998;
                `;
                base.parentNode.appendChild(obsTracerOverlay);
                obsTracerContext = obsTracerOverlay.getContext('2d');
            }

            obsTracerInterval = setInterval(() => {
                obsTracerContext.clearRect(0, 0, obsTracerOverlay.width, obsTracerOverlay.height);

                const dino = r.tRex;
                if (!dino) return;

                const dinoCenterX = dino.xPos + dino.config.WIDTH / 2;
                const dinoCenterY = dino.yPos + dino.config.HEIGHT / 2;

                for (const o of r.horizon.obstacles) {
                    const obstacleCenterX = o.xPos + o.width / 2;
                    const obstacleCenterY = o.yPos + o.typeConfig.height / 2;

                    obsTracerContext.beginPath();
                    obsTracerContext.moveTo(dinoCenterX, dinoCenterY);
                    obsTracerContext.lineTo(obstacleCenterX, obstacleCenterY);
                    obsTracerContext.strokeStyle = 'red';
                    obsTracerContext.lineWidth = 2;
                    obsTracerContext.stroke();
                }
            }, 16);
        } else {
            clearInterval(obsTracerInterval);
            if (obsTracerOverlay) {
                obsTracerOverlay.remove();
                obsTracerOverlay = null;
                obsTracerContext = null;
            }
        }
    }
}    // --- Auto Play logic with duck lock and early cactus jump ---
    function toggleAutoPlay(enabled) {
        const r = Runner.instance_;
        if (!r) return;
        autoPlayEnabled = enabled;

        let duckLockUntil = 0; // Timestamp until which the dino should stay ducked

        if (enabled) {
            autoPlayInterval = setInterval(() => {
                const t = r.tRex;
                const obstacles = r.horizon.obstacles;
                if (!t || !obstacles) return;

                const now = Date.now();
                const upcomingObstacles = obstacles.filter(o => o.xPos > t.xPos);
                let shouldDuck = false;

                for (const obs of upcomingObstacles) {
                    const dist = obs.xPos - t.xPos;

                    // Handle pterodactyls
                    if (obs.typeConfig.type === 'PTERODACTYL') {
                        const isLow = obs.yPos > t.yPos;

                        if (dist < 100) {
                            if (isLow && !t.jumping && !t.ducking) {
                                // Jump over low pterodactyl
                                document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 38 }));
                                document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 38 }));
                                break;
                            } else if (!isLow) {
                                // Duck under high pterodactyl
                                shouldDuck = true;
                                duckLockUntil = now + 400; // Stay ducked for 400ms
                                break;
                            }
                        }
                    } else {
                        // Handle cactus or ground obstacle
                        if (dist < 100 && !t.jumping && !t.ducking) {
                            document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 38 })); // jump
                            document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 38 }));
                            break;
                        }
                    }
                }

                // Apply duck or un-duck with duck lock
                if ((shouldDuck || now < duckLockUntil) && !t.ducking) {
                    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 40 })); // duck
                } else if (!shouldDuck && now >= duckLockUntil && t.ducking) {
                    document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 40 })); // un-duck
                }

            }, 20);
        } else {
            clearInterval(autoPlayInterval);
            document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 40 })); // stop ducking
        }
    }

    // --- Teleport Past Obstacles feature ---
    function toggleTeleportPastObstacles(enabled) {
        const runner = Runner.instance_;
        if (!runner) return;

        const dino = runner.tRex;
        const triggerDistance = 80; // pixels ahead of dino

        function teleportPastClosestObstacle() {
            if (!runner.horizon || !runner.horizon.obstacles.length) return false;

            const obstacles = runner.horizon.obstacles;
            const dinoX = dino.xPos;

            let closestObstacle = null;
            let minDistance = Infinity;

            for (const obs of obstacles) {
                const dist = obs.xPos - dinoX;
                if (dist > 0 && dist < triggerDistance && dist < minDistance) {
                    closestObstacle = obs;
                    minDistance = dist;
                }
            }

            if (!closestObstacle) return false;

            // Teleport so dino is just past obstacle + buffer
            const shiftAmount = minDistance + closestObstacle.width + 10;

            obstacles.forEach(o => {
                o.xPos -= shiftAmount;
            });

            if (runner.horizon.clouds && runner.horizon.clouds.length) {
                runner.horizon.clouds.forEach(cloud => {
                    cloud.xPos -= shiftAmount;
                });
            }

            // Reset dino state to running, cancel jump/duck if any
            if (dino.jumping || dino.ducking) {
                dino.jumping = false;
                dino.ducking = false;
                dino.update(0, 'RUNNING');
            }

            return true;
        }

        function teleportMultipleObstacles() {
            let teleported;
            do {
                teleported = teleportPastClosestObstacle();
            } while (teleported);
        }

        if (enabled) {
            teleportInterval = setInterval(() => {
                teleportMultipleObstacles();
            }, 20);
        } else {
            clearInterval(teleportInterval);
        }
    }

    // --- Air Jump (Auto Jump on T toggle) ---
    function toggleAirJump(enabled) {
        const runner = Runner.instance_;
        if (!runner || !runner.tRex) return;

        airJumping = enabled;

        if (airJumping) {
            airJumpInterval = setInterval(() => {
                // Reset jumping state to allow continuous jumping
                runner.tRex.jumping = false;
                runner.tRex.startJump(runner.currentSpeed);
            }, 300); // Adjust interval for speed of auto jump
        } else {
            clearInterval(airJumpInterval);
            airJumpInterval = null;
        }
    }

    // Also listen for 'T' key to toggle Air Jump (independent of mod menu checkbox)
    document.addEventListener('keydown', function (e) {
        if (e.key.toLowerCase() === 't') {
            toggleAirJump(!airJumping);
            // Update checkbox state in menu if visible
            const menu = document.getElementById('modMenu');
            if (menu) {
                const labels = menu.getElementsByTagName('label');
                for (const label of labels) {
                    if (label.textContent.trim() === 'Air Jump (Auto Jump on T)') {
                        const cb = label.querySelector('input[type="checkbox"]');
                        if (cb) cb.checked = airJumping;
                        break;
                    }
                }
            }
        }
    });

    // --- Auto Restart & Hats initialization ---
    const waitForRunner = setInterval(() => {
        if (Runner.instance_) {
            clearInterval(waitForRunner);
            const r = Runner.instance_;
            const canvas = document.querySelector('canvas');

            // Auto-restart
            setInterval(() => {
                if (r.crashed) {
                    canvas.focus();
                    ['keydown','keyup'].forEach(type => {
                        document.dispatchEvent(new KeyboardEvent(type,{
                            key: ' ',
                            code: 'Space',
                            keyCode: 32,
                            which: 32,
                            bubbles: true
                        }));
                    });
                }
            }, 100);

            // Hats
            const hats = ['🎩','👑','⛑️','🧢','🎓'];
            let idx = 0, hatEl, t=0;
            function createHat() {
                hatEl = document.createElement('div');
                hatEl.style.cssText = 'position:absolute;font-size:22px;z-index:1000;pointer-events:none;';
                document.body.appendChild(hatEl);
            }
            function updateHat() {
                const d = r.tRex;
                if (!d) return;
                const rect = r.canvas.getBoundingClientRect();
                const x = rect.left + d.xPos + 22;
                const y = rect.top + d.yPos - 10;
                const angle = Math.sin(t)*20;
                t += 0.1;
                hatEl.style.left = `${x}px`;
                hatEl.style.top  = `${y}px`;
                hatEl.style.transform = `translate(-50%,-50%) rotate(${angle}deg)`;
            }
            function toggleHat() {
                idx = (idx+1) % hats.length;
                hatEl.textContent = hats[idx];
            }
            createHat();
            document.addEventListener('keydown', e => {
                if (e.key.toLowerCase()==='h') toggleHat();
            });
            setInterval(updateHat, 30);
        }
    }, 100);


            // Soccer ball
          const waitForGame = setInterval(() => {
        const r = window.Runner?.instance_;
        if (r && r.tRex && r.canvas) {
            clearInterval(waitForGame);

            const canvas = r.canvas;
            const ball = document.createElement('div');
            ball.textContent = '⚽';
            ball.style.position = 'absolute';
            ball.style.fontSize = '22px';
            ball.style.zIndex = 9999;
            ball.style.pointerEvents = 'none';
            document.body.appendChild(ball);

            let rotation = 0;

            function updateBallPosition() {
                const dino = r.tRex;
                const canvasRect = canvas.getBoundingClientRect();

                const dinoX = canvasRect.left + dino.xPos;
                const dinoY = canvasRect.top + dino.yPos;

                // 27 pixels higher
                const ballX = dinoX + 28;
                const ballY = dinoY + 37;

                rotation += 10; // Constant rolling
                ball.style.left = `${ballX}px`;
                ball.style.top = `${ballY}px`;
                ball.style.transform = `rotate(${rotation}deg)`;

                requestAnimationFrame(updateBallPosition);
            }

            requestAnimationFrame(updateBallPosition);
        }
    }, 100);

    // --- Canvas Visibility Check & Redirect ---
    const CHECK_INTERVAL = 1000;
    const HIDDEN_THRESHOLD = 3; // Number of checks canvas must be missing/hidden before redirect

    let hiddenCount = 0;

    function isCanvasVisible(canvas) {
        if (!canvas) return false;
        const style = window.getComputedStyle(canvas);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
        if (canvas.width === 0 || canvas.height === 0) return false;
        return true;
    }

    const interval = setInterval(() => {
        const canvas = document.querySelector('canvas');

        if (!isCanvasVisible(canvas)) {
            hiddenCount++;
            if (hiddenCount >= HIDDEN_THRESHOLD) {
                clearInterval(interval);
                console.log('[Dino Redirect] Canvas missing or hidden for multiple checks. Redirecting...');
                window.location.href = 'https://dino-chrome.com/';
            }
        } else {
            hiddenCount = 0; // reset if canvas visible again
        }
    }, CHECK_INTERVAL);

    // --- Show Mod Menu ---
    const checker = setInterval(() => {
        if (Runner.instance_?.tRex) {
            clearInterval(checker);
            createModMenu();
        }
    }, 500);

})();