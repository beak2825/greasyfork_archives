// ==UserScript==
// @name         Agar.io image to custom skin + border colors
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Upload image for custom skin with selectable border (white for color 1, black for color 2)
// @author       New Jack 🕹️ + mod by ChatGPT
// @match        agar.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537681/Agario%20image%20to%20custom%20skin%20%2B%20border%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/537681/Agario%20image%20to%20custom%20skin%20%2B%20border%20colors.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let selectedColorIndex = 0;

  function createButton() {
    const button = document.createElement("input");
    button.type = "file";
    button.accept = "image/*";
    button.id = "customImageUpload";
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

      // Limpieza del fondo
      context.clearRect(0, 0, 512, 512);

      // Dibujo del borde si corresponde
      if (selectedColorIndex === 1 || selectedColorIndex === 2) {
        const borderColor = selectedColorIndex === 1 ? "white" : "black";
        context.beginPath();
        context.arc(256, 256, 248, 0, 2 * Math.PI); // R = 248 para que se vea un borde alrededor
        context.fillStyle = borderColor;
        context.fill();
      }

      // Recorte circular y dibujo de la imagen
      context.save();
      context.beginPath();
      context.arc(256, 256, 240, 0, 2 * Math.PI); // R = 240 para dejar espacio al borde
      context.clip();
      context.drawImage(image, 0, 0, 512, 512);
      context.restore();
    };
    image.src = base64;
  }

  function hookColorButtons() {
    const buttons = document.querySelectorAll(".color-option button");
    buttons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        selectedColorIndex = index + 1;
      });
    });
  }

  function checkForTarget() {
    const target = document.querySelector(".left-tools");
    const canvas = document.getElementById("skin-editor-canvas");
    if (target && canvas) {
      const button = createButton();
      insertButton(button, target);
      button.addEventListener("change", convertImageToBase64);
      hookColorButtons();
      clearInterval(checkInterval);
    }
  }

  const checkInterval = setInterval(checkForTarget, 1000);
})();
