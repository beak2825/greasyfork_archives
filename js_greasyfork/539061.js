// ==UserScript==
// @name         Voxiom.io Chams/Wallhacks Emulation (2025) **WORKING**
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  See players through walls with adjustable opacity and wireframe toggle, draggable UI
// @author       Emulation
// @match        *://*/*
// @grant        none
// @license      Emulation
// @downloadURL https://update.greasyfork.org/scripts/539061/Voxiomio%20ChamsWallhacks%20Emulation%20%282025%29%20%2A%2AWORKING%2A%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/539061/Voxiomio%20ChamsWallhacks%20Emulation%20%282025%29%20%2A%2AWORKING%2A%2A.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const prototype_ = {
    player: {
      opacity: 0.6,
      wireframe: false,
      seeThroughWalls: true
    }
  };

  const playerMaterials = new Set();

  const originalPush = Array.prototype.push;
  Array.prototype.push = function (...args) {
    for (const obj of args) {
      const mat = obj?.material;
      if (!mat) continue;

      if (mat.type === "MeshBasicMaterial") {
        mat.opacity = prototype_.player.opacity;
        mat.wireframe = prototype_.player.wireframe;
        mat.transparent = true;
        mat.side = 2; // DoubleSide

        if (prototype_.player.seeThroughWalls) {
          mat.depthTest = false;
          mat.depthFunc = 7; // Always
        } else {
          mat.depthTest = true;
          mat.depthFunc = 3; // LEQUAL
        }

        playerMaterials.add(mat);
      }
    }
    return originalPush.apply(this, args);
  };

  function applyChamsSettings() {
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
    });
  }

  // Menu UI
  const style = document.createElement("style");
  style.innerHTML = `
    #menu {
      position: fixed;
      top: 100px;
      left: 100px;
      background: rgba(20,20,20,0.9);
      padding: 15px;
      border: 2px solid #00f0ff;
      color: white;
      font-family: sans-serif;
      border-radius: 10px;
      z-index: 9999;
      user-select: none;
      box-shadow: 0 0 15px #00f0ff;
      width: 220px;
    }
    #menu h1 {
      font-size: 18px;
      margin: 0 0 10px 0;
      text-align: center;
      background: linear-gradient(to right, red, yellow, lime, cyan, magenta);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: rainbow 5s linear infinite;
      cursor: grab;
      user-select: none;
    }
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
    #menu label {
      display: block;
      margin: 5px 0;
      font-size: 14px;
    }
    #menu input[type="range"] {
      width: 100%;
    }
  `;
  document.head.appendChild(style);

  const menu = document.createElement("div");
  menu.id = "menu";
  menu.innerHTML = `
    <h1>EMULATION'S CHAMS</h1>
    <label>
      <input type="checkbox" id="toggleSeeThrough" ${prototype_.player.seeThroughWalls ? "checked" : ""}>
      See Through Walls
    </label>
    <label>
      <input type="checkbox" id="toggleWireframe" ${prototype_.player.wireframe ? "checked" : ""}>
      Wireframe
    </label>
    <label>
      Opacity:
      <input type="range" id="opacitySlider" min="0" max="1" step="0.1" value="${prototype_.player.opacity}">
    </label>
  `;
  document.body.appendChild(menu);

  document.getElementById("toggleSeeThrough").onchange = e => {
    prototype_.player.seeThroughWalls = e.target.checked;
    applyChamsSettings();
  };
  document.getElementById("toggleWireframe").onchange = e => {
    prototype_.player.wireframe = e.target.checked;
    applyChamsSettings();
  };
  document.getElementById("opacitySlider").oninput = e => {
    prototype_.player.opacity = parseFloat(e.target.value);
    applyChamsSettings();
  };

  // Draggable Menu by dragging the header text
  const header = menu.querySelector("h1");
  let dragging = false, offsetX = 0, offsetY = 0;

  header.style.cursor = "grab";

  header.addEventListener("mousedown", e => {
    dragging = true;
    offsetX = e.clientX - menu.offsetLeft;
    offsetY = e.clientY - menu.offsetTop;
    header.style.cursor = "grabbing";
  });
  window.addEventListener("mouseup", () => {
    dragging = false;
    header.style.cursor = "grab";
  });
  window.addEventListener("mousemove", e => {
    if (dragging) {
      menu.style.left = `${e.clientX - offsetX}px`;
      menu.style.top = `${e.clientY - offsetY}px`;
    }
  });

  console.log("[EMULATION] Chams loaded. Players should now be visible through walls.");
})();
