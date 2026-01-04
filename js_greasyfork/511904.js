// ==UserScript==
// @name         YouTube Rewind & Fast Forward Buttons
// @namespace
// @version      1.0
// @description
// @author       IlIlIlIIlIlIlllI
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @license      MIT
// @namespace IlIlIlIIlIlIlllI
// @description Modify the YouTube HTML player interface with configurable rewind and fast forward times
// @downloadURL https://update.greasyfork.org/scripts/511904/YouTube%20Rewind%20%20Fast%20Forward%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/511904/YouTube%20Rewind%20%20Fast%20Forward%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let rewindSeconds = parseInt(localStorage.getItem('rewindSeconds')) || 10;
    if (isNaN(rewindSeconds)) rewindSeconds = 10;
    let fastForwardSeconds = parseInt(localStorage.getItem('fastForwardSeconds')) || 10;
    if (isNaN(fastForwardSeconds)) fastForwardSeconds = 10;

    let menuOpen = false;
    function addControls() {
        if (document.querySelector('.ytp-rewind-button') || document.querySelector('.ytp-fastforward-button')) {
            return;
        }

        var rightControls = document.querySelector('.ytp-right-controls');
        var leftControls = document.querySelector('.ytp-left-controls');
        var timedisplay = document.querySelector('.ytp-time-display');
        if (rightControls && leftControls) {

            var rewindButton = document.createElement('button');
            rewindButton.classList.add('ytp-rewind-button');
            rewindButton.innerHTML = `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                      <svg width="18px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000">
                                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                      <g id="SVGRepo_iconCarrier">
                                      <path d="M6 14H8L8 9L13 14H15L15 2H13L8 7L8 2H6L0 8L6 14Z" fill="#ffffff"></path></g>
                                      </svg>
                                      <span style="color: white; font-size: 14px; margin-left: 0px;">${rewindSeconds}s</span>
                                      </div>`;
            rewindButton.style.cursor = 'pointer';
            rewindButton.style.marginLeft = '1px';
            rewindButton.title = `Rewind ${rewindSeconds} seconds`;
            rewindButton.addEventListener('click', function() {
                var player = document.querySelector('.video-stream');
                if (player) {
                    player.currentTime -= rewindSeconds;
                    showFeedback(`-${rewindSeconds}s`, 'left');
                }
            });
            timedisplay.parentNode.insertBefore(rewindButton, timedisplay);

            var configureButton = document.createElement('button');
            configureButton.innerHTML = `<svg height="100%" fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="-34.03 -34.03 408.33 408.33" xml:space="preserve" stroke="#ffffff" stroke-width="0.00340274">
                                         <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                                         <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                                         <g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M293.629,127.806l-5.795-13.739c19.846-44.856,18.53-46.189,14.676-50.08l-25.353-24.77l-2.516-2.12h-2.937 c-1.549,0-6.173,0-44.712,17.48l-14.184-5.719c-18.332-45.444-20.212-45.444-25.58-45.444h-35.765 c-5.362,0-7.446-0.006-24.448,45.606l-14.123,5.734C86.848,43.757,71.574,38.19,67.452,38.19l-3.381,0.105L36.801,65.032 c-4.138,3.891-5.582,5.263,15.402,49.425l-5.774,13.691C0,146.097,0,147.838,0,153.33v35.068c0,5.501,0,7.44,46.585,24.127 l5.773,13.667c-19.843,44.832-18.51,46.178-14.655,50.032l25.353,24.8l2.522,2.168h2.951c1.525,0,6.092,0,44.685-17.516 l14.159,5.758c18.335,45.438,20.218,45.427,25.598,45.427h35.771c5.47,0,7.41,0,24.463-45.589l14.195-5.74 c26.014,11,41.253,16.585,45.349,16.585l3.404-0.096l27.479-26.901c3.909-3.945,5.278-5.309-15.589-49.288l5.734-13.702 c46.496-17.967,46.496-19.853,46.496-25.221v-35.029C340.268,146.361,340.268,144.434,293.629,127.806z M170.128,228.474 c-32.798,0-59.504-26.187-59.504-58.364c0-32.153,26.707-58.315,59.504-58.315c32.78,0,59.43,26.168,59.43,58.315 C229.552,202.287,202.902,228.474,170.128,228.474z"/> </g> </g> </g> </g>
                                         </svg>`;
            configureButton.style.cursor = 'pointer';
            configureButton.style.marginLeft = '1px';

            configureButton.classList.add('ytp-configure-button');
            configureButton.title = 'Configure the rewind and fast forward duration';
            configureButton.addEventListener('click', function(event) {
                if (menuOpen) {
                    closeConfigureMenu();
                } else {
                    openConfigureMenu(event);
                }
            });
            configureButton.addEventListener('dblclick', closeConfigureMenu);
            timedisplay.parentNode.insertBefore(configureButton, timedisplay);

            var fastForwardButton = document.createElement('button');
            fastForwardButton.classList.add('ytp-fastforward-button');
            fastForwardButton.innerHTML = `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                           <svg width="18px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" transform="rotate(180)">
                                           <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                           <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                           <g id="SVGRepo_iconCarrier">
                                           <path d="M6 14H8L8 9L13 14H15L15 2H13L8 7L8 2H6L0 8L6 14Z" fill="#ffffff"></path></g>
                                           </svg>
                                           <span style="color: white; font-size: 14px; margin-right: 0px;">${fastForwardSeconds}s</span>
                                           </div>`;
            fastForwardButton.style.cursor = 'pointer';
            fastForwardButton.style.marginLeft = '1px';
            fastForwardButton.title = `Forward ${fastForwardSeconds} seconds`;
            fastForwardButton.addEventListener('click', function() {
                var player = document.querySelector('.video-stream');
                if (player) {
                    player.currentTime += fastForwardSeconds;
                    showFeedback(`+${fastForwardSeconds}s`, 'right');
                }
            });
            timedisplay.parentNode.insertBefore(fastForwardButton, timedisplay);
        }
    }

    function openConfigureMenu() {
        var modal = document.createElement('div');
        modal.id = 'configure-modal';
        modal.style.position = 'fixed';
        modal.style.top = '80%';
        modal.style.left = '280px';
        modal.style.transform = 'translateX(-50%)';
        modal.style.backgroundColor = 'rgba(50, 50, 50, 0.9)';
        modal.style.border = '1px solid #ccc';
        modal.style.padding = '15px';
        modal.style.zIndex = '9999';
        modal.style.borderRadius = '5px';
        modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        modal.style.width = '150px'; // Ancho fijo para el modal

        var rewindRow = document.createElement('div');
        rewindRow.style.display = 'flex';
        rewindRow.style.justifyContent = 'space-between';
        rewindRow.style.marginBottom = '10px';

        var rewindLabel = document.createElement('label');
        rewindLabel.innerText = 'Rewind Seconds:';
        rewindLabel.style.color = '#fff';
        rewindLabel.style.fontSize = '15px';

        var rewindInput = document.createElement('input');
        rewindInput.type = 'number';
        rewindInput.value = rewindSeconds;
        rewindInput.style.textAlign = 'right'; // Alineación a la derecha
        rewindInput.style.width = '50px';
        rewindInput.min = 1; // Mínimo valor permitido
        rewindInput.max = 60; // Máximo valor permitido
        rewindInput.step = 1; // Incremento de 1 en 1

        rewindRow.appendChild(rewindLabel);
        rewindRow.appendChild(rewindInput);

        var fastForwardRow = document.createElement('div');
        fastForwardRow.style.display = 'flex';
        fastForwardRow.style.justifyContent = 'space-between';
        fastForwardRow.style.marginBottom = '10px';

        var fastForwardLabel = document.createElement('label');
        fastForwardLabel.innerText = 'Fast Forward Seconds:';
        fastForwardLabel.style.color = '#fff';
        fastForwardLabel.style.fontSize = '15px';

        var fastForwardInput = document.createElement('input');
        fastForwardInput.type = 'number';
        fastForwardInput.value = fastForwardSeconds;
        fastForwardInput.style.width = '50px'; // Reducir el tamaño del input
        fastForwardInput.style.textAlign = 'right'; // Alineación a la derecha
        fastForwardInput.min = 1; // Mínimo valor permitido
        fastForwardInput.max = 60; // Máximo valor permitido
        fastForwardInput.step = 1; // Incremento de 1 en 1

        rewindInput.style.height = '25px'; // Altura del input
        rewindInput.style.fontSize = '25px'; // Tamaño de fuente

        fastForwardInput.style.height = '25px'; // Altura del input
        fastForwardInput.style.fontSize = '25px'; // Tamaño de fuente

        rewindInput.style['-webkit-appearance'] = 'none';
        rewindInput.style['-moz-appearance'] = 'textfield';
        fastForwardInput.style['-webkit-appearance'] = 'none';
        fastForwardInput.style['-moz-appearance'] = 'textfield';

        fastForwardRow.appendChild(fastForwardLabel);
        fastForwardRow.appendChild(fastForwardInput);

        var saveButton = document.createElement('button');
        saveButton.innerText = 'Save';
        saveButton.style.marginTop = '10px';
        saveButton.style.width = '100%';
        saveButton.style.textAlign = 'center';
        saveButton.style.cursor = 'pointer';
        saveButton.style.padding = '10px';
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '5px';

        saveButton.addEventListener('click', function() {
            let newRewindSeconds = parseInt(rewindInput.value) || 10;
            let newFastForwardSeconds = parseInt(fastForwardInput.value) || 10;

            if (newRewindSeconds < 1 || newRewindSeconds > 60) {
                alert("Rewind Seconds must be between 1 and 60.");
                return; // Don't continue if value is invalid
            }
            if (newFastForwardSeconds < 1 || newFastForwardSeconds > 60) {
                alert("Fast Forward Seconds must be between 1 and 60.");
                return; // Don't continue if value is invalid
            }

            rewindSeconds = newRewindSeconds;
            fastForwardSeconds = newFastForwardSeconds;
            localStorage.setItem('rewindSeconds', rewindSeconds);
            localStorage.setItem('fastForwardSeconds', fastForwardSeconds);

            document.querySelector('.ytp-rewind-button span').textContent = `${rewindSeconds}s`;
            document.querySelector('.ytp-fastforward-button span').textContent = `${fastForwardSeconds}s`;

            closeConfigureMenu();
        });
        modal.appendChild(rewindRow);
        modal.appendChild(fastForwardRow);
        modal.appendChild(saveButton);

        document.body.appendChild(modal);

        menuOpen = true;

        // Ensure event to close modal when clicking outside
        document.addEventListener('click', closeMenuOnClickOutside);
    }
    // Function to close the configuration modal
    function closeConfigureMenu() {
        var modal = document.getElementById('configure-modal'); // Obtener el modal por su ID.
        if (modal) {
            modal.remove(); // Eliminar el modal del DOM.
        }
        menuOpen = false; // Marcar el menú como cerrado.
    }

    // Restaurado el comportamiento de cierre cuando se hace click fuera del menú
    function closeMenuOnClickOutside(event) {
        const modal = document.getElementById('configure-modal');
        if (modal && !modal.contains(event.target) && !event.target.classList.contains('ytp-configure-button')) {
            closeConfigureMenu(); // Cierra el menú si el click es fuera del modal
        }
    }

    function showFeedback(message, position) {
        const player = document.querySelector('.html5-video-player');
        if (!player) return;

        const feedback = document.createElement('div');
        feedback.style.position = 'absolute';
        feedback.style.color = 'white';
        feedback.style.fontSize = '24px';
        feedback.style.fontWeight = 'bold';
        feedback.style.display = 'flex';
        feedback.style.alignItems = 'center';
        feedback.style.gap = '5px';
        feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        feedback.style.padding = '10px';
        feedback.style.borderRadius = '5px';
        feedback.style.zIndex = '9999';
        feedback.style.transform = 'translateY(-50%)';

        // Posición: izquierda o derecha del reproductor
        feedback.style.top = '50%';
        if (position === 'left') {
            feedback.style.left = '10%';
            feedback.style.flexDirection = 'row-reverse'; // Flechas primero, luego texto
        } else if (position === 'right') {
            feedback.style.right = '10%';
            feedback.style.flexDirection = 'row'; // Texto primero, luego flechas
        }

        // Añadir el texto del mensaje (e.g., "+10s" o "-10s")
        const text = document.createElement('span');
        text.textContent = message;
        feedback.appendChild(text);

        // Añadir las flechas SVG animadas después del texto
        for (let i = 0; i < 3; i++) {
            const arrow = document.createElement('div');
            arrow.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 12L12 22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
            arrow.style.opacity = '0';
            if (position === 'left') {
                arrow.style.animation = `arrowFadeLeft 0.75s ease ${i * 0.1}s forwards`;
            } else if (position === 'right') {
                arrow.style.animation = `arrowFadeRight 0.75s ease ${i * 0.1}s forwards`;
            }
            feedback.appendChild(arrow);
        }

        player.appendChild(feedback);

        // Eliminar el mensaje después de 1 segundo
        setTimeout(() => {
            feedback.remove();
        }, 500);
    }

    // Add highlight styles for hover effect
    var style = document.createElement('style');
    style.innerHTML = `
        input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
                -webkit-appearance: auto;
                margin: 0;
            }

        input[type="number"] {
            -moz-appearance: textfield;
            appearance: textfield;
        }

        .ytp-rewind-button, .ytp-fastforward-button, .ytp-configure-button {
            background: transparent; /* Fondo transparente */
            border: none; /* Sin borde */
            font-size: 16px; /* Hacer los botones más grandes */
            transition: background-color 0.3s; /* Transición suave al cambiar de fondo */
            border-radius: 20%;
            padding: 8px;
        }

        .ytp-rewind-button:hover, .ytp-fastforward-button:hover, .ytp-configure-button:hover {
            background-color: rgba(211, 211, 211, 0.4); /* Fondo gris claro al hacer hover */
        }

        #configure-modal button {
            cursor: pointer;
        }

        @keyframes arrowFadeLeft {
            0% { transform: translateX(20px); opacity: 0; }
            50% { transform: translateX(0px); opacity: 0.5; }
            100% { transform: translateX(-20px); opacity: 1; }
        }

        @keyframes arrowFadeRight {
            0% { transform: translateX(-20px) rotate(180deg); opacity: 0; }
            50% { transform: translateX(0px) rotate(180deg); opacity: 0.5; }
            100% { transform: translateX(20px) rotate(180deg); opacity: 1; }
        }
`;

    document.head.appendChild(style); // Añadir los estilos al documento

    // Use MutationObserver to listen for changes in the player container element
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Check for newly added nodes
            if (mutation.addedNodes) {
                Array.from(mutation.addedNodes).forEach(function(node) {
                    if (node.classList && node.classList.contains('html5-video-player')) {
                        // Add controls when the player container element changes
                        addControls();
                    }
                });
            }
        });
    });

    // Observe changes in the entire document
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
