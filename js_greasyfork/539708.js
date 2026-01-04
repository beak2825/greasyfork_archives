// ==UserScript==
// @name         Agar.io image to custom skin (Color Fix + Browser Button)
// @namespace    http://tampermonkey.net/
// @version      0.7.2
// @description  Upload image as custom skin keeping correct color and original browser button
// @author       New Jack 🕹️ + ChatGPT Mod
// @match        agar.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539708/Agario%20image%20to%20custom%20skin%20%28Color%20Fix%20%2B%20Browser%20Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539708/Agario%20image%20to%20custom%20skin%20%28Color%20Fix%20%2B%20Browser%20Button%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Crea el input de archivo
  function createButton() {
    const button = document.createElement("input");
    button.type = "file";
    button.accept = "image/*";
    button.id = "customImageUpload";
    button.style.cursor = "pointer";
    button.title = "Browser"; // Este texto aparece al pasar el mouse
    return button;
  }

  // Inserta el botón en el contenedor .clear dentro de .color-options
  function insertButton(button, target) {
    if (target) {
      const newDiv = document.createElement("div");
      newDiv.style.marginTop = "5px";
      newDiv.appendChild(button);
      const clearDiv = target.querySelector(".clear");
      if (clearDiv) {
        clearDiv.appendChild(newDiv);
      }
    }
  }

  // Convierte imagen a base64 y la dibuja en el canvas del editor
  function convertImageToBase64(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = function () {
      const base64 = reader.result;
      drawImage(base64);
    };
    reader.readAsDataURL(file);
  }

  // Dibuja la imagen en el canvas del editor sin afectar color
  function drawImage(base64) {
    const canvas = document.querySelector("#skinEditorCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.beginPath();
      ctx.arc(128, 128, 128, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, 0, 0, 256, 256);
      ctx.restore();
    };
    img.src = base64;
  }

  // Ejecutar cuando cargue el DOM
  const interval = setInterval(() => {
    const target = document.querySelector(".color-options");
    if (target && !document.getElementById("customImageUpload")) {
      const button = createButton();
      button.addEventListener("change", convertImageToBase64);
      insertButton(button, target);
      clearInterval(interval);
    }
  }, 1000);
})();
