// ==UserScript==
// @name         Agar.io - Skin personalizada con borde real (negro, blanco y más)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Permite subir imagen como skin personalizada con borde visible según el color (incluye blanco y negro)
// @author        Usuario
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539461/Agario%20-%20Skin%20personalizada%20con%20borde%20real%20%28negro%2C%20blanco%20y%20m%C3%A1s%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539461/Agario%20-%20Skin%20personalizada%20con%20borde%20real%20%28negro%2C%20blanco%20y%20m%C3%A1s%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const intervalo = setInterval(() => {
    const menu = document.querySelector('.skin-editor');
    if (!menu) return;

    clearInterval(intervalo);

    const btnContainer = document.createElement('div');
    btnContainer.style.marginTop = '10px';
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'center';
    btnContainer.style.gap = '10px';

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    const subirBtn = document.createElement('button');
    subirBtn.textContent = 'Subir imagen';
    subirBtn.style.padding = '5px 10px';
    subirBtn.style.borderRadius = '6px';
    subirBtn.style.border = '1px solid #ccc';
    subirBtn.style.cursor = 'pointer';
    subirBtn.style.background = '#f4f4f4';

    subirBtn.onclick = () => input.click();

    input.addEventListener('change', async () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const size = 512;
          const borderSize = 25;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          // Obtener el color del borde seleccionado
          const selectedColor = getComputedStyle(document.querySelector('.skin-editor .color-option.selected')).backgroundColor;

          // Dibujar fondo transparente
          ctx.clearRect(0, 0, size, size);

          // Dibujar borde
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
          ctx.fillStyle = selectedColor;
          ctx.fill();

          // Dibujar imagen en el centro
          ctx.save();
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2 - borderSize, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(img, borderSize, borderSize, size - borderSize * 2, size - borderSize * 2);
          ctx.restore();

          // Mostrar skin en el preview circular
          const preview = document.querySelector('.skin-editor .skin-preview > img');
          if (preview) preview.src = canvas.toDataURL();

          // Guardar en localStorage por si se desea persistir
          localStorage.setItem('agarCustomSkin', canvas.toDataURL());
        };
      };

      reader.readAsDataURL(file);
    });

    btnContainer.appendChild(subirBtn);
    menu.appendChild(btnContainer);
    menu.appendChild(input);
  }, 1000);
})();
