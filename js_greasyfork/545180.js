// ==UserScript==
// @name         MyInstant Music Copy Url
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  copy the url and the song in a new page
// @author       YouTubeDrawaria
// @match        https://www.myinstants.com/es/instant/*
// @grant        none
// @license      MIT
// @icon         https://www.myinstants.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/545180/MyInstant%20Music%20Copy%20Url.user.js
// @updateURL https://update.greasyfork.org/scripts/545180/MyInstant%20Music%20Copy%20Url.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para crear el botón flotante
    function createFloatingButton() {
        const button = document.createElement('button');
        button.innerText = 'Abrir MP3 URL';
        button.id = 'mp3-url-opener';

        // Estilos para el botón flotante
        button.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            z-index: 9999;
            background: #15202B;
            color: white;
            border: none;
            padding: 15px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            transform: translateY(-50%);
        `;

        // Efectos hover
        button.addEventListener('mouseenter', function() {
            this.style.background = '#15202B';
            this.style.transform = 'translateY(-50%) scale(1.05)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.background = '#15202B';
            this.style.transform = 'translateY(-50%) scale(1)';
        });

        return button;
    }

    // Función para extraer la URL del MP3
    function extractMp3Url() {
        const instantButton = document.getElementById('instant-page-button-element');

        if (!instantButton) {
            alert('No se encontró el botón de reproducción');
            return null;
        }

        // Intentar obtener la URL desde el atributo data-url
        let mp3Path = instantButton.getAttribute('data-url');

        // Si no está en data-url, intentar extraerla del onclick
        if (!mp3Path) {
            const onclickAttr = instantButton.getAttribute('onclick');
            if (onclickAttr) {
                const match = onclickAttr.match(/play$$'([^']+)'/);
                if (match && match[1]) {
                    mp3Path = match[1];
                }
            }
        }

        if (!mp3Path) {
            alert('No se pudo extraer la URL del MP3');
            return null;
        }

        // Construir la URL completa
        const fullUrl = `https://www.myinstants.com${mp3Path}`;
        return fullUrl;
    }

    // Función principal que se ejecuta al hacer clic en el botón
    function openMp3Url() {
        const mp3Url = extractMp3Url();

        if (mp3Url) {
            // Abrir en nueva pestaña
            window.open(mp3Url, '_blank');

            // Opcional: copiar al portapapeles
            if (navigator.clipboard) {
                navigator.clipboard.writeText(mp3Url).then(() => {
                    // Mostrar feedback visual
                    const button = document.getElementById('mp3-url-opener');
                    const originalText = button.innerText;
                    button.innerText = '¡Copiado!';
                    button.style.background = '#2196F3';

                    setTimeout(() => {
                        button.innerText = originalText;
                        button.style.background = '#15202B';
                    }, 1500);
                }).catch(err => {
                    console.warn('No se pudo copiar al portapapeles:', err);
                });
            }
        }
    }

    // Función para inicializar el script
    function init() {
        // Esperar a que la página se cargue completamente
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Verificar que estamos en la página correcta
        const instantButton = document.getElementById('instant-page-button-element');
        if (!instantButton) {
            console.log('No se encontró el botón de instant, esperando...');
            setTimeout(init, 1000);
            return;
        }

        // Crear y agregar el botón flotante si no existe
        if (!document.getElementById('mp3-url-opener')) {
            const floatingButton = createFloatingButton();
            floatingButton.addEventListener('click', openMp3Url);
            document.body.appendChild(floatingButton);

            console.log('Botón MP3 URL Opener agregado exitosamente');
        }
    }

    // Inicializar el script
    init();

    // Función de limpieza para evitar múltiples instancias
    window.addEventListener('beforeunload', function() {
        const button = document.getElementById('mp3-url-opener');
        if (button) {
            button.remove();
        }
    });

})();
