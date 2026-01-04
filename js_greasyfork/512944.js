// ==UserScript==
// @name         YouTube Quick Speed Interface
// @version      1.0
// @author       IlIlIlIIlIlIlllI
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @license MIT
// @description  Modify the YouTube HTML player interface
// @namespace https://twitter.com/CobleeH
// @downloadURL https://update.greasyfork.org/scripts/512944/YouTube%20Quick%20Speed%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/512944/YouTube%20Quick%20Speed%20Interface.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add speed options
    function addSpeedOptions() {
        // Check if speed options are already added
        if (document.querySelector('.ytp-speed-options')) {
            return;
        }

        var rightControls = document.querySelector('.ytp-right-controls');
        var leftControls = document.querySelector('.ytp-left-controls');
        if (rightControls && leftControls) {
            var speedOptions = document.createElement('div');
            speedOptions.classList.add('ytp-speed-options');
            speedOptions.style.display = 'flex';
            speedOptions.style.alignItems = 'center';
            speedOptions.style.order = '2';
            speedOptions.style.marginLeft = '5px';
            speedOptions.style.marginRight = '5px';

            var speeds = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
            speeds.forEach(function(speed) {
                var option = document.createElement('div');
                option.innerText = speed;
                option.classList.add('ytp-speed-option');

                // Estilos para centrar y alinear
                option.style.cursor = 'pointer';
                option.style.fontSize = "15px";
                option.style.minWidth = '15px';
                option.style.height = '30px';
                option.style.display = 'flex';
                option.style.justifyContent = 'center';
                option.style.alignItems = 'center';
                option.style.margin = '0 1px';
                option.style.padding = '0 2px';

option.addEventListener('click', function () {
    const player = document.querySelector('.video-stream');
    if (player) {
        // Establecer la velocidad directamente
        player.playbackRate = speed;

        // Forzar al reproductor a reconocer el cambio
        const ytPlayer = document.querySelector('#movie_player');
        if (ytPlayer) {
            ytPlayer.setPlaybackRate(speed); // Método interno de YouTube para manejar cambios de velocidad
        }

        localStorage.setItem('videoSpeed', speed); // Guardar la velocidad seleccionada
        updateSpeedIndicator(); // Asegurar que los indicadores se actualicen visualmente
        showSpeedNotification(speed); // Mostrar la notificación de velocidad
    }
});

                option.addEventListener('mouseover', function() {
                    option.classList.add('highlighted');
                });

                option.addEventListener('mouseout', function() {
                    if (!option.classList.contains('active')) {
                        option.classList.remove('highlighted');
                    }
                });

                speedOptions.appendChild(option);
            });

            leftControls.style.order = '1';
            rightControls.style.order = '3';

            document.querySelector('.ytp-chrome-controls').appendChild(speedOptions);
        }
    }

    function highlightOption(option) {
        // Remove highlight from other options
        var options = document.querySelectorAll('.ytp-speed-option');
        options.forEach(function(opt) {
            opt.classList.remove('active');
        });

        // Add highlight to the current option
        option.classList.add('active');
    }

        // Función para mostrar la notificación de velocidad
    function showSpeedNotification(speed) {
        const notification = document.createElement('div');
        notification.className = 'ytp-speed-notification';
        notification.innerText = `${speed}x`;
        notification.style.position = 'absolute';
        notification.style.top = '10%'; // Más cerca del borde superior
        notification.style.left = '50%';
        notification.style.transform = 'translate(-50%, -50%)';
        notification.style.color = 'white';
        notification.style.fontSize = '20px'; // Reducido ligeramente
        notification.style.fontWeight = 'normal'; // Menos negrita
        notification.style.textShadow = '0 0 8px rgba(0, 0, 0, 0.6), 0 0 12px rgba(0, 0, 0, 0.4)';
        notification.style.zIndex = '9999';
        notification.style.pointerEvents = 'none';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.2s ease'; // Transición más rápida

        document.body.appendChild(notification);

        // Fade-in effect
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
        });

        // Remove notification after 1 second
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 200); // Tiempo de transición reducido
        }, 500);
    }

    // Leer la velocidad guardada al cargar la página
    function updateSpeedIndicator() {
        var player = document.querySelector('.video-stream');
        var currentSpeed = parseFloat(localStorage.getItem('videoSpeed')) || 1.0; // Leer la velocidad guardada o 1x por defecto

        // Establecer la velocidad del reproductor
        if (player) {
            player.playbackRate = currentSpeed;
        }

        // Encontrar y resaltar la opción que coincide con la velocidad actual
        var options = document.querySelectorAll('.ytp-speed-option');
        options.forEach(function(opt) {
            if (parseFloat(opt.innerText) === currentSpeed) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }

    // Detect playback rate change in all browsers
    function observePlaybackRateChange() {
        const player = document.querySelector('.video-stream');
        if (player) {
            player.addEventListener('ratechange', function() {
                localStorage.setItem('videoSpeed', player.playbackRate); // Guardar la nueva velocidad
                updateSpeedIndicator(); // Actualizar el indicador de velocidad después del cambio
            });
        }
    }

    // Add highlight styles
    var style = document.createElement('style');
    style.innerHTML = `

        .ytp-speed-options {
            display: flex;
            align-items: center;
        }

        .ytp-speed-option {
            display: none !important;
            opacity: 0;
            transition: opacity 0.4s ease;
            border-radius: 10px;
            visibility: hidden;
        }

        .ytp-speed-option.active {
            display: flex !important;
            opacity: 1;
            visibility: visible;
            background-color: rgba(127, 127, 127, 0.5);
        }

        .ytp-speed-options:hover .ytp-speed-option {
            display: flex !important;
            opacity: 1;
            visibility: visible;
        }

        .ytp-speed-option:hover {
            background-color: rgba(127, 127, 127, 1);
        }
    `;
    document.head.appendChild(style);

    // Listen for URL changes and automatically reset speed highlight
    var currentURL = window.location.href;
    setInterval(function() {
        var newURL = window.location.href;
        if (newURL !== currentURL) {
            currentURL = newURL;
            addSpeedOptions();
            updateSpeedIndicator(); // Actualizar la velocidad al cambiar de video
        }
    }, 500);

    // Use MutationObserver to listen for changes in the player container element
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                Array.from(mutation.addedNodes).forEach(function(node) {
                    if (node.classList && node.classList.contains('html5-video-player')) {
                        addSpeedOptions();
                        updateSpeedIndicator();
                        observePlaybackRateChange();
                    }
                });
            }
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Add speed options and initialize the indicator after the page is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        addSpeedOptions();
        updateSpeedIndicator();
        observePlaybackRateChange();
    });
})();
