// ==UserScript==
  // @name         Voxiom.io Emulation Premium Cheat Client 3.0
  // @namespace    3.0.0
  // @version      3.0.0
  // @description  A premium cheat client for Voxiom.io with cosmic-themed UI, expanded mesh types, version history accordions, key GUI opacity slider, and persistent settings.
  // @author       Emulation
  // @match        https://voxiom.io/*
  // @icon         https://www.google.com/s2/favicons?sz=64&domain=voxiom.io
  // @grant        none
  // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540271/Voxiomio%20Emulation%20Premium%20Cheat%20Client%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/540271/Voxiomio%20Emulation%20Premium%20Cheat%20Client%2030.meta.js
  // ==/UserScript==

  (function() {
    // Settings
    const settings = {
      player: {
        opacity: 1,
        wireframe: false,
        seeThroughWalls: false,
        meshType: 'Normal',
        animationSpeed: 1,
        baseHue: 0,
        emissiveIntensity: 0.5,
        crosshairType: 'None',
        crosshairSize: 20,
        crosshairGap: 5,
        crosshairColor: '#FFD700',
        notifications: true,
        modStatus: true,
        menuOpacity: 1.0,
        theme: localStorage.getItem('theme') || 'gold-black',
        menuPosition: JSON.parse(localStorage.getItem('menuPosition')) || { left: '10px', top: '10px' },
        menuMinimized: true,
        showPing: false,
        showFps: false,
        showKeys: false,
        showMouse: false,
        showGameTime: false,
        keyGuiPosition: JSON.parse(localStorage.getItem('keyGuiPosition')) || { left: '10px', bottom: '10px' },
        keyGuiSize: JSON.parse(localStorage.getItem('keyGuiSize')) || { width: '150px', height: '100px' },
        keyGuiOpacity: parseFloat(localStorage.getItem('keyGuiOpacity')) || 1.0
      }
    };

    const playerMaterials = new Set();
    let notificationTimeout = null;
    const clientVersion = '3.0.0';
    const notifications = [];
    let stats = {
      ping: 0,
      fps: 0,
      keys: { w: false, a: false, s: false, d: false, space: false },
      mouse: { x: 0, y: 0 },
      gameTime: 0
    };
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let startTime = Date.now();

    // Save settings
    function saveSettings() {
      localStorage.setItem('theme', settings.player.theme);
      localStorage.setItem('menuPosition', JSON.stringify(settings.player.menuPosition));
      localStorage.setItem('menuMinimized', settings.player.menuMinimized);
      localStorage.setItem('keyGuiPosition', JSON.stringify(settings.player.keyGuiPosition));
      localStorage.setItem('keyGuiSize', JSON.stringify(settings.player.keyGuiSize));
      localStorage.setItem('keyGuiOpacity', settings.player.keyGuiOpacity);
      localStorage.setItem('settings', JSON.stringify({
        opacity: settings.player.opacity,
        wireframe: settings.player.wireframe,
        seeThroughWalls: settings.player.seeThroughWalls,
        meshType: settings.player.meshType,
        animationSpeed: settings.player.animationSpeed,
        baseHue: settings.player.baseHue,
        emissiveIntensity: settings.player.emissiveIntensity,
        crosshairType: settings.player.crosshairType,
        crosshairSize: settings.player.crosshairSize,
        crosshairGap: settings.player.crosshairGap,
        crosshairColor: settings.player.crosshairColor,
        notifications: settings.player.notifications,
        modStatus: settings.player.modStatus,
        menuOpacity: settings.player.menuOpacity,
        showPing: settings.player.showPing,
        showFps: settings.player.showFps,
        showKeys: settings.player.showKeys,
        showMouse: settings.player.showMouse,
        showGameTime: settings.player.showGameTime
      }));
    }

    // Load settings
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      Object.assign(settings.player, JSON.parse(savedSettings));
    }

    // Show notification
    function showNotification(message) {
      if (!settings.player.notifications) return;
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      notification.style.position = 'fixed';
      notification.style.bottom = `${20 + notifications.length * 40}px`;
      notification.style.right = '20px';
      notification.style.background = 'var(--bg-gradient)';
      notification.style.border = '1px solid var(--accent-color)';
      notification.style.color = 'var(--text-color)';
      notification.style.padding = '8px 16px';
      notification.style.borderRadius = '6px';
      notification.style.boxShadow = '0 4px 12px var(--accent-shadow)';
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      notification.style.transform = 'translateX(20px)';
      notification.style.zIndex = '999997';
      notification.style.fontFamily = '"Exo 2", sans-serif';
      notification.style.fontSize = '12px';
      document.body.appendChild(notification);
      notifications.push(notification);

      setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
      }, 10);
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(20px)';
        setTimeout(() => {
          notification.remove();
          notifications.splice(notifications.indexOf(notification), 1);
          notifications.forEach((n, i) => {
            n.style.bottom = `${20 + i * 40}px`;
          });
        }, 300);
      }, 2500);

      if (notificationTimeout) clearTimeout(notificationTimeout);
      notificationTimeout = setTimeout(() => {}, 100);
    }

    // Loading screen
    function showLoadingScreen() {
      const loadingScreen = document.createElement('div');
      loadingScreen.id = 'loading-screen';
      loadingScreen.style.position = 'fixed';
      loadingScreen.style.top = '0';
      loadingScreen.style.left = '0';
      loadingScreen.style.width = '100%';
      loadingScreen.style.height = '100%';
      loadingScreen.style.background = 'var(--bg-gradient)';
      loadingScreen.style.display = 'flex';
      loadingScreen.style.flexDirection = 'column';
      loadingScreen.style.alignItems = 'center';
      loadingScreen.style.justifyContent = 'center';
      loadingScreen.style.zIndex = '1000000';
      loadingScreen.style.color = 'var(--text-color)';
      loadingScreen.style.fontFamily = '"Exo 2", sans-serif';
      loadingScreen.innerHTML = `
        <div id="loading-logo" style="width: 50px; height: 50px; background: radial-gradient(circle, var(--accent-color) 10%, transparent 70%); animation: blackHoleSwirl 2s linear infinite;"></div>
        <h1 style="font-size: 20px; margin: 15px 0;">Emulation Premium</h1>
        <div id="loading-bar" style="width: 200px; height: 4px; background: var(--btn-bg); border-radius: 2px; overflow: hidden;">
          <div id="loading-progress" style="width: 0; height: 100%; background: var(--accent-color); transition: width 1.5s ease;"></div>
        </div>
      `;
      document.body.appendChild(loadingScreen);

      const progressBar = document.getElementById('loading-progress');
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            setTimeout(() => loadingScreen.remove(), 500);
          }, 300);
        }
      }, 80);
    }

    // Patch Array.push
    const originalPush = Array.prototype.push;
    Array.prototype.push = function(...args) {
      try {
        for (const obj of args) {
          const mat = obj?.material;
          if (!mat || mat.type !== "MeshBasicMaterial") continue;
          mat.transparent = true;
          playerMaterials.add(mat);
          applyMeshType(mat);
        }
      } catch (e) {
        console.error("[EMULATION PREMIUM] Material hook error:", e);
        showNotification("Warning: Material hooking failed");
      }
      return originalPush.apply(this, args);
    };

    // Apply settings
    function applySettings() {
      try {
        playerMaterials.forEach(mat => {
          if (!mat) return;
          mat.opacity = settings.player.opacity;
          mat.wireframe = settings.player.wireframe;
          mat.transparent = true;
          mat.side = 2;
          if (settings.player.seeThroughWalls) {
            mat.depthTest = false;
            mat.depthFunc = 7;
          } else {
            mat.depthTest = true;
            mat.depthFunc = 3;
          }
          applyMeshType(mat);
        });
        updateStatusOverlay();
        drawCrosshair();
        updateStatsOverlay();
        updateKeyPressGui();
      } catch (e) {
        console.error("[EMULATION PREMIUM] Settings error:", e);
        showNotification("Error applying settings");
      }
    }

    // Dynamic color helpers
    function getRainbowColor() { return `hsl(${(Date.now() / (50 / settings.player.animationSpeed)) % 360}, 100%, 50%)`; }
    function getAuroraColor() { const t = Date.now() / (400 / settings.player.animationSpeed); return `hsl(${(t * 30 + settings.player.baseHue) % 360}, 80%, 60%)`; }
    function getNeonPulseColor() { const t = Date.now() / (100 / settings.player.animationSpeed); const i = (Math.sin(t * 2) + 1) / 2; return `hsl(${(300 + settings.player.baseHue) % 360}, 100%, ${50 + i * 30}%)`; }
    function getSolarFlareColor() { const t = Date.now() / (250 / settings.player.animationSpeed); return `hsl(${(30 + settings.player.baseHue) % 360}, 100%, ${60 + Math.sin(t) * 20}%)`; }
    function getGoldPulseColor() { const t = Date.now() / (200 / settings.player.animationSpeed); const i = (Math.sin(t * 2) + 1) / 2; return `hsl(45, 80%, ${50 + i * 20}%)`; }
    function getCosmicVoidColor() { const t = Date.now() / (300 / settings.player.animationSpeed); return `hsl(${(240 + t * 10) % 360}, 90%, ${40 + Math.sin(t) * 10}%)`; }
    function getStarfieldFluxColor() { const t = Date.now() / (150 / settings.player.animationSpeed); const i = (Math.cos(t * 3) + 1) / 2; return `hsl(210, 80%, ${60 + i * 20}%)`; }
    function getPlasmaSurgeColor() { const t = Date.now() / (200 / settings.player.animationSpeed); return `hsl(${(270 + t * 20) % 360}, 100%, ${50 + Math.sin(t * 2) * 15}%)`; }
    function getGalacticSpiralColor() { const t = Date.now() / (350 / settings.player.animationSpeed); return `hsl(${(180 + t * 15) % 360}, 85%, ${55 + Math.cos(t) * 10}%)`; }
    function getQuantumFlickerColor() { const t = Date.now() / (100 / settings.player.animationSpeed); const i = Math.random() * 0.3 + 0.7; return `hsl(300, 90%, ${50 * i}%)`; }

    // Mesh type implementation
    function applyMeshType(mat) {
      if (!mat) return;
      const type = settings.player.meshType;
      mat.color.set('white');
      if (mat.emissive) mat.emissive.setHex(0x000000);
      mat.wireframe = settings.player.wireframe;
      mat.side = 2;
      const emissiveFactor = settings.player.emissiveIntensity;
      switch (type) {
        // Advantage Meshes
        case 'Normal': mat.opacity = 1; mat.transparent = false; mat.depthTest = true; break;
        case 'Glow Neon': mat.color.set(`hsl(${(180 + settings.player.baseHue) % 360}, 100%, 50%)`); mat.opacity = settings.player.opacity; if (mat.emissive) mat.emissive.setHex(0x00FFFF).multiplyScalar(emissiveFactor); mat.transparent = mat.opacity < 1; mat.depthTest = true; break;
        case 'Red Danger': mat.color.set(`hsl(${(0 + settings.player.baseHue) % 360}, 100%, 50%)`); mat.opacity = 0.9; mat.transparent = true; mat.depthTest = true; break;
        case 'Hacker Matrix': mat.color.set(`hsl(${(120 + settings.player.baseHue) % 360}, 100%, 50%)`); mat.wireframe = true; mat.opacity = 1; mat.transparent = false; mat.depthTest = true; break;
        case 'Chrome Metal': mat.color.set('#C0C0C0'); if (mat.emissive) mat.emissive.setHex(0x404040).multiplyScalar(emissiveFactor); mat.opacity = 1; mat.transparent = false; mat.depthTest = true; break;
        case 'Shadow Cloak': mat.color.set('#1A1A1A'); mat.opacity = 0.6; mat.transparent = true; mat.depthTest = false; if (mat.emissive) mat.emissive.setHex(0x111111).multiplyScalar(emissiveFactor); break;
        case 'Crystal Clear': mat.color.set('#E6E6FA'); mat.opacity = 0.3; mat.transparent = true; mat.depthTest = true; if (mat.emissive) mat.emissive.setHex(0xFFFFFF).multiplyScalar(emissiveFactor); break;
        case 'Toxic Haze': mat.color.set(`hsl(${(90 + settings.player.baseHue) % 360}, 80%, 50%)`); mat.opacity = 0.7; mat.transparent = true; mat.depthTest = false; if (mat.emissive) mat.emissive.setHex(0x00FF00).multiplyScalar(emissiveFactor); break;
        case 'Phantom Outline': mat.color.set('#FFFFFF'); mat.wireframe = true; mat.opacity = 0.8; mat.transparent = true; mat.depthTest = true; break;
        case 'Electric Grid': mat.color.set(`hsl(${(210 + settings.player.baseHue) % 360}, 100%, 50%)`); mat.wireframe = true; mat.opacity = 0.9; mat.transparent = true; mat.depthTest = false; if (mat.emissive) mat.emissive.setHex(0x00AAFF).multiplyScalar(emissiveFactor); break;
        // Utility Meshes
        case 'Rainbow': mat.transparent = true; mat.opacity = 0.9; mat.depthTest = true; mat.color.set(getRainbowColor()); break;
        case 'Aurora Borealis': mat.transparent = true; mat.opacity = 0.7; mat.depthTest = true; mat.color.set(getAuroraColor()); break;
        case 'Neon Pulse': mat.transparent = true; mat.opacity = 0.9; mat.depthTest = true; mat.color.set(getNeonPulseColor()); if (mat.emissive) mat.emissive.setHex(0xFF00FF).multiplyScalar(emissiveFactor); break;
        case 'Solar Flare': mat.transparent = true; mat.opacity = 0.9; mat.depthTest = true; mat.color.set(getSolarFlareColor()); if (mat.emissive) mat.emissive.setHex(0xFFA500).multiplyScalar(emissiveFactor); break;
        case 'Gold Pulse': mat.transparent = true; mat.opacity = 0.9; mat.depthTest = true; mat.color.set(getGoldPulseColor()); if (mat.emissive) mat.emissive.setHex(0xFFD700).multiplyScalar(emissiveFactor); break;
        case 'Cosmic Void': mat.transparent = true; mat.opacity = 0.8; mat.depthTest = true; mat.color.set(getCosmicVoidColor()); if (mat.emissive) mat.emissive.setHex(0x1A237E).multiplyScalar(emissiveFactor); break;
        case 'Starfield Flux': mat.transparent = true; mat.opacity = 0.9; mat.depthTest = true; mat.color.set(getStarfieldFluxColor()); if (mat.emissive) mat.emissive.setHex(0x0288D1).multiplyScalar(emissiveFactor); break;
        case 'Plasma Surge': mat.transparent = true; mat.opacity = 0.85; mat.depthTest = true; mat.color.set(getPlasmaSurgeColor()); if (mat.emissive) mat.emissive.setHex(0x8E24AA).multiplyScalar(emissiveFactor); break;
        case 'Galactic Spiral': mat.transparent = true; mat.opacity = 0.8; mat.depthTest = true; mat.color.set(getGalacticSpiralColor()); if (mat.emissive) mat.emissive.setHex(0x26A69A).multiplyScalar(emissiveFactor); break;
        case 'Quantum Flicker': mat.transparent = true; mat.opacity = 0.9; mat.depthTest = true; mat.color.set(getQuantumFlickerColor()); if (mat.emissive) mat.emissive.setHex(0xAB47BC).multiplyScalar(emissiveFactor); break;
        default: mat.opacity = settings.player.opacity; mat.transparent = mat.opacity < 1; mat.depthTest = true; break;
      }
    }

    // Animation loop
    let animationFrameId;
    function animate() {
      const now = performance.now();
      frameCount++;
      if (now - lastFrameTime >= 1000) {
        stats.fps = frameCount;
        frameCount = 0;
        lastFrameTime = now;
        stats.ping = Math.floor(Math.random() * 80 + 20);
        stats.gameTime = Math.floor((Date.now() - startTime) / 1000);
        updateStatsOverlay();
        updateKeyPressGui();
      }
      const staticMeshes = ['Normal', 'Glow Neon', 'Red Danger', 'Hacker Matrix', 'Chrome Metal', 'Shadow Cloak', 'Crystal Clear', 'Toxic Haze', 'Phantom Outline', 'Electric Grid'];
      if (!staticMeshes.includes(settings.player.meshType)) {
        playerMaterials.forEach(mat => {
          if (!mat) return;
          switch (settings.player.meshType) {
            case 'Rainbow': mat.color.set(getRainbowColor()); break;
            case 'Aurora Borealis': mat.color.set(getAuroraColor()); break;
            case 'Neon Pulse': mat.color.set(getNeonPulseColor()); break;
            case 'Solar Flare': mat.color.set(getSolarFlareColor()); break;
            case 'Gold Pulse': mat.color.set(getGoldPulseColor()); break;
            case 'Cosmic Void': mat.color.set(getCosmicVoidColor()); break;
            case 'Starfield Flux': mat.color.set(getStarfieldFluxColor()); break;
            case 'Plasma Surge': mat.color.set(getPlasmaSurgeColor()); break;
            case 'Galactic Spiral': mat.color.set(getGalacticSpiralColor()); break;
            case 'Quantum Flicker': mat.color.set(getQuantumFlickerColor()); break;
          }
        });
      }
      drawCrosshair();
      animationFrameId = requestAnimationFrame(animate);
    }

    // Crosshair rendering
    let crosshairCanvas, crosshairCtx;
    function initCrosshairCanvas() {
      crosshairCanvas = document.createElement('canvas');
      crosshairCanvas.id = 'crosshair-canvas';
      crosshairCanvas.style.position = 'fixed';
      crosshairCanvas.style.top = '0';
      crosshairCanvas.style.left = '0';
      crosshairCanvas.style.width = '100%';
      crosshairCanvas.style.height = '100%';
      crosshairCanvas.style.zIndex = '999998';
      crosshairCanvas.style.pointerEvents = 'none';
      document.body.appendChild(crosshairCanvas);
      crosshairCtx = crosshairCanvas.getContext('2d');
      resizeCrosshair();
    }

    function resizeCrosshair() {
      if (!crosshairCanvas) return;
      crosshairCanvas.width = window.innerWidth;
      crosshairCanvas.height = window.innerHeight;
      drawCrosshair();
    }

    function drawCrosshair() {
      if (!crosshairCtx || !crosshairCanvas) return;
      crosshairCtx.clearRect(0, 0, crosshairCanvas.width, crosshairCanvas.height);
      if (settings.player.crosshairType === 'None') return;

      const centerX = crosshairCanvas.width / 2;
      const centerY = crosshairCanvas.height / 2;
      const size = settings.player.crosshairSize;
      const gap = settings.player.crosshairGap;
      const color = settings.player.crosshairColor;
      crosshairCtx.strokeStyle = color;
      crosshairCtx.fillStyle = color;
      crosshairCtx.lineWidth = 2;

      switch (settings.player.crosshairType) {
        case 'Dot':
          crosshairCtx.beginPath();
          crosshairCtx.arc(centerX, centerY, size / 4, 0, Math.PI * 2);
          crosshairCtx.fill();
          break;
        case 'Cross':
          crosshairCtx.beginPath();
          crosshairCtx.moveTo(centerX - size / 2, centerY);
          crosshairCtx.lineTo(centerX - gap, centerY);
          crosshairCtx.moveTo(centerX + gap, centerY);
          crosshairCtx.lineTo(centerX + size / 2, centerY);
          crosshairCtx.moveTo(centerX, centerY - size / 2);
          crosshairCtx.lineTo(centerX, centerY - gap);
          crosshairCtx.moveTo(centerX, centerY + gap);
          crosshairCtx.lineTo(centerX, centerY + size / 2);
          crosshairCtx.stroke();
          break;
        case 'Plus':
          crosshairCtx.beginPath();
          crosshairCtx.lineWidth = 3;
          crosshairCtx.moveTo(centerX - size / 3, centerY);
          crosshairCtx.lineTo(centerX - gap, centerY);
          crosshairCtx.moveTo(centerX + gap, centerY);
          crosshairCtx.lineTo(centerX + size / 3, centerY);
          crosshairCtx.moveTo(centerX, centerY - size / 3);
          crosshairCtx.lineTo(centerX, centerY - gap);
          crosshairCtx.moveTo(centerX, centerY + gap);
          crosshairCtx.lineTo(centerX, centerY + size / 3);
          crosshairCtx.stroke();
          break;
        case 'Dynamic Dot':
          const pulseSize = size / 4 + Math.sin(Date.now() / 300) * (size / 10);
          crosshairCtx.beginPath();
          crosshairCtx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
          crosshairCtx.fill();
          break;
      }
    }

    // Update status overlay
    function updateStatusOverlay() {
      const statusBar = document.querySelector('#status-bar');
      if (!statusBar) return;
      statusBar.innerHTML = `
        <span class="status-text"><i class="fas fa-cube"></i> Mesh: ${settings.player.meshType}</span>
        <span class="status-text"><i class="fas fa-eye"></i> Wallhack: ${settings.player.seeThroughWalls ? 'ON' : 'OFF'}</span>
        <span class="status-text"><i class="fas fa-crosshairs"></i> Crosshair: ${settings.player.crosshairType}</span>
        <span class="status-text"><i class="fas fa-chart-line"></i> FPS: ${settings.player.showFps ? stats.fps : 'OFF'}</span>
      `;
    }

    // Update stats overlay
    function updateStatsOverlay() {
      let overlay = document.getElementById('stats-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'stats-overlay';
        overlay.style.position = 'fixed';
        overlay.style.bottom = '10px';
        overlay.style.right = '10px';
        overlay.style.background = 'var(--bg-gradient)';
        overlay.style.border = '1px solid var(--accent-color)';
        overlay.style.color = 'var(--text-color)';
        overlay.style.padding = '8px';
        overlay.style.borderRadius = '6px';
        overlay.style.boxShadow = '0 2px 8px var(--accent-shadow)';
        overlay.style.zIndex = '999998';
        overlay.style.fontFamily = '"Exo 2", sans-serif';
        overlay.style.fontSize = '11px';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);
      }
      const content = [];
      if (settings.player.showPing) content.push(`<div><i class="fas fa-network-wired"></i> Ping: ${stats.ping}ms</div>`);
      if (settings.player.showFps) content.push(`<div><i class="fas fa-tachometer-alt"></i> FPS: ${stats.fps}</div>`);
      if (settings.player.showKeys) content.push(`<div><i class="fas fa-keyboard"></i> Keys: W:${stats.keys.w ? 'Down' : 'Up'} A:${stats.keys.a ? 'Down' : 'Up'} S:${stats.keys.s ? 'Down' : 'Up'} D:${stats.keys.d ? 'Down' : 'Up'} Space:${stats.keys.space ? 'Down' : 'Up'}</div>`);
      if (settings.player.showMouse) content.push(`<div><i class="fas fa-mouse"></i> Mouse: X:${stats.mouse.x} Y:${stats.mouse.y}</div>`);
      if (settings.player.showGameTime) content.push(`<div><i class="fas fa-clock"></i> Game Time: ${stats.gameTime}s</div>`);
      overlay.innerHTML = content.join('');
      overlay.style.display = content.length ? 'block' : 'none';
    }

    // Update key press GUI
    function updateKeyPressGui() {
      let gui = document.getElementById('key-press-gui');
      if (!gui) {
        gui = document.createElement('div');
        gui.id = 'key-press-gui';
        gui.style.position = 'fixed';
        gui.style.left = settings.player.keyGuiPosition.left;
        gui.style.bottom = settings.player.keyGuiPosition.bottom;
        gui.style.width = settings.player.keyGuiSize.width;
        gui.style.height = settings.player.keyGuiSize.height;
        gui.style.background = `var(--bg-gradient)`;
        gui.style.opacity = settings.player.keyGuiOpacity;
        gui.style.border = '1px solid var(--accent-color)';
        gui.style.borderRadius = '6px';
        gui.style.boxShadow = '0 2px 8px var(--accent-shadow)';
        gui.style.zIndex = '999998';
        gui.style.fontFamily = '"Exo 2", sans-serif';
        gui.style.fontSize = '11px';
        gui.style.display = settings.player.showKeys ? 'block' : 'none';
        gui.style.userSelect = 'none';
        gui.innerHTML = `
          <div id="key-gui-header" style="padding: 4px; cursor: move; border-bottom: 1px solid var(--border-color); text-align: center; color: var(--text-color);">
            Key Inputs
          </div>
          <div id="key-gui-body" style="padding: 8px; display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <div id="key-w" class="key-box" style="width: 24px; height: 24px; line-height: 24px; text-align: center; border-radius: 4px; background: ${stats.keys.w ? '#D3D3D3' : '#333333'}; color: ${stats.keys.w ? '#000000' : '#FFFFFF'};">W</div>
            <div style="display: flex; gap: 4px;">
              <div id="key-a" class="key-box" style="width: 24px; height: 24px; line-height: 24px; text-align: center; border-radius: 4px; background: ${stats.keys.a ? '#D3D3D3' : '#333333'}; color: ${stats.keys.a ? '#000000' : '#FFFFFF'};">A</div>
              <div id="key-s" class="key-box" style="width: 24px; height: 24px; line-height: 24px; text-align: center; border-radius: 4px; background: ${stats.keys.s ? '#D3D3D3' : '#333333'}; color: ${stats.keys.s ? '#000000' : '#FFFFFF'};">S</div>
              <div id="key-d" class="key-box" style="width: 24px; height: 24px; line-height: 24px; text-align: center; border-radius: 4px; background: ${stats.keys.d ? '#D3D3D3' : '#333333'}; color: ${stats.keys.d ? '#000000' : '#FFFFFF'};">D</div>
            </div>
            <div id="key-space" class="key-box" style="width: 60px; height: 20px; line-height: 20px; text-align: center; border-radius: 4px; background: ${stats.keys.space ? '#D3D3D3' : '#333333'}; color: ${stats.keys.space ? '#000000' : '#FFFFFF'};">Space</div>
          </div>
          <div id="key-gui-resize" style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: var(--accent-color); cursor: se-resize; border-radius: 0 0 6px 0;"></div>
        `;
        document.body.appendChild(gui);

        // Draggable
        const header = gui.querySelector('#key-gui-header');
        let isDragging = false;
        let dragX, dragY;
        header.addEventListener('mousedown', (e) => {
          isDragging = true;
          dragX = e.clientX - parseFloat(gui.style.left || 10);
          dragY = e.clientY - (window.innerHeight - parseFloat(gui.style.bottom || 10) - gui.offsetHeight);
        });
        document.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          let newX = e.clientX - dragX;
          let newBottom = window.innerHeight - (e.clientY - dragY) - gui.offsetHeight;
          newX = Math.max(0, Math.min(newX, window.innerWidth - gui.offsetWidth));
          newBottom = Math.max(0, Math.min(newBottom, window.innerHeight - gui.offsetHeight));
          gui.style.left = `${newX}px`;
          gui.style.bottom = `${newBottom}px`;
          settings.player.keyGuiPosition = { left: `${newX}px`, bottom: `${newBottom}px` };
          saveSettings();
        });
        document.addEventListener('mouseup', () => {
          isDragging = false;
        });

        // Resizable
        const resizeHandle = gui.querySelector('#key-gui-resize');
        let isResizing = false;
        let resizeX, resizeY;
        resizeHandle.addEventListener('mousedown', (e) => {
          isResizing = true;
          resizeX = e.clientX;
          resizeY = e.clientY;
          e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
          if (!isResizing) return;
          const deltaX = e.clientX - resizeX;
          const deltaY = e.clientY - resizeY;
          let newWidth = parseFloat(gui.style.width) + deltaX;
          let newHeight = parseFloat(gui.style.height) + deltaY;
          newWidth = Math.max(100, Math.min(newWidth, 300));
          newHeight = Math.max(70, Math.min(newHeight, 200));
          gui.style.width = `${newWidth}px`;
          gui.style.height = `${newHeight}px`;
          settings.player.keyGuiSize = { width: `${newWidth}px`, height: `${newHeight}px` };
          resizeX = e.clientX;
          resizeY = e.clientY;
          saveSettings();
          updateKeyPressGuiLayout();
        });
        document.addEventListener('mouseup', () => {
          isResizing = false;
        });
      }

      // Update key states and opacity
      gui.querySelector('#key-w').style.background = stats.keys.w ? '#D3D3D3' : '#333333';
      gui.querySelector('#key-w').style.color = stats.keys.w ? '#000000' : '#FFFFFF';
      gui.querySelector('#key-a').style.background = stats.keys.a ? '#D3D3D3' : '#333333';
      gui.querySelector('#key-a').style.color = stats.keys.a ? '#000000' : '#FFFFFF';
      gui.querySelector('#key-s').style.background = stats.keys.s ? '#D3D3D3' : '#333333';
      gui.querySelector('#key-s').style.color = stats.keys.s ? '#000000' : '#FFFFFF';
      gui.querySelector('#key-d').style.background = stats.keys.d ? '#D3D3D3' : '#333333';
      gui.querySelector('#key-d').style.color = stats.keys.d ? '#000000' : '#FFFFFF';
      gui.querySelector('#key-space').style.background = stats.keys.space ? '#D3D3D3' : '#333333';
      gui.querySelector('#key-space').style.color = stats.keys.space ? '#000000' : '#FFFFFF';
      gui.style.display = settings.player.showKeys ? 'block' : 'none';
      gui.style.opacity = settings.player.keyGuiOpacity;
    }

    // Update key press GUI layout
    function updateKeyPressGuiLayout() {
      const gui = document.getElementById('key-press-gui');
      if (!gui) return;
      const width = parseFloat(gui.style.width);
      const height = parseFloat(gui.style.height);
      const keySize = Math.min(width / 8, height / 5);
      const spaceWidth = keySize * 2.5;
      const keyHeight = keySize * 0.8;
      gui.querySelector('#key-w').style.width = `${keySize}px`;
      gui.querySelector('#key-w').style.height = `${keySize}px`;
      gui.querySelector('#key-w').style.lineHeight = `${keySize}px`;
      gui.querySelector('#key-a').style.width = `${keySize}px`;
      gui.querySelector('#key-a').style.height = `${keySize}px`;
      gui.querySelector('#key-a').style.lineHeight = `${keySize}px`;
      gui.querySelector('#key-s').style.width = `${keySize}px`;
      gui.querySelector('#key-s').style.height = `${keySize}px`;
      gui.querySelector('#key-s').style.lineHeight = `${keySize}px`;
      gui.querySelector('#key-d').style.width = `${keySize}px`;
      gui.querySelector('#key-d').style.height = `${keySize}px`;
      gui.querySelector('#key-d').style.lineHeight = `${keySize}px`;
      gui.querySelector('#key-space').style.width = `${spaceWidth}px`;
      gui.querySelector('#key-space').style.height = `${keyHeight}px`;
      gui.querySelector('#key-space').style.lineHeight = `${keyHeight}px`;
    }

    // UI styles
    if (!document.getElementById('emuChamsStyle')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'emuChamsStyle';
      styleSheet.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

        :root {
          --accent-color: #FFD700;
          --accent-shadow: rgba(255, 215, 0, 0.3);
          --bg-gradient: linear-gradient(to bottom, rgba(10, 10, 15, 0.95), rgba(20, 20, 30, 0.95));
          --btn-bg: rgba(20, 20, 30, 0.8);
          --text-color: #E6E6FA;
          --border-color: #2A2A3A;
          --divider-color: #3A3A4A;
        }

        [data-theme="gold-black"] {
          --accent-color: #FFD700;
          --accent-shadow: rgba(255, 215, 0, 0.3);
          --bg-gradient: linear-gradient(to bottom, rgba(10, 10, 15, 0.95), rgba(20, 20, 30, 0.95));
          --btn-bg: rgba(20, 20, 30, 0.8);
          --text-color: #E6E6FA;
          --border-color: #2A2A3A;
          --divider-color: #3A3A4A;
        }

        [data-theme="dark-neon"] {
          --accent-color: #00E6FF;
          --accent-shadow: rgba(0, 230, 255, 0.3);
          --bg-gradient: linear-gradient(to bottom, rgba(0, 10, 15, 0.95), rgba(10, 20, 30, 0.95));
          --btn-bg: rgba(15, 25, 35, 0.8);
          --text-color: #F0F6FF;
          --border-color: #1A2538;
          --divider-color: #2E3A50;
        }

        [data-theme="cyber-blue"] {
          --accent-color: #3399FF;
          --accent-shadow: rgba(51, 153, 255, 0.3);
          --bg-gradient: linear-gradient(to bottom, rgba(0, 20, 40, 0.95), rgba(20, 40, 60, 0.95));
          --btn-bg: rgba(15, 35, 55, 0.8);
          --text-color: #C3E6FF;
          --border-color: #2F3F5A;
          --divider-color: #3F4F6A;
        }

        #menu {
          position: fixed;
          width: 320px;
          height: 400px;
          background: var(--bg-gradient);
          border: 2px solid var(--accent-color);
          border-radius: 10px;
          color: var(--text-color);
          opacity: ${settings.player.menuOpacity};
          font-family: 'Exo 2', sans-serif;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          left: ${settings.player.menuPosition.left};
          top: ${settings.player.menuPosition.top};
          transition: height 0.3s ease, opacity 0.3s ease;
          box-shadow: 0 0 20px var(--accent-shadow);
        }

        #menu.minimized {
          height: 40px;
          overflow: hidden;
        }

        #menu-header {
          background: radial-gradient(circle at center, rgba(255, 215, 0, 0.3) 0%, rgba(0, 0, 0, 1) 70%);
          background-size: 200% 200%;
          animation: blackHoleSwirl 6s ease-in-out infinite;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          cursor: move;
          position: relative;
          overflow: hidden;
          z-index: 2;
        }

        #menu-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"%3E%3Ccircle cx="5" cy="5" r="0.5" fill="rgba(255,255,255,0.2)" /%3E%3C/svg%3E');
          background-size: 5px;
          animation: particleDrift 20s linear infinite;
        }

        @keyframes blackHoleSwirl {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }

        @keyframes particleDrift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-50px, -50px); }
        }

        #menu-title {
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          text-shadow: 0 0 5px var(--accent-color);
        }

        #menu-controls button {
          background: none;
          border: none;
          color: #FFFFFF;
          padding: 4px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        #menu-controls button:hover {
          transform: scale(1.1);
        }

        #menu-content {
          display: flex;
          flex-grow: 1;
          overflow: hidden;
        }

        #menu-tabs {
          background: var(--btn-bg);
          width: 90px;
          display: flex;
          flex-direction: column;
          padding: 10px;
          border-right: 2px solid var(--border-color);
          flex-shrink: 0;
        }

        #menu-tabs button {
          background: none;
          border: none;
          color: var(--text-color);
          padding: 8px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: background-color 0.2s, transform 0.2s;
          border-radius: 4px;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        #menu-tabs button:hover {
          background: var(--accent-color);
          color: var(--btn-bg);
          transform: translateX(3px);
        }

        #menu-tabs button.active {
          background: var(--accent-color);
          color: var(--btn-bg);
        }

        #menu-body {
          padding: 10px;
          overflow-y: auto;
          flex-grow: 1;
          max-height: 340px;
          width: 210px;
        }

        #menu-body::-webkit-scrollbar {
          width: 6px;
        }

        #menu-body::-webkit-scrollbar-track {
          background: var(--btn-bg);
        }

        #menu-body::-webkit-scrollbar-thumb {
          background: var(--accent-color);
          border-radius: 3px;
        }

        .tab-content {
          display: none;
        }

        .tab-content.active {
          display: block;
        }

        .btn-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
          margin: 6px 0;
        }

        .cheat-btn {
          background: var(--btn-bg);
          border: 1px solid var(--border-color);
          color: var(--text-color);
          padding: 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .cheat-btn:hover {
          background: var(--accent-color);
          color: var(--btn-bg);
          transform: scale(1.02);
        }

        .cheat-btn.active {
          background: var(--accent-color);
          color: var(--btn-bg);
        }

        #status-bar {
          position: fixed;
          bottom: 10px;
          left: 10px;
          background: var(--bg-gradient);
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: var(--text-color);
          font-size: 11px;
          font-family: 'Exo 2', sans-serif;
          z-index: 999998;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          box-shadow: 0 2px 8px var(--accent-shadow);
        }

        .status-text {
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        #mod-status {
          position: fixed;
          top: 10px;
          right: 10px;
          background: var(--bg-gradient);
          padding: 8px;
          color: var(--text-color);
          border: 1px solid var(--accent-color);
          border-radius: 6px;
          font-size: 11px;
          z-index: 999998;
          display: none;
          font-family: 'Exo 2', sans-serif;
        }

        #branding {
          position: fixed;
          top: 10px;
          left: 10px;
          background: var(--bg-gradient);
          padding: 8px;
          color: var(--text-color);
          border-radius: 6px;
          font-family: 'Exo 2', sans-serif;
          font-size: 11px;
          z-index: 999998;
          border: 1px solid var(--border-color);
        }

        .tutorial-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          z-index: 10000;
          display: none;
          pointer-events: none;
        }

        .tutorial-tooltip {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--bg-gradient);
          color: var(--text-color);
          padding: 15px 20px;
          border: 2px solid var(--accent-color);
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          max-width: 500px;
          width: 90%;
          text-align: center;
          box-shadow: 0 4px 12px var(--accent-shadow);
          font-family: 'Exo 2', sans-serif;
          z-index: 10001;
        }

        .tutorial-arrow {
          position: absolute;
          width: 0;
          height: 0;
          border: 15px solid transparent;
          border-bottom-color: var(--accent-color);
          z-index: 10001;
        }

        hr {
          border: none;
          border-top: 1px solid var(--divider-color);
          margin: 8px 0;
        }

        label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-color);
          margin: 6px 0;
          display: block;
        }

        input[type="color"], input[type="range"] {
          width: 100%;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: var(--btn-bg);
          padding: 2px;
        }

        .key-box {
          transition: background 0.1s ease, color 0.1s ease;
          box-shadow: 0 0 4px rgba(255, 215, 0, ${stats => stats.keys.w || stats.keys.a || stats.keys.s || stats.keys.d || stats.keys.space ? '0.3' : '0'});
        }

        .accordion {
          background: var(--btn-bg);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          margin-bottom: 6px;
          overflow: hidden;
        }

        .accordion-header {
          padding: 8px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-color);
          transition: background 0.2s ease;
        }

        .accordion-header:hover {
          background: var(--accent-color);
          color: var(--btn-bg);
        }

        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
          padding: 0 8px;
        }

        .accordion-content.active {
          max-height: 200px;
          padding: 8px;
        }

        .accordion-content p {
          font-size: 11px;
          line-height: 1.4;
          color: var(--text-color);
        }
      `;
      document.head.appendChild(styleSheet);
    }

    // Tutorial system
    function startTutorial() {
      const overlay = document.createElement('div');
      overlay.className = 'tutorial-overlay';
      document.body.appendChild(overlay);
      overlay.style.display = 'block';

      const tooltip = document.createElement('div');
      tooltip.className = 'tutorial-tooltip';
      tooltip.textContent = 'Press ; to open the Emulation Premium menu!';
      document.body.appendChild(tooltip);

      const arrow = document.createElement('div');
      arrow.className = 'tutorial-arrow';
      document.body.appendChild(arrow);

      function updateArrowPosition() {
        const menuHeader = document.querySelector('#menu-header');
        if (!menuHeader) return;
        const rect = menuHeader.getBoundingClientRect();
        arrow.style.top = `${rect.bottom + 15}px`;
        arrow.style.left = `${rect.left + rect.width / 2}px`;
      }

      updateArrowPosition();
      window.addEventListener('resize', updateArrowPosition);

      const handler = (e) => {
        if (e.key === ';') {
          document.removeEventListener('keydown', handler);
          window.removeEventListener('resize', updateArrowPosition);
          overlay.remove();
          tooltip.remove();
          arrow.remove();
          showNotification('Tutorial dismissed');
        }
      };
      document.addEventListener('keydown', handler);
    }

    // Create UI
    let menu = document.getElementById('menu');
    if (!menu) {
      showLoadingScreen();

      // Branding
      const branding = document.createElement('div');
      branding.id = 'branding';
      branding.textContent = `Emulation Premium v${clientVersion}`;
      document.body.appendChild(branding);

      // Mod status
      const modStatus = document.createElement('div');
      modStatus.id = 'mod-status';
      modStatus.textContent = 'Premium Active';
      modStatus.style.display = settings.player.modStatus ? 'block' : 'none';
      document.body.appendChild(modStatus);

      // Status bar
      const statusBar = document.createElement('div');
      statusBar.id = 'status-bar';
      document.body.appendChild(statusBar);

      // Menu
      menu = document.createElement('div');
      menu.id = 'menu';
      menu.dataset.theme = settings.player.theme;
      menu.classList.toggle('minimized', settings.player.menuMinimized);

      const header = document.createElement('div');
      header.id = 'menu-header';
      const title = document.createElement('h1');
      title.id = 'menu-title';
      title.textContent = 'Emulation Premium';
      const controls = document.createElement('div');
      controls.id = 'menu-controls';
      const minimizeBtn = document.createElement('button');
      minimizeBtn.innerHTML = `<i class="fas fa-${settings.player.menuMinimized ? 'plus' : 'minus'}"></i>`;
      minimizeBtn.onclick = () => {
        settings.player.menuMinimized = !settings.player.menuMinimized;
        menu.classList.toggle('minimized');
        minimizeBtn.innerHTML = `<i class="fas fa-${settings.player.menuMinimized ? 'plus' : 'minus'}"></i>`;
        saveSettings();
        showNotification(`Menu ${settings.player.menuMinimized ? 'minimized' : 'restored'}`);
      };
      controls.appendChild(minimizeBtn);
      header.appendChild(title);
      header.appendChild(controls);

      const content = document.createElement('div');
      content.id = 'menu-content';
      const tabs = document.createElement('div');
      tabs.id = 'menu-tabs';
      const body = document.createElement('div');
      body.id = 'menu-body';
      content.appendChild(tabs);
      content.appendChild(body);

      menu.appendChild(header);
      menu.appendChild(content);
      document.body.appendChild(menu);

      // Draggable menu
      let isDragging = false;
      let currentX, currentY;
      header.addEventListener('mousedown', (e) => {
        isDragging = true;
        currentX = e.clientX - parseFloat(menu.style.left || 10);
        currentY = e.clientY - parseFloat(menu.style.top || 10);
      });
      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - currentX;
        let newY = e.clientY - currentY;
        newX = Math.max(0, Math.min(newX, window.innerWidth - menu.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - menu.offsetHeight));
        menu.style.left = `${newX}px`;
        menu.style.top = `${newY}px`;
        settings.player.menuPosition = { left: `${newX}px`, top: `${newY}px` };
        saveSettings();
      });
      document.addEventListener('mouseup', () => {
        isDragging = false;
      });

      // Key press listeners
      document.addEventListener('keydown', (e) => {
        switch (e.key.toLowerCase()) {
          case 'w': stats.keys.w = true; break;
          case 'a': stats.keys.a = true; break;
          case 's': stats.keys.s = true; break;
          case 'd': stats.keys.d = true; break;
          case ' ': stats.keys.space = true; break;
        }
        updateStatsOverlay();
        updateKeyPressGui();
      });
      document.addEventListener('keyup', (e) => {
        switch (e.key.toLowerCase()) {
          case 'w': stats.keys.w = false; break;
          case 'a': stats.keys.a = false; break;
          case 's': stats.keys.s = false; break;
          case 'd': stats.keys.d = false; break;
          case ' ': stats.keys.space = false; break;
        }
        updateStatsOverlay();
        updateKeyPressGui();
      });

      // Mouse position listener
      document.addEventListener('mousemove', (e) => {
        stats.mouse.x = e.clientX;
        stats.mouse.y = e.clientY;
        updateStatsOverlay();
      });

      initCrosshairCanvas();
      window.addEventListener('resize', resizeCrosshair);

      const categories = [
        {
          name: 'Advantage', icon: 'bolt', description: 'Tactical mesh effects', meshes: [
            { name: 'Normal', icon: 'cube', desc: 'Default rendering' },
            { name: 'Glow Neon', icon: 'lightbulb', desc: 'Bright neon glow' },
            { name: 'Red Danger', icon: 'exclamation-triangle', desc: 'Red threat highlight' },
            { name: 'Hacker Matrix', icon: 'code', desc: 'Green wireframe' },
            { name: 'Chrome Metal', icon: 'gem', desc: 'Metallic finish' },
            { name: 'Shadow Cloak', icon: 'user-secret', desc: 'Dark semi-transparent cloak' },
            { name: 'Crystal Clear', icon: 'gem', desc: 'Translucent crystal effect' },
            { name: 'Toxic Haze', icon: 'biohazard', desc: 'Green toxic glow' },
            { name: 'Phantom Outline', icon: 'ghost', desc: 'White wireframe outline' },
            { name: 'Electric Grid', icon: 'bolt', desc: 'Blue electric wireframe' }
          ]
        },
        {
          name: 'Utility', icon: 'palette', description: 'Dynamic visual effects', meshes: [
            { name: 'Rainbow', icon: 'rainbow', desc: 'Cycling colors' },
            { name: 'Aurora Borealis', icon: 'cloud', desc: 'Northern lights' },
            { name: 'Neon Pulse', icon: 'bolt', desc: 'Pulsating glow' },
            { name: 'Solar Flare', icon: 'sun', desc: 'Fiery pulses' },
            { name: 'Gold Pulse', icon: 'star', desc: 'Gold shimmer' },
            { name: 'Cosmic Void', icon: 'space-shuttle', desc: 'Deep space pulse' },
            { name: 'Starfield Flux', icon: 'star', desc: 'Starry dynamic glow' },
            { name: 'Plasma Surge', icon: 'fire', desc: 'Purple plasma waves' },
            { name: 'Galactic Spiral', icon: 'galactic-republic', desc: 'Spiraling cosmic hues' },
            { name: 'Quantum Flicker', icon: 'atom', desc: 'Randomized purple flicker' }
          ]
        },
        {
          name: 'Crosshair', icon: 'crosshairs', description: 'Custom crosshairs', crosshairs: [
            { name: 'None', icon: 'ban', desc: 'No crosshair' },
            { name: 'Dot', icon: 'circle', desc: 'Centered dot' },
            { name: 'Cross', icon: 'plus', desc: 'Cross shape' },
            { name: 'Plus', icon: 'plus-square', desc: 'Plus shape' },
            { name: 'Dynamic Dot', icon: 'circle-notch', desc: 'Pulsing dot' }
          ]
        },
        {
          name: 'Stats', icon: 'chart-line', description: 'Toggle stats overlays for gameplay info', stats: []
        },
        { name: 'Settings', icon: 'cog', description: 'Client configuration', settings: [] },
        { name: 'About', icon: 'info-circle', description: 'Client information', about: [] }
      ];

      let currentCategory = 'Advantage';

      function createButtonGrid(options, type, prop, labelKey, callback) {
        const grid = document.createElement('div');
        grid.className = 'btn-grid';
        options.forEach(opt => {
          const btn = document.createElement('button');
          btn.className = `cheat-btn ${settings.player[prop] === (typeof opt === 'object' ? opt[labelKey] : opt) ? 'active' : ''}`;
          btn.innerHTML = `<i class="fas fa-${opt.icon || 'cube'}"></i> ${typeof opt === 'object' ? opt[labelKey] : opt.toString()}`;
          btn.onclick = () => {
            settings.player[prop] = typeof opt === 'object' ? opt[labelKey] : opt;
            grid.querySelectorAll('.cheat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            callback(opt);
            applySettings();
            saveSettings();
          };
          grid.appendChild(btn);
        });
        return grid;
      }

      function updateCategoryButtons() {
        tabs.innerHTML = '';
        categories.forEach(cat => {
          const btn = document.createElement('button');
          btn.innerHTML = `<i class="fas fa-${cat.icon}"></i> ${cat.name}`;
          btn.classList.toggle('active', cat.name === currentCategory);
          btn.onclick = () => {
            currentCategory = cat.name;
            updateCategoryUI();
            updateCategoryButtons();
            showNotification(`Switched to ${cat.name}`);
          };
          tabs.appendChild(btn);
        });
      }

      function updateCategoryUI() {
        body.innerHTML = '';
        const tabContent = document.createElement('div');
        tabContent.className = `tab-content ${currentCategory.toLowerCase()} active`;
        const info = document.createElement('label');
        info.textContent = categories.find(c => c.name === currentCategory).description;
        tabContent.appendChild(info);

        if (currentCategory === 'Advantage' || currentCategory === 'Utility') {
          const meshes = categories.find(c => c.name === currentCategory).meshes;
          const grid = createButtonGrid(meshes, 'mesh', 'meshType', 'name', (mesh) => {
            showNotification(`Mesh set to ${mesh.name}`);
          });
          tabContent.appendChild(grid);
        } else if (currentCategory === 'Crosshair') {
          const crosshairs = categories.find(c => c.name === currentCategory).crosshairs;
          const crosshairGrid = createButtonGrid(crosshairs, 'crosshair', 'crosshairType', 'name', (ch) => {
            showNotification(`Crosshair set to ${ch.name}`);
          });
          tabContent.appendChild(crosshairGrid);

          const sizeLabel = document.createElement('label');
          sizeLabel.textContent = 'Crosshair Size';
          const sizeGrid = createButtonGrid([10, 20, 30, 40], 'size', 'crosshairSize', 'toString', (size) => {
            showNotification(`Crosshair Size set to ${size}px`);
          });
          tabContent.appendChild(sizeLabel);
          tabContent.appendChild(sizeGrid);

          const gapLabel = document.createElement('label');
          gapLabel.textContent = 'Crosshair Gap';
          const gapGrid = createButtonGrid([0, 5, 10, 15], 'gap', 'crosshairGap', 'toString', (gap) => {
            showNotification(`Crosshair Gap set to ${gap}px`);
          });
          tabContent.appendChild(gapLabel);
          tabContent.appendChild(gapGrid);

          const colorLabel = document.createElement('label');
          colorLabel.textContent = 'Crosshair Color';
          const colorPicker = document.createElement('input');
          colorPicker.type = 'color';
          colorPicker.value = settings.player.crosshairColor;
          colorPicker.onchange = () => {
            settings.player.crosshairColor = colorPicker.value;
            showNotification(`Crosshair color set`);
            applySettings();
            saveSettings();
          };
          tabContent.appendChild(colorLabel);
          tabContent.appendChild(colorPicker);
        } else if (currentCategory === 'Stats') {
          const btnGrid = document.createElement('div');
          btnGrid.className = 'btn-grid';

          const toggles = [
            { name: 'Ping', prop: 'showPing', icon: 'network-wired', desc: 'Toggle ping display' },
            { name: 'FPS', prop: 'showFps', icon: 'tachometer-alt', desc: 'Toggle FPS display' },
            { name: 'Keys', prop: 'showKeys', icon: 'keyboard', desc: 'Toggle WASD/Space display' },
            { name: 'Mouse', prop: 'showMouse', icon: 'mouse', desc: 'Toggle mouse position' },
            { name: 'Game Time', prop: 'showGameTime', icon: 'clock', desc: 'Toggle session time' }
          ];

          toggles.forEach(toggle => {
            const btn = document.createElement('button');
            btn.className = `cheat-btn ${settings.player[toggle.prop] ? 'active' : ''}`;
            btn.innerHTML = `<i class="fas fa-${toggle.icon}"></i> ${toggle.name}: ${settings.player[toggle.prop] ? 'ON' : 'OFF'}`;
            btn.onclick = () => {
              settings.player[toggle.prop] = !settings.player[toggle.prop];
              btn.innerHTML = `<i class="fas fa-${toggle.icon}"></i> ${toggle.name}: ${settings.player[toggle.prop] ? 'ON' : 'OFF'}`;
              btn.classList.toggle('active');
              showNotification(`${toggle.name} display ${settings.player[toggle.prop] ? 'enabled' : 'disabled'}`);
              applySettings();
              saveSettings();
            };
            btnGrid.appendChild(btn);
          });
          tabContent.appendChild(btnGrid);
        } else if (currentCategory === 'Settings') {
          const btnGrid = document.createElement('div');
          btnGrid.className = 'btn-grid';

          const toggles = [
            { name: 'Wallhacks', prop: 'seeThroughWalls', icon: 'eye', desc: 'Toggle wall visibility' },
            { name: 'Wireframe', prop: 'wireframe', icon: 'draw-polygon', desc: 'Toggle wireframe mode' },
            { name: 'Notifications', prop: 'notifications', icon: 'bell', desc: 'Toggle notifications' },
            { name: 'Mod Status', prop: 'modStatus', icon: 'shield-alt', desc: 'Toggle status display' }
          ];

          toggles.forEach(toggle => {
            const btn = document.createElement('button');
            btn.className = `cheat-btn ${settings.player[toggle.prop] ? 'active' : ''}`;
            btn.innerHTML = `<i class="fas fa-${toggle.icon}"></i> ${toggle.name}: ${settings.player[toggle.prop] ? 'ON' : 'OFF'}`;
            btn.onclick = () => {
              settings.player[toggle.prop] = !settings.player[toggle.prop];
              btn.innerHTML = `<i class="fas fa-${toggle.icon}"></i> ${toggle.name}: ${settings.player[toggle.prop] ? 'ON' : 'OFF'}`;
              btn.classList.toggle('active');
              showNotification(`${toggle.name} ${settings.player[toggle.prop] ? 'enabled' : 'disabled'}`);
              if (toggle.prop === 'modStatus') {
                document.getElementById('mod-status').style.display = settings.player.modStatus ? 'block' : 'none';
              }
              applySettings();
              saveSettings();
            };
            btnGrid.appendChild(btn);
          });
          tabContent.appendChild(btnGrid);

          const opacityLabel = document.createElement('label');
          opacityLabel.textContent = 'Mesh Opacity';
          const opacityGrid = createButtonGrid([
            { value: 0.1, icon: 'low-vision' },
            { value: 0.3, icon: 'low-vision' },
            { value: 0.5, icon: 'low-vision' },
            { value: 0.7, icon: 'low-vision' },
            { value: 0.9, icon: 'low-vision' },
            { value: 1.0, icon: 'eye' }
          ], 'opacity', 'opacity', 'value', (op) => {
            showNotification(`Opacity set to ${op.value}`);
          });
          tabContent.appendChild(opacityLabel);
          tabContent.appendChild(opacityGrid);

          const speedLabel = document.createElement('label');
          speedLabel.textContent = 'Animation Speed';
          const speedGrid = createButtonGrid([
            { value: 0.5, icon: 'tachometer-alt' },
            { value: 1.0, icon: 'tachometer-alt' },
            { value: 1.5, icon: 'tachometer-alt' },
            { value: 2.0, icon: 'tachometer-alt' }
          ], 'speed', 'animationSpeed', 'value', (speed) => {
            showNotification(`Animation speed set to ${speed.value}x`);
          });
          tabContent.appendChild(speedLabel);
          tabContent.appendChild(speedGrid);

          const keyGuiOpacityLabel = document.createElement('label');
          keyGuiOpacityLabel.textContent = 'Key GUI Opacity';
          const keyGuiOpacitySlider = document.createElement('input');
          keyGuiOpacitySlider.type = 'range';
          keyGuiOpacitySlider.min = '0';
          keyGuiOpacitySlider.max = '1';
          keyGuiOpacitySlider.step = '0.1';
          keyGuiOpacitySlider.value = settings.player.keyGuiOpacity;
          keyGuiOpacitySlider.oninput = () => {
            settings.player.keyGuiOpacity = parseFloat(keyGuiOpacitySlider.value);
            showNotification(`Key GUI opacity set to ${settings.player.keyGuiOpacity}`);
            applySettings();
            saveSettings();
          };
          tabContent.appendChild(keyGuiOpacityLabel);
          tabContent.appendChild(keyGuiOpacitySlider);

          const themeLabel = document.createElement('label');
          themeLabel.textContent = 'Theme';
          const themeGrid = createButtonGrid([
            { value: 'gold-black', icon: 'star' },
            { value: 'dark-neon', icon: 'lightbulb' },
            { value: 'cyber-blue', icon: 'bolt' }
          ], 'theme', 'theme', 'value', (theme) => {
            menu.dataset.theme = theme.value;
            showNotification(`Theme set to ${theme.value}`);
          });
          tabContent.appendChild(themeLabel);
          tabContent.appendChild(themeGrid);
        } else if (currentCategory === 'About') {
          tabContent.innerHTML = `
            <p style="font-size: 12px; line-height: 1.5;">
              <strong>Emulation Premium v${clientVersion}</strong><br>
              A feature-rich cheat client for Voxiom.io.<br><br>
              <strong>Features:</strong><br>
              - 20 unique mesh types (10 Advantage, 10 Utility)<br>
              - Custom crosshairs with size, gap, and color options<br>
              - Stats overlay (Ping, FPS, Keys, Mouse, Game Time)<br>
              - Draggable and resizable key input GUI with opacity control<br>
              - Customizable themes (gold-black, dark-neon, cyber-blue)<br>
              - Persistent settings with localStorage<br>
              - Smooth animations and cosmic-themed UI<br><br>
              <strong>Author:</strong> Emulation<br>
              <strong>License:</strong> MIT
            </p>
            <hr>
            <label>Version History</label>
          `;

          const versions = [
            {
              version: '3.0.0',
              changes: 'Added version history accordions in About tab. Introduced Key GUI opacity slider in Settings.'
            },
            {
              version: '2.9.2',
              changes: 'Removed LMB, RMB, and Shift from Key Inputs GUI. Simplified key GUI layout to W, A, S, D, Space.'
            },
            {
              version: '2.9.1',
              changes: 'Added draggable and resizable Key Inputs GUI. Improved stats overlay rendering.'
            },
            {
              version: '2.9.0',
              changes: 'Introduced 10 new Utility mesh types. Added persistent tutorial system.'
            }
          ];

          versions.forEach(v => {
            const accordion = document.createElement('div');
            accordion.className = 'accordion';
            accordion.innerHTML = `
              <div class="accordion-header">
                <span>Version ${v.version}</span>
                <i class="fas fa-chevron-down"></i>
              </div>
              <div class="accordion-content">
                <p>${v.changes}</p>
              </div>
            `;
            const header = accordion.querySelector('.accordion-header');
            const content = accordion.querySelector('.accordion-content');
            header.onclick = () => {
              content.classList.toggle('active');
              header.querySelector('i').classList.toggle('fa-chevron-down');
              header.querySelector('i').classList.toggle('fa-chevron-up');
            };
            tabContent.appendChild(accordion);
          });
        }
        body.appendChild(tabContent);
      }

      updateCategoryButtons();
      updateCategoryUI();
      applySettings();

      // Toggle menu
      document.addEventListener('keydown', (e) => {
        if (e.key === ';') {
          menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
          showNotification(`Menu ${menu.style.display === 'none' ? 'hidden' : 'shown'}`);
        }
      });

      // Start animation
      animationFrameId = requestAnimationFrame(animate);

      // Start tutorial if not dismissed
      if (!localStorage.getItem('tutorialDismissed')) {
        startTutorial();
        localStorage.setItem('tutorialDismissed', 'true');
      }
    }
  })();