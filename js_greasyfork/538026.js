// ==UserScript==
// @name         Skin Border
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Agrega un borde a la skin
// @author       Tu nombre
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538026/Skin%20Border.user.js
// @updateURL https://update.greasyfork.org/scripts/538026/Skin%20Border.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const skinImage = document.querySelector('img.skinWrapper');
  if (skinImage) {
    const borderColorInput = document.createElement('input');
    borderColorInput.type = 'color';
    borderColorInput.value = '#000000';
    borderColorInput.style.position = 'fixed';
    borderColorInput.style.top = '10px';
    borderColorInput.style.left = '10px';

    const borderWidthInput = document.createElement('input');
    borderWidthInput.type = 'number';
    borderWidthInput.value = '2';
    borderWidthInput.style.position = 'fixed';
    borderWidthInput.style.top = '40px';
    borderWidthInput.style.left = '10px';

    const applyBorderButton = document.createElement('button');
    applyBorderButton.textContent = 'Aplicar borde';
    applyBorderButton.style.position = 'fixed';
    applyBorderButton.style.top = '70px';
    applyBorderButton.style.left = '10px';

    document.body.appendChild(borderColorInput);
    document.body.appendChild(borderWidthInput);
    document.body.appendChild(applyBorderButton);

    applyBorderButton.addEventListener('click', () => {
      const borderColor = borderColorInput.value;
      const borderWidth = borderWidthInput.value + 'px';
      skinImage.style.border = `${borderWidth} solid ${borderColor}`;
    });
  }
})();
(function() {
  'use strict';
  const skinImage = document.createElement('img');
  skinImage.style.width = '200px';
  skinImage.style.height = '200px';
  skinImage.style.border = 'none';

  const imageInput = document.createElement('input');
  imageInput.type = 'file';
  imageInput.style.position = 'fixed';
  imageInput.style.top = '10px';
  imageInput.style.left = '10px';

  const borderColorInput = document.createElement('input');
  borderColorInput.type = 'color';
  borderColorInput.value = '#000000';
  borderColorInput.style.position = 'fixed';
  borderColorInput.style.top = '40px';
  borderColorInput.style.left = '10px';

  const borderWidthInput = document.createElement('input');
  borderWidthInput.type = 'number';
  borderWidthInput.value = '2';
  borderWidthInput.style.position = 'fixed';
  borderWidthInput.style.top = '70px';
  borderWidthInput.style.left = '10px';

  const applyBorderButton = document.createElement('button');
  applyBorderButton.textContent = 'Aplicar borde';
  applyBorderButton.style.position = 'fixed';
  applyBorderButton.style.top = '100px';
  applyBorderButton.style.left = '10px';

  document.body.appendChild(imageInput);
  document.body.appendChild(skinImage);
  document.body.appendChild(borderColorInput);
  document.body.appendChild(borderWidthInput);
  document.body.appendChild(applyBorderButton);

  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      skinImage.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  applyBorderButton.addEventListener('click', () => {
    const borderColor = borderColorInput.value;
    const borderWidth = borderWidthInput.value + 'px';
    skinImage.style.border = `${borderWidth} solid ${borderColor}`;
  });
})();