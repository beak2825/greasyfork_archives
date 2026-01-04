// ==UserScript==
// @name         KRUNKER.IO MODS v2.1 (Dogeware Enhanced)
// @namespace    https://github.com/Dogeware-Scripts
// @version      2.1.5
// @description  Advanced mod suite for Krunker.io with adaptive detection
// @author       Dogeware Team
// @match        *://krunker.io/*
// @match        *://browserfps.com/*
// @exclude      *://krunker.io/social*
// @exclude      *://krunker.io/editor*
// @icon         https://i.imgur.com/LdO1D1y.png
// @grant        unsafeWindow
// @require      https://unpkg.com/three@0.158.0/build/three.min.js
// @downloadURL https://update.greasyfork.org/scripts/528055/KRUNKERIO%20MODS%20v21%20%28Dogeware%20Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528055/KRUNKERIO%20MODS%20v21%20%28Dogeware%20Enhanced%29.meta.js
// ==/UserScript==

/* Uudet ominaisuudet ja parannetut toiminnallisuudet */
const THREE = unsafeWindow.THREE || window.THREE;
const DEBUG_MODE = false;

// Proxy-järjestelmä havaitsemiskykysuojaukseen
const securityProxy = {
  get: (target, prop) => {
    if(typeof target[prop] === 'function') {
      return new Proxy(target[prop], {
        apply: (target, thisArg, args) => {
          if(Math.random() < 0.7) return target.apply(thisArg, args);
          return null;
        }
      });
    }
    return target[prop];
  }
};

class SceneManager {
  constructor() {
    this.mainScene = null;
    this.sceneNames = ['MainScene', 'GameWorld', 'Main'];
    this.detectionInterval = setInterval(() => this.detectScene(), 1000);
  }

  detectScene() {
    this.sceneNames.forEach(name => {
      const scene = THREE.Scene?.children.find(
        child => child.name === name
      );
      if(scene) {
        this.mainScene = scene;
        clearInterval(this.detectionInterval);
      }
    });
  }
}

class PlayerManager {
  static findHeadBone(playerObj) {
    const queue = [...playerObj.children];
    while(queue.length > 0) {
      const child = queue.shift();
      if(child?.name?.toLowerCase().includes('head')) {
        return child;
      }
      queue.push(...(child?.children || []));
    }
    return null;
  }

  static getValidPlayers(scene) {
    return scene.children.filter(child => {
      try {
        return child?.children?.[0]?.type === 'Group';
      } catch(e) {
        return false;
      }
    });
  }
}

class AimbotSystem {
  constructor() {
    this.smoothing = 0.65;
    this.maxDistance = 500;
    this.aimOffset = new THREE.Vector3(0, 1.6, 0);
  }

  calculateAimPosition(target) {
    const headPos = new THREE.Vector3();
    const headBone = PlayerManager.findHeadBone(target);
    if(headBone) headBone.getWorldPosition(headPos);
    return headPos.add(this.aimOffset);
  }

  smoothAim(current, target, delta) {
    return current + (target - current) * this.smoothing * delta;
  }
}

const DogewareMod = {
  config: {
    visuals: {
      wireframe: false,
      espBox: true,
      glowEffect: true
    },
    combat: {
      aimbot: true,
      triggerbot: false,
      silentAim: false
    },
    misc: {
      fovChanger: 120,
      thirdPerson: false
    }
  },

  init() {
    this.sceneManager = new SceneManager();
    this.aimbot = new AimbotSystem();
    this.setupEventListeners();
    this.injectCustomUI();
    this.mainLoop();
  },

  mainLoop() {
    requestAnimationFrame(() => this.mainLoop());
    
    try {
      if(!this.sceneManager.mainScene) return;
      
      const players = PlayerManager.getValidPlayers(this.sceneManager.mainScene);
      const localPlayer = players.find(p => p?.isLocalPlayer);
      
      if(this.config.combat.aimbot) {
        const nearestEnemy = this.findNearestEnemy(localPlayer, players);
        if(nearestEnemy) this.handleAimbot(localPlayer, nearestEnemy);
      }
      
      this.applyVisualModifications(players);
    } catch(e) {
      DEBUG_MODE && console.error('Main loop error:', e);
    }
  },

  findNearestEnemy(localPlayer, players) {
    return players.reduce((closest, player) => {
      if(player === localPlayer) return closest;
      const dist = localPlayer.position.distanceTo(player.position);
      return dist < (closest?.distance || Infinity) ? {player, distance: dist} : closest;
    }, null)?.player;
  },

  handleAimbot(localPlayer, target) {
    const aimPos = this.aimbot.calculateAimPosition(target);
    const delta = 60 / 1000; // Approx delta time
    
    localPlayer.rotation.y = this.aimbot.smoothAim(
      localPlayer.rotation.y,
      Math.atan2(aimPos.x - localPlayer.position.x, 
                aimPos.z - localPlayer.position.z),
      delta
    );
    
    localPlayer.rotation.x = this.aimbot.smoothAim(
      localPlayer.rotation.x,
      -Math.atan2(aimPos.y - localPlayer.position.y,
                 Math.hypot(aimPos.x - localPlayer.position.x,
                           aimPos.z - localPlayer.position.z)),
      delta
    );
  },

  applyVisualModifications(players) {
    players.forEach(player => {
      if(player === this.localPlayer) return;
      
      player.traverse(child => {
        if(child.material) {
          child.material.wireframe = this.config.visuals.wireframe;
          if(this.config.visuals.glowEffect) {
            child.material.emissive.setHex(0xFF3300);
            child.material.needsUpdate = true;
          }
        }
      });
    });
  },

  setupEventListeners() {
    document.addEventListener('keydown', e => {
      if(e.key.toLowerCase() === 'insert') this.toggleMenu();
    });
  },

  toggleMenu() {
    const menu = document.getElementById('dw-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  },

  injectCustomUI() {
    const shadowHost = document.createElement('div');
    const shadowRoot = shadowHost.attachShadow({mode: 'closed'});
    
    shadowRoot.innerHTML = `
      <style>
        /* Päivitetty UI-tyyli */
        .dw-menu {
          position: fixed;
          top: 20px;
          left: 20px;
          background: rgba(0,0,0,0.9);
          color: #fff;
          padding: 15px;
          border-radius: 8px;
          font-family: Arial;
          z-index: 99999;
        }
        .dw-section { margin: 10px 0; }
        .dw-toggle { cursor: pointer; }
      </style>
      <div class="dw-menu" id="dw-menu">
        <h3>Dogeware Mods v2</h3>
        <div class="dw-section">
          <label class="dw-toggle">
            <input type="checkbox" id="aimbotToggle"> Aimbot
          </label>
        </div>
        <!-- Lisää UI-komponentteja tähän -->
      </div>
    `;
    
    document.body.appendChild(shadowHost);
  }
};

// Alustus
setTimeout(() => {
  if(typeof THREE !== 'undefined') {
    DogewareMod.init();
  } else {
    console.error('Three.js not loaded');
  }
}, 5000);

// Anti-debugger suojaus
const antiDebug = () => {
  function blockDebuggers() {
    setInterval(() => {
      if(typeof console !== 'undefined') {
        console.log = () => {};
        console.warn = () => {};
        debugger;
      }
    }, 1000);
  }
  try { blockDebuggers(); } catch(e) {}
};
window.onload = antiDebug;