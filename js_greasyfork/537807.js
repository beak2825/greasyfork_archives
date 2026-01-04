// ==UserScript==
// @name         Agar.io image to custom skin + system border colors (white and black support)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Upload image and set skin with simulated white/black border using system border (color 1 = white, color 2 = black)
// @author       jose (modificado por jose)
// @match        agar.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537807/Agario%20image%20to%20custom%20skin%20%2B%20system%20border%20colors%20%28white%20and%20black%20support%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537807/Agario%20image%20to%20custom%20skin%20%2B%20system%20border%20colors%20%28white%20and%20black%20support%29.meta.js
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
      context.clearRect(0, 0, 512, 512);

      // Aplica un borde falso (visual, no parte de la imagen) según el color seleccionado
      if (selectedColorIndex === 1 || selectedColorIndex === 2) {
        const borderColor = selectedColorIndex === 1 ? "white" : "black";
        const outerCircle = document.createElement("div");
        outerCircle.style.position = "absolute";
        outerCircle.style.top = canvas.offsetTop + 'px';
        outerCircle.style.left = canvas.offsetLeft + 'px';
        outerCircle.style.width = '512px';
        outerCircle.style.height = '512px';
        outerCircle.style.border = `12px solid ${borderColor}`;
        outerCircle.style.borderRadius = '50%';
        outerCircle.style.pointerEvents = 'none';
        outerCircle.id = "customSkinBorderOverlay";

        removeOldOverlay();
        canvas.parentElement.appendChild(outerCircle);
      } else {
        removeOldOverlay();
      }

      // Dibujo circular de la imagen
      context.save();
      context.beginPath();
      context.arc(256, 256, 256, 0, 2 * Math.PI);
      context.clip();
      context.drawImage(image, 0, 0, 512, 512);
      context.restore();
    };
    image.src = base64;
  }

  function removeOldOverlay() {
    const old = document.getElementById("customSkinBorderOverlay");
    if (old) old.remove();
  }

  // Detecta cambio de color seleccionado
  document.addEventListener("click", () => {
    const colorButtons = document.querySelectorAll(".color-option button");
    colorButtons.forEach((btn, index) => {
      if (btn.classList.contains("selected")) {
        selectedColorIndex = index + 1; // 1 para blanco, 2 para negro
      }
    });
  });

  // Inserta el botón una vez que carga el editor
  const observer = new MutationObserver(() => {
    const target = document.querySelector(".editor-panel");
    if (target && !document.getElementById("customImageUpload")) {
      const button = createButton();
      insertButton(button, target);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
