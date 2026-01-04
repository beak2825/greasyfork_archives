// ==UserScript==
// @name         Bloxium Client HUD (v1)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Alpha of #1 bloxd client ( hotbare + cps,ping,fps,timer,fps max,quality,keystroyes...) ( DONT COPY THIS CODE OR I CAN FILE A COMPLAINT
// @author       Bloxium Team
// @match        *://bloxd.io/*
// @match        https://staging.bloxd.io/
// @grant        none
// @license      CC BY-NC-ND 4.0
// @icon         https://i.imgur.com/gaj92pC.png?1
// @downloadURL https://update.greasyfork.org/scripts/540953/Bloxium%20Client%20HUD%20%28v1%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540953/Bloxium%20Client%20HUD%20%28v1%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.top !== window.self || window.bloxiumInitialized) return;
    window.bloxiumInitialized = true;

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
    <label><input type="checkbox" id="toggle-funfacts" checked> Fun Facts</label>
        <label><input type="checkbox" id="toggle-perf"> Performance Mode 🧪</label>
        <label><input type="checkbox" id="toggle-cinematic"> 🎬 Cinematic Mode</label>
        <label><input type="checkbox" id="toggle-music" checked> 🎵 Music</label>
        <label for="volume-slider">🔊 Volume</label>
<input type="range" id="volume-slider" min="0" max="100" value="40" />



`;  // <- fermeture du backtick ici !

document.body.appendChild(menu);
document.getElementById('crosshair-style').value = localStorage.getItem('bloxium-crosshair-style') || 'crosshair-default';

// Raccourci pour ouvrir/fermer le menu avec RightShift
document.addEventListener('keydown', (e) => {
    if (e.code === 'ShiftRight') {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
});



    // 1. Déclare d’abord ton audio
const bloxiumMusic = new Audio("https://file.garden/aF_qZS3oWW0Z5HGs/turn-it-up-a-minecraft-original-music-video-song_6yfEgQVm.mp3");
bloxiumMusic.volume = 0.4;
bloxiumMusic.loop = true;


    // Gestion du toggle musique
const musicCheckbox = document.getElementById('toggle-music');

if (musicCheckbox) {
    musicCheckbox.addEventListener('change', () => {
        if (musicCheckbox.checked) {
            bloxiumMusic.play().catch(e => console.warn("Autoplay bloqué :", e));
        } else {
            bloxiumMusic.pause();
        }
    });

    // Lancer direct au début si activé
    if (musicCheckbox.checked) {
        bloxiumMusic.play().catch(e => console.warn("Autoplay bloqué :", e));
    }
}




    // === Variables globales ===
    const elements = {};
    let lastUpdate = performance.now();
    // === Anti pub ===
    [
  'GameAdsBanner',
  'HomeBannerInner',
  'ShopBannerDiv',
  'SettingsAdOuter',
  'InventoryAdInner',
  'RespawnLeaderboardBannerDivInner',
  'RespawnSideSquareBannerDiv',
  'LoadingOverlayLeft',
  'LoadingOverlayRightAdBannerContainer',
  'LoadingOverlayDividerContainer'
].forEach(className => {
  document.querySelectorAll('.' + className).forEach(ad => {
    ad.style.opacity = '0';
    ad.style.height = '2px';
    ad.style.width = '2px';   // corrigé ici
    ad.style.pointerEvents = 'none'; // empêche les clics invisibles
    // Optionnel mais propre:
    // ad.style.display = 'none';
  });
});


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
    .bloxium-intro {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.85);
    z-index: 9999;
}
.bloxium-title {
    font-size: 36px;
    color: white;
    font-family: 'Arial Black', sans-serif;
    text-shadow: 2px 2px 8px black;
    margin-bottom: 40px;
}
.bloxium-loader-container {
    width: 300px;
    height: 12px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px #000;
}

.bloxium-loader-bar {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #00ffcc, #0099ff);
    animation: loadBarAnim 7s ease-out forwards;
}

@keyframes loadBarAnim {
    0% { width: 0%; }
    100% { width: 100%; }
}

.bloxium-loader-text {
    margin-top: 15px;
    color: white;
    font-family: monospace;
    font-size: 20px;
    text-shadow: 1px 1px 3px black;
}

.bloxium-loader {
    background: rgba(0, 0, 0, 0.75);
    padding: 20px 40px;
    color: white;
    font-size: 24px;
    border-radius: 12px;
    font-family: monospace;
    text-align: center;
    box-shadow: 0 0 10px #000000aa;
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
.bloxium-cinematic {
  filter: brightness(0.95) saturate(1.1) contrast(1.05);
  transition: filter 0.3s ease;
}

.SelectedItem {
  animation: glow 1s infinite alternate;
}

`;
document.head.appendChild(style);


    // Remplace le fond d'accueil du jeu par une image custom
const customBackgroundURL = 'https://i.imgur.com/Ld3cDxg.jpeg'; // 🔁 Mets ici ton vrai lien

const applyCustomBackground = () => {
    const homeBg = document.querySelector('.HomePageBackground');
    if (homeBg && !homeBg.dataset.bloxiumModified) {
        homeBg.style.backgroundImage = `url('https://i.imgur.com/Ld3cDxg.jpeg')`;
        homeBg.style.backgroundSize = 'cover';
        homeBg.style.backgroundPosition = 'center';
        homeBg.style.backgroundRepeat = 'no-repeat';
        homeBg.dataset.bloxiumModified = 'true';
        console.log('[Bloxium] Custom homepage background applied.');
    }
};

// Observe les changements pour être sûr que ça s’applique même si le DOM recharge
const bgObserver = new MutationObserver(applyCustomBackground);
bgObserver.observe(document.body, { childList: true, subtree: true });

// Essaie de l’appliquer immédiatement aussi
applyCustomBackground();
    const updateTitle = () => {
  const titleEl = document.querySelector('div.Title.FullyFancyText');
  if (titleEl) {
    titleEl.textContent = 'Bloxium';
    titleEl.style.fontFamily = "'Press Start 2P', cursive, monospace"; // Exemple de police stylée pixel
    titleEl.style.fontWeight = 'bold';
    titleEl.style.fontSize = '28px';
    titleEl.style.color = '#00ff99'; // vert néon stylé
    titleEl.style.textShadow = '0 0 8px #00ff99, 0 0 12px #00ff99';
  }
};

// Charger la police Google Fonts en dynamique
const link = document.createElement('link');
link.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

// Appliquer la modif quand le DOM est prêt + régulièrement au cas où ça recharge
document.addEventListener('DOMContentLoaded', updateTitle);
setInterval(updateTitle, 2000);
    const customLogoURL = "https://i.imgur.com/Delp1oH.png"; // Remplace par ton URL
const modifyLogoLoader = () => {
    const logoDiv = document.querySelector("div.LogoLoaderOuter");
    if (logoDiv) {
        logoDiv.innerHTML = ""; // Vide l'ancien contenu
        logoDiv.style.backgroundImage = `url('https://i.imgur.com/Delp1oH.png')`;
        logoDiv.style.backgroundSize = "contain";
        logoDiv.style.backgroundRepeat = "no-repeat";
        logoDiv.style.backgroundPosition = "center";
        logoDiv.style.width = "200px";
        logoDiv.style.height = "200px";
        logoDiv.style.margin = "auto";
    }
};

// Attendre que le DOM charge et vérifier régulièrement si le logo est apparu
const logoInterval = setInterval(() => {
    const logo = document.querySelector("div.LogoLoaderOuter");
    if (logo) {
        modifyLogoLoader();
        clearInterval(logoInterval);
    }
}, 300);

    const funFacts = [
  "💡 Tip: Press Right Shift to open the Bloxium menu!",
  "🔧 You can customize your HUD anytime.",
  "⏱️ Load times are now tracked automatically!",
  "🚀 Bloxium boosts your FPS with style.",
  "🌐 Connect faster. Win harder.",
  "🌀 Who needs Lunar when you have this?"
];

const interval = setInterval(() => {
    const overlay = document.querySelector('.LoadingOverlayRightBody');

    if (overlay && !document.getElementById('bloxium-styled-loading')) {
        // Ajoute un overlay personnalisé au-dessus
        const custom = document.createElement('div');
        custom.id = 'bloxium-styled-loading';
        custom.style.position = 'absolute';
        custom.style.top = '0';
        custom.style.left = '0';
        custom.style.width = '100%';
        custom.style.height = '100%';
        custom.style.display = 'flex';
        custom.style.flexDirection = 'column';
        custom.style.alignItems = 'center';
        custom.style.justifyContent = 'center';
        custom.style.zIndex = '99999';
        custom.style.background = "url('https://i.imgur.com/Ld3cDxg.jpeg') center/cover no-repeat";
        custom.style.color = 'white';
        custom.style.fontFamily = "'Arial Black', sans-serif";
        custom.style.textShadow = '2px 2px 8px black';

        // Titre
        const title = document.createElement('div');
        title.textContent = "Bloxium is loading...";
        title.style.fontSize = "32px";
        title.style.marginBottom = "20px";

        // Container barre de chargement
        const barContainer = document.createElement('div');
        barContainer.style.width = "300px";
        barContainer.style.height = "12px";
        barContainer.style.background = "#333";
        barContainer.style.borderRadius = "8px";
        barContainer.style.overflow = "hidden";
        barContainer.style.boxShadow = "0 0 10px #000";

        // Barre de progression animée
        const bar = document.createElement('div');
        bar.style.height = "100%";
        bar.style.width = "0%";
        bar.style.background = "linear-gradient(90deg, #00ffcc, #0099ff)";
        bar.style.transition = "width 3.5s ease-in-out";

        // Fun fact
        const fact = document.createElement('div');
        fact.textContent = funFacts[Math.floor(Math.random() * funFacts.length)];
        fact.style.fontSize = "18px";
        fact.style.marginTop = "20px";
        fact.style.fontFamily = "monospace";

        // Animation de la barre
        setTimeout(() => {
            bar.style.width = "100%";
        }, 100);

        barContainer.appendChild(bar);
        custom.appendChild(title);
        custom.appendChild(barContainer);
        custom.appendChild(fact);
        overlay.appendChild(custom);

        // === Son de démarrage Bloxium ===
const bloxiumStartSound = new Audio("https://files.catbox.moe/6mltop.wav");
bloxiumStartSound.volume = 0.5; // tu peux mettre plus ou moins
bloxiumStartSound.play().catch(e => console.warn("Audio autoplay bloqué : ", e));


        clearInterval(interval);
    }
}, 100);

    // Supprime l'écran de chargement dès que le jeu démarre
const originalLog = console.log;
console.log = function (...args) {
    const msg = args.join(" ");

    if (msg.includes("Updated gamestate inGame")) {
        const custom = document.getElementById('bloxium-styled-loading');
        if (custom) custom.remove();
    }

    originalLog.apply(console, args);
};







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


// Reconnexion des toggles existants
const toggles = {
    'toggle-fps': 'fps',
    'toggle-cps': 'cps',
    'toggle-ping': 'ping',
    'toggle-timer': 'timer',
    'toggle-keystrokes': 'keystrokes',
    'toggle-crosshair': 'crosshair',
    'toggle-shield': 'shield'
};
for (const checkboxId in toggles) {
    document.getElementById(checkboxId).addEventListener('change', e => {
        const el = elements[toggles[checkboxId]];
        if (el) el.classList.toggle('bloxium-hidden', !e.target.checked);
    });
}
document.getElementById('toggle-night').addEventListener('change', toggleNight);
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


   // === Intro stylée avec fond custom + animation ===
const version = "0.33"; // Change selon ta version
const intro = document.createElement('div');
intro.className = 'bloxium-intro';
intro.innerHTML = `
    <div class="bloxium-title">Bloxium v${version}</div>
    <div class="bloxium-loader-container">
        <div class="bloxium-loader-bar"></div>
    </div>
    <div class="bloxium-loader-text">Chargement...</div>
`;
document.body.appendChild(intro);

// Style direct
intro.style.backgroundImage = "url('https://i.imgur.com/5aWg1Qy.jpeg')";
intro.style.backgroundSize = "cover";
intro.style.backgroundPosition = "center";
intro.style.backgroundRepeat = "no-repeat";

    // === Supprimer proprement avec fade-out ===
setTimeout(() => {
    intro.style.opacity = '0';
    setTimeout(() => intro.remove(), 1000); // attend la transition
}, 8000); // temps total visible

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
    // === Fun Facts System ===
const tips = [
  "💡 Tip: Press Right Shift to open the Bloxium menu!",
  "🌙 Night Mode helps your eyes during night battles.",
  "⚙️ Customize your HUD and crosshair in settings!",
  "💾 Everything auto-saves in localStorage!",
  "🚀 Pro tip: You can bunny-hop to go faster.",
  "📶 Lag is just your WiFi practicing teleportation.",
  "🧠 99% of players don’t read tips. Be the 1%.",
  "😵‍💫 CTRL+W gives you free coins! (don’t try this)",
  "🆒 If you read this, you're officially cooler than your friends.",
  "🎂 The cake is a lie.",
  "🧱 Skyblock is life. Fight me.",
  "🕳️ Tip: Don’t fall off.",
  "⚠️ Your ping is over 9000!",
  "🧠 Using Bloxium? You're elite now.",
  "📸 FPS drops are just surprise screenshots.",
  "💥 Random fact: A creeper explodes in 1.5 seconds.",
  "👁️ Your crosshair is judging you.",
  "🪓 Fun fact: This isn't Minecraft.",
  "🔑 RightShift opens the menu. If you have fingers.",
  "🛡️ Bloxium Shield is not edible.",
  "🌿 Remember to touch grass. Digitally.",
  "⚔️ PvP tip: Hit them first. Genius.",
  "🪂 Try jumping. It’s like flying, but worse.",
  "🕳️ Never dig straight down. Even here.",
  "🥤 You’ve been playing for 3 hours. Hydrate.",
  "😤 Parkour = pain + precision",
  "👀 The devs are watching. Maybe.",
  "😬 Don’t trust players with “69” in their name.",
  "💬 If you win, say “gg ez” (and prepare for war).",
  "🥚 You found an Easter egg! No you didn’t.",
  "🌀 Some say the void stares back.",
  "🤖 Get 100 CPS for a free ban.",
  "🎯 Crosshair tip: the dot is NOT the bullet.",
  "🕵️ Bloxium doesn’t spy on you. Probably.",
  "😩 FPS: Frames Per Suffering.",
  "🧱 Try to wallrun. It won’t work, but you’ll look cool.",
  "⌛ Loading... please wait. Just kidding, we’re live.",
  "📌 Better aim = less shame.",
  "🪐 Ping > 200ms? You’re playing on Mars.",
  "👟 Shift is your best friend. Until it’s not.",
  "😭 The block you missed is crying.",
  "🎯 Crosshair on, aim strong.",
  "🧊 Bloxd.io: where chaos meets cubes.",
  "🎮 Try using keystrokes to show off.",
  "🔤 WASD = Winning At Speedy Dodging.",
  "🕰️ You’re not lagging, you’re time-traveling.",
  "🚧 Bloxium v1.0 is only the beginning.",
  "🧠 You clicked this tip. Mentally.",
  "🔥 To win, pretend you're cracked. Then become cracked.",
  "📉 Settings > Ultra > Regret",
  "🔔 This is your sign to dominate the leaderboard.",
  "🖼️ Every frame counts. Even the dropped ones.",
  "🎥 This message is sponsored by your GPU.",
  "🤔 How do you still have 0 kills?",
  "🔍 Don't be sus. Or do. Your choice.",
  "🦵 Parkour isn't real. It’s just leg day.",
  "🖱️ You’re not sweating, your mouse is.",
  "🤓 Noobs ask “how”. Pros ask “why”.",
  "⏸️ Pause? Never heard of her.",
  "🧩 Error 404: Skill not found."
];

// Crée l’élément visuel des tips
const tipEl = document.createElement('div');
tipEl.className = 'bloxium-element';
tipEl.style.top = '0';
tipEl.style.left = '50%';
tipEl.style.transform = 'translateX(-50%)';
tipEl.style.background = 'rgba(0, 0, 0, 0.8)';
tipEl.style.borderRadius = '0 0 10px 10px';
tipEl.style.padding = '8px 20px';
tipEl.style.fontSize = '14px';
tipEl.style.zIndex = '10000';
tipEl.style.pointerEvents = 'none';
document.body.appendChild(tipEl);

// Attends que le menu soit créé pour accéder à la checkbox
window.addEventListener('load', () => {
    const toggleFunFacts = document.getElementById('toggle-funfacts');

    // Si la case existe bien
    if (toggleFunFacts) {
        // Charger l’état depuis le localStorage
        const funFactsEnabled = localStorage.getItem('bloxium-funfacts') !== 'false';
        toggleFunFacts.checked = funFactsEnabled;
        tipEl.style.display = funFactsEnabled ? 'block' : 'none';

        // Mettre à jour localStorage si l’utilisateur change la case
        toggleFunFacts.addEventListener('change', () => {
            const enabled = toggleFunFacts.checked;
            localStorage.setItem('bloxium-funfacts', enabled);
            tipEl.style.display = enabled ? 'block' : 'none';
        });

        // Fonction pour mettre à jour le tip
        function updateTip() {
            if (toggleFunFacts.checked) {
                tipEl.textContent = tips[Math.floor(Math.random() * tips.length)];
            }
        }

        updateTip(); // Tip de départ
        setInterval(updateTip, 5000); // Tous les 5s
    }
});
    setInterval(() => {
  if (document.hasFocus()) {
    document.title = "Bloxium Client ☀";
  } else {
    document.title = "👀 Come back to the game!";
  }
}, 1000);
    // === Variables de perf
let perfInterval = null;
let perfCanvasApplied = false;

// === Fonction de performance mode ===
function togglePerformanceMode(enabled) {
    if (enabled) {
        console.log('[Bloxium] Performance Mode ON');


        // 3. Nettoie les éléments invisibles régulièrement
        perfInterval = setInterval(() => {
            document.querySelectorAll('div, span, canvas').forEach(el => {
                const cs = window.getComputedStyle(el);
                if (
                    cs.display === 'none' ||
                    cs.visibility === 'hidden' ||
                    el.offsetHeight === 0
                ) el.remove();
            });
        }, 10000);
    } else {
        console.log('[Bloxium] Performance Mode OFF');

        // Enlève le style de boost
        const style = document.getElementById('bloxium-perf-style');
        if (style) style.remove();

        // Stop le nettoyage auto
        if (perfInterval) clearInterval(perfInterval);
        perfInterval = null;

        // Ne remet pas la résolution originale automatiquement pour l’instant
    }
}

// === Activation via le menu ===
let cinematicActive = false;
const toggleCinematicMode = () => {
    cinematicActive = !cinematicActive;

    // Retire l'ancien night mode et ajoute le nouveau cinematic light
    document.body.classList.remove('bloxium-night');
    if (cinematicActive) {
        document.body.classList.add('bloxium-cinematic');
    } else {
        document.body.classList.remove('bloxium-cinematic');
    }

    // Cache ou affiche tous les HUDs et crosshair
    const hudElements = document.querySelectorAll('.bloxium-element, .bloxium-crosshair');
    hudElements.forEach(el => el.classList.toggle('bloxium-hidden', cinematicActive));

    console.log(`[Bloxium] 🎬 Cinematic mode ${cinematicActive ? 'enabled' : 'disabled'}`);
};
const volumeSlider = document.getElementById('volume-slider');

if(volumeSlider){
    // Initial volume (valeur par défaut ou locale)
    bloxiumMusic.volume = volumeSlider.value / 100;

    volumeSlider.addEventListener('input', () => {
        bloxiumMusic.volume = volumeSlider.value / 100;
    });
}
// Charger volume au démarrage
const savedVolume = localStorage.getItem('bloxium-music-volume');
if(savedVolume !== null){
    volumeSlider.value = savedVolume;
    bloxiumMusic.volume = savedVolume / 100;
}

// Sauvegarder à chaque changement
volumeSlider.addEventListener('input', () => {
    bloxiumMusic.volume = volumeSlider.value / 100;
    localStorage.setItem('bloxium-music-volume', volumeSlider.value);
});


})()