// ==UserScript==
// @name         Agar.io image to custom skin (Color Fix)
// @namespace    http://tampermonkey.net/
// @version      0.7.1
// @description  Upload image as custom skin without affecting color choices
// @author       Modificado por ChatGPT 🧠
// @match        agar.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539707/Agario%20image%20to%20custom%20skin%20%28Color%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539707/Agario%20image%20to%20custom%20skin%20%28Color%20Fix%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function createButton() {
    const button = document.createElement("input");
    button.type = "file";
    button.accept = "image/*";
    button.id = "customImageUpload";
    button.style.marginTop = "5px";
    button.style.cursor = "pointer";
    return button;
  }

  function insertButton(button) {
    const interval = setInterval(() => {
      const target = document.querySelector(".color-options");
      if (target && !document.getElementById("customImageUpload")) {
        const div = document.createElement("div");
        div.appendChild(button);
        target.appendChild(div);
        clearInterval(interval);
      }
    }, 1000);
  }

  function convertImageToBase64(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = function () {
      const base64 = reader.result;
      drawImage(base64);
    };
    reader.readAsDataURL(file);
  }

  function drawImage(base64) {
    const canvas = document.querySelector("#skinEditorCanvas");
    const ctx = canvas?.getContext("2d");
    const img = new Image();
    img.onload = () => {
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.beginPath();
        ctx.arc(128, 128, 128, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 0, 0, 256, 256);
        ctx.restore();
      }
    };
    img.src = base64;
  }

  const button = createButton();
  button.addEventListener("change", convertImageToBase64);
  insertButton(button);
})();
