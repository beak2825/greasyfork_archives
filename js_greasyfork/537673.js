// ==UserScript==
// @name         Agar.io image to custom skin + border colors
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Upload image for custom skin with selectable border (white for color 1, black for color 2)
// @author       🕹️+ mod by jose
// @match        agar.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537673/Agario%20image%20to%20custom%20skin%20%2B%20border%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/537673/Agario%20image%20to%20custom%20skin%20%2B%20border%20colors.meta.js
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
    if (target) {
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

      // Dibujar borde según color seleccionado
      if (selectedColorIndex === 1) {
        context.fillStyle = "white"; // color 1 → blanco
        context.beginPath();
        context.arc(256, 256, 256, 0, 2 * Math.PI);
        context.fill();
      } else if (selectedColorIndex === 2) {
        context.fillStyle = "black"; // color 2 → negro
        context.beginPath();
        context.arc(256, 256, 256, 0, 2 * Math.PI);
        context.fill();
      } else {
        // Borrar fondo si no se aplica borde
        context.clearRect(0, 0, 512, 512);
      }

      context.save();
      context.beginPath();
      context.arc(256, 256, 256, 0, 2 * Math.PI);
      context.clip();
      context.drawImage(image, 0, 0, 512, 512);
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
