// ==UserScript==
// @name         Subir imagen + Borde real como Bite VIP
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Subir imagen con borde exacto (blanco, negro, rojo, etc.) sin dibujarlo en el canvas
// @author       ChatGPT + Tu código base
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539468/Subir%20imagen%20%2B%20Borde%20real%20como%20Bite%20VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/539468/Subir%20imagen%20%2B%20Borde%20real%20como%20Bite%20VIP.meta.js
// ==/UserScript==

(function () {
  'use strict';

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
      setTimeout(() => applyBorderFromSelection(), 200); // aplicar borde correcto
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
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.beginPath();
      context.arc(256, 256, 256, 0, Math.PI * 2);
      context.closePath();
      context.clip();
      context.drawImage(image, 0, 0, 512, 512);
      context.restore();
    };

    image.src = base64;
  }

  function applyBorderFromSelection() {
    const selectedBorder = document.querySelector('.right-tools .color.selected');
    if (!selectedBorder) return;

    const colorStyle = window.getComputedStyle(selectedBorder).backgroundColor;

    // Simula el sistema de Bite VIP
    const borderPreview = document.querySelector("#skin-editor-canvas");
    if (borderPreview) {
      borderPreview.style.outline = `12px solid ${colorStyle}`;
      borderPreview.style.outlineOffset = "-6px";
      borderPreview.style.borderRadius = "50%";
    }
  }

  function checkForTarget() {
    const target = document.querySelector(".left-tools");

    if (target && !document.getElementById("customImageUpload")) {
      const button = createButton();
      button.addEventListener("change", convertImageToBase64);
      insertButton(button, target);
    }
  }

  setInterval(checkForTarget, 1000);
})();
