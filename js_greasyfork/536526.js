// ==UserScript==
// @name         DeepSeek Tokens Remaining y Caracteres
// @version      1.4
// @description  Contador de tokens y caracteres en tiempo real para DeepSeek Chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @author       Steve Casanova
// @namespace    Steve Casanova
// @match        https://chat.deepseek.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536526/DeepSeek%20Tokens%20Remaining%20y%20Caracteres.user.js
// @updateURL https://update.greasyfork.org/scripts/536526/DeepSeek%20Tokens%20Remaining%20y%20Caracteres.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuración
    const MAX_TOKENS_PER_MESSAGE = 4096;
    const TOKEN_RATIO = 4; // 1 token ≈ 4 caracteres

    // Esperar a que los elementos estén disponibles
    const init = () => {
        const textarea = document.getElementById('chat-input');
        const attachButton = document.querySelector('.bf38813a'); // Botón de adjuntar
        const textareaContainer = document.querySelector('._24fad49');

        if (textarea && attachButton && textareaContainer) {
            setupCounters(textarea, attachButton, textareaContainer);
        } else {
            setTimeout(init, 500);
        }
    };

    function setupCounters(textarea, attachButton, textareaContainer) {
        // Crear contenedor para la barra de progreso (más gruesa)
        const progressContainer = document.createElement('div');
        progressContainer.style.width = '100%';
        progressContainer.style.height = '8px'; // Doble de gruesa (antes 4px)
        progressContainer.style.marginBottom = '10px';
        progressContainer.style.borderRadius = '4px';
        progressContainer.style.overflow = 'hidden';
        progressContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';

        const progressBar = document.createElement('div');
        progressBar.style.height = '100%';
        progressBar.style.width = '0%';
        progressBar.style.transition = 'width 0.3s ease';
        progressContainer.appendChild(progressBar);

        // Insertar la barra de progreso arriba del textarea
        textareaContainer.insertBefore(progressContainer, textareaContainer.firstChild);

        // Crear contenedor para los contadores con icono
        const counterContainer = document.createElement('div');
        counterContainer.style.display = 'flex';
        counterContainer.style.alignItems = 'center';
        counterContainer.style.marginRight = '15px';
        counterContainer.style.fontFamily = 'Arial, sans-serif';
        counterContainer.style.fontSize = '14px'; // Más grande (antes 12px)
        counterContainer.style.color = '#666';

        // Añadir icono de DeepSeek (más grande)
        const icon = document.createElement('img');
        icon.src = 'https://chat.deepseek.com/favicon.svg';
        icon.style.width = '20px'; // Más grande (antes 16px)
        icon.style.height = '20px'; // Más grande (antes 16px)
        icon.style.marginRight = '8px';
        icon.style.opacity = '0.8';
        counterContainer.appendChild(icon);

        const tokensSpan = document.createElement('span');
        tokensSpan.style.marginRight = '10px';
        tokensSpan.style.fontWeight = '600'; // Más negrita
        tokensSpan.style.fontSize = '14px'; // Más grande

        const charsSpan = document.createElement('span');
        charsSpan.style.fontStyle = 'italic';
        charsSpan.style.opacity = '0.9';
        charsSpan.style.fontSize = '14px'; // Más grande

        counterContainer.appendChild(tokensSpan);
        counterContainer.appendChild(charsSpan);

        // Insertar los contadores al lado izquierdo del botón de adjuntar
        attachButton.parentElement.insertBefore(counterContainer, attachButton);

        // Función para actualizar los contadores
        const updateCounters = () => {
            const text = textarea.value;
            const charCount = text.length;
            const tokenEstimate = Math.ceil(charCount / TOKEN_RATIO);
            const percentUsed = Math.min(100, (tokenEstimate / MAX_TOKENS_PER_MESSAGE) * 100);

            // Actualizar barra de progreso
            let progressColor;
            if (percentUsed < 70) progressColor = '#4CAF50';
            else if (percentUsed < 90) progressColor = '#FFC107';
            else progressColor = '#F44336';

            progressBar.style.width = `${percentUsed}%`;
            progressBar.style.backgroundColor = progressColor;

            // Actualizar contadores de texto
            tokensSpan.textContent = `${tokenEstimate}/${MAX_TOKENS_PER_MESSAGE} tokens`;
            tokensSpan.style.color = progressColor;
            charsSpan.textContent = `${charCount} chars`;

            // Cambiar estilo si se excede el límite
            if (tokenEstimate >= MAX_TOKENS_PER_MESSAGE) {
                progressBar.style.backgroundColor = '#F44336';
                tokensSpan.style.color = '#F44336';
                tokensSpan.style.fontWeight = 'bold';
                icon.style.opacity = '1';
                icon.style.transform = 'scale(1.1)';
            } else {
                icon.style.opacity = '0.8';
                icon.style.transform = 'scale(1)';
            }
        };

        // Event listeners
        textarea.addEventListener('input', updateCounters);
        textarea.addEventListener('keyup', updateCounters);
        textarea.addEventListener('change', updateCounters);

        // Inicializar
        updateCounters();

        // Observar cambios en el DOM
        const observer = new MutationObserver(() => {
            if (!document.body.contains(progressContainer)) {
                textareaContainer.insertBefore(progressContainer, textareaContainer.firstChild);
            }
            if (!document.body.contains(counterContainer)) {
                attachButton.parentElement.insertBefore(counterContainer, attachButton);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Iniciar
    setTimeout(init, 1000);
})();