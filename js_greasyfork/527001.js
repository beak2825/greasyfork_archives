// ==UserScript==
// @name         Web to PDF Converter with Extended Drag Selection (No Page Limit)
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Convert web pages to PDF with a drag-to-select feature using jsPDF and html2canvas without page size limitation
// @author       ChatGPT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/527001/Web%20to%20PDF%20Converter%20with%20Extended%20Drag%20Selection%20%28No%20Page%20Limit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527001/Web%20to%20PDF%20Converter%20with%20Extended%20Drag%20Selection%20%28No%20Page%20Limit%29.meta.js
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
        selectionBox.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        selectionBox.style.zIndex = '10000';
        selectionBox.style.pointerEvents = 'none';
        document.body.appendChild(selectionBox);

        startX = e.pageX;
        startY = e.pageY;

        function moveSelection(e) {
            if (!isSelecting) return;
            const width = e.pageX - startX;
            const height = e.pageY - startY;

            selectionBox.style.left = Math.min(startX, e.pageX) + 'px';
            selectionBox.style.top = Math.min(startY, e.pageY) + 'px';
            selectionBox.style.width = Math.abs(width) + 'px';
            selectionBox.style.height = Math.abs(height) + 'px';
        }

        function stopSelection(e) {
            if (!isSelecting) return;
            isSelecting = false;

            document.removeEventListener('mousemove', moveSelection);
            document.removeEventListener('mouseup', stopSelection);

            captureSelectedArea();
        }

        document.addEventListener('mousemove', moveSelection);
        document.addEventListener('mouseup', stopSelection);
    }

    function captureSelectedArea() {
        if (!selectionBox) return;

        const rect = selectionBox.getBoundingClientRect();

        // Créer un conteneur pour la zone sélectionnée
        const selectedArea = document.createElement('div');
        selectedArea.style.position = 'absolute';
        selectedArea.style.left = rect.left + 'px';
        selectedArea.style.top = rect.top + 'px';
        selectedArea.style.width = rect.width + 'px';
        selectedArea.style.height = rect.height + 'px';
        selectedArea.style.overflow = 'hidden';

        document.body.appendChild(selectedArea);

        selectionBox.style.display = 'none';

        // Utiliser html2canvas pour capturer la sélection
        html2canvas(document.body, {
            x: rect.left + window.scrollX, // Prendre en compte le défilement de la page
            y: rect.top + window.scrollY,  // Prendre en compte le défilement de la page
            width: rect.width,
            height: rect.height,
            scale: 2,
            useCORS: true,
            logging: true,
            backgroundColor: '#ffffff',
        }).then(canvas => {
            document.body.removeChild(selectedArea);
            selectionBox.style.display = 'block';

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let currentHeight = 0;
            let pageCount = 1;

            // Ajout de l'image à la première page
            doc.addImage(imgData, 'PNG', 0, -currentHeight, pdfWidth, pdfHeight);
            currentHeight += pdfHeight;

            // Ajout d'une nouvelle page si nécessaire et gérer la continuité du contenu
            while (currentHeight < imgProps.height) {
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, -currentHeight, pdfWidth, pdfHeight);
                currentHeight += pdfHeight;
            }

            doc.save('webpage_selection.pdf');
        });
    }

    let existingButton = document.getElementById('gpt-finish-btn');
    if (existingButton) existingButton.remove();

    const finishButton = document.createElement('button');
    finishButton.id = 'gpt-finish-btn';
    finishButton.textContent = 'Générer PDF';
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

    finishButton.addEventListener('click', function() {
        alert('Sélectionnez la zone en maintenant le clic droit et en faisant glisser la souris');
    });

    document.body.appendChild(finishButton);

    GM_registerMenuCommand('Convertir en PDF avec sélection par glissement', function() {
        document.addEventListener('mousedown', startSelection);
    });
})();
