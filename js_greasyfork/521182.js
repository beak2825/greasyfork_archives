// ==UserScript==
// @name         Bumble Beeline Unblur
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Unblur Bumble beeline profiles
// @match        https://bumble.com/app/beeline
// @match        https://bumble.com/app/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521182/Bumble%20Beeline%20Unblur.user.js
// @updateURL https://update.greasyfork.org/scripts/521182/Bumble%20Beeline%20Unblur.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function unblurImages() {
        // Seleccionar todas las imágenes borrosas
        const blurredImages = document.querySelectorAll('.media-box__picture-image');
        const blurredBackgrounds = document.querySelectorAll('.media-box__picture-background');
        const profileCards = document.querySelectorAll('.encounters-user__info');

        // Remover el desenfoque de las imágenes
        blurredImages.forEach(img => {
            if (img) {
                img.style.filter = 'none';
                img.style.webkitFilter = 'none';
                // Remover clases que puedan causar el desenfoque
                img.classList.remove('blur');
                img.classList.remove('media-box__picture-image--blurred');
                // Ajustar la opacidad si es necesario
                img.style.opacity = '1';
            }
        });

        // Remover el desenfoque de los fondos
        blurredBackgrounds.forEach(bg => {
            if (bg) {
                bg.style.filter = 'none';
                bg.style.webkitFilter = 'none';
                bg.classList.remove('blur');
                bg.style.opacity = '1';
            }
        });

        // Intentar mostrar nombres y otros detalles
        profileCards.forEach(card => {
            if (card) {
                card.style.filter = 'none';
                card.style.webkitFilter = 'none';
                card.style.opacity = '1';
            }
        });

        // Remover overlay de desenfoque
        const overlays = document.querySelectorAll('.encounters-filter-overlay');
        overlays.forEach(overlay => {
            if (overlay) {
                overlay.style.display = 'none';
            }
        });

        // Remover efectos adicionales de desenfoque
        const style = document.createElement('style');
        style.textContent = `
            .media-box__picture-image--blurred {
                filter: none !important;
                -webkit-filter: none !important;
            }
            .encounters-filter-overlay {
                display: none !important;
            }
            .encounters-user__info {
                opacity: 1 !important;
                filter: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Función para ejecutar periódicamente
    function checkAndUnblur() {
        unblurImages();
    }

    // Ejecutar cuando la página se carga
    window.addEventListener('load', () => {
        // Ejecutar inicialmente después de 2 segundos
        setTimeout(checkAndUnblur, 2000);
        // Continuar verificando cada 3 segundos
        setInterval(checkAndUnblur, 3000);
    });

    // Observer para detectar cambios en el DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                checkAndUnblur();
            }
        });
    });

    // Configurar y iniciar el observer
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Crear botón para activar manualmente
    const unblurButton = document.createElement('button');
    unblurButton.textContent = 'Desbloquear Fotos';
    unblurButton.style.position = 'fixed';
    unblurButton.style.top = '10px';
    unblurButton.style.left = '50%';
    unblurButton.style.transform = 'translateX(-50%)';
    unblurButton.style.zIndex = '9999';
    unblurButton.style.backgroundColor = '#FDB333';
    unblurButton.style.color = '#000000';
    unblurButton.style.border = 'none';
    unblurButton.style.borderRadius = '20px';
    unblurButton.style.padding = '10px 20px';
    unblurButton.style.fontSize = '16px';
    unblurButton.style.cursor = 'pointer';
    unblurButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    unblurButton.style.transition = 'all 0.3s ease';

    unblurButton.addEventListener('mouseover', function() {
        unblurButton.style.backgroundColor = '#FFE033';
        unblurButton.style.transform = 'translateX(-50%) scale(1.05)';
    });

    unblurButton.addEventListener('mouseout', function() {
        unblurButton.style.backgroundColor = '#FDB333';
        unblurButton.style.transform = 'translateX(-50%) scale(1)';
    });

    unblurButton.addEventListener('click', () => {
        checkAndUnblur();
        unblurButton.textContent = '¡Desbloqueado!';
        setTimeout(() => {
            unblurButton.textContent = 'Desbloquear Fotos';
        }, 2000);
    });

    document.body.appendChild(unblurButton);
})();