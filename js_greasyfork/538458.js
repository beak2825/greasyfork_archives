// ==UserScript==
// @name         Homepage Wireframe Visualizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gera uma sobreposição wireframe simplificada para a homepage do site atual
// @author       SeuNome
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538458/Homepage%20Wireframe%20Visualizer.user.js
// @updateURL https://update.greasyfork.org/scripts/538458/Homepage%20Wireframe%20Visualizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para criar um overlay wireframe para um elemento
    function createWireframeOverlay(element, color='rgba(0, 0, 0, 0.1)') {
        const rect = element.getBoundingClientRect();
        if(rect.width < 50 || rect.height < 50) return null; // Ignorar elementos muito pequenos

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.left = rect.left + 'px';
        overlay.style.top = rect.top + 'px';
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';
        overlay.style.backgroundColor = color;
        overlay.style.border = '2px solid #333';
        overlay.style.zIndex = 999999;
        overlay.style.pointerEvents = 'none';
        overlay.style.boxSizing = 'border-box';

        return overlay;
    }

    // Selecionar elementos principais da homepage para wireframe
    // Pode-se ajustar os seletores conforme o site
    const selectors = [
        'header',
        'nav',
        'main',
        'section',
        'article',
        'aside',
        'footer',
        '.hero',
        '.banner',
        '.content',
        '.container'
    ];

    // Criar container para os overlays
    const wireframeContainer = document.createElement('div');
    wireframeContainer.id = 'wireframe-overlay-container';
    wireframeContainer.style.position = 'fixed';
    wireframeContainer.style.left = '0';
    wireframeContainer.style.top = '0';
    wireframeContainer.style.width = '100vw';
    wireframeContainer.style.height = '100vh';
    wireframeContainer.style.pointerEvents = 'none';
    wireframeContainer.style.zIndex = 999998;
    document.body.appendChild(wireframeContainer);

    // Criar overlays para cada elemento encontrado
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            const overlay = createWireframeOverlay(el, 'rgba(0, 120, 215, 0.15)');
            if(overlay) wireframeContainer.appendChild(overlay);
        });
    });

    // Adicionar botão para ativar/desativar wireframe
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Toggle Wireframe';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.right = '10px';
    toggleBtn.style.top = '10px';
    toggleBtn.style.zIndex = 1000000;
    toggleBtn.style.padding = '8px 12px';
    toggleBtn.style.backgroundColor = '#0078d7';
    toggleBtn.style.color = 'white';
    toggleBtn.style.border = 'none';
    toggleBtn.style.borderRadius = '4px';
    toggleBtn.style.cursor = 'pointer';

    toggleBtn.onclick = () => {
        if(wireframeContainer.style.display === 'none') {
            wireframeContainer.style.display = 'block';
        } else {
            wireframeContainer.style.display = 'none';
        }
    };

    document.body.appendChild(toggleBtn);

})();
