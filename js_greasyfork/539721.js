// ==UserScript==
// @name         Voxiom.io Emulation Premium Cheat Client
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A premium cheat client for Voxiom.io developed by Emulation, featuring advanced in-game mods and enhancements.
// @author       Emulation
// @match        https://voxiom.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=voxiom.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539721/Voxiomio%20Emulation%20Premium%20Cheat%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/539721/Voxiomio%20Emulation%20Premium%20Cheat%20Client.meta.js
// ==/UserScript==


(function() {
  // Settings
  const prototype_ = {
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
      crosshairColor: '#00f0ff',
      notifications: true,
      modStatus: true,
      menuOpacity: 1.0,
      fov: 90,
      noFog: false,
      theme: localStorage.getItem('theme') || 'obsidian-black',
      menuPosition: JSON.parse(localStorage.getItem('menuPosition')) || { left: '50%', top: '50%' },
      menuVisible: localStorage.getItem('menuVisible') !== 'false',
      menuMinimized: false
    }
  };

  const playerMaterials = new Set();
  let notificationTimeout = null;
  const clientVersion = '2.0.0';
  let menuVisible = prototype_.player.menuVisible;
  let camera, scene;
  const notifications = [];

  // Save settings
  function saveSettings() {
    localStorage.setItem('theme', prototype_.player.theme);
    localStorage.setItem('menuPosition', JSON.stringify(prototype_.player.menuPosition));
    localStorage.setItem('menuVisible', menuVisible);
    localStorage.setItem('menuMinimized', prototype_.player.menuMinimized);
    localStorage.setItem('settings', JSON.stringify({
      opacity: prototype_.player.opacity,
      wireframe: prototype_.player.wireframe,
      seeThroughWalls: prototype_.player.seeThroughWalls,
      meshType: prototype_.player.meshType,
      animationSpeed: prototype_.player.animationSpeed,
      baseHue: prototype_.player.baseHue,
      emissiveIntensity: prototype_.player.emissiveIntensity,
      crosshairType: prototype_.player.crosshairType,
      crosshairSize: prototype_.player.crosshairSize,
      crosshairGap: prototype_.player.crosshairGap,
      crosshairColor: prototype_.player.crosshairColor,
      notifications: prototype_.player.notifications,
      modStatus: prototype_.player.modStatus,
      menuOpacity: prototype_.player.menuOpacity,
      fov: prototype_.player.fov,
      noFog: prototype_.player.noFog
    }));
  }

  // Load settings
  const savedSettings = localStorage.getItem('settings');
  if (savedSettings) {
    Object.assign(prototype_.player, JSON.parse(savedSettings));
  }

  // Show notification
  function showNotification(message) {
    if (!prototype_.player.notifications) return;
    const notification = document.createElement('div');
    notification.className = 'notification tooltip';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = `${20 + notifications.length * 40}px`;
    notification.style.right = '20px';
    notification.style.background = 'var(--bg-gradient)';
    notification.style.border = '1px solid var(--accent-color)';
    notification.style.color = 'var(--text-color)';
    notification.style.padding = '6px 12px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 15px var(--accent-shadow)';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    notification.style.transform = 'translateX(20px)';
    notification.style.zIndex = '999997';
    notification.style.fontFamily = '"Inter", sans-serif';
    notification.style.fontSize = '11px';
    notification.style.backdropFilter = 'blur(12px)';
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
        if (!camera && obj.camera) {
          camera = obj.camera;
          applyFOV();
        }
        if (!scene && obj.scene) {
          scene = obj.scene;
          applyFog();
        }
      }
    } catch (e) {
      console.error("[EMULATION'S PREMIUM] Material hook error:", e);
      showNotification("Warning: Material hooking failed");
    }
    return originalPush.apply(this, args);
  };

  // Apply chams
  function applyChamsSettings() {
    try {
      playerMaterials.forEach(mat => {
        if (!mat) return;
        mat.opacity = prototype_.player.opacity;
        mat.wireframe = prototype_.player.wireframe;
        mat.transparent = true;
        mat.side = 2;
        if (prototype_.player.seeThroughWalls) {
          mat.depthTest = false;
          mat.depthFunc = 7;
        } else {
          mat.depthTest = true;
          mat.depthFunc = 3;
        }
        applyMeshType(mat);
      });
      applyFOV();
      applyFog();
      updateStatus();
      drawCrosshair();
    } catch (e) {
      console.error("[EMULATION'S PREMIUM] Chams error:", e);
      showNotification("Error applying chams");
    }
  }

  // Apply FOV
  function applyFOV() {
    if (camera) {
      camera.fov = prototype_.player.fov;
      camera.updateProjectionMatrix();
    }
  }

  // Apply Fog
  function applyFog() {
    if (scene) {
      if (prototype_.player.noFog) {
        scene.fog = null;
      } else {
        if (scene.fog === null) {
          scene.fog = new THREE.Fog(0x000000, 10, 100);
        }
      }
    }
  }

  // Dynamic color helpers
  function getRainbowColor() { return `hsl(${(Date.now() / (50 / prototype_.player.animationSpeed)) % 360}, 100%, 50%)`; }
  function getAuroraColor() { const t = Date.now() / (400 / prototype_.player.animationSpeed); return `hsl(${(t * 30 + prototype_.player.baseHue) % 360}, 80%, 60%)`; }
  function getNeonPulseColor() { const t = Date.now() / (100 / prototype_.player.animationSpeed); const i = (Math.sin(t * 2) + 1) / 2; return `hsl(${(300 + prototype_.player.baseHue) % 360}, 100%, ${50 + i * 30}%)`; }
  function getSolarFlareColor() { const t = Date.now() / (250 / prototype_.player.animationSpeed); return `hsl(${(30 + prototype_.player.baseHue) % 360}, 100%, ${60 + Math.sin(t) * 20}%)`; }

  // Mesh type implementation
  function applyMeshType(mat) {
    if (!mat) return;
    const type = prototype_.player.meshType;
    mat.color.set('white');
    if (mat.emissive) mat.emissive.setHex(0x000000);
    mat.wireframe = prototype_.player.wireframe;
    mat.side = 2;
    const emissiveFactor = prototype_.player.emissiveIntensity;
    switch (type) {
      case 'Normal': mat.opacity = 1; mat.transparent = false; mat.depthTest = true; break;
      case 'Glow Neon': mat.color.set(`hsl(${(180 + prototype_.player.baseHue) % 360}, 100%, 50%)`); mat.opacity = prototype_.player.opacity; if (mat.emissive) mat.emissive.setHex(0x00FFFF).multiplyScalar(emissiveFactor); mat.transparent = mat.opacity < 1; mat.depthTest = true; break;
      case 'Rainbow': mat.transparent = true; mat.opacity = 0.9; mat.depthTest = false; mat.color.set(getRainbowColor()); break;
      case 'Glass': mat.color.set(`hsl(${(200 + prototype_.player.baseHue) % 360}, 50%, 80%)`); mat.opacity = 0.3; mat.transparent = true; mat.depthTest = true; break;
      case 'Red Danger': mat.color.set(`hsl(${(0 + prototype_.player.baseHue) % 360}, 100%, 50%)`); mat.opacity = 0.9; mat.transparent = true; mat.depthTest = true; break;
      case 'Hacker Matrix': mat.color.set(`hsl(${(120 + prototype_.player.baseHue) % 360}, 100%, 50%)`); mat.wireframe = true; mat.opacity = 1; mat.transparent = false; mat.depthTest = true; break;
      case 'Chrome Metal': mat.color.set('#C0C0C0'); if (mat.emissive) mat.emissive.setHex(0x404040).multiplyScalar(emissiveFactor); mat.opacity = 1; mat.transparent = false; mat.depthTest = true; break;
      case 'Aurora Borealis': mat.transparent = true; mat.opacity = 0.7; mat.depthTest = false; mat.color.set(getAuroraColor()); break;
      case 'Neon Pulse': mat.transparent = true; mat.opacity = 0.9; mat.depthTest = false; mat.color.set(getNeonPulseColor()); if (mat.emissive) mat.emissive.setHex(0xFF00FF).multiplyScalar(emissiveFactor); break;
      case 'Solar Flare': mat.transparent = true; mat.opacity = 0.9; mat.depthTest = false; mat.color.set(getSolarFlareColor()); if (mat.emissive) mat.emissive.setHex(0xFFA500).multiplyScalar(emissiveFactor); break;
      default: mat.opacity = prototype_.player.opacity; mat.transparent = mat.opacity < 1; mat.depthTest = true; break;
    }
  }

  // Animation loop
  let animationFrameId;
  function animate() {
    if (!menuVisible && !prototype_.player.modStatus && prototype_.player.crosshairType === 'None') {
      drawCrosshair();
      animationFrameId = requestAnimationFrame(animate);
      return;
    }
    const staticMeshes = ['Normal', 'Glow Neon', 'Glass', 'Red Danger', 'Hacker Matrix', 'Chrome Metal'];
    if (!staticMeshes.includes(prototype_.player.meshType)) {
      playerMaterials.forEach(mat => {
        if (!mat) return;
        switch (prototype_.player.meshType) {
          case 'Rainbow': mat.color.set(getRainbowColor()); break;
          case 'Aurora Borealis': mat.color.set(getAuroraColor()); break;
          case 'Neon Pulse': mat.color.set(getNeonPulseColor()); break;
          case 'Solar Flare': mat.color.set(getSolarFlareColor()); break;
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
    crosshairCanvas.style.background = 'var(--crosshair-overlay)';
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
    if (prototype_.player.crosshairType === 'None') return;

    const centerX = crosshairCanvas.width / 2;
    const centerY = crosshairCanvas.height / 2;
    const size = prototype_.player.crosshairSize;
    const gap = prototype_.player.crosshairGap;
    const color = prototype_.player.crosshairColor;
    crosshairCtx.strokeStyle = color;
    crosshairCtx.fillStyle = color;
    crosshairCtx.lineWidth = 2;

    switch (prototype_.player.crosshairType) {
      case 'Dot':
        crosshairCtx.beginPath();
        crosshairCtx.arc(centerX, centerY, size / 5, 0, Math.PI * 2);
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
        crosshairCtx.lineWidth = 4;
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
        const pulseSize = size / 5 + Math.sin(Date.now() / 300) * (size / 4);
        crosshairCtx.beginPath();
        crosshairCtx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
        crosshairCtx.fill();
        break;
    }
  }

  // Update status bar
  function updateStatus() {
    const statusBar = document.querySelector('#status-bar');
    if (!statusBar) return;
    statusBar.innerHTML = `
      <span class="status-item" title="Current mesh type"><i class="fas fa-cube"></i> Mesh: <span class="status-value">${prototype_.player.meshType}</span></span>
      <span class="status-item tooltip" id="wallhack-toggle" title="Click to toggle wallhacks"><i class="fas fa-eye"></i> Wallhacks: <span class="${prototype_.player.seeThroughWalls ? 'active' : ''}">${prototype_.player.seeThroughWalls ? 'ON' : 'OFF'}</span></span>
      <span class="status-item tooltip" title="Current crosshair type"><i class="fas fa-crosshairs"></i> Crosshair: <span class="status-value">${prototype_.player.crosshairType}</span></span>
      <span class="status-item tooltip" title="Current FOV setting"><i class="fas fa-camera"></i> FOV: <span class="status-value">${prototype_.player.fov}°</span></span>
    `;
    const wallhackToggle = statusBar.querySelector('#wallhack-toggle');
    if (wallhackToggle) {
      wallhackToggle.onclick = () => {
        prototype_.player.seeThroughWalls = !prototype_.player.seeThroughWalls;
        showNotification(`Wallhacks ${prototype_.player.seeThroughWalls ? 'enabled' : 'disabled'}`);        applyChamsSettings();
        updateCategoryUI('Settings');
      };
    }
  }

  // UI styles
  if (!document.getElementById('emuChamsStyle')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'emuChamsStyle';
    styleSheet.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Orbitron:wght@700;800&display=swap');
      @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

      :root {
        --accent-color: #00ccff;
        --accent-shadow: rgba(0, 204, 255, 0.4);
        --bg-gradient: linear-gradient(to bottom, rgba(0, 10, 20, 0.9), rgba(5, 15, 30, 0.9));
        --btn-bg: rgba(20, 30, 50, 0.7);
        --btn-hover-gradient: linear-gradient(to right, rgba(0, 204, 255, 0.3), rgba(255, 64, 129, 0.3));
        --text-color: #f0f6ff;
        --status-bg: rgba(0, 10, 20, 0.85);
        --border-color: #1a2538;
        --divider-color: #2e3a50;
        --crosshair-overlay: linear-gradient(to bottom, rgba(0, 10, 20, 0.05), rgba(0, 10, 20, 0.1));
      }

      [data-theme="obsidian-black"] { --accent-color: #00ccff; --accent-shadow: rgba(0, 204, 255, 0.4); --bg-gradient: linear-gradient(to bottom, rgba(0, 10, 20, 0.9), rgba(5, 5, 15, 30, 0.9)); --btn-bg: rgba(20, 30, 50, 0.7); --btn-hover-bg: rgba(0, 204, 255, 0.3); --text-color: #f0f6ff; --status-bg: rgba(0, 10, 20, 5, 30, 0.85); --border-color: #1a2538; --divider-color: #2e3a50; --crosshair-overlay: linear-gradient(to bottom, rgba(0, 10, 20, 0.05), rgba(0, 10, 20, 0.1)); }
      [data-theme="arctic-white"] { --accent-color: #0066cc; --accent-shadow: rgba(0, 0, 204, 0.3); --bg-gradient: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(235, 245, 255, 0.9)); --btn-bg: rgba(210, 220, 230, 0.4); --btn-hover-bg: rgba(0, 105, 204, 0.2); --text-color: #1a2530; --status-bg: rgba(255, 255, 255, 0.85); --border-color: #d5e0f0; --divider-color: #e5e0f5; --crosshair-overlay: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(235, 245, 255, 0.1)); }
      [data-theme="crimson-pulse"] { --accent-color: #ff3333; --accent-shadow: rgba(255, 51, 51, 0.3); --bg-gradient: linear-gradient(to bottom, rgba(45, 0, 0, 0.9), rgba(30, 5, 5, 5, 0.9)); --btn-bg: rgba(60, 15, 15, 0.7); --btn-hover-bg: rgba(255, 51, 51, 0.5); --text-color: #ffcc99; --status-bg: rgba(30, 5, 5, 0, 0.85); --border-color: #4a2525; --divider-color: #5a3f3f3f; --crosshair-bg: linear-gradient(to bottom, rgba(45, 0, 0, 0.1), rgba(30, 5, 5, 0.1)); }
      [data-theme="toxic-green"] { --accent-color: #00ff33; --accent-shadow: rgba(0, 255, 51, 0.3); --bg-gradient: linear-gradient(to bottom, rgba(0, 40, 0, 0.9), rgba(55, 25, 5, 0.9)); --btn-bg: rgba(20, 60, 20, 0.7); --btn-hover-bg: rgba(0, 255, 51, 0.2); --text-color: #ccff99; --status-bg: rgba(5, 5, 25, 5, 0.85); --border-color: #2f4a2f; --divider-color: #3f5a3f; --crosshair-bg: linear-gradient(to bottom, rgba(5, 40, 0, 0.05), rgba(5, 5, 25, 5, 0.05)); }
      [data-theme="sapphire-blue"] { --accent-color: #3399ff; --accent-shadow: rgba(51, 153, 255, 0.3); --bg-gradient: linear-gradient(to bottom, rgba(0, 20, 50, 0.9), rgba(5, 5, 15, 40, 0.9)); --btn-bg: rgba(20, 50, 80, 0.3); --btn-hover-bg: rgba(51, 153, 255, 0.2); --text-color: #c3c3e6ff; --status-bg: rgba(5, 5, 15, 40, 0.85); --border-color: #2f3f5a; --divider-color: #3f4f6a; --crosshair-bg: linear-gradient(to bottom, rgba(0, 20, 50, 0.05), rgba(5, 5, 15, 40, 0.05)); }
      [data-theme="synthwave-purple"] { --accent-color: #cc66cc; --accent-shadow: rgba(204, 102, 204, 0.3); --bg-gradient: linear-gradient(to bottom, rgba(40, 0, 50, 0.9), rgba(25, 5, 5, 40, 0.9)); --btn-bg: rgba(60, 20, 70, 0.3); --btn-hover-bg: rgba(204, 102, 204, 0.2); --text-color: #e6ccff; --status-bg: rgba(25, 5, 5, 40, 0.85); --border-color: #4a2f5a; --divider-color: #5a3f6a; --crosshair-bg: linear-gradient(to bottom, rgba(40, 0, 50, 0.05), rgba(25, 5, 5, 40, 0.05)); }
      [data-theme="dark-neon"] { --accent-color: #00e6ff; --accent-shadow: rgba(0, 230, 255, 0.3); --bg-gradient: linear-gradient(to bottom, rgba(0, 10, 20, 0.9), rgba(5, 5, 15, 30, 0.9)); --btn-bg: rgba(20, 30, 50, 0.7); --btn-hover-bg: rgba(0, 230, 255, 0.2); --text-color: #f0f6ff; --status-bg: rgba(0, 10, 20, 5, 30, 0.85); --border-color: #1a2538; --divider-color: #2e3a50; --crosshair-bg: linear-gradient(to bottom, rgba(0, 10, 20, 0.05), rgba(0, 10, 20, 0.1)); }
      [data-theme="light-cyber"] { --accent-color: #0066cc; --accent-shadow: rgba(0, 102, 204, 0.3); --bg-gradient: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(235, 245, 255, 0.9)); --btn-bg: rgba(210, 220, 230, 0.4); --btn-hover-bg: rgba(0, 102, 204, 0.2); --text-color: #1a2530; --status-bg: rgba(255, 255, 255, 0.85); --border-color: #d5e0f0; --divider-color: #e5e0f5; --crosshair-bg: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(235, 245, 255, 0.1)); }
      [data-theme="matrix-green"] { --accent-color: #00ff33; --accent-shadow: rgba(0, 255, 51, 0.3); --bg-gradient: linear-gradient(to bottom, rgba(0, 40, 0, 0.9), rgba(5, 5, 25, 5, 0.9)); --btn-bg: rgba(20, 60, 20, 0.7); --btn-hover-bg: rgba(0, 255, 51, 0.2); --text-color: #ccff99; --status-bg: rgba(5, 5, 25, 5, 0.85); --border-color: #2f4a2f; --divider-color: #3f5a3f; --crosshair-bg: linear-gradient(to bottom, rgba(0, 40, 0, 0.05), rgba(5, 5, 25, 5, 0.05)); }
      [data-theme="retro-vaporwave"] { --accent-color: #ff66cc; --accent-shadow: rgba(255, 102, 204, 0.3); --bg-gradient: linear-gradient(to bottom, rgba(255, 102, 204, 0.5), rgba(90, 0, 150, 0.5)); --btn-bg: rgba(255, 102, 204, 0.4); --btn-hover-bg: rgba(255, 102, 204, 0.6); --text-color: #f0f6ff; --status-bg: rgba(90, 0, 150, 0.7); --border-color: #9000cc; --divider-color: #c300ff; --crosshair-bg: linear-gradient(to bottom, rgba(255, 102, 204, 0.1), rgba(90, 0, 150, 0.1)); }

      #menu {
        position: absolute;
        width: 400px;
        background: var(--bg-gradient);
        backdrop-filter: blur(12px);
        border: 1px solid var(--accent-color);
        border-radius: 5px;
        box-shadow: 0 4px 25px var(--accent-shadow), inset 0 0 5px rgba(255, 255, 255, 0.1);
        z-index: 999999;
        font-family: 'Inter', sans-serif;
        color: var(--text-color);
        opacity: ${prototype_.player.menuOpacity};
        transition: opacity 0.3s ease, transform 0.3s ease, height 0.3s ease;
        left: ${prototype_.player.menuPosition.left};
        top: ${prototype_.player.menuPosition.top};
      }

      #menu.hidden {
        opacity: 0;
        transform: scale(0.95);
        pointer-events: none;
      }

      #menu.minimized {
        height: 32px;
        overflow: hidden;
      }

      #menu.transitioning {
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      #menu-header {
        padding: 5px 8px;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--border-color);
        cursor: move;
      }

      #menu-logo {
        width: 18px;
        height: 18px;
        margin-right: 6px;
        background: conic-gradient(from 45deg, transparent 0deg 90deg, var(--accent-color) 90deg 180deg, transparent 180deg 270deg, var(--accent-color) 270deg 360deg);
        clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
        transform: rotate(45deg);
      }

      #menu-badge {
        font-size: 8px;
        padding: 2px 6px;
        background: linear-gradient(45deg, var(--accent-color), #ff4081);
        color: var(--btn-bg);
        border-radius: 3px;
        margin-left: 6px;
        text-transform: uppercase;
        font-weight: 800;
        font-family: 'Orbitron', sans-serif;
      }

      #menu-title {
        font-size: 13px;
        font-weight: 800;
        font-family: 'Orbitron', sans-serif;
        background: linear-gradient(45deg, var(--accent-color), #ff4081);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 3px var(--accent-shadow);
        margin: 0;
        flex-grow: 1;
      }

      #menu-controls button {
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 11px;
        padding: 3px;
        cursor: pointer;
        transition: color 0.2s, transform 0.2s;
        margin-left: 3px;
      }

      #menu-controls button:hover {
        color: var(--accent-color);
        transform: scale(1.1);
      }

      #menu-tabs {
        display: flex;
        background: var(--status-bg);
        border-bottom: 1px solid var(--border-color);
      }

      #menu-tabs button {
        background: transparent;
        border: none;
        color: var(--text-color);
        padding: 5px 8px;
        cursor: pointer;
        font-size: 10px;
        font-weight: 800;
        font-family: 'Orbitron', sans-serif;
        transition: all 0.2s;
        flex: 1;
        text-align: center;
        text-transform: uppercase;
      }

      #menu-tabs button:hover {
        background: var(--btn-hover-bg);
      }

      #menu-tabs button.active {
        color: var(--accent-color);
        background: var(--btn-bg);
        border-bottom: 2px solid var(--accent-color);
      }

      #menu-body {
        padding: 8px;
        max-height: 380px;
        overflow-y: auto;
        background: transparent;
      }

      #menu-body::-webkit-scrollbar {
        width: 6px;
      }

      #menu-body::-webkit-scrollbar-track {
        background: var(--btn-bg);
        border-radius: 3px;
      }

      #menu-body::-webkit-scrollbar-thumb {
        background: var(--accent-color);
        border-radius: 3px;
      }

      .tab-content {
        display: none;
        animation: fadeIn 0.3s ease;
      }

      .tab-content.active {
        display: block;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .btn-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 5px;
        margin: 5px 0;
      }

      .btn-grid.settings {
        grid-template-columns: repeat(3, 1fr);
      }

      .cheat-btn {
        position: relative;
        background: var(--btn-bg);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        padding: 4px;
        border-radius: 4px;
        font-size: 8px;
        font-weight: 800;
        font-family: 'Orbitron', sans-serif;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        text-transform: uppercase;
        overflow: hidden;
      }

      .cheat-btn:hover {
        background: var(--btn-hover-bg);
        border-color: var(--accent-color);
        box-shadow: 0 0 5px var(--accent-shadow);
        transform: scale(1.02);
      }

      .cheat-btn:hover::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
        transform: translate(-50%, -50%) scale(0);
        animation: ripple 0.5s ease-out;
      }

      @keyframes ripple {
        to { transform: translate(-50%, -50%) scale(2); opacity: 0; }
      }

      .cheat-btn.active {
        background: var(--accent-color);
        color: var(--btn-bg);
        border-color: var(--accent-color);
      }

      .cheat-btn:active {
        transform: scale(0.98);
      }

      #status-bar {
        padding: 4px 8px;
        background: var(--status-bg);
        border-top: 1px solid var(--border-color);
        font-size: 8px;
        color: var(--text-color);
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        font-family: 'Inter', sans-serif;
      }

      .status-item {
        background: var(--btn-bg);
        padding: 2px 6px;
        border-radius: 10px;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
        display: flex;
        align-items: center;
        gap: 3px;
      }

      .status-item:hover {
        background: var(--btn-hover-bg);
        color: var(--accent-color);
      }

      .status-value, .active {
        color: var(--accent-color);
        font-weight: 600;
      }

      #mod-status {
        position: fixed;
        top: 10px;
        right: 10px;
        background: var(--bg-gradient);
        color: var(--text-color);
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid var(--accent-color);
        font-family: 'Inter', sans-serif;
        font-size: 9px;
        z-index: 999997;
        box-shadow: 0 0 5px var(--accent-shadow);
        backdrop-filter: blur(10px);
        animation: pulseGlow 0.5s infinite alternate;
        display: none;
      }

      @keyframes pulseGlow {
        to { box-shadow: 0 0 8px var(--accent-shadow); }
      }

      #branding {
        position: fixed;
        top: 10px;
        left: 10px;
        display: flex;
        align-items: center;
        background: var(--bg-gradient);
        padding: 6px 12px;
        border-radius: 4px;
        border: 2px solid var(--border-color);
        box-shadow: 0 0 5px var(--accent-shadow), inset 0 0 3px rgba(255,255,255,0.1);
        color: var(--text-color);
        font-family: 'Inter', sans-serif;
        font-size: 11px;
        z-index: 999997;
        backdrop-filter: blur(10px);
      }

      #branding-icon {
        width: 20px;
        height: 20px;
        margin-right: 6px;
        background: conic-gradient(from 0deg, transparent 0deg 90deg, var(--accent-color) 90deg 180deg, transparent 180deg 270deg, var(--accent-color) 270deg 360deg);
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        transform: rotate(0deg);
        animation: spin 4s linear infinite;
      }

      #branding-text {
        background: linear-gradient(45deg, var(--accent-color), #ff4081);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 3px var(--accent-shadow);
      }

      #branding-version {
        font-size: 8px;
        color: var(--text-color);
        opacity: 0.6;
        margin-left: 4px;
      }

      .tooltip::after {
        content: attr(title);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--btn-bg);
        color: var(--text-color);
        padding: 3px 6px;
        border-radius: 4px;
        font-size: 8px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s;
        z-index: 10;
        border: 1px solid var(--border-color);
      }

      .tooltip:hover::after {
        opacity: 1;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      hr {
        border: 0;
        border-top: 1px solid var(--divider-color);
        margin: 5px 0;
      }

      label {
        display: block;
        font-size: 10px;
        font-weight: 500;
        margin: 5px 0 2px;
        color: var(--text-color);
      }

      input[type="color"], input[type="range"] {
        width: 100%;
        height: 20px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--btn-bg);
        cursor: pointer;
      }

      input[type="range"] {
        -webkit-appearance: none;
        height: 6px;
      }

      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        background: var(--accent-color);
        border-radius: 50%;
        border: 1px solid var(--border-color);
        cursor: pointer;
      }

      .description {
        font-size: 9px;
        color: var(--text-color);
        opacity: 0.6;
        margin-bottom: 5px;
      }
    `;
    document.head.appendChild(styleSheet);
  }

  // Create UI
  let menu = document.getElementById('menu');
  if (!menu) {
    // Branding
    const branding = document.createElement('div');
    branding.id = 'branding';
    branding.innerHTML = `
      <span id="branding-icon"></span>
      <span id="branding-text">Emulation's Premium Client</span>
      <span id="branding-version">v${clientVersion}</span>
    `;
    document.body.appendChild(branding);

    // Mod status
    const modStatus = document.createElement('div');
    modStatus.id = 'mod-status';
    modStatus.textContent = "Emulation's Premium: Active";
    modStatus.style.display = prototype_.player.modStatus ? 'block' : 'none';
    document.body.appendChild(modStatus);

    // Menu
    menu = document.createElement('div');
    menu.id = 'menu';
    menu.dataset.theme = prototype_.player.theme;
    menu.classList.toggle('hidden', !menuVisible);
    menu.classList.toggle('minimized', prototype_.player.menuMinimized);

    const header = document.createElement('div');
    header.id = 'menu-header';
    const logo = document.createElement('div');
    logo.id = 'menu-logo';
    const title = document.createElement('h1');
    title.id = 'menu-title';
    title.textContent = "Emulation's Premium Client";
    const badge = document.createElement('span');
    badge.id = 'menu-badge';
    badge.textContent = 'PREMIUM';
    const controls = document.createElement('div');
    controls.id = 'menu-controls';
    const minimizeBtn = document.createElement('button');
    minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
    minimizeBtn.setAttribute('aria-label', 'Minimize menu');
    minimizeBtn.onclick = () => {
      prototype_.player.menuMinimized = !prototype_.player.menuMinimized;
      menu.classList.toggle('minimized', prototype_.player.menuMinimized);
      minimizeBtn.innerHTML = `<i class="fas fa-${prototype_.player.menuMinimized ? 'plus' : 'minus'}"></i>`;
      saveSettings();
      showNotification(`Menu ${prototype_.player.menuMinimized ? 'minimized' : 'restored'}`);
    };
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.onclick = () => {
      menuVisible = false;
      menu.classList.add('hidden');
      saveSettings();
      showNotification('Menu closed');
    };
    controls.appendChild(minimizeBtn);
    controls.appendChild(closeBtn);
    header.appendChild(logo);
    header.appendChild(title);
    header.appendChild(badge);
    header.appendChild(controls);

    const content = document.createElement('div');
    content.id = 'menu-content';
    const tabs = document.createElement('div');
    tabs.id = 'menu-tabs';
    const body = document.createElement('div');
    body.id = 'menu-body';
    const statusBar = document.createElement('div');
    statusBar.id = 'status-bar';
    content.appendChild(tabs);
    content.appendChild(body);
    content.appendChild(statusBar);

    menu.appendChild(header);
    menu.appendChild(content);
    document.body.appendChild(menu);

    // Draggable menu
    let isDragging = false;
    let currentX, currentY;
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      currentX = e.clientX - parseFloat(menu.style.left || window.innerWidth / 2);
      currentY = e.clientY - parseFloat(menu.style.top || window.innerHeight / 2);
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      let newX = e.clientX - currentX;
      let newY = e.clientY - currentY;
      newX = Math.max(0, Math.min(newX, window.innerWidth - menu.offsetWidth));
      newY = Math.max(0, Math.min(newY, window.innerHeight - menu.offsetHeight));
      menu.style.left = `${newX}px`;
      menu.style.top = `${newY}px`;
      prototype_.player.menuPosition = { left: `${newX}px`, top: `${newY}px` };
      saveSettings();
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
      document.body.style.userSelect = '';
    });

    initCrosshairCanvas();
    window.addEventListener('resize', resizeCrosshair);

    const categories = [
      { name: 'Advantage', description: 'Tactical enhancements for strategic play', meshes: [
        { name: 'Normal', desc: 'Default mesh rendering' },
        { name: 'Glow Neon', desc: 'Bright neon glow effect' },
        { name: 'Red Danger', desc: 'Red highlight for threats' },
        { name: 'Hacker Matrix', desc: 'Green wireframe style' },
        { name: 'Chrome Metal', desc: 'Shiny metallic finish' },
      ]},
      { name: 'Visuals', description: 'Dynamic visual effects for immersion', meshes: [
        { name: 'Rainbow', desc: 'Cycling rainbow colors' },
        { name: 'Aurora Borealis', desc: 'Northern lights effect' },
        { name: 'Neon Pulse', desc: 'Pulsating pink glow' },
        { name: 'Solar Flare', desc: 'Bright fiery pulses' },
      ]},
      { name: 'Crosshairs', description: 'Customizable crosshair styles', crosshairs: [
        { name: 'None', desc: 'No crosshair' },
        { name: 'Dot', desc: 'Small centered dot' },
        { name: 'Cross', desc: 'Classic cross shape' },
        { name: 'Plus', desc: 'Thick plus shape' },
        { name: 'Dynamic Dot', desc: 'Pulsing dot effect' },
      ]},
      { name: 'Settings', description: 'Configure client options', meshes: [] }
    ];

    let currentCategory = 'Advantage';

    function updateCategoryButtons() {
      tabs.innerHTML = '';
      categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat.name;
        btn.classList.toggle('active', cat.name === currentCategory);
        btn.setAttribute('aria-label', `Select ${cat.name} tab`);
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
      const info = document.createElement('div');
      info.className = 'description';
      info.textContent = categories.find(c => c.name === currentCategory).description;
      tabContent.appendChild(info);

      if (currentCategory === 'Advantage' || currentCategory === 'Visuals') {
        const btnGrid = document.createElement('div');
        btnGrid.className = 'btn-grid';
        const meshes = categories.find(c => c.name === currentCategory).meshes;
        meshes.forEach(mesh => {
          const btn = document.createElement('button');
          btn.className = `cheat-btn ${prototype_.player.meshType === mesh.name ? 'active' : ''} tooltip`;
          btn.title = mesh.desc;
          btn.innerHTML = `<i class="fas fa-cube"></i> ${mesh.name}`;
          btn.onclick = () => {
            prototype_.player.meshType = mesh.name;
            btnGrid.querySelectorAll('.cheat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showNotification(`Mesh set to ${mesh.name}`);
            applyChamsSettings();
            saveSettings();
          };
          btnGrid.appendChild(btn);
        });
        tabContent.appendChild(btnGrid);
      } else if (currentCategory === 'Crosshairs') {
        const btnGrid = document.createElement('div');
        btnGrid.className = 'btn-grid';
        const crosshairs = categories.find(c => c.name === currentCategory).crosshairs;
        crosshairs.forEach(ch => {
          const btn = document.createElement('button');
          btn.className = `cheat-btn ${prototype_.player.crosshairType === ch.name ? 'active' : ''} tooltip`;
          btn.title = ch.desc;
          btn.innerHTML = `<i class="fas fa-crosshairs"></i> ${ch.name}`;
          btn.onclick = () => {
            prototype_.player.crosshairType = ch.name;
            btnGrid.querySelectorAll('.cheat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showNotification(`Crosshair set to ${ch.name}`);
            applyChamsSettings();
            saveSettings();
          };
          btnGrid.appendChild(btn);
        });
        tabContent.appendChild(btnGrid);

        const sizeLabel = document.createElement('label');
        sizeLabel.textContent = 'Crosshair Size';
        const sizeGrid = document.createElement('div');
        sizeGrid.className = 'btn-grid';
        [10, 20, 30, 40, 50].forEach(size => {
          const btn = document.createElement('button');
          btn.className = `cheat-btn ${prototype_.player.crosshairSize === size ? 'active' : ''} tooltip`;
          btn.title = `Set size to ${size}px`;
          btn.textContent = `${size}px`;
          btn.onclick = () => {
            prototype_.player.crosshairSize = size;
            sizeGrid.querySelectorAll('.cheat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showNotification(`Crosshair Size set to ${size}px`);
            applyChamsSettings();
            saveSettings();
          };
          sizeGrid.appendChild(btn);
        });
        tabContent.appendChild(sizeLabel);
        tabContent.appendChild(sizeGrid);

        const gapLabel = document.createElement('label');
        gapLabel.textContent = 'Crosshair Gap';
        const gapGrid = document.createElement('div');
        gapGrid.className = 'btn-grid';
        [0, 5, 10, 15, 20].forEach(gap => {
          const btn = document.createElement('button');
          btn.className = `cheat-btn ${prototype_.player.crosshairGap === gap ? 'active' : ''} tooltip`;
          btn.title = `Set gap to ${gap}px`;
          btn.textContent = `${gap}px`;
          btn.onclick = () => {
            prototype_.player.crosshairGap = gap;
            gapGrid.querySelectorAll('.cheat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showNotification(`Crosshair Gap set to ${gap}px`);
            applyChamsSettings();
            saveSettings();
          };
          gapGrid.appendChild(btn);
        });
        tabContent.appendChild(gapLabel);
        tabContent.appendChild(gapGrid);

        const colorLabel = document.createElement('label');
        colorLabel.textContent = 'Crosshair Color';
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = prototype_.player.crosshairColor;
        colorPicker.onchange = () => {
          prototype_.player.crosshairColor = colorPicker.value;
          showNotification(`Crosshair color set to ${colorPicker.value}`);
          applyChamsSettings();
          saveSettings();
        };
        tabContent.appendChild(colorLabel);
        tabContent.appendChild(colorPicker);
      } else if (currentCategory === 'Settings') {
        const btnGrid = document.createElement('div');
        btnGrid.className = 'btn-grid settings';

        // Wallhacks
        const wallhackBtn = document.createElement('button');
        wallhackBtn.className = `cheat-btn ${prototype_.player.seeThroughWalls ? 'active' : ''} tooltip`;
        wallhackBtn.title = 'Toggle visibility through walls';
        wallhackBtn.innerHTML = `<i class="fas fa-eye"></i> Wallhacks: ${prototype_.player.seeThroughWalls ? 'ON' : 'OFF'}`;
        wallhackBtn.onclick = () => {
          prototype_.player.seeThroughWalls = !prototype_.player.seeThroughWalls;
          wallhackBtn.innerHTML = `<i class="fas fa-eye"></i> Wallhacks: ${prototype_.player.seeThroughWalls ? 'ON' : 'OFF'}`;
          wallhackBtn.classList.toggle('active');
          showNotification(`Wallhacks ${prototype_.player.seeThroughWalls ? 'enabled' : 'disabled'}`);
          applyChamsSettings();
          saveSettings();
        };
        btnGrid.appendChild(wallhackBtn);

        // Wireframe
        const wireframeBtn = document.createElement('button');
        wireframeBtn.className = `cheat-btn ${prototype_.player.wireframe ? 'active' : ''} tooltip`;
        wireframeBtn.title = 'Enable wireframe rendering';
        wireframeBtn.innerHTML = `<i class="fas fa-draw-polygon"></i> Wireframe: ${prototype_.player.wireframe ? 'ON' : 'OFF'}`;
        wireframeBtn.onclick = () => {
          prototype_.player.wireframe = !prototype_.player.wireframe;
          wireframeBtn.innerHTML = `<i class="fas fa-draw-polygon"></i> Wireframe: ${prototype_.player.wireframe ? 'ON' : 'OFF'}`;
          wireframeBtn.classList.toggle('active');
          showNotification(`Wireframe ${prototype_.player.wireframe ? 'enabled' : 'disabled'}`);
          applyChamsSettings();
          saveSettings();
        };
        btnGrid.appendChild(wallhackBtn);

        // No Fog
        const noFogBtn = document.createElement('button');
        noFogBtn.className = `cheat-btn ${prototype_.player.noFog ? 'active' : ''} tooltip`;
        noFogBtn.title = 'Disable environmental fog';
        noFogBtn.innerHTML = `<i class="fas fa-cloud"></i> No Fog: ${prototype_.player.noFog ? 'ON' : 'OFF'}`;
        noFogBtn.onclick = () => {
          prototype_.player.noFog = !prototype_.player.noFog;
          noFogBtn.innerHTML = `<i class="fas fa-cloud"></i> No Fog: ${prototype_.player.noFog ? 'ON' : 'OFF'}`;
          noFogBtn.classList.toggle('active');
          showNotification(`No Fog ${prototype_.player.noFog ? 'enabled' : 'disabled'}`);
          applyChamsSettings();
          saveSettings();
        };
        btnGrid.appendChild(noFogBtn);

        // Notifications
        const notifyBtn = document.createElement('button');
        notifyBtn.className = `cheat-btn ${prototype_.player.notifications ? 'active' : ''} tooltip`;
        notifyBtn.title = 'Toggle action notifications';
        notifyBtn.innerHTML = `<i class="fas fa-bell"></i> Notifications: ${prototype_.player.notifications ? 'ON' : 'OFF'}`;
        notifyBtn.onclick = () => {
          prototype_.player.notifications = !prototype_.player.notifications;
          notifyBtn.innerHTML = `<i class="fas fa-bell"></i> Notifications: ${prototype_.player.notifications ? 'ON' : 'OFF'}`;
          notifyBtn.classList.toggle('active');
          showNotification(`Notifications ${prototype_.player.notifications ? 'enabled' : 'disabled'}`);
          saveSettings();
        };
        btnGrid.appendChild(notifyBtn);

        // Mod Status
        const modStatusBtn = document.createElement('button');
        modStatusBtn.className = `cheat-btn ${prototype_.player.modStatus ? 'active' : ''} tooltip`;
        modStatusBtn.title = 'Toggle mod status display';
        modStatusBtn.innerHTML = `<i class="fas fa-shield-alt"></i> Mod Status: ${prototype_.player.modStatus ? 'ON' : 'OFF'}`;
        modStatusBtn.onclick = () => {
          prototype_.player.modStatus = !prototype_.player.modStatus;
          modStatusBtn.innerHTML = `<i class="fas fa-shield-alt"></i> Mod Status: ${prototype_.player.modStatus ? 'ON' : 'OFF'}`;
          modStatusBtn.classList.toggle('active');
          document.getElementById('mod-status').style.display = prototype_.player.modStatus ? 'block' : 'none';
          showNotification(`Mod Status ${prototype_.player.modStatus ? 'enabled' : 'disabled'}`);
          saveSettings();
        };
        btnGrid.appendChild(modStatusBtn);
        tabContent.appendChild(btnGrid);
        tabContent.appendChild(document.createElement('hr'));

        // Opacity
        const opacityLabel = document.createElement('label');
        opacityLabel.textContent = 'Mesh Opacity';
        const opacityGrid = document.createElement('div');
        opacityGrid.className = 'btn-grid';
        [0.1, 0.3, 0.5, 0.7, 0.9, 1.0].forEach(op => {
          const btn = document.createElement('button');
          btn.className = `cheat-btn ${prototype_.player.opacity === op ? 'active' : ''} tooltip`;
          btn.title = `Set opacity to ${op}`;
          btn.textContent = op.toFixed(1);
          btn.onclick = () => {
            prototype_.player.opacity = op;
            opacityGrid.querySelectorAll('.cheat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showNotification(`Opacity set to ${op}`);
            applyChamsSettings();
            saveSettings();
          };
          opacityGrid.appendChild(btn);
        });
        tabContent.appendChild(opacityLabel);
        tabContent.appendChild(opacityGrid);

        // Animation Speed
        const speedLabel = document.createElement('label');
        speedLabel.textContent = 'Animation Speed';
        const speedGrid = document.createElement('div');
        speedGrid.className = 'btn-grid';
        [0.5, 1.0, 1.5, 2.0].forEach(speed => {
          const btn = document.createElement('button');
          btn.className = `cheat-btn ${prototype_.player.animationSpeed === speed ? 'active' : ''} tooltip`;
          btn.title = `Set speed to ${speed}x`;
          btn.textContent = `${speed}x`;
          btn.onclick = () => {
            prototype_.player.animationSpeed = speed;
            speedGrid.querySelectorAll('.cheat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showNotification(`Animation speed set to ${speed}x`);
            applyChamsSettings();
            saveSettings();
          };
          speedGrid.appendChild(btn);
        });
        tabContent.appendChild(speedLabel);
        tabContent.appendChild(speedGrid);

        // Base Hue
        const hueLabel = document.createElement('label');
        hueLabel.textContent = 'Base Hue';
        const hueGrid = document.createElement('div');
        hueGrid.className = 'btn-grid';
        [0, 60, 120, 180, 240, 300].forEach(hue => {
          const btn = document.createElement('button');
          btn.className = `cheat-btn ${prototype_.player.baseHue === hue ? 'active' : ''} tooltip`;
          btn.title = `Set hue to ${hue}°`;
          btn.textContent = `${hue}°`;
          btn.onclick = () => {
            prototype_.player.baseHue = hue;
            hueGrid.querySelectorAll('.cheat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showNotification(`Base Hue set to ${hue}°`);
            applyChamsSettings();
            saveSettings();
          };
          hueGrid.appendChild(btn);
        });
        tabContent.appendChild(hueLabel);
        tabContent.appendChild(hueGrid);

        // Emissive Intensity
        const emissiveLabel = document.createElement('label');
        emissiveLabel.textContent = 'Emissive Intensity';
        const emissiveGrid = document.createElement('div');
        emissiveGrid.className = 'btn-grid';
        [0.0, 0.2, 0.4, 0.6, 0.8, 1.0].forEach(intensity => {
          const btn = document.createElement('button');
          btn.className = `cheat-btn ${prototype_.player.emissiveIntensity === intensity ? 'active' : ''} tooltip`;
          btn.title = `Set intensity to ${intensity}`;
          btn.textContent = intensity.toFixed(1);
          btn.onclick = () => {
            prototype_.player.emissiveIntensity = intensity;
            emissiveGrid.querySelectorAll('.cheat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showNotification(`Emissive Intensity set to ${intensity}`);
            applyChamsSettings();
            saveSettings();
          };
          emissiveGrid.appendChild(btn);
        });
        tabContent.appendChild(emissiveLabel);
        tabContent.appendChild(emissiveGrid);

        // FOV
        const fovLabel = document.createElement('label');
        fovLabel.textContent = `Field of View: ${prototype_.player.fov}°`;
        const fovSlider = document.createElement('input');
        fovSlider.type = 'range';
        fovSlider.min = 70;
        fovSlider.max = 120;
        fovSlider.step = 1;
        fovSlider.value = prototype_.player.fov;
        fovSlider.oninput = () => {
          prototype_.player.fov = parseInt(fovSlider.value);
          fovLabel.textContent = `Field of View: ${prototype_.player.fov}°`;
          showNotification(`FOV set to ${prototype_.player.fov}°`);
          applyChamsSettings();
          saveSettings();
        };
        tabContent.appendChild(fovLabel);
        tabContent.appendChild(fovSlider);
        tabContent.appendChild(document.createElement('hr'));

        // Menu Opacity
        const menuOpacityLabel = document.createElement('label');
        menuOpacityLabel.textContent = 'Menu Opacity';
        const menuOpacityGrid = document.createElement('div');
        menuOpacityGrid.className = 'btn-grid';
        [0.5, 0.7, 0.9, 1.0].forEach(op => {
          const btn = document.createElement('button');
          btn.className = `cheat-btn ${prototype_.player.menuOpacity === op ? 'active' : ''} tooltip`;
          btn.title = `Set menu opacity to ${op}`;
          btn.textContent = op.toFixed(1);
          btn.onclick = () => {
            prototype_.player.menuOpacity = op;
            menu.style.opacity = op;
            menuOpacityGrid.querySelectorAll('.cheat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showNotification(`Menu Opacity set to ${op}`);
            saveSettings();
          };
          menuOpacityGrid.appendChild(btn);
        });
        tabContent.appendChild(menuOpacityLabel);
        tabContent.appendChild(menuOpacityGrid);

        // Theme
        const themeLabel = document.createElement('label');
        themeLabel.textContent = 'Theme';
        const themeGrid = document.createElement('div');
        themeGrid.className = 'btn-grid';
        ['obsidian-black', 'arctic-white', 'crimson-pulse', 'toxic-green', 'sapphire-blue', 'synthwave-purple', 'dark-neon', 'light-cyber', 'matrix-green', 'retro-vaporwave'].forEach(theme => {
          const btn = document.createElement('button');
          btn.className = `cheat-btn ${prototype_.player.theme === theme ? 'active' : ''} tooltip`;
          btn.title = `Switch to ${theme.replace('-', ' ')} theme`;
          btn.textContent = theme.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
          btn.onclick = () => {
            menu.classList.add('transitioning');
            setTimeout(() => {
              prototype_.player.theme = theme;
              menu.dataset.theme = theme;
              saveSettings();
              themeGrid.querySelectorAll('.cheat-btn').forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              showNotification(`Theme set to ${theme}`);
              menu.classList.remove('transitioning');
              branding.dataset.theme = theme;
              modStatus.dataset.theme = theme;
              crosshairCanvas.dataset.theme = theme;
            }, 200);
          };
          themeGrid.appendChild(btn);
        });
        tabContent.appendChild(themeLabel);
        tabContent.appendChild(themeGrid);
        tabContent.appendChild(document.createElement('hr'));

        // Reset Settings
        const resetLabel = document.createElement('label');
        resetLabel.textContent = 'Reset Settings';
        const resetBtn = document.createElement('button');
        resetBtn.className = 'cheat-btn tooltip';
        resetBtn.title = 'Reset all settings to default';
        resetBtn.innerHTML = '<i class="fas fa-undo"></i> Reset All';
        resetBtn.onclick = () => {
          prototype_.player = {
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
            crosshairColor: '#00f0ff',
            notifications: true,
            modStatus: true,
            menuOpacity: 1.0,
            fov: 90,
            noFog: false,
            theme: 'obsidian-black',
            menuPosition: { left: '50%', top: '50%' },
            menuVisible: true,
            menuMinimized: false
          };
          menu.style.opacity = 1.0;
          menu.style.left = '50%';
          menu.style.top = '50%';
          menu.dataset.theme = 'obsidian-black';
          menuVisible = true;
          menu.classList.remove('hidden');
          menu.classList.remove('minimized');
          branding.dataset.theme = 'obsidian-black';
          modStatus.dataset.theme = 'obsidian-black';
          crosshairCanvas.dataset.theme = 'obsidian-black';
          saveSettings();
          showNotification('Settings reset to default');
          applyChamsSettings();
          updateCategoryUI();
        };
        tabContent.appendChild(resetLabel);
        tabContent.appendChild(resetBtn);
      }
      body.appendChild(tabContent);
      updateStatus();
    }

    updateCategoryButtons();
    updateCategoryUI();

    // Toggle menu with semicolon
    document.addEventListener('keydown', (e) => {
      if (e.key === ';') {
        menuVisible = !menuVisible;
        menu.classList.toggle('hidden', !menuVisible);
        saveSettings();
        showNotification(`Menu ${menuVisible ? 'opened' : 'closed'}`);
      }
    });
  }

  // Start animation loop
  applyChamsSettings();
  animate();
})();



