// ==UserScript==
// @name         Editor de Skins Agar.io (Tipo App en Web)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Elegir imagen, recortar, agregar borde, renombrar y guardar como PNG transparente tipo app para skins de Agar.io
// @author       ChatGPT
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539683/Editor%20de%20Skins%20Agario%20%28Tipo%20App%20en%20Web%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539683/Editor%20de%20Skins%20Agario%20%28Tipo%20App%20en%20Web%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Crear interfaz como app
  function createEditorUI() {
    const panel = document.createElement("div");
    panel.id = "skinAppPanel";
    panel.style.position = "fixed";
    panel.style.top = "20px";
    panel.style.right = "20px";
    panel.style.zIndex = "9999";
    panel.style.padding = "15px";
    panel.style.background = "#222";
    panel.style.border = "2px solid #555";
    panel.style.borderRadius = "10px";
    panel.style.color = "#fff";
    panel.innerHTML = `
      <label>Subir imagen:</label><br>
      <input type="file" id="skinImgInput" accept="image/*"><br><br>
      <label>Color borde:</label>
      <input type="color" id="borderColorPicker" value="#000000"><br><br>
      <label>Nombre del archivo:</label>
      <input type="text" id="filenameInput" value="skin"><br><br>
      <button id="generateSkinBtn">Generar & Descargar</button>
    `;
    document.body.appendChild(panel);
  }

  // Dibujar imagen circular con borde
  function processImage(file, borderColor, filename) {
    const reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      img.onload = function () {
        const size = 512;
        const border = 24;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d");

        // Dibujar borde
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = borderColor;
        ctx.fill();
        ctx.closePath();

        // Recorte circular y dibujar imagen
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - border, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 0, 0, size, size);
        ctx.restore();

        // Descargar imagen como PNG
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = filename + ".png";
        link.click();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  // Escuchar evento click en "Generar & Descargar"
  function setupEventListeners() {
    document.getElementById("generateSkinBtn").addEventListener("click", () => {
      const file = document.getElementById("skinImgInput").files[0];
      const borderColor = document.getElementById("borderColorPicker").value;
      const filename = document.getElementById("filenameInput").value.trim() || "skin";

      if (!file) {
        alert("Selecciona una imagen.");
        return;
      }

      processImage(file, borderColor, filename);
    });
  }

  // Ejecutar al cargar
  setTimeout(() => {
    createEditorUI();
    setupEventListeners();
  }, 2000);
})();
