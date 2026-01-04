// ==UserScript==
// @name         Bloxium Client HUD (0.29)
// @namespace    http://tampermonkey.net/
// @description  Alpha of #1 bloxd client ( hotbare + cps,ping,fps,timer,fps max,quality,keystroyes...) ( DONT COPY THIS CODE OR I CAN FILE A COMPLAINT
// @author       Bloxium Team
// @match        *://bloxd.io/*
// @match        https://staging.bloxd.io/
// @grant        none
// @version      0.29 ( Alpha )
// @license      CC BY-NC-ND 4.0
// @icon         https://imgur.com/a/DQtyuIL
// @downloadURL https://update.greasyfork.org/scripts/540745/Bloxium%20Client%20HUD%20%28029%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540745/Bloxium%20Client%20HUD%20%28029%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.top !== window.self || window.bloxiumInitialized) return;
    window.bloxiumInitialized = true;

    // === Variables globales ===
    const elements = {};
    let lastUpdate = performance.now();
    // === Anti pub ===
    setInterval(() => {
        const badIds = ['gameAdContainer', 'adsbox', 'adOverlay', 'loadAdContainer'];
        const badClasses = ['adsbygoogle'];
        document.querySelectorAll('iframe, div').forEach(el => {
            const id = (el.id || '').toLowerCase();
            const cls = (el.className || '').toLowerCase();
            if (badIds.includes(id) || badClasses.some(c => cls.includes(c))) el.remove();
        });
    }, 2000);

   // === Styles CSS ===
const style = document.createElement('style');
style.innerHTML = `
    .bloxium-element {
        position: fixed;
        background: rgba(0,0,0,0.6);
        color: white;
        padding: 6px 10px;
        font-family: monospace;
        font-size: 14px;
        border-radius: 8px;
        z-index: 9998;
        cursor: move;
        user-select: none;
    }
    .bloxium-intro {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex; align-items: center; justify-content: center;
        font-family: 'Arial Black', sans-serif;
        font-size: 42px; color: white; z-index: 9999;
        text-shadow: 2px 2px 4px black;
    }
    .bloxium-crosshair {
        position: fixed; left: 50%; top: 50%;
        transform: translate(-50%, -50%);
        z-index: 9997;
        pointer-events: none;
    }
    .crosshair-default::before, .crosshair-default::after,
    .crosshair-circle::before, .crosshair-dot::before {
        content: ""; position: absolute; background: white;
    }
    .crosshair-default::before {
        width: 2px; height: 30px;
        left: 50%; top: calc(50% - 15px);
        transform: translateX(-50%);
    }
    .crosshair-default::after {
        height: 2px; width: 30px;
        top: 50%; left: calc(50% - 15px);
        transform: translateY(-50%);
    }
    .crosshair-circle::before {
        border-radius: 50%; width: 20px; height: 20px;
        top: 50%; left: 50%; transform: translate(-50%, -50%);
    }
    .crosshair-dot::before {
        border-radius: 50%; width: 6px; height: 6px;
        top: 50%; left: 50%; transform: translate(-50%, -50%);
    }
    .bloxium-hidden { display: none !important; }
    .bloxium-menu {
        position: fixed; right: 20px; top: 20px;
        background: #111; border: 2px solid #333;
        padding: 20px; border-radius: 10px;
        color: white; font-family: sans-serif;
        z-index: 10000; display: none;
    }
    .bloxium-menu label { display: block; margin: 5px 0; cursor: pointer; }
    .bloxium-night *:not(.bloxium-menu):not(.bloxium-element):not(.bloxium-crosshair):not(.bloxium-intro) {
        filter: brightness(0.85) contrast(1.05) !important;
    }
    /* Hotbar globale */
.item {
  border-radius: 0px !important;
  border: 2px solid #000000 !important;
  background-color: rgba(0,0,0,0.7) !important; /* semi-transparent */
  box-shadow: inset -2px -2px 10px 0px rgba(128, 128, 128, 0.6),
              inset 0.3px 0.3px 5px 0px rgba(255, 255, 255, 0.2) !important;
  outline: none !important;
  transition: background-color 0.3s, border-color 0.3s;
}

/* Slot sélectionné */
.SelectedItem {
  background-color: rgba(0, 150, 255, 0.4) !important;
  box-shadow: 0 0 6px 2px rgba(0, 255, 255, 0.8), inset 0 0 4px 1px rgba(255, 255, 255, 0.2) !important;
  border-color: cyan !important;
  outline: 2px solid rgba(0, 255, 255, 0.7) !important;
  transform: scale(1.05);
  transition: all 0.2s ease;
}
@keyframes glow {
  0% { box-shadow: 0 0 6px rgba(0,255,255,0.7); }
  50% { box-shadow: 0 0 12px rgba(0,255,255,1); }
  100% { box-shadow: 0 0 6px rgba(0,255,255,0.7); }
}

.SelectedItem {
  animation: glow 1s infinite alternate;
}

`;
document.head.appendChild(style);



   // === Fonction HUD ===
const createHUD = (id, label, x, y) => {
    const el = document.createElement('div');
    el.id = id;
    el.className = 'bloxium-element';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.textContent = `${label}: 0`;
    document.body.appendChild(el);
    makeDraggable(el);
    elements[id] = el;
};

    const makeDraggable = (el) => {
    let dragging = false, offsetX = 0, offsetY = 0;
    el.addEventListener('mousedown', (e) => {
        dragging = true;
        offsetX = e.clientX - el.offsetLeft;
        offsetY = e.clientY - el.offsetTop;
    });
    document.addEventListener('mousemove', (e) => {
        if (dragging) {
            el.style.left = `${e.clientX - offsetX}px`;
            el.style.top = `${e.clientY - offsetY}px`;
        }
    });
    document.addEventListener('mouseup', () => dragging = false);
};

    // === FPS / CPS / PING / TIMER ===
    ['fps', 'cps', 'ping', 'timer'].forEach((type, i) => {
        createHUD(type, type.toUpperCase(), 20, 20 + i * 30);
    });
    createHUD('shield', 'Bloxium Shield: Disabled', 20, 140); // Position personnalisée
elements.shield.classList.add('bloxium-hidden'); // caché par défaut


   let clicks = 0;
let cps = 0;
let fps = 0;
let ping = '?';
let timer = 0;
let frames = 0;

const updateLoop = () => {
  requestAnimationFrame(updateLoop);
  frames++;

  const now = performance.now();

  if (now - lastUpdate >= 1000) {
    // Calcul du FPS et reset du compteur
    fps = frames;

    // Mise à jour du CPS à partir des clicks cumulés sur la dernière seconde
    cps = clicks;

    // Format du timer en mm:ss
    const mins = Math.floor(timer / 60).toString().padStart(2, '0');
    const secs = (timer % 60).toString().padStart(2, '0');

    // Mise à jour du texte dans le HUD
    if (elements.fps) elements.fps.textContent = `FPS: ${fps}`;
    if (elements.cps) elements.cps.textContent = `CPS: ${cps}`;
    if (elements.ping) elements.ping.textContent = `Ping: ${ping}ms`;
    if (elements.timer) elements.timer.textContent = `Timer: ${mins}:${secs}`;

    // Reset des compteurs pour la prochaine seconde
    frames = 0;
    clicks = 0;

    lastUpdate = now;
  }
};

updateLoop();

// Événement click pour compter les clics souris (CPS)
document.addEventListener('click', () => {
  clicks++;
});

// Incrémente timer chaque seconde
setInterval(() => {
  timer++;
}, 1000);

// Mise à jour du ping toutes les 5 secondes
setInterval(() => {
  const start = performance.now();
  fetch('/favicon.ico', { cache: 'no-store' })
    .then(() => {
      ping = Math.round(performance.now() - start);
    })
    .catch(() => {
      ping = '?';
    });
}, 5000);





   // === Crosshair ===
const crosshair = document.createElement('div');
crosshair.className = 'bloxium-crosshair crosshair-default';
document.body.appendChild(crosshair);
elements['crosshair'] = crosshair;

const setCrosshair = (styleName) => {
    crosshair.className = `bloxium-crosshair ${styleName}`;
    localStorage.setItem('bloxium-crosshair-style', styleName);
};
const savedStyle = localStorage.getItem('bloxium-crosshair-style') || 'crosshair-default';
setCrosshair(savedStyle);


    // === Night Mode ===
 let nightMode = false;
    const toggleNight = () => {
        nightMode = !nightMode;
        document.body.classList.toggle('bloxium-night', nightMode);
    };

    // === Menu (RightShift) ===
const menu = document.createElement('div');
menu.className = 'bloxium-menu';
menu.innerHTML = `
    <h2>Bloxium Menu</h2>
    ${['fps', 'cps', 'ping', 'timer', 'keystrokes', 'crosshair', 'shield'].map(id =>
        `<label><input type="checkbox" id="toggle-${id}" checked> ${id.toUpperCase()}</label>`
    ).join('')}
    <label><input type="checkbox" id="toggle-night"> Night Mode</label>

    <label>Crosshair:
        <select id="crosshair-style">
            <option value="crosshair-default">Croix</option>
            <option value="crosshair-circle">Cercle</option>
            <option value="crosshair-dot">Point</option>
        </select>
    </label>
    <label>Qualité du rendu:
    <select id="resolution-select">
        <option value="1920x1080">1080p (Full HD)</option>
        <option value="2560x1440">2K (1440p)</option>
        <option value="3200x1800">1800p</option>
        <option value="3840x2160">4K (2160p)</option>
    </select>
</label>
<label><input type="checkbox" id="toggle-hotbar-style" checked> Hotbar Stylée</label>

`;
document.body.appendChild(menu);
document.getElementById('crosshair-style').value = savedStyle;

document.addEventListener('keydown', (e) => {
    if (e.code === 'ShiftRight') {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
});


    const toggles = {
        'toggle-fps': 'fps',
        'toggle-cps': 'cps',
        'toggle-ping': 'ping',
        'toggle-timer': 'timer',
        'toggle-keystrokes': 'keystrokes',
        'toggle-crosshair': 'crosshair',
        'toggle-shield': 'shield'
    };
    for (const id in toggles) {
        document.getElementById(id).addEventListener('change', e => {
            const el = elements[toggles[id]];
            if (el) el.classList.toggle('bloxium-hidden', !e.target.checked);
        });
    }
    document.getElementById('toggle-night').addEventListener('change', toggleNight)
    document.getElementById('crosshair-style').addEventListener('change', e => setCrosshair(e.target.value));
    const resolutionSelect = document.getElementById('resolution-select');

// Fonction pour appliquer la résolution sur le canvas
function applyResolution(res) {
    const [w, h] = res.split('x').map(Number);
    const canvas = document.querySelector('canvas');
    if (canvas) {
        // On force la taille du canvas (style CSS + attributs canvas)
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        canvas.width = w;
        canvas.height = h;
        console.log(`[Bloxium] Résolution appliquée : ${w}x${h}`);
    }
}

// Charger la résolution sauvegardée ou défaut à 1080p
const savedRes = localStorage.getItem('bloxium-resolution') || '1920x1080';
resolutionSelect.value = savedRes;
applyResolution(savedRes);

// Quand on change la résolution dans le menu
resolutionSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    applyResolution(val);
    localStorage.setItem('bloxium-resolution', val);
});


    // === Intro animée ===
const intro = document.createElement('div');
intro.className = 'bloxium-intro';
intro.textContent = 'Bloxium v1.0 - Chargement...';
document.body.appendChild(intro);
setTimeout(() => intro.remove(), 4000);


      // === Waypoints ===
const wpListDiv = document.createElement('div');
wpListDiv.style.marginTop = '10px';

const wpSection = document.createElement('div');
wpSection.className = 'bloxium-menu-section';
wpSection.innerHTML = `
    <h3 style="margin-top:10px;">Waypoints</h3>
    <input type="text" id="wp-label" placeholder="Nom" style="width: 100%; margin-bottom: 5px;">
    <input type="text" id="wp-coords" placeholder="x y z" style="width: 100%; margin-bottom: 5px;">
    <button id="wp-add" style="width: 100%; margin-bottom: 10px;">Ajouter</button>
`;
wpSection.appendChild(wpListDiv);
document.querySelector('.bloxium-menu').appendChild(wpSection);

function saveWaypoints(list) {
    localStorage.setItem('bloxium-waypoints', JSON.stringify(list));
}

function loadWaypoints() {
    return JSON.parse(localStorage.getItem('bloxium-waypoints') || '[]');
}

function renderWaypoints() {
    wpListDiv.innerHTML = '';
    waypoints.forEach((wp, i) => {
        const div = document.createElement('div');
        div.style.marginBottom = '4px';
        div.innerHTML = `${wp.label} (${wp.coords}) <button data-i="${i}" style="float:right;">X</button>`;
        div.querySelector('button').onclick = () => {
            waypoints.splice(i, 1);
            saveWaypoints(waypoints);
            renderWaypoints();
        };
        wpListDiv.appendChild(div);
    });
}

let waypoints = loadWaypoints();
renderWaypoints();

document.getElementById('wp-add').addEventListener('click', () => {
    const label = document.getElementById('wp-label').value.trim();
    const coords = document.getElementById('wp-coords').value.trim();
    if (!label || !coords) return;
    waypoints.push({ label, coords });
    saveWaypoints(waypoints);
    renderWaypoints();
    document.getElementById('wp-label').value = '';
    document.getElementById('wp-coords').value = '';
});

    const toggleShield = (enabled) => {
    const el = elements.shield;
    if (!el) return;

    el.classList.toggle('bloxium-hidden', !enabled);
    el.textContent = `Bloxium Shield: ${enabled ? 'Activated' : 'Disabled'}`;

    if (enabled) {
        // Supprime les cookies simples
        document.cookie.split(";").forEach(c => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        console.log("[Bloxium Shield] Cookies supprimés.");
    }
};

document.getElementById('toggle-shield').addEventListener('change', e => {
    toggleShield(e.target.checked);
});
    const hotbarCheckbox = document.getElementById('toggle-hotbar-style');
let hotbarEnabled = hotbarCheckbox.checked;

const applyHotbarStyle = () => {
  if (!hotbarEnabled) {
    // Remet les styles par défaut du jeu (reset inline styles)
    document.querySelectorAll('.item, .SelectedItem').forEach(el => {
      el.style.borderRadius = '';
      el.style.borderColor = '';
      el.style.backgroundColor = '';
      el.style.boxShadow = '';
      el.style.outline = '';
    });
    return;
  }

  document.querySelectorAll('.item').forEach(slot => {
    slot.style.borderRadius = '0px';
    slot.style.borderColor = '#000000';
    slot.style.backgroundColor = 'rgba(0,0,0,0.7)';
    slot.style.boxShadow = 'inset -2px -2px 10px 0px rgba(128,128,128,0.6), inset 0.3px 0.3px 5px 0px rgba(255,255,255,0.2)';
    slot.style.outline = 'none';
  });
  document.querySelectorAll('.SelectedItem').forEach(selected => {
    selected.style.backgroundColor = 'rgba(0,0,255,0.3)';
    selected.style.boxShadow = 'inset -2px -2px 10px 0px rgba(0,0,255,0.7), inset 0.3px 0.3px 5px 0px rgba(128,128,128,0.6)';
    selected.style.borderColor = '#0000ff';
    selected.style.outline = 'none';
  });
};

hotbarCheckbox.addEventListener('change', e => {
  hotbarEnabled = e.target.checked;
  if (hotbarEnabled) {
    applyHotbarStyle();
  } else {
    applyHotbarStyle();
  }
});

// Et dans ton setInterval, tu peux faire :
setInterval(() => {
  if (hotbarEnabled) applyHotbarStyle();
}, 100);
    setInterval(() => {
    if (document.title !== "Bloxium Client") {
        document.title = "Bloxium Client";
    }
}, 1000);


})();