// ==UserScript==
// @name         Teste
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Testes
// @author       You
// @match        *://*/*.jpg*
// @match        *://*/*.jpeg*
// @match        *://*/*.png*
// @match        *://*/*.gif*
// @match        *://*/*.bmp*
// @match        *://*/*.webp*
// @match        *://*/*.avif*
// @match        *://*/*.JPG*
// @match        *://*/*.JPEG*
// @match        *://*/*.PNG*
// @match        *://*/*.GIF*
// @match        *://*/*.BMP*
// @match        *://*/*.WEBP*
// @match        *://*/*.AVIF*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bookwalker.jp
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482691/Teste.user.js
// @updateURL https://update.greasyfork.org/scripts/482691/Teste.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Função para adicionar animação ao criar elementos
    function addAnimation(element, delay) {
        element.style.transition = 'opacity 0.5s ease-in-out';
        element.style.opacity = '1';

        // Aguarda o atraso especificado antes de aplicar a animação
        setTimeout(() => {
            element.style.opacity = '1';
        }, delay);
    }

    // Create a button and append it to the body with an ID
    const button = document.createElement('button');
    button.id = 'downloadButton';
    button.style.bottom = '80px';
    button.style.left = '50px';
    button.style.fontSize = '16px';
    button.style.width = '160px';
    button.style.height = '40px';
    button.style.opacity = '0';
    button.style.position = 'fixed';
    button.textContent = 'Download Image';
    document.body.appendChild(button);

    // Create an input for image number and append it to the body with an ID
    const numberInput = document.createElement('input');
    numberInput.id = 'imageNumberInput';
    numberInput.type = 'number';
    // numberInput.value = '1';
    numberInput.style.bottom = '80px';
    numberInput.style.left = '220px'; // Position next to the button
    numberInput.style.fontSize = '16px';
    numberInput.style.width = '80px';
    numberInput.style.height = '30px';
    numberInput.style.opacity = '0';
    numberInput.step = '1'; // Set the increment/decrement step to 1
    numberInput.style.position = 'fixed';
    document.body.appendChild(numberInput);

    // Create a checkbox for automatic extraction from URL and append it to the body with an ID
    const autoExtractCheckbox = document.createElement('input');
    autoExtractCheckbox.id = 'autoExtractCheckbox';
    autoExtractCheckbox.type = 'checkbox';
    autoExtractCheckbox.style.bottom = '80px';
    autoExtractCheckbox.style.left = '310px'; // Position next to the input
    autoExtractCheckbox.style.fontSize = '16px';
    autoExtractCheckbox.style.position = 'fixed';
    autoExtractCheckbox.checked = false;
    document.body.appendChild(autoExtractCheckbox);

    // Create a label for the checkbox and append it to the body with an ID
    const autoExtractLabel = document.createElement('label');
    autoExtractLabel.id = 'autoExtractLabel';
    autoExtractLabel.textContent = 'Auto Extract from URL';
    autoExtractLabel.style.bottom = '80px';
    autoExtractLabel.style.left = '340px'; // Position next to the checkbox
    autoExtractLabel.style.fontSize = '16px';
    autoExtractLabel.style.position = 'fixed';
    document.body.appendChild(autoExtractLabel);

    // Adiciona animação ao criar os elementos
    addAnimation(button, 5000); // Aguarda 5000 milissegundos (5 segundos) antes de aplicar a animação
    addAnimation(numberInput, 5100); // Aguarda 5100 milissegundos (5.1 segundos) antes de aplicar a animação
    addAnimation(autoExtractCheckbox, 5200); // Aguarda 5200 milissegundos (5.2 segundos) antes de aplicar a animação
    addAnimation(autoExtractLabel, 5300); // Aguarda 5300 milissegundos (5.3 segundos) antes de aplicar a animação

    // Função para iniciar o script
    function downloadImage() {
        let imageNumber;
        let fileExtension;

        if (autoExtractCheckbox.checked) {
            // If auto-extraction is enabled, extract the image number from the URL
            const match = window.location.href.match(/\/(\d+)\.(jpg|jpeg|png|gif|bmp|webp|avif)(\?.*)?$/i);
            if (match) {
                fileExtension = match[2];
                imageNumber = match[1];
            } else {
                alert('Unable to determine file extension from the URL.');
                return;
            }
        } else {
            // Otherwise, use the manually inputted image number
            imageNumber = parseInt(numberInput.value) || 1;

            // Extrai a extensão do link original
            const extensionMatch = window.location.href.match(/\.(jpg|jpeg|png|gif|bmp|webp|avif)(\?.*)?$/i);
            if (extensionMatch) {
                fileExtension = extensionMatch[1];
            } else {
                alert('Unable to determine file extension from the URL.');
                return;
            }
        }

        // Use fetch to get the image content
        fetch(window.location.href)
            .then(response => response.blob())
            .then(blob => {
                // Use FileSaver.js to save the blob as a file with the original extension
                saveAs(blob, `${imageNumber.toString().padStart(2, '0')}.${fileExtension}`);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert('Failed to fetch image content.');
            });
    }

    // Adiciona um ouvinte de evento ao botão para baixar a imagem
    button.addEventListener('click', downloadImage);

})();
