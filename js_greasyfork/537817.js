// ==UserScript==
// @name         Agar.io image to custom skin + system border colors
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Upload image and set skin with system border (white for color 1, black for color 2)
// @author       jose (modificado por ChatGPT sin romper botón original)
// @match        agar.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537817/Agario%20image%20to%20custom%20skin%20%2B%20system%20border%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/537817/Agario%20image%20to%20custom%20skin%20%2B%20system%20border%20colors.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let selectedColorIndex = 0;

  function createButton() {
    const button = document.createElement("input");
    button.type = "file";
    button.accept = "image/*";
    button.id = "customImageUpload";
    button.addEventListener("change", convertImageToBase64);
    return button;
  }

  function insertButton(button, target) {
    if (target && !document.getElementById("customImageUpload")) {
      const newDiv = document.createElement("div");
      newDiv.style.marginTop = "5px";
      newDiv.appendChild(button);
      target.querySelector(".clear").appendChild(newDiv);
    }
  }

  function convertImageToBase64(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = function () {
      const base64 = reader.result;
      drawImage(base64);
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

      // Limpia todo el canvas
      context.clearRect(0, 0, 512, 512);

      // Solo recorte circular de la imagen, sin dibujar ningún borde
      context.save();
      context.beginPath();
      context.arc(256, 256, 256, 0, 2 * Math.PI); // círculo completo
      context.clip();
      context.drawImage(image, 0, 0, 512, 512);
      context.restore();
    };
    image.src = base64;
  }

  // Detectar color seleccionado (1 = blanco, 2 = negro)
  const observer = new MutationObserver(() => {
    const colorButtons = document.querySelectorAll(".color-option button");
    colorButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        selectedColorIndex = index + 1;
        setSystemBorderColor(selectedColorIndex);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  function setSystemBorderColor(index) {
    const borderButton = document.querySelector('[data-type="border"]');
    if (borderButton && !borderButton.classList.contains("selected")) {
      borderButton.click(); // Activar borde si no está
    }
    const colorButtons = document.querySelectorAll(".color-option button");
    if (colorButtons[index - 1]) {
      colorButtons[index - 1].click(); // Elegir el color correspondiente
    }
  }

  // Esperar que se cargue la interfaz para insertar el botón
  const interval = setInterval(() => {
    const target = document.querySelector("#settingsContainer");
    if (target && document.querySelector(".clear")) {
      const button = createButton();
      insertButton(button, target);
      clearInterval(interval);
    }
  }, 1000);
})();
