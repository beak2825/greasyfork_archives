// ==UserScript==
// @name         Agar.io Macros & Extras
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Macros for agario
// @author       Maroc - https://www.youtube.com/@maroooc
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545478/Agario%20Macros%20%20Extras.user.js
// @updateURL https://update.greasyfork.org/scripts/545478/Agario%20Macros%20%20Extras.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 Maroc

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/



(function() {
    'use strict';

//REMOVER FONDO
    const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    let startBlocking = false;

    setTimeout(() => {
        startBlocking = true;
    }, 3000);

    CanvasRenderingContext2D.prototype.drawImage = function (img) {
        if (startBlocking && img && img.src === "https://agar.io/img/background.png") {
            return; 
        }

        return originalDrawImage.apply(this, arguments);
    };

//FPS COUNTER
(function setupFPSCounter() {
  let fpsBox = document.createElement("div");
  fpsBox.style = `
    position: absolute;
    top: 10px;
    left: 10px;
    color: white;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 7px;
    padding: 2.5px;
    font-weight: bold;
    font-family: 'Ubuntu', sans-serif;
    z-index: 9999;
  `;

  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap";

  function appendWhenReady() {
    if (document.body && document.head) {
      document.head.appendChild(link);
      document.body.appendChild(fpsBox);
    } else {
      requestAnimationFrame(appendWhenReady);
    }
  }

  appendWhenReady();

  let frames = 0;
  let lastTime = performance.now();

  function updateFPS() {
    const now = performance.now();
    const delta = now - lastTime;

    if (delta >= 1000) {
      fpsBox.textContent = "FPS " + frames;
      frames = 0;
      lastTime = now;
    }

    requestAnimationFrame(updateFPS);
  }

  updateFPS();

  const clearRectOld = CanvasRenderingContext2D.prototype.clearRect;
  CanvasRenderingContext2D.prototype.clearRect = function () {
    if (this.canvas === window.canvas) {
      frames++;
    }
    return clearRectOld.apply(this, arguments);
  };
})();

//UPLOAD SKINS IN-GAME SHOP OPTION//

function createImageButton() {
  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.display = "inline-block";

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.id = "customImageUpload";
  input.style.width = "100%";
  input.style.height = "100%";
  input.style.opacity = "0";
  input.style.position = "absolute";
  input.style.left = "0";
  input.style.top = "0";
  input.style.zIndex = "1";

  const button = document.createElement("button");
  button.textContent = "Upload Image";
  button.style.color = "#fff";
  button.style.fontWeight = "bold";
  button.style.backgroundColor = "#2a61d7";
  button.style.width = "118px";
  button.style.height = "50px";
  button.style.border = "none";
  button.style.borderRadius = "3px";
  button.style.padding = "5px 10px";

  container.appendChild(input);
  container.appendChild(button);
  return container;
}

function insertImageButton(container, target) {
  if (!target) return;
  const newDiv = document.createElement("div");
  newDiv.style.marginTop = "15px";
  newDiv.style.marginBottom = "-35px";
  newDiv.style.marginLeft = "25px";
  newDiv.appendChild(container);
  target.querySelector(".cell-colors").appendChild(newDiv);
}

function convertImageToBase64(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onloadend = function () {
    drawImage(reader.result);
  };
  reader.readAsDataURL(file);
}

function drawImage(base64) {
  const canvas = document.getElementById("skin-editor-canvas");
  const context = canvas.getContext("2d");
  const image = new Image();
  image.onload = function () {
    canvas.width = 512;
    canvas.height = 512;
    context.drawImage(image, 0, 0, 512, 512);
    context.save();
  };
  image.src = base64;
}

function observeTargetContainer() {
  const observer = new MutationObserver(() => {
    const target = document.querySelector(".right-tools");
    if (target && !target.querySelector("#customImageUpload")) {
      const btn = createImageButton();
      insertImageButton(btn, target);
      btn.querySelector("input").addEventListener("change", convertImageToBase64);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Asegúrate de que la función observeTargetContainer se ejecute tan pronto como el DOM esté parcialmente cargado
document.addEventListener('DOMContentLoaded', () => {
  observeTargetContainer();
});

//TEXTO INSTRUCCIONES
// Crear el div
const customDiv = document.createElement('div');
customDiv.style.background = '#fff';
customDiv.style.borderRadius = '12px';
customDiv.style.padding = '10px';
customDiv.style.marginTop = '10px';
customDiv.style.fontFamily = 'Arial, sans-serif';
customDiv.style.fontSize = '14px';
customDiv.style.lineHeight = '1.4';
customDiv.style.textAlign = 'center';
customDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';

customDiv.innerHTML = `
  Press
  <span style="color:#2a61d7; font-weight:600;">Keybinds</span>
  or
  <span style="color:#3bb34a; font-weight:600;">XTRAS</span>
  for more options
  <br>
  <small style="display:block; margin-top:8px; font-size:12px; color:#666;">
    Made by
    <a href="https://www.youtube.com/@maroooc?sub_confirmation=1"
       target="_blank"
       rel="noopener noreferrer"
       style="font-weight:bold; color:#000; text-decoration:none; cursor:pointer;"
       onmouseenter="this.style.textDecoration='underline';"
       onmouseleave="this.style.textDecoration='none';">
       Maroc
    </a>
  </small>
`;

// Función para insertar el div debajo de #mainui-offers
function insertCustomDiv() {
  const offers = document.querySelector('#mainui-offers');
  if (offers && offers.parentNode && !document.contains(customDiv)) {
    offers.parentNode.insertBefore(customDiv, offers.nextSibling);
  }
}

// Observer para detectar cuando aparece #mainui-offers
const observe = new MutationObserver(() => {
  insertCustomDiv();
});

observe.observe(document.body, {
  childList: true,
  subtree: true
});

// Por si ya está cargado cuando el script corre
insertCustomDiv();


//REMOVER ANUNCIOS Y ELEMENTOS INNECESARIOS

(function zapAdsAndTos() {
	/* selectors for anything we want gone */
	const SELECTORS = ["#agar-io_160x600", "#agar-io_160x600_2", ".tosBox.right", ".agario-promo-container", ".bubble", "#agario-web-incentive", "#socialButtons", "#data-v-0733aa78", "#agar-io_970x90"];

	/* utility – delete any element matching our selectors */
	const removeMatches = (root) =>
		SELECTORS.forEach((sel) =>
			root.querySelectorAll(sel).forEach((el) => el.remove()),
		);

	/* 1. Immediately clean whatever is already in the DOM */
	removeMatches(document);

	/* 2. Keep cleaning with a MutationObserver */
	const obs = new MutationObserver((muts) =>
		muts.forEach((m) =>
			m.addedNodes.forEach((n) => n.nodeType === 1 && removeMatches(n)),
		),
	);
	obs.observe(document.documentElement, {childList: true, subtree: true});

})();

//CAMBIO DE UI
const style = document.createElement("style");
    style.innerHTML = `
        :root {
            --bottom-banner-height: 0px !important;
        }

        .btn-play[data-v-0733aa78] {
            position: relative;
            top: 25px;
            color: #fff !important;
            background-color: #2a61d7 !important;
            border-color: #2a61d7 !important;
            width: 243px;
            height: 34px;
            font-size: 20px;
            line-height: 1.5;
        }

        .mini .potion-slot-animation[data-v-55506716] {
            top: 24% !important;
            position: absolute !important;
            width: 98% !important;
            height: 175% !important;
            transform-origin: center !important;
            z-index: 1 !important;
            overflow: hidden !important;
        }

        .party-join[data-v-3152cd5c], .party-play[data-v-3152cd5c] {
            background-color: #2a61d7 !important;
            border-color: #2a61d7 !important;
            width: 77px;
        }

        .party-create[data-v-3152cd5c], .party-copy[data-v-3152cd5c] {
            background-color: #00d3ff !important;
            border-color: #7cddf3!important;
            width: 68px;
        }

        .dialog[data-v-0b8695e7] {
            z-index: 1000 !important;
            position: relative;
        }

        #title[data-v-0733aa78] {
            font-size: 60px !important;
            margin-top: 33px !important;
            margin-bottom: 8px !important;
        }

        .partymode-info {
            position: absolute;
            top: 40px !important;
            left: 10px !important;
            font-size: 12px !important;
        }

        #mainui-features {
            position: absolute !important;
            left: 50.025% !important;
            top: 75% !important;
            transform: translateX(-50%) translateY(-50%) !important;
        }

        center[data-v-0733aa78] {
            margin-top: 30px !important;
            display: block !important;
            text-align: center !important;
            font-size: 18px !important;
            color: #000 !important;
        }
    `;
    document.documentElement.appendChild(style);

//MAPEADO & lOGICA DE LAS KEYBINDS ROWS
  const keyCodeMap = {
    A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71,
    H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78,
    O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85,
    V: 86, W: 87, X: 88, Y: 89, Z: 90,
    0: 48, 1: 49, 2: 50, 3: 51, 4: 52, 5: 53,
    6: 54, 7: 55, 8: 56, 9: 57,
  };
  const defaultKeybinds = {
    ejectM: "W",
    splitDouble: "G",
    splitX16: "T",
    stopMovement: "S",
    dance: "D",
    mini1: "M",
  };
  const keybindOrder = [
    "ejectM", "splitDouble", "splitX16",
    "stopMovement", "dance", "mini1",
  ];

  let customKeybinds = {};

  function loadKeybinds() {
  const saved = localStorage.getItem("keybinds");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const valid = Object.values(parsed).every((k) =>
        Object.keys(keyCodeMap).includes(k)
      );
      if (valid) {
        console.log("Loaded saved keybinds:", { ...defaultKeybinds, ...parsed });
        return { ...defaultKeybinds, ...parsed };
      }
    } catch {}
  }
  console.log("Using default keybinds:", defaultKeybinds);
  return { ...defaultKeybinds };
}
  function saveKeybinds() {
    localStorage.setItem("keybinds", JSON.stringify(customKeybinds));
    console.log("Keybinds saved:", customKeybinds);
  }
  function resetKeybinds() {
    customKeybinds = { ...defaultKeybinds };
    saveKeybinds();
    updateKeybindDisplay();
  }

  function createKeybindRow(label, key, keyName) {
    const row = document.createElement("div");
    row.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding: 8px 12px;
      border-radius: 8px;
      background: rgba(42, 97, 215, 0.15);
      user-select: none;
      font-family: Arial, sans-serif;
      font-size: 14px;
      color: #222;
    `;

    const labelElem = document.createElement("span");
    labelElem.style.flex = "1";
    labelElem.style.textAlign = "left";
    labelElem.textContent = label;
    row.appendChild(labelElem);

    const keyElem = document.createElement("span");
    keyElem.textContent = key.toUpperCase();
    keyElem.style.cssText = `
      cursor: pointer;
      font-weight: bold;
      padding: 5px 12px;
      border: 1.5px solid #2a61d7;
      border-radius: 6px;
      background: rgba(42, 97, 215, 0.3);
      min-width: 45px;
      text-align: center;
      transition: background 0.3s ease;
      user-select: none;
    `;
    keyElem.title = "Click to change key";
    keyElem.addEventListener("mouseenter", () => {
      keyElem.style.background = "rgba(42, 97, 215, 0.6)";
    });
    keyElem.addEventListener("mouseleave", () => {
      keyElem.style.background = "rgba(42, 97, 215, 0.3)";
    });

    keyElem.addEventListener("click", () => {
      keyElem.textContent = "...";
      const keyHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const newKey = (e.key || "").toUpperCase();
        if (
          newKey.length === 1 &&
          Object.keys(keyCodeMap).includes(newKey)
        ) {
          const keyAlreadyInUse =
            Object.values(customKeybinds).includes(newKey) &&
            customKeybinds[keyName] !== newKey;
          if (keyAlreadyInUse) {
            alert("Key already in use, try another one.");
            keyElem.textContent = customKeybinds[keyName];
          } else {
            customKeybinds[keyName] = newKey;
            saveKeybinds();
            updateKeybindDisplay();
          }
        } else {
          alert("Invalid key input.");
          keyElem.textContent = customKeybinds[keyName];
        }
        document.removeEventListener("keydown", keyHandler);
      };
      document.addEventListener("keydown", keyHandler, { once: true });
    });

    row.appendChild(keyElem);
    return row;
  }

  const keybindForm = document.createElement("div");
  keybindForm.style.cssText = `
    text-align: center;
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 8px;
  `;

  function updateKeybindDisplay() {
    keybindForm.innerHTML = "";
    keybindOrder.forEach((keyName) => {
      const label = {
        ejectM: "Macro Feed (Hold)",
        splitDouble: "Double Split (Tap)",
        splitX16: "Split x16 (Tap)",
        stopMovement: "Stop Movement (Tap)",
        dance: "Dance (Tap)",
        mini1: "Toggle Minimap",
      }[keyName];
      keybindForm.appendChild(
        createKeybindRow(label, customKeybinds[keyName], keyName)
      );
    });

    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset Defaults";
    resetBtn.style.cssText = `
      margin-top: 10px;
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      background-color: #2a61d7;
      color: #fff;
      font-weight: bold;
      cursor: pointer;
      user-select: none;
      transition: background-color 0.3s ease;
    `;
    resetBtn.addEventListener("mouseenter", () => {
      resetBtn.style.backgroundColor = "#1f479f";
    });
    resetBtn.addEventListener("mouseleave", () => {
      resetBtn.style.backgroundColor = "#2a61d7";
    });
    resetBtn.addEventListener("click", resetKeybinds);
    keybindForm.appendChild(resetBtn);
  }

  customKeybinds = loadKeybinds();
  updateKeybindDisplay();


//MACROS AGARIO

// GLOBAL VARIABLES
let EjectDown = false;
let speed = 25;
let miniact = false;
let keysDown = {};
let isPaused = false;
let lockInterval = null;
let originalSetTarget = null;
let originalSendFunction = null;
let gameCanvas = null;
let lockPosition = { x: 0.0, y: 0.0 };

// Events
window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);

// Init
interceptWebSocket();
interceptCoreForFreeze();
findGameCanvas();

// === TOGGLE PAUSE ===
function togglePause() {
    if (isMenuVisible() || !MC?.isInGame?.()) return;

    isPaused = !isPaused;
    if (isPaused) {
        updateLockPosition();
        startCursorLock();
        showPauseBanner();
    } else {
        if (lockInterval) clearInterval(lockInterval);
        hidePauseBanner();
    }
}

function isMenuVisible() {
    const el = document.querySelector('#playnick[data-v-0733aa78]');
    if (!el) return false;
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
}

// === INTERCEPT core.setTarget ===
function interceptCoreForFreeze() {
    const checkForCore = setInterval(() => {
        if (window.core && typeof window.core.setTarget === 'function') {
            originalSetTarget = window.core.setTarget;
            window.core.setTarget = function (x, y) {
                if (isPaused && !(x === lockPosition.x && y === lockPosition.y)) return;
                return originalSetTarget.call(this, x, y);
            };
            clearInterval(checkForCore);
        }
    }, 100);
}

// === INTERCEPT WebSocket SEND ===
function interceptWebSocket() {
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function (url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);
        const originalSend = ws.send;
        ws.send = function (data) {
            if (isPaused && isMouseMovementPacket(data)) return;
            return originalSend.apply(this, arguments);
        };
        return ws;
    };
    window.WebSocket.prototype = OriginalWebSocket.prototype;
    window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
    window.WebSocket.OPEN = OriginalWebSocket.OPEN;
    window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
    window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
    console.log('✅ WebSocket interception complete');
}

// === MOUSE PACKET DETECTION ===
function isMouseMovementPacket(data) {
    if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
        const view = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
        if (view[0] === 16 && (view.length === 13 || view.length === 9 || view.length === 21)) return true;
    }
    return false;
}

// === LOCK TARGET ===
function updateLockPosition() {
    const canvas = document.querySelector("canvas");
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        lockPosition.x = rect.left + rect.width / 2;
        lockPosition.y = rect.top + rect.height / 2;
    } else {
        lockPosition.x = window.innerWidth / 2;
        lockPosition.y = window.innerHeight / 2;
    }
}

function startCursorLock() {
    if (lockInterval) clearInterval(lockInterval);
    if (window.core?.setTarget) window.core.setTarget(lockPosition.x, lockPosition.y);
    lockInterval = setInterval(() => {
        if (isPaused && window.core?.setTarget) window.core.setTarget(lockPosition.x, lockPosition.y);
    }, 5);
}

// === PAUSE BANNER ===
function showPauseBanner() {
    let banner = document.getElementById('pause-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'pause-banner';
        banner.textContent = 'PAUSED';
        Object.assign(banner.style, {
            position: 'fixed',
            top: '10%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '30px',
            fontWeight: 'bold',
            color: 'red',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: '20px 40px',
            borderRadius: '15px',
            zIndex: '9999',
            fontFamily: 'Arial, sans-serif',
            textShadow: '2px 2px 5px black',
            pointerEvents: 'none',
        });
        document.body.appendChild(banner);
    }
}

function hidePauseBanner() {
    const banner = document.getElementById('pause-banner');
    if (banner) banner.remove();
}

// === FIND GAME CANVAS ===
function findGameCanvas() {
    const canvases = document.getElementsByTagName("canvas");
    for (let canvas of canvases) {
        if (canvas.width > 500 && canvas.height > 500) {
            gameCanvas = canvas;
            return;
        }
    }
    setTimeout(findGameCanvas, 2000);
}

// === DANCE EMULATION ===
function emulateDance() {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = 100;
    const speed = 0.07;
    let angle = 0;
    let isEmulating = true;

    function animate() {
        if (!isEmulating) return;
        angle += speed;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const mEv1 = new MouseEvent("mousemove", { clientX: x, clientY: y });
        canvas.dispatchEvent(mEv1);
        requestAnimationFrame(animate);
    }

    animate();
    function stop() {
        isEmulating = false;
        window.removeEventListener("mousemove", stop);
    }
    window.addEventListener("mousemove", stop);
}

// === MACRO HANDLERS ===
function keydown(event) {
    const key = event.key.toUpperCase();
    if (!keyCodeMap[key]) return;
    keysDown[key] = true;

    const ejectKeyCode = keyCodeMap[customKeybinds.ejectM];
    const doubleSplitKeyCode = keyCodeMap[customKeybinds.splitDouble];
    const splitX16KeyCode = keyCodeMap[customKeybinds.splitX16];
    const stopMovementKeyCode = keyCodeMap[customKeybinds.stopMovement];
    const danceKeyCode = keyCodeMap[customKeybinds.dance];
    const mini1KeyCode = keyCodeMap[customKeybinds.mini1];


    if (keyCodeMap[key] === ejectKeyCode) {
        eject();
    } else if (keyCodeMap[key] === doubleSplitKeyCode) {
        split();
        setTimeout(split, speed);
    } else if (keyCodeMap[key] === splitX16KeyCode) {
        for (let i = 1; i <= 4; i++) setTimeout(split, speed * i);
    } else if (keyCodeMap[key] === stopMovementKeyCode) {
        togglePause();
    } else if (keyCodeMap[key] === danceKeyCode) {
        emulateDance();
    } else if (keyCodeMap[key] === mini1KeyCode) {
        if (typeof core !== "undefined" && core.setMinimap && core.playersMinimap) {
            miniact = !miniact;
            core.setMinimap(miniact ? 1 : 0);
            core.playersMinimap(miniact ? 1 : 0);
            console.log(`Minimap ${miniact ? "ON" : "OFF"}`);
        }
    }
}

function keyup(event) {
    const key = event.key.toUpperCase();
    if (!keyCodeMap[key]) return;
    keysDown[key] = false;
}

function eject() {
    if (keysDown[customKeybinds.ejectM]) {
        triggerKeyEvent(87);
        setTimeout(eject, speed);
    }
}

function split() {
    triggerKeyEvent(32); // Space
}

function triggerKeyEvent(keyCode) {
    $("body").trigger($.Event("keydown", { keyCode }));
    $("body").trigger($.Event("keyup", { keyCode }));
}


//BTN KEYBINDS Y XTRAS

function createSettingsButton() {
  const btnWidth = "120px";
  const btnHeight = "40px";

  // Botón Keybinds
  const settingsBtn = document.createElement("button");
  settingsBtn.innerText = "⚙ KEYBINDS";
  settingsBtn.id = "macro-settings-btn";
  Object.assign(settingsBtn.style, {
    position: "fixed",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    background: "#2a61d7",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    zIndex: 9999,
    fontSize: "14px",
    width: btnWidth,
    height: btnHeight,
    boxSizing: "border-box",
  });
  document.body.appendChild(settingsBtn);

  // Overlay único
  let overlay = document.getElementById("macro-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "macro-overlay";
    Object.assign(overlay.style, {
      display: "none",
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.6)",
      zIndex: 9998,
    });
    document.body.appendChild(overlay);
  }

  // Panel Keybinds
  const settingsPanel = document.createElement("div");
  settingsPanel.id = "macro-settings-panel";
  Object.assign(settingsPanel.style, {
    display: "none",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#EBF2FA",
    padding: "15px 25px 25px 25px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.4)",
    zIndex: 9999,
    minWidth: "320px",
    maxWidth: "90vw",
    maxHeight: "80vh",
    overflowY: "auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#222",
    userSelect: "none",
  });

  const header = document.createElement("div");
  header.style.cssText = "text-align: center; margin-bottom: 20px;";

  const title = document.createElement("h2");
  title.textContent = "Keybinds";
  Object.assign(title.style, {
    margin: "0",
    fontSize: "22px",
    fontWeight: "bold",
    color: "#2a61d7",
    userSelect: "none",
  });

  const closeBtnSettings = document.createElement("button");
  closeBtnSettings.textContent = "✕";
  Object.assign(closeBtnSettings.style, {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#444",
    userSelect: "none",
    padding: "0",
    lineHeight: "1",
    zIndex: 10000,
  });
  closeBtnSettings.title = "Close settings";

  closeBtnSettings.addEventListener("mouseenter", () => (closeBtnSettings.style.color = "#2a61d7"));
  closeBtnSettings.addEventListener("mouseleave", () => (closeBtnSettings.style.color = "#444"));
  closeBtnSettings.addEventListener("click", () => toggleSettingsPanel(false));

  header.appendChild(title);
  settingsPanel.appendChild(closeBtnSettings);
  settingsPanel.appendChild(header);
  // Aquí agregamos tu formulario/keybindForm
  if (typeof keybindForm !== "undefined") {
    settingsPanel.appendChild(keybindForm);
  }
  document.body.appendChild(settingsPanel);

  // --- XTRAS ---
  const xtrasBtn = document.createElement("button");
  xtrasBtn.innerText = "+ XTRAS";
  xtrasBtn.id = "macro-xtras-btn";
  Object.assign(xtrasBtn.style, {
    position: "fixed",
    top: "calc(50% + 50px)", // 50px abajo de keybinds
    right: "10px",
    transform: "translateY(-50%)",
    background: "#3bb34a",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    zIndex: 9999,
    fontSize: "14px",
    width: btnWidth,
    height: btnHeight,
    boxSizing: "border-box",
  });
  document.body.appendChild(xtrasBtn);

  const xtrasPanel = document.createElement("div");
  xtrasPanel.id = "macro-xtras-panel";
  Object.assign(xtrasPanel.style, {
    display: "none",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#f0fff0",
    padding: "15px 25px 25px 25px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.4)",
    zIndex: 9999,
    minWidth: "320px",
    maxWidth: "90vw",
    maxHeight: "80vh",
    overflowY: "auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#222",
    userSelect: "none",
  });

  const headerXtras = document.createElement("div");
  headerXtras.style.cssText = "text-align: center; margin-bottom: 20px;";

  const titleXtras = document.createElement("h2");
  titleXtras.textContent = "XTRAS";
  Object.assign(titleXtras.style, {
    margin: "0",
    fontSize: "22px",
    fontWeight: "bold",
    color: "#3bb34a",
    userSelect: "none",
  });

  const closeBtnXtras = document.createElement("button");
  closeBtnXtras.textContent = "✕";
  Object.assign(closeBtnXtras.style, {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#444",
    userSelect: "none",
    padding: "0",
    lineHeight: "1",
    zIndex: 10000,
  });
  closeBtnXtras.title = "Close XTRAS";

  closeBtnXtras.addEventListener("mouseenter", () => (closeBtnXtras.style.color = "#3bb34a"));
  closeBtnXtras.addEventListener("mouseleave", () => (closeBtnXtras.style.color = "#444"));
  closeBtnXtras.addEventListener("click", () => toggleXtrasPanel(false));

  headerXtras.appendChild(titleXtras);
  xtrasPanel.appendChild(closeBtnXtras);
  xtrasPanel.appendChild(headerXtras);

  // Contenedor toggles
  const togglesContainer = document.createElement("div");
  xtrasPanel.appendChild(togglesContainer);

  document.body.appendChild(xtrasPanel);

  // --- Función para crear toggle con lógica y estilo ---
  function createToggle({ id, labelText, localStorageKey, onToggle }) {
    const outerContainer = document.createElement("div");
    Object.assign(outerContainer.style, {
      marginBottom: "12px",
      width: "100%",
      display: "flex",
      justifyContent: "center",
    });

    const innerContainer = document.createElement("div");
    Object.assign(innerContainer.style, {
      display: "flex",
      width: "220px",
      justifyContent: "space-between",
      alignItems: "center",
    });

    const label = document.createElement("span");
    label.innerText = labelText;
    Object.assign(label.style, {
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      color: "#3bb34a",
      fontSize: "15px",
      fontWeight: "600",
      userSelect: "none",
    });

    const toggleSwitch = document.createElement("div");
    toggleSwitch.id = id;
    Object.assign(toggleSwitch.style, {
      width: "50px",
      height: "25px",
      backgroundColor: "#ccc",
      borderRadius: "15px",
      cursor: "pointer",
      position: "relative",
      boxShadow: "inset 0 0 5px rgba(0,0,0,0.15)",
      transition: "background-color 0.3s ease",
    });

    const toggleIndicator = document.createElement("div");
    Object.assign(toggleIndicator.style, {
      width: "21px",
      height: "21px",
      backgroundColor: "white",
      borderRadius: "50%",
      position: "absolute",
      top: "2px",
      left: "2px",
      transition: "left 0.2s ease",
      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
    });

    innerContainer.appendChild(label);
    innerContainer.appendChild(toggleSwitch);
    toggleSwitch.appendChild(toggleIndicator);
    outerContainer.appendChild(innerContainer);
    togglesContainer.appendChild(outerContainer);

    // Estado inicial toggle
    let isOn = false;
    if (localStorageKey) {
      isOn = localStorage.getItem(localStorageKey) === "true";
    }
    updateToggleVisual();

    toggleSwitch.addEventListener("click", () => {
      isOn = !isOn;
      if (localStorageKey) {
        localStorage.setItem(localStorageKey, isOn);
      }
      updateToggleVisual();
      if (onToggle) onToggle(isOn);
    });

    function updateToggleVisual() {
      toggleSwitch.style.backgroundColor = isOn ? "#3bb34a" : "#ccc";
      toggleIndicator.style.left = isOn ? "27px" : "2px";
    }

    return () => isOn;
  }

  // --- Lógica toggles ---

  // Auto Respawn lógica
  const originalOnPlayerSpawn = MC.onPlayerSpawn;
  MC.onPlayerSpawn = function (...args) {
    console.info("%c Player respawned!", "background: hsl(145, 40%, 30%); color: #a3db67");
    originalOnPlayerSpawn.apply(this, args);
  };

  const originalOnPlayerDeath = MC.onPlayerDeath;
  MC.onPlayerDeath = function (...args) {
    if (localStorage.getItem("autoRespawnEnabled") !== "true") {
      return originalOnPlayerDeath.apply(this, args);
    }
    console.info("%c Player died, triggering auto respawn...", "background: hsl(0, 50%, 30%); color: #ff6b6b");
    try {
      (0, utils.find_node)(void 0, (child) => child && typeof child.fastEntry !== "undefined")
        .forEach((child) => {
          if (!child.fastEntry) {
            Object.defineProperty(child, "fastEntry", {
              get: () => true,
              set: (x) => x,
            });
          }
        });
    } catch (e) {}
    MC.clickButton("statsContinue");
    MC.closeTopView();
    MC.clickButton("play");
    setTimeout(() => MC.clickButton("play"), 1000);
    return originalOnPlayerDeath.apply(this, args);
  };

  // Auto Collect lógica: monedas y pociones
  setInterval(() => {
    if (localStorage.getItem("autoCollectEnabled") === "true") {
      recogerMonedas();
      checkPotionSlots();
    }
  }, 2000);

  function recogerMonedas() {
    if (MC.isUserLoggedIn()) {
      const freeCoinsButton = document.querySelector('button#freeCoins[data-v-1791274a]');
      if (freeCoinsButton && !freeCoinsButton.classList.contains('wait')) {
        setTimeout(() => {
          console.log('%c Collecting Free Coins...', 'background: #c7b602');
          window['agarApp'].API.getFreeCoins();
          MC.closeTopView();
        }, 100);
      }
    }
  }

  let currentSlot = 1;
  function checkPotionSlots() {
    if (localStorage.getItem("autoCollectEnabled") !== "true") return;
    if (window['agarApp'].API.isGuest()) return;

    let foundOrange = false;
    for (let slot = 1; slot <= 3; slot++) {
      let slotElement = document.querySelector(getSlotSelector(slot));
      if (slotElement && slotElement.classList.contains("orange")) {
        console.log(`%c Opening potion in slot ${slot}...`, "background: #00d3ff");
        MC.openPotion(slot);
        MC.closeAllViews();
        currentSlot = slot + 1;
        if (currentSlot > 3) currentSlot = 1;
        foundOrange = true;
        break;
      }
    }
    if (!foundOrange) {
      let slotElement = document.querySelector(getSlotSelector(currentSlot));
      if (slotElement && slotElement.classList.contains("blue")) {
        MC.startPotion(currentSlot);
      }
      currentSlot++;
      if (currentSlot > 3) currentSlot = 1;
    }
  }

  function getSlotSelector(slot) {
    switch (slot) {
      case 1: return ".mini.left .potion-slot-shape";
      case 2: return ".mini.middle .potion-slot-shape";
      case 3: return ".mini.right .potion-slot-shape";
      default: return "";
    }
  }

  // Acid Mode toggle (usando core.setAcid)
  function toggleAcidMode(enabled) {
    if (typeof core?.setAcid === "function") {
      core.setAcid(enabled ? 1 : 0);
    }
  }

  // Crear toggles en XTRAS
  createToggle({
    id: "autoRespawnToggle",
    labelText: "Auto Respawn",
    localStorageKey: "autoRespawnEnabled",
    onToggle: (on) => {
      console.log("Auto Respawn toggled:", on);
      localStorage.setItem("autoRespawnEnabled", on);
    },
  });

  createToggle({
    id: "autoCollectToggle",
    labelText: "Auto Collect",
    localStorageKey: "autoCollectEnabled",
    onToggle: (on) => {
      console.log("Auto Collect toggled:", on);
      localStorage.setItem("autoCollectEnabled", on);
    },
  });

  createToggle({
    id: "acidModeToggle",
    labelText: "Acid Mode",
    localStorageKey: "acidModeEnabled",
    onToggle: (on) => {
      console.log("Acid Mode toggled:", on);
      localStorage.setItem("acidModeEnabled", on);
      toggleAcidMode(on);
    },
  });

  // --- Funciones toggle paneles ---
  function toggleSettingsPanel(show) {
    if (show) {
      settingsPanel.style.display = "block";
      xtrasPanel.style.display = "none";
      overlay.style.display = "block";
    } else {
      settingsPanel.style.display = "none";
      overlay.style.display = "none";
    }
  }

  function toggleXtrasPanel(show) {
    if (show) {
      xtrasPanel.style.display = "block";
      settingsPanel.style.display = "none";
      overlay.style.display = "block";
    } else {
      xtrasPanel.style.display = "none";
      overlay.style.display = "none";
    }
  }

  // --- Eventos botones ---
  settingsBtn.addEventListener("click", () => {
    const visible = settingsPanel.style.display === "block";
    toggleSettingsPanel(!visible);
  });

  xtrasBtn.addEventListener("click", () => {
    const visible = xtrasPanel.style.display === "block";
    toggleXtrasPanel(!visible);
  });

  // Cerrar al click en overlay
  overlay.addEventListener("click", () => {
    toggleSettingsPanel(false);
    toggleXtrasPanel(false);
  });
}

// Ejecutar después que cargue el DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createSettingsButton);
} else {
  createSettingsButton();
}


})();
