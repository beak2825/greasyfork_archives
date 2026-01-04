// ==UserScript==
// @name         Skin personalizada con borde blanco/negro
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Subir skin con borde negro o blanco según el color seleccionado
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539472/Skin%20personalizada%20con%20borde%20blanconegro.user.js
// @updateURL https://update.greasyfork.org/scripts/539472/Skin%20personalizada%20con%20borde%20blanconegro.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Crear input para subir imagen
  function createButton() {
    const button = document.createElement("input");
    button.type = "file";
    button.accept = "image/*";
    button.id = "customImageUpload";
    button.addEventListener("change", convertImageToBase64);
    return button;
  }

  // Insertar el botón debajo del área de limpieza en el creador de skins
  function insertButton(button, target) {
    if (target) {
      const newDiv = document.createElement("div");
      newDiv.style.marginTop = "5px";
      newDiv.appendChild(button);
      target.querySelector(".clear")?.appendChild(newDiv);
    }
  }

  // Convertir imagen a base64
  function convertImageToBase64(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
      const base64 = reader.result;
      drawImage(base64);
    };

    reader.readAsDataURL(file);
  }

  // Detectar color visual seleccionado
  function getSelectedColor() {
    const selected = document.querySelector(".color-option .circle.selected");
    if (!selected) return null;
    return window.getComputedStyle(selected).backgroundColor;
  }

  // Dibujar imagen en canvas con borde si es blanco o negro
  function drawImage(base64) {
    const canvas = document.getElementById("skin-editor-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const image = new Image();

    image.onload = function () {
      const size = 512;
      const borderWidth = 24;
      canvas.width = size;
      canvas.height = size;

      const color = getSelectedColor();
      const colorHex = rgbToHex(color);

      ctx.clearRect(0, 0, size, size);

      // Si es blanco o negro, dibujar borde
      if (colorHex === "#ffffff" || colorHex === "#000000") {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = colorHex;
        ctx.fill();
      }

      // Dibujar la imagen circular
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - borderWidth, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(image, 0, 0, size, size);
      ctx.restore();
    };

    image.src = base64;
  }

  // Convertir RGB a HEX
  function rgbToHex(rgb) {
    if (!rgb) return "";
    const result = rgb.match(/\d+/g);
    if (!result || result.length < 3) return "";
    return (
      "#" +
      [0, 1, 2]
        .map((i) => {
          const hex = parseInt(result[i]).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  // Esperar a que cargue el creador de skin
  function waitForTarget() {
    const interval = setInterval(() => {
      const target = document.querySelector(".left-tools");
      if (target && target.querySelector(".clear") && !document.getElementById("customImageUpload")) {
        const button = createButton();
        insertButton(button, target);
        clearInterval(interval);
      }
    }, 1000);
  }

  waitForTarget();
})();
