// ==UserScript==
// @name         Emulation's Evo Client
// @description  Really advanced tracers for evoworld.io
// @match        evoworld.io
// @version      8.4
// @license      MIT
// @namespace https://greasyfork.org/users/1481831
// @downloadURL https://update.greasyfork.org/scripts/543812/Emulation%27s%20Evo%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/543812/Emulation%27s%20Evo%20Client.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.title = "Emulation's Evo Client Enhanced";

  // Wait for game objects to load
  function waitForGameLoad() {
    if (typeof game !== 'undefined' && game.canvas && game.me) {
      initModMenu();
    } else {
      setTimeout(waitForGameLoad, 100);
    }
  }

  function initModMenu() {
    try {
      const canvas = game.canvas;
      canvas.style.cursor = 'default';

      // Configuration object
      const config = {
        showFood: false,
        showEnemies: false,
        showAllObjects: false,
        highlightEnemies: false,
        showEnemyNames: false,
        showHealthBars: false,
        showResourceIndicators: false,
        showThreatLevel: false,
        showDistanceOpacity: false,
        showHiddenObjects: false,
        showTeamIndicators: false,
        showMiniMap: false,
        showVelocityArrows: false,
        showHitboxOutlines: false,
        showLevelIndicators: false,
        showStatusEffects: false,
        showPredatorESP: false,
        showPreyESP: false,
        showSafeZones: false,
        showGridOverlay: false,
        showESPBoxes: false,
        showPlayerPaths: false,
        tracerLength: 1.0, // 0.5 to 2.0
        tracerThickness: 1.5, // 0.5 to 5.0
        tracerGlow: false,
        tracerColor: '#ffffff' // Default white
      };

      // Create mod menu container
      const menu = document.createElement('div');
      Object.assign(menu.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        width: '400px',
        maxHeight: '95vh',
        background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95), rgba(40, 40, 40, 0.95))',
        color: '#ffffff',
        borderRadius: '12px',
        fontFamily: '"Montserrat", sans-serif',
        zIndex: 10000,
        display: 'none',
        boxShadow: '0 4px 20px rgba(0, 255, 128, 0.4)',
        overflow: 'hidden',
        border: '1px solid rgba(0, 255, 128, 0.5)'
      });
      document.body.appendChild(menu);

      // CSS
      const style = document.createElement('style');
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
        .mod-menu * { box-sizing: border-box; }
        .mod-menu { font-size: 14px; }
        .mod-menu input, .mod-menu select {
          background: #222;
          color: #fff;
          border: 1px solid #00ff80;
          border-radius: 6px;
          padding: 6px;
          transition: all 0.3s ease;
        }
        .mod-menu input:focus, .mod-menu select:focus {
          outline: none;
          border-color: #00cc66;
          background: #333;
        }
        .mod-menu .content {
          max-height: calc(95vh - 70px);
          overflow-y: auto;
          padding: 15px;
          scrollbar-width: thin;
          scrollbar-color: #00ff80 #222;
        }
        .mod-menu .content::-webkit-scrollbar {
          width: 10px;
        }
        .mod-menu .content::-webkit-scrollbar-track {
          background: #222;
        }
        .mod-menu .content::-webkit-scrollbar-thumb {
          background: #00ff80;
          border-radius: 5px;
        }
        .mod-menu .title-bar {
          background: #1a1a1a;
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #00ff80;
        }
        .mod-menu .title {
          font-size: 18px;
          font-weight: 700;
          color: #00ff80;
        }
        .mod-menu .close-btn {
          font-size: 24px;
          cursor: pointer;
          color: #fff;
          transition: color 0.3s ease;
        }
        .mod-menu .close-btn:hover {
          color: #00ff80;
        }
        .mod-menu .section-header {
          font-size: 16px;
          font-weight: 600;
          color: #00ff80;
          margin: 15px 0 10px;
          padding: 5px 0 5px 10px;
          cursor: pointer;
          text-transform: uppercase;
          border-left: 3px solid #00ff80;
        }
        .mod-menu .section-header:hover {
          color: #00cc66;
        }
        .mod-menu .section-content {
          display: none;
          padding-left: 10px;
        }
        .mod-menu .section-content.active {
          display: block;
        }
        .mod-menu .separator {
          border-top: 1px solid #444;
          margin: 10px 0;
        }
        .mod-menu .mod-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          gap: 10px;
        }
        .mod-menu .mod-label {
          flex: 1;
          font-size: 14px;
        }
        .mod-menu .toggle-btn {
          background: #ff3333;
          color: #fff;
          border: 1px solid #00ff80;
          border-radius: 6px;
          padding: 6px 12px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          min-width: 60px;
          text-align: center;
        }
        .mod-menu .toggle-btn.on {
          background: #00ff80;
          color: #000;
        }
        .mod-menu .toggle-btn:hover {
          background: #00cc66;
          border-color: #00cc66;
        }
        .mod-menu .range-input {
          width: 100px;
        }
        .mod-menu .color-input {
          width: 60px;
          height: 26px;
          padding: 2px;
          cursor: pointer;
        }
        .mod-menu .notification {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: rgba(34, 34, 34, 0.95);
          color: #fff;
          padding: 12px 18px;
          border-radius: 8px;
          border: 1px solid #00ff80;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.3s ease;
          zIndex: 10001;
          font-size: 14px;
        }
        .mod-menu .notification.show {
          opacity: 1;
          transform: translateY(0);
        }
        .mod-menu .mini-map {
          position: fixed;
          bottom: 15px;
          left: 15px;
          width: 200px;
          height: 200px;
          background: rgba(0, 0, 0, 0.8);
          border: 2px solid #00ff80;
          border-radius: 8px;
          zIndex: 9999;
        }
      `;
      document.head.appendChild(style);

      // Mod menu HTML
      menu.innerHTML = `
        <div class="mod-menu">
          <div class="title-bar">
            <h2 class="title">Emulation's Evo Client Enhanced</h2>
            <button class="close-btn">&times;</button>
          </div>
          <div class="content">
            <div class="section-header" data-section="esp">ESP Features</div>
            <div class="section-content" id="esp-section">
              <div class="mod-item">
                <span class="mod-label">ESP Food</span>
                <button class="toggle-btn" id="showFood">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">ESP Enemies</span>
                <button class="toggle-btn" id="showEnemies">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">ESP All Objects</span>
                <button class="toggle-btn" id="showAllObjects">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">ESP Predators</span>
                <button class="toggle-btn" id="showPredatorESP">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">ESP Prey</span>
                <button class="toggle-btn" id="showPreyESP">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">ESP Hidden Objects</span>
                <button class="toggle-btn" id="showHiddenObjects">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">ESP Bounding Boxes</span>
                <button class="toggle-btn" id="showESPBoxes">OFF</button>
              </div>
            </div>
            <div class="section-header" data-section="indicators">Indicators</div>
            <div class="section-content" id="indicators-section">
              <div class="mod-item">
                <span class="mod-label">Enemy Name Tags</span>
                <button class="toggle-btn" id="showEnemyNames">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">ESP Health Bars</span>
                <button class="toggle-btn" id="showHealthBars">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">ESP Resource Indicators</span>
                <button class="toggle-btn" id="showResourceIndicators">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">ESP Threat Level</span>
                <button class="toggle-btn" id="showThreatLevel">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">ESP Team Indicators</span>
                <button class="toggle-btn" id="showTeamIndicators">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">ESP Level Indicators</span>
                <button class="toggle-btn" id="showLevelIndicators">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">ESP Status Effects</span>
                <button class="toggle-btn" id="showStatusEffects">OFF</button>
              </div>
            </div>
            <div class="section-header" data-section="overlays">Visual Overlays</div>
            <div class="section-content" id="overlays-section">
              <div class="mod-item">
                <span class="mod-label">Show Mini-Map</span>
                <button class="toggle-btn" id="showMiniMap">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">ESP Velocity Arrows</span>
                <button class="toggle-btn" id="showVelocityArrows">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">ESP Hitbox Outlines</span>
                <button class="toggle-btn" id="showHitboxOutlines">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">ESP Safe Zones</span>
                <button class="toggle-btn" id="showSafeZones">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">Grid Overlay</span>
                <button class="toggle-btn" id="showGridOverlay">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">Player Path Prediction</span>
                <button class="toggle-btn" id="showPlayerPaths">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">ESP Distance Opacity</span>
                <button class="toggle-btn" id="showDistanceOpacity">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">Highlight Enemies</span>
                <button class="toggle-btn" id="highlightEnemies">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">Tracer Length</span>
                <input type="range" id="tracerLength" min="0.5" max="2.0" step="0.1" value="1.0" class="range-input">
              </div>
              <div class="mod-item">
                <span class="mod-label">Tracer Thickness</span>
                <input type="range" id="tracerThickness" min="0.5" max="5.0" step="0.5" value="1.5" class="range-input">
              </div>
              <div class="mod-item">
                <span class="mod-label">Tracer Glow Effect</span>
                <button class="toggle-btn" id="tracerGlow">OFF</button>
              </div>
              <div class="mod-item">
                <span class="mod-label">Tracer Color</span>
                <input type="color" id="tracerColor" value="#ffffff" class="color-input">
              </div>
            </div>
          </div>
          <div id="notifications"></div>
        </div>
      `;

      // Notification system
      let lastNotification = { message: '', time: 0 };
      function showNotification(message, duration = 3000) {
        if (message === lastNotification.message && Date.now() - lastNotification.time < 5000) return;
        lastNotification = { message, time: Date.now() };
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.getElementById('notifications').appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
          notification.classList.remove('show');
          setTimeout(() => notification.remove(), 300);
        }, duration);
      }

      // Toggle menu with semicolon
      document.addEventListener('keydown', (e) => {
        if (e.key === ';') {
          e.preventDefault();
          menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
          showNotification(`Menu ${menu.style.display === 'block' ? 'opened' : 'closed'}`);
        }
      });
      menu.querySelector('.close-btn').addEventListener('click', () => {
        menu.style.display = 'none';
        showNotification('Menu closed');
      });

      // Collapsible sections
      menu.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
          const section = header.dataset.section;
          const content = document.getElementById(`${section}-section`);
          const isActive = content.classList.contains('active');
          menu.querySelectorAll('.section-content').forEach(c => c.classList.remove('active'));
          menu.querySelectorAll('.section-header').forEach(h => h.style.color = '#00ff80');
          if (!isActive) {
            content.classList.add('active');
            header.style.color = '#00cc66';
          }
        });
      });

      // Event listeners for toggle buttons and inputs
      const configKeys = [
        'showFood', 'showEnemies', 'showAllObjects', 'highlightEnemies', 'showEnemyNames', 'showHealthBars',
        'showResourceIndicators', 'showThreatLevel', 'showDistanceOpacity', 'showHiddenObjects',
        'showTeamIndicators', 'showMiniMap', 'showVelocityArrows', 'showHitboxOutlines',
        'showLevelIndicators', 'showStatusEffects', 'showPredatorESP', 'showPreyESP',
        'showSafeZones', 'showGridOverlay', 'showESPBoxes', 'showPlayerPaths', 'tracerGlow'
      ];
      configKeys.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
          button.textContent = config[id] ? 'ON' : 'OFF';
          button.classList.toggle('on', config[id]);
          button.addEventListener('click', () => {
            config[id] = !config[id];
            button.textContent = config[id] ? 'ON' : 'OFF';
            button.classList.toggle('on', config[id]);
            showNotification(`${id.replace(/([A-Z])/g, ' $1').trim()} ${config[id] ? 'enabled' : 'disabled'}`);
          });
        }
      });

      // Event listeners for range and color inputs
      const tracerLengthInput = document.getElementById('tracerLength');
      if (tracerLengthInput) {
        tracerLengthInput.value = config.tracerLength;
        tracerLengthInput.addEventListener('input', () => {
          config.tracerLength = parseFloat(tracerLengthInput.value);
          showNotification(`Tracer Length set to ${config.tracerLength.toFixed(1)}`);
        });
      }

      const tracerThicknessInput = document.getElementById('tracerThickness');
      if (tracerThicknessInput) {
        tracerThicknessInput.value = config.tracerThickness;
        tracerThicknessInput.addEventListener('input', () => {
          config.tracerThickness = parseFloat(tracerThicknessInput.value);
          showNotification(`Tracer Thickness set to ${config.tracerThickness.toFixed(1)}`);
        });
      }

      const tracerColorInput = document.getElementById('tracerColor');
      if (tracerColorInput) {
        tracerColorInput.value = config.tracerColor;
        tracerColorInput.addEventListener('input', () => {
          config.tracerColor = tracerColorInput.value;
          showNotification(`Tracer Color set to ${config.tracerColor}`);
        });
      }

      // Canvas context
      function getCanvasContext() {
        try {
          return game.dynamicContext || game.canvas.getContext('2d') || document.getElementsByTagName('canvas')[0]?.getContext('2d') || null;
        } catch (e) {
          console.error('Canvas context error:', e);
          showNotification(`Canvas error: ${e.message}`);
          return null;
        }
      }

      // Get game objects
      function getGameObjects() {
        try {
          return Object.values(game.gameObjects || game.entities || game.players || {});
        } catch (e) {
          console.error('Error accessing game objects:', e);
          showNotification(`Objects error: ${e.message}`);
          return [];
        }
      }

      // Object validation
      function validObj(obj) {
        try {
          return obj && obj.position && typeof obj.position.x === 'number' && typeof obj.position.y === 'number' &&
                 (obj.active ?? obj.isActive ?? true);
        } catch (e) {
          console.error('Object validation error:', e);
          return false;
        }
      }

      // Food chain check
      function canEat(a, b) {
        try {
          return window.foodChain?.[a?.name]?.eats?.[b?.name] || b?.type === 'food';
        } catch (e) {
          console.error('Food chain error:', e);
          return false;
        }
      }

      // ESP Drawing
      function drawESP() {
        try {
          const ctx = getCanvasContext();
          if (!ctx) return;

          const me = game.me;
          if (!me || !me.position || typeof me.position.x !== 'number' || typeof me.position.y !== 'number') {
            showNotification('Error: Player position invalid');
            return;
          }

          ctx.save();
          ctx.imageSmoothingEnabled = true;

          const meX = me.position.x + (me.width || 20) / 2;
          const meY = me.position.y + (me.height || 20) / 2;

          const getRenderPosition = (x, y) => {
            try {
              if (game.getRenderPosition) return game.getRenderPosition(x, y);
              const scale = game.camera?.scale || 1;
              const camX = game.camera?.x || meX;
              const camY = game.camera?.y || meY;
              return {
                x: (x - camX) * scale + canvas.width / 2,
                y: (y - camY) * scale + canvas.height / 2
              };
            } catch (e) {
              console.error('Render position error:', e);
              showNotification('Error in render position');
              return { x: canvas.width / 2, y: canvas.height / 2 };
            }
          };

          // Draw grid overlay
          if (config.showGridOverlay) {
            const scale = game.camera?.scale || 1;
            const camX = game.camera?.x || meX;
            const camY = game.camera?.y || meY;
            const gridSize = 100;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            for (let x = -10000; x <= 10000; x += gridSize) {
              const renderX = (x - camX) * scale + canvas.width / 2;
              ctx.beginPath();
              ctx.moveTo(renderX, 0);
              ctx.lineTo(renderX, canvas.height);
              ctx.stroke();
            }
            for (let y = -5000; y <= 5000; y += gridSize) {
              const renderY = (y - camY) * scale + canvas.height / 2;
              ctx.beginPath();
              ctx.moveTo(0, renderY);
              ctx.lineTo(canvas.width, renderY);
              ctx.stroke();
            }
          }

          const objects = getGameObjects();
          for (const obj of objects) {
            if (!validObj(obj)) continue;

            const objX = obj.position.x + (obj.width || 20) / 2;
            const objY = obj.position.y + (obj.height || 20) / 2;
            const dx = meX - objX;
            const dy = meY - objY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const meRender = getRenderPosition(meX, meY);
            const objRender = getRenderPosition(objX, objY);

            const isFood = canEat(me, obj);
            const isEnemy = canEat(obj, me) || obj.type === 'player';
            const isResource = obj.type === 'water' || obj.type === 'oxygen';
            const isHidden = obj.isHidden || obj.hidden || obj.opacity < 1;
            const isTeam = obj.team && me.team && obj.team === me.team && obj !== me;
            const isPredator = canEat(obj, me);
            const isPrey = canEat(me, obj);

            // ESP Tracers
            let shouldDrawTracer = false;
            let baseColor = config.tracerColor;
            if (config.showFood && isFood) {
              shouldDrawTracer = true;
              baseColor = '#00ff00';
            } else if (config.showEnemies && isEnemy) {
              shouldDrawTracer = true;
              baseColor = '#ff3333';
            } else if (config.showAllObjects && !isResource) {
              shouldDrawTracer = true;
              baseColor = '#ffff00';
            } else if ((config.showResourceIndicators || config.showAllObjects) && isResource) {
              shouldDrawTracer = true;
              baseColor = '#0000ff';
            } else if (config.showHiddenObjects && isHidden) {
              shouldDrawTracer = true;
              baseColor = '#ff00ff';
            } else if (config.showPredatorESP && isPredator) {
              shouldDrawTracer = true;
              baseColor = '#ff0000';
            } else if (config.showPreyESP && isPrey) {
              shouldDrawTracer = true;
              baseColor = '#00ff80';
            }

            if (shouldDrawTracer) {
              const opacity = config.showDistanceOpacity ? Math.max(0.3, 1 - dist / 3000) : 1;
              ctx.strokeStyle = baseColor.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
              ctx.lineWidth = config.tracerThickness;
              if (config.tracerGlow) {
                ctx.shadowColor = baseColor;
                ctx.shadowBlur = 10;
              }
              ctx.beginPath();
              const tracerEndX = meRender.x + (objRender.x - meRender.x) * config.tracerLength;
              const tracerEndY = meRender.y + (objRender.y - meRender.y) * config.tracerLength;
              ctx.moveTo(meRender.x, meRender.y);
              ctx.lineTo(tracerEndX, tracerEndY);
              ctx.stroke();
              ctx.shadowBlur = 0;

              ctx.fillStyle = baseColor;
              ctx.font = '16px Montserrat';
              ctx.textAlign = 'center';
              ctx.fillText(`${Math.round(dist)}m`, objRender.x, objRender.y - 20);
              ctx.beginPath();
              ctx.arc(objRender.x, objRender.y, 6, 0, 2 * Math.PI);
              ctx.fill();
            }

            // ESP Bounding Boxes
            if (config.showESPBoxes && (isEnemy || isFood || isResource)) {
              ctx.strokeStyle = baseColor || '#ffffff';
              ctx.lineWidth = 2;
              ctx.strokeRect(
                objRender.x - (obj.width || 20) / 2 * (game.camera?.scale || 1),
                objRender.y - (obj.height || 20) / 2 * (game.camera?.scale || 1),
                (obj.width || 20) * (game.camera?.scale || 1),
                (obj.height || 20) * (game.camera?.scale || 1)
              );
            }

            // Highlight Enemies
            if (config.highlightEnemies && isEnemy) {
              ctx.strokeStyle = '#ff3333';
              ctx.lineWidth = 5;
              ctx.beginPath();
              ctx.arc(objRender.x, objRender.y, (obj.width || 20) / 2 * (game.camera?.scale || 1) + 3, 0, 2 * Math.PI);
              ctx.stroke();
            }

            // Enemy Name Tags
            if (config.showEnemyNames && isEnemy && obj.nick) {
              ctx.fillStyle = '#ff3333';
              ctx.font = '14px Montserrat';
              ctx.textAlign = 'center';
              ctx.fillText(obj.nick, objRender.x, objRender.y - 35);
            }

            // ESP Health Bars
            if (config.showHealthBars && (isEnemy || isFood) && obj.hp && obj.maxHealth) {
              const healthRatio = obj.hp / obj.maxHealth;
              const barWidth = 60;
              const barHeight = 6;
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
              ctx.fillRect(objRender.x - barWidth / 2, objRender.y - 30, barWidth, barHeight);
              ctx.fillStyle = '#ff0000';
              ctx.fillRect(objRender.x - barWidth / 2, objRender.y - 30, barWidth * healthRatio, barHeight);
            }

            // ESP Resource Indicators
            if (config.showResourceIndicators && isResource) {
              ctx.fillStyle = '#0000ff';
              ctx.font = '16px Montserrat';
              ctx.textAlign = 'center';
              const label = obj.type === 'water' ? 'Water' : 'Oxygen';
              ctx.fillText(label, objRender.x, objRender.y - 25);
            }

            // ESP Threat Level
            if (config.showThreatLevel && isEnemy) {
              const threat = Math.min(1, (obj.level || 1) / (me.level || 1));
              ctx.fillStyle = threat > 0.5 ? '#ff0000' : '#ffcc00';
              ctx.font = '14px Montserrat';
              ctx.textAlign = 'center';
              ctx.fillText(`Threat: ${Math.round(threat * 100)}%`, objRender.x, objRender.y + 30);
            }

            // ESP Team Indicators
            if (config.showTeamIndicators && isTeam) {
              ctx.fillStyle = '#00ff99';
              ctx.font = '14px Montserrat';
              ctx.textAlign = 'center';
              ctx.fillText('Team', objRender.x, objRender.y + 20);
            }

            // ESP Velocity Arrows
            if (config.showVelocityArrows && (obj.velocityX || obj.velocityY)) {
              const scale = game.camera?.scale || 1;
              const vx = (obj.velocityX || 0) * scale * 15;
              const vy = (obj.velocityY || 0) * scale * 15;
              const magnitude = Math.sqrt(vx * vx + vy * vy);
              if (magnitude > 0) {
                ctx.strokeStyle = '#00ffff';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(objRender.x, objRender.y);
                ctx.lineTo(objRender.x + vx, objRender.y + vy);
                ctx.stroke();
                const angle = Math.atan2(vy, vx);
                ctx.beginPath();
                ctx.moveTo(objRender.x + vx, objRender.y + vy);
                ctx.lineTo(objRender.x + vx - 12 * Math.cos(angle - Math.PI / 6), objRender.y + vy - 12 * Math.sin(angle - Math.PI / 6));
                ctx.lineTo(objRender.x + vx - 12 * Math.cos(angle + Math.PI / 6), objRender.y + vy - 12 * Math.sin(angle + Math.PI / 6));
                ctx.closePath();
                ctx.fillStyle = '#00ffff';
                ctx.fill();
              }
            }

            // ESP Hitbox Outlines
            if (config.showHitboxOutlines) {
              ctx.strokeStyle = '#ff9900';
              ctx.lineWidth = 3;
              ctx.strokeRect(
                objRender.x - (obj.width || 20) / 2 * (game.camera?.scale || 1),
                objRender.y - (obj.height || 20) / 2 * (game.camera?.scale || 1),
                (obj.width || 20) * (game.camera?.scale || 1),
                (obj.height || 20) * (game.camera?.scale || 1)
              );
            }

            // ESP Level Indicators
            if (config.showLevelIndicators && (obj.level || obj.xpValue)) {
              ctx.fillStyle = '#ffffff';
              ctx.font = '14px Montserrat';
              ctx.textAlign = 'center';
              const label = obj.level ? `Level: ${obj.level}` : `XP: ${obj.xpValue || 0}`;
              ctx.fillText(label, objRender.x, objRender.y + 40);
            }

            // ESP Status Effects
            if (config.showStatusEffects && obj.statusEffects) {
              const effects = Object.keys(obj.statusEffects || {}).filter(effect => obj.statusEffects[effect]);
              if (effects.length > 0) {
                ctx.fillStyle = '#9900ff';
                ctx.font = '14px Montserrat';
                ctx.textAlign = 'center';
                ctx.fillText(effects.join(', '), objRender.x, objRender.y + 50);
              }
            }

            // ESP Safe Zones
            if (config.showSafeZones && obj.type === 'safeZone') {
              ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
              ctx.beginPath();
              ctx.arc(objRender.x, objRender.y, (obj.width || 50) / 2 * (game.camera?.scale || 1), 0, 2 * Math.PI);
              ctx.fill();
              ctx.fillStyle = '#00ff00';
              ctx.font = '14px Montserrat';
              ctx.textAlign = 'center';
              ctx.fillText('Safe Zone', objRender.x, objRender.y);
            }

            // Player Path Prediction
            if (config.showPlayerPaths && isEnemy && (obj.velocityX || obj.velocityY)) {
              const scale = game.camera?.scale || 1;
              const vx = (obj.velocityX || 0) * scale * 50;
              const vy = (obj.velocityY || 0) * scale * 50;
              ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);
              ctx.beginPath();
              ctx.moveTo(objRender.x, objRender.y);
              ctx.lineTo(objRender.x + vx, objRender.y + vy);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }

          ctx.restore();
        } catch (e) {
          console.error('ESP drawing error:', e);
          showNotification(`ESP error: ${e.message}`);
        }
      }

      // Mini-Map
      let miniMapCanvas = null;
      function drawMiniMap() {
        try {
          if (!config.showMiniMap) {
            if (miniMapCanvas) {
              miniMapCanvas.remove();
              miniMapCanvas = null;
            }
            return;
          }
          if (!miniMapCanvas) {
            miniMapCanvas = document.createElement('canvas');
            miniMapCanvas.className = 'mini-map';
            document.body.appendChild(miniMapCanvas);
          }
          const ctx = miniMapCanvas.getContext('2d');
          miniMapCanvas.width = 200;
          miniMapCanvas.height = 200;
          ctx.clearRect(0, 0, 200, 200);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(0, 0, 200, 200);
          ctx.strokeStyle = '#00ff80';
          ctx.lineWidth = 2;
          ctx.strokeRect(0, 0, 200, 200);

          const me = game.me;
          if (!me || !me.position) return;

          const mapScale = 0.015;
          const mapCenterX = 100;
          const mapCenterY = 100;

          ctx.fillStyle = '#00ccff';
          ctx.beginPath();
          ctx.arc(mapCenterX, mapCenterY, 5, 0, 2 * Math.PI);
          ctx.fill();

          const objects = getGameObjects();
          for (const obj of objects) {
            if (!validObj(obj)) continue;
            const objX = obj.position.x * mapScale + mapCenterX - me.position.x * mapScale;
            const objY = obj.position.y * mapScale + mapCenterY - me.position.y * mapScale;
            if (Math.abs(objX - mapCenterX) > 100 || Math.abs(objY - mapCenterY) > 100) continue;

            const isFood = canEat(me, obj);
            const isEnemy = canEat(obj, me) || obj.type === 'player';
            const isResource = obj.type === 'water' || obj.type === 'oxygen';
            const isHidden = obj.isHidden || obj.hidden || obj.opacity < 1;
            const isTeam = obj.team && me.team && obj.team === me.team && obj !== me;
            const isPredator = canEat(obj, me);
            const isPrey = canEat(me, obj);
            ctx.fillStyle = isResource ? '#0000ff' :
                           isFood ? '#00ff00' :
                           isEnemy ? '#ff3333' :
                           isHidden ? '#ff00ff' :
                           isTeam ? '#00ff99' :
                           isPredator ? '#ff0000' :
                           isPrey ? '#00ff80' :
                           '#ffff00';
            ctx.beginPath();
            ctx.arc(objX, objY, isEnemy ? 4 : 3, 0, 2 * Math.PI);
            ctx.fill();

            // Mini-Map Velocity Arrows
            if (config.showVelocityArrows && (obj.velocityX || obj.velocityY)) {
              const vx = (obj.velocityX || 0) * mapScale * 60;
              const vy = (obj.velocityY || 0) * mapScale * 60;
              const magnitude = Math.sqrt(vx * vx + vy * vy);
              if (magnitude > 0) {
                ctx.strokeStyle = '#00ffff';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(objX, objY);
                ctx.lineTo(objX + vx, objY + vy);
                ctx.stroke();
              }
            }
          }
        } catch (e) {
          console.error('Mini-map error:', e);
          showNotification(`Mini-map error: ${e.message}`);
        }
      }

      // Game loop hook
      const originalDraw = game.beforeDrawAllObjects || game.draw || (() => {});
      game.beforeDrawAllObjects = function() {
        try {
          originalDraw?.apply(this, arguments);
          drawESP();
          drawMiniMap();
        } catch (e) {
          console.error('Game loop error:', e);
          showNotification(`Game loop error: ${e.message}`);
        }
      };

      console.log('Emulation\'s Evo Client Enhanced loaded');
      showNotification('Menu loaded. Press ; to toggle.', 5000);
    } catch (e) {
      console.error('Init mod menu error:', e);
      showNotification(`Menu init error: ${e.message}`);
    }
  }

  waitForGameLoad();
})();