// ==UserScript==
// @name         Sistema de Skin Personalizado con Borde Real (Negro, Blanco, etc.)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Subir imagen como skin con borde de cualquier color (incluye negro y blanco) sin depender del sistema de Agar.io
// @author       José
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539460/Sistema%20de%20Skin%20Personalizado%20con%20Borde%20Real%20%28Negro%2C%20Blanco%2C%20etc%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539460/Sistema%20de%20Skin%20Personalizado%20con%20Borde%20Real%20%28Negro%2C%20Blanco%2C%20etc%29.meta.js
// ==/UserScript==

(function () {
  const style = document.createElement("style");
  style.innerHTML = `
    #customSkinPanel {
      position: fixed;
      top: 80px;
      right: 20px;
      background: #222;
      color: white;
      padding: 12px;
      border-radius: 10px;
      z-index: 9999;
      font-family: Arial;
    }
    #customSkinPanel input[type="color"],
    #customSkinPanel input[type="file"],
    #customSkinPanel button {
      margin-top: 6px;
      display: block;
    }
    #customSkinCanvas {
      display: block;
      margin-top: 10px;
      background: transparent;
    }
  `;
  document.head.appendChild(style);

  const panel = document.createElement("div");
  panel.id = "customSkinPanel";
  panel.innerHTML = `
    <b>🎨 Skin personalizada</b><br>
    <input type="file" id="uploadSkinImg" accept="image/*">
    <label>Color del borde:</label>
    <input type="color" id="borderColorPicker" value="#ffffff">
    <button id="downloadSkin">📥 Descargar PNG</button>
    <canvas id="customSkinCanvas" width="512" height="512"></canvas>
  `;
  document.body.appendChild(panel);

  const uploadInput = document.getElementById("uploadSkinImg");
  const borderColorPicker = document.getElementById("borderColorPicker");
  const canvas = document.getElementById("customSkinCanvas");
  const ctx = canvas.getContext("2d");

  uploadInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => drawSkin(reader.result);
    reader.readAsDataURL(file);
  });

  borderColorPicker.addEventListener("input", () => {
    if (lastImg) drawSkin(lastImg);
  });

  document.getElementById("downloadSkin").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "skin_con_borde.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  let lastImg = null;

  function drawSkin(imgBase64) {
    lastImg = imgBase64;
    const borderColor = borderColorPicker.value;
    const size = 512;
    const borderWidth = 24;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, size, size);

      // Círculo del borde
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = borderColor;
      ctx.fill();

      // Imagen recortada dentro del borde
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - borderWidth, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0, size, size);
      ctx.restore();
    };
    img.src = imgBase64;
  }
})();
