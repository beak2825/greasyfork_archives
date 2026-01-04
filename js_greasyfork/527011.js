// ==UserScript==
// @name         Manhwa Web to Image Converter (Drag Selection & Corrected Full Capture)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Capture une sélection ou de longs chapitres manhwa en PNG sans duplication ni erreurs
// @author       ChatGPT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/527011/Manhwa%20Web%20to%20Image%20Converter%20%28Drag%20Selection%20%20Corrected%20Full%20Capture%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527011/Manhwa%20Web%20to%20Image%20Converter%20%28Drag%20Selection%20%20Corrected%20Full%20Capture%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isSelecting = false;
    let selectionBox = null;
    let startX, startY;

    function startSelection(e) {
        if (e.button !== 2) return;
        e.preventDefault();
        isSelecting = true;
        selectionBox = document.createElement('div');
        selectionBox.style.position = 'absolute';
        selectionBox.style.border = '2px dashed #ff0000';
        selectionBox.style.backgroundColor = 'rgba(255,0,0,0.2)';
        selectionBox.style.zIndex = '10000';
        selectionBox.style.pointerEvents = 'none';
        document.body.appendChild(selectionBox);
        startX = e.pageX;
        startY = e.pageY;

        document.addEventListener('mousemove', moveSelection);
        document.addEventListener('mouseup', stopSelection);
    }

    function moveSelection(e) {
        if (!isSelecting) return;
        selectionBox.style.left = Math.min(startX, e.pageX) + 'px';
        selectionBox.style.top = Math.min(startY, e.pageY) + 'px';
        selectionBox.style.width = Math.abs(e.pageX - startX) + 'px';
        selectionBox.style.height = Math.abs(e.pageY - startY) + 'px';
    }

    async function stopSelection(e) {
        if (!isSelecting) return;
        isSelecting = false;
        document.removeEventListener('mousemove', moveSelection);
        document.removeEventListener('mouseup', stopSelection);
        const rect = selectionBox.getBoundingClientRect();
        selectionBox.style.display = 'none';

        const canvas = await html2canvas(document.body, {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
            width: rect.width,
            height: rect.height,
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'selection.png';
        link.click();
        document.body.removeChild(selectionBox);
    }

    async function captureFullPage() {
        const canvas = await html2canvas(document.body, {
            scale: 2,
            useCORS: true,
            windowWidth: document.body.scrollWidth,
            windowHeight: document.body.scrollHeight
        });

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'manhwa_full_page.png';
        link.click();
    }

    const finishButton = document.createElement('button');
    finishButton.textContent = 'Générer Image';
    finishButton.style.position = 'fixed';
    finishButton.style.top = '20px';
    finishButton.style.right = '20px';
    finishButton.style.zIndex = '10000';
    finishButton.style.padding = '10px';
    finishButton.style.backgroundColor = '#28a745';
    finishButton.style.color = '#fff';
    finishButton.style.border = 'none';
    finishButton.style.borderRadius = '5px';
    finishButton.style.cursor = 'pointer';
    finishButton.addEventListener('click', () => alert('Sélectionnez la zone avec le clic droit.'));
    document.body.appendChild(finishButton);

    const captureButton = document.createElement('button');
    captureButton.textContent = 'Capturer Chapitre Manhwa';
    captureButton.style.position = 'fixed';
    captureButton.style.top = '60px';
    captureButton.style.right = '20px';
    captureButton.style.zIndex = '10000';
    captureButton.style.padding = '10px';
    captureButton.style.backgroundColor = '#007bff';
    captureButton.style.color = '#fff';
    captureButton.style.border = 'none';
    captureButton.style.borderRadius = '5px';
    captureButton.style.cursor = 'pointer';
    captureButton.addEventListener('click', captureFullPage);
    document.body.appendChild(captureButton);

    GM_registerMenuCommand('Convertir en Image avec sélection', () => {
        document.addEventListener('mousedown', startSelection);
    });
})();
