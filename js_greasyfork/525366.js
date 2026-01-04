// ==UserScript==
// @name         3D Translucent Browser Tabs
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adiciona efeito 3D translúcido às abas do navegador
// @author       EmersonxD
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/525366/3D%20Translucent%20Browser%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/525366/3D%20Translucent%20Browser%20Tabs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Adiciona os estilos CSS necessários
    GM_addStyle(`
        /* Efeito 3D na janela inteira */
        html {
            transform-style: preserve-3d;
            perspective: 1000px;
            background: transparent !important;
            overflow: hidden;
        }

        body {
            transform: translateZ(0px);
            backface-visibility: visible;
            transform-style: preserve-3d;
            transition: transform 0.2s ease-out;
            background: rgba(255, 255, 255, 0.85) !important;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        /* Evitar efeito em elementos específicos */
        iframe, video, canvas, img {
            transform: none !important;
        }
    `);

    // Variável para controlar a intensidade do efeito
    const intensity = 30; // Ajuste este valor para controlar a intensidade do efeito

    // Função para aplicar efeito 3D ao mover o mouse
    function apply3DEffect(e) {
        const body = document.body;
        const rect = body.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const angleX = (mouseY - centerY) / intensity;
        const angleY = (centerX - mouseX) / intensity;

        // Usando requestAnimationFrame para otimizar a animação
        requestAnimationFrame(() => {
            body.style.transform = `translateZ(20px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
    }

    // Adiciona listener para movimento do mouse
    document.addEventListener('mousemove', apply3DEffect);

    // Reseta a transformação quando o mouse sai da janela
    document.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
            document.body.style.transform = 'translateZ(0px)';
        });
    });

})();