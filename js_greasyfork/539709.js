// ==UserScript==
// @name         Agar.io image to custom skin (color fix)
// @namespace    http://tampermonkey.net/
// @version      0.7.3
// @description  Upload image for custom skin without affecting color
// @author       New Jack 🕹️ + Mod by ChatGPT
// @match        agar.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539709/Agario%20image%20to%20custom%20skin%20%28color%20fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539709/Agario%20image%20to%20custom%20skin%20%28color%20fix%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Crear input de tipo archivo
  function createButton() {
    const button = document.createElement("input");
    button.type = "file";
    button.accept = "image/*";
    button.id = "customImageUpload";
    return button;
  }

  // Insertar el botón en el contenedor correcto
  function insertButton(button, target) {
    if (target) {
      const newDiv = document.createElement("div");
      newDiv.style.marginTop = "5px";
      newDiv.appendChild(button);
      const clearArea = target.querySelector(".clear");
      if (clearArea) clearArea.appendChild(newDiv);
    }
  }

  // Convertir imagen a base64 y dibujarla
  function convertImageToBase64(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
      const base64 = reader.result;
      drawImage(base64);
    };

    reader.readAsDataURL(file);
  }

  // Dibuja imagen en el canvas sin alterar el color elegido
  function drawImage(base64) {
    const canvas = document.getElementById("skin-editor-canvas");
    const context = canvas.getContext("2d");
    const image = new Image();

    image.onload = function () {
      canvas.width = 512;
      canvas.height = 512;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();

      // Clipping circular como en el juego
      context.beginPath();
      context.arc(256, 256, 256, 0, Math.PI * 2);
      context.clip();

      context.drawImage(image, 0, 0, 512, 512);
      context.restore();
    };

    image.src = base64;
  }

  // Buscar el panel de la izquierda para meter el botón
  function checkForTarget() {
    const target = document.querySelector(".left-tools");

    if (target) {
      const button = createButton();
      insertButton(button, target);
      button.addEventListener("change", convertImageToBase64);
      clearInterval(checkInterval);
    }
  }

  // Revisar cada segundo si ya cargó el panel
  const checkInterval = setInterval(checkForTarget, 1000);
})();
