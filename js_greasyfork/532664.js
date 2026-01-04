// ==UserScript==
// @name         Copiar imagem do Canva Premium [PT-BR]
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Copie ou abra as imagens premium do Canva para usar onde quiser
// @author       JKCHSTR
// @match        https://www.canva.com/design/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532664/Copiar%20imagem%20do%20Canva%20Premium%20%5BPT-BR%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/532664/Copiar%20imagem%20do%20Canva%20Premium%20%5BPT-BR%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Canva Tools] Script iniciado');

    function createMenu(container, imageUrl) {
        const menuContainer = document.createElement('div');
        menuContainer.style.position = 'absolute';
        menuContainer.style.top = '5px';
        menuContainer.style.left = '5px';
        menuContainer.style.zIndex = '999999';

        const button = document.createElement('button');
        button.innerHTML = '🖼️';
        button.style.background = '#fff';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '3px';
        button.style.padding = '2px 4px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '12px';
        button.title = 'Opções da imagem';
        button.className = 'canva-menu-button';

        const dropdown = document.createElement('div');
        dropdown.style.position = 'absolute';
        dropdown.style.top = '25px';
        dropdown.style.left = '0';
        dropdown.style.background = '#fff';
        dropdown.style.border = '1px solid #ccc';
        dropdown.style.borderRadius = '3px';
        dropdown.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
        dropdown.style.display = 'none';
        dropdown.className = 'canva-dropdown';

        const option1 = document.createElement('div');
        option1.textContent = 'Nova guia';
        option1.style.padding = '4px 8px';
        option1.style.cursor = 'pointer';
        option1.style.fontSize = '12px';
        option1.style.whiteSpace = 'nowrap';
        option1.addEventListener('click', () => {
            window.open(imageUrl, '_blank');
            setTimeout(() => toggleMenu(false), 1000); // Mantém aberto por 1s
        });

        const option2 = document.createElement('div');
        option2.textContent = 'Copiar img';
        option2.style.padding = '4px 8px';
        option2.style.cursor = 'pointer';
        option2.style.fontSize = '12px';
        option2.style.whiteSpace = 'nowrap';
        option2.addEventListener('click', async () => {
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();

                const img = await new Promise(resolve => {
                    const i = new Image();
                    i.onload = () => resolve(i);
                    i.src = URL.createObjectURL(blob);
                });

                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                canvas.toBlob(async (pngBlob) => {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': pngBlob })
                    ]);
                    option2.style.backgroundColor = '#d4edda';
                    setTimeout(() => {
                        option2.style.backgroundColor = '';
                        toggleMenu(false);
                    }, 1000);
                }, 'image/png');

            } catch (error) {
                console.error('[Canva] Erro:', error);
                option2.style.backgroundColor = '#f8d7da';
                setTimeout(() => {
                    option2.style.backgroundColor = '';
                    toggleMenu(false);
                }, 1000);
            }
        });

        const toggleMenu = (isOpen) => {
            dropdown.style.display = isOpen ? 'block' : 'none';
            button.innerHTML = isOpen ? '❌' : '🖼️';
            button.style.background = isOpen ? '#f0f0f0' : '#fff';
        };

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.style.display === 'block';
            toggleMenu(!isOpen);
        });

        document.addEventListener('click', (e) => {
            if (!menuContainer.contains(e.target)) {
                toggleMenu(false);
            }
        });

        dropdown.appendChild(option1);
        dropdown.appendChild(option2);
        menuContainer.appendChild(button);
        menuContainer.appendChild(dropdown);
        container.style.position = 'relative';
        container.appendChild(menuContainer);
    }

    function processContainers() {
        document.querySelectorAll('div.vMIRQg._1kUSIQ.D5BVoA.LFBd9g, div.qFtWQg').forEach(container => {
            if (container.querySelector('.canva-menu-button')) return;

            const themeElement = container.querySelector('span.theme.dark.vQEisA');
            if (!themeElement) return;

            const image = container.querySelector('img.A_yLpA');
            if (image) {
                console.log('[Canva] Imagem encontrada');
                createMenu(container, image.src);
            }
        });
    }

    const observer = new MutationObserver(processContainers);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    processContainers();
})();