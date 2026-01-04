// ==UserScript==
// @name         Twitch AutoTheater, Speeds & Controls
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Añade botones de Rewind, Configure y Fast Forward en el reproductor de Twitch
// @author       You
// @match        https://www.twitch.tv/videos/*
// @match        https://www.twitch.tv/*/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543967/Twitch%20AutoTheater%2C%20Speeds%20%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/543967/Twitch%20AutoTheater%2C%20Speeds%20%20Controls.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuración inicial
    let rewindSeconds = parseInt(localStorage.getItem('rewindSeconds'), 10) || 10;
    let ffSeconds = parseInt(localStorage.getItem('ffSeconds'), 10) || 10;
    let initialized = false;

    // Función principal para verificar si los elementos están listos
    function checkElementsReady() {
        if (initialized) return;

        const videoPlayer = document.querySelector('video');
        const controlsRight = document.querySelector('.player-controls__right-control-group');
        const controlsLeft = document.querySelector('.player-controls__left-control-group');

        if (videoPlayer && controlsRight && controlsLeft) {
            initialized = true;
            main();
        } else {
            setTimeout(checkElementsReady, 500);
        }
    }

    // Función principal que contiene toda tu lógica original
    function main() {

        let rewindSeconds = parseInt(localStorage.getItem('rewindSeconds'), 10) || 10;
        let ffSeconds = parseInt(localStorage.getItem('ffSeconds'), 10) || 10;

    function enableTheatreMode() {
        setTimeout(() => {
            // Selector universal que funciona en ambos navegadores
            const selectors = [
                'button[aria-label*="Theatre Mode"]', // Firefox
                'button[aria-label*="Modo Teatro"]', // Firefox en español
                'button[aria-label*="(Alt+T)"]', // Chrome
                '.ScCoreButton-sc-ocjdkq-0.fYnRik.ScButtonIcon-sc-9yap0r-0.dOOPAe[aria-label*="Teatro"]' // Chrome estructura específica
            ];

            let theatreButton;

            // Probar cada selector hasta encontrar el botón
            for (const selector of selectors) {
                theatreButton = document.querySelector(selector);
                if (theatreButton) break;
            }

            // Versión alternativa más agresiva para Chrome si aún no se encuentra
            if (!theatreButton) {
                const buttons = document.querySelectorAll('button');
                for (const button of buttons) {
                    const label = button.getAttribute('aria-label') || '';
                    if (label.includes('Teatro') || label.includes('Theatre') || label.includes('Alt+T')) {
                        theatreButton = button;
                        break;
                    }
                }
            }

            if (theatreButton) {
                theatreButton.click();
                console.log('Modo teatro activado');
            } else {
                console.warn('No se pudo encontrar el botón de modo teatro');
                // Intentar nuevamente después de un tiempo si falla
                setTimeout(enableTheatreMode, 2000);
            }
        }, 3000);
    }

        const videoPlayer = document.querySelector('video');

        // Función para disminuir la velocidad
        function decreaseSpeed() {
            const videoPlayer = document.querySelector('video');
            if (videoPlayer && videoPlayer.playbackRate > 0.25) {
                videoPlayer.playbackRate -= 0.25;
                showSpeedNotification(videoPlayer.playbackRate);
            }
        }

        // Función para aumentar la velocidad
        function increaseSpeed() {
            const videoPlayer = document.querySelector('video');
            if (videoPlayer && videoPlayer.playbackRate < 2) {
                videoPlayer.playbackRate += 0.25;
                console.log('Nueva velocidad:', videoPlayer.playbackRate); // Depuración
                showSpeedNotification(videoPlayer.playbackRate);
            } else {
                console.warn('No se puede aumentar más la velocidad.');
            }
        }

        // Crear los botones de velocidad
        function createSpeedControlContainer() {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexDirection = 'column'; // Botones uno encima del otro
            container.style.alignItems = 'center';
            container.style.order = '1'; // Establecer el orden

            // Crear el botón de disminuir velocidad
            const decreaseButton = document.createElement('button');
            decreaseButton.innerHTML = '⬇️';
            decreaseButton.title = 'Decrease Speed';
            decreaseButton.style.color = '#fff';
            decreaseButton.style.backgroundColor = 'transparent';
            decreaseButton.style.border = 'none';
            decreaseButton.style.borderRadius = '4px';
            decreaseButton.style.cursor = 'pointer';
            decreaseButton.addEventListener('click', decreaseSpeed);
            decreaseButton.style.fontSize = 'large';
            decreaseButton.style.marginTop= '-2px'; // Eliminar separación

            // Crear el botón de aumentar velocidad
            const increaseButton = document.createElement('button');
            increaseButton.innerHTML = '⬆️';
            increaseButton.title = 'Increase Speed';
            increaseButton.style.color = '#fff';
            increaseButton.style.backgroundColor = 'transparent';
            increaseButton.style.border = 'none';
            increaseButton.style.borderRadius = '4px';
            increaseButton.style.cursor = 'pointer';
            increaseButton.addEventListener('click', increaseSpeed);
            increaseButton.style.fontSize = 'large';
            increaseButton.style.marginBottom= '-2px'; // Eliminar separación

            // Función para agregar efecto hover a los botones
            function addHoverEffect(button) {
                button.addEventListener('mouseover', () => {
                    button.style.backgroundColor = '#6500ff'; // Color de fondo al pasar el ratón
                });
                button.addEventListener('mouseout', () => {
                    button.style.backgroundColor = 'transparent'; // Vuelve a ser transparente
                });
            }
            increaseButton.addEventListener("mousedown", (event) => {
                event.preventDefault();
            });

            decreaseButton.addEventListener("mousedown", (event) => {
                event.preventDefault();
            });

            // Añadir efecto hover a ambos botones
            addHoverEffect(decreaseButton);
            addHoverEffect(increaseButton);

            // Agregar los botones al contenedor
            container.appendChild(increaseButton);
            container.appendChild(decreaseButton);

            // Buscar el contenedor de controles del reproductor
            const playerControls = document.querySelector('.player-controls__right-control-group');
            playerControls.insertBefore(container, playerControls.firstChild);
        }

        function createButtonWithHover(icon, label, onClick) {
            const button = document.createElement('button');
            button.innerHTML = icon;
            button.title = label;
            button.style.color = '#fff';
            button.style.backgroundColor = 'transparent';
            button.style.border = 'none';
            button.style.borderRadius = '4px';
            button.style.cursor = 'pointer';
            button.style.fontSize = 'large';

            // Efecto hover
            button.addEventListener('mouseover', () => button.style.backgroundColor = '#6500ff');
            button.addEventListener('mouseout', () => button.style.backgroundColor = 'transparent');

            // Acción de click
            button.addEventListener('click', onClick);

            // Evitar que gane foco
            button.addEventListener("mousedown", (event) => {
                event.preventDefault();
            });

            return button;
        }

        // Para Rewind
        const rewindButton = createButtonWithHover('⏪', 'Rewind', () => {
            const video = document.querySelector('video');
            if (video) video.currentTime -= rewindSeconds; // Usar el valor configurado
            showFeedback(`-${rewindSeconds}s`, 'left');
        });
        rewindButton.innerHTML = '';
        rewindButton.style.display = 'flex';
        rewindButton.style.flexDirection = 'column';
        rewindButton.style.alignItems = 'center';
        // rewindButton.style.gap = '2px'; // Ajusta el gap entre la flecha y el texto

        const rewindArrow = document.createElement('span');
        rewindArrow.innerHTML = '⏪';
        rewindArrow.style.fontSize = '18px';
        rewindButton.appendChild(rewindArrow);

        const rewindText = document.createElement('span');
        rewindText.id = 'rewindtext';
        rewindText.textContent = `${rewindSeconds}s`;
        rewindText.style.color = '#fff';
        rewindText.style.fontSize = '12px';
        rewindButton.appendChild(rewindText);

        // Para Fast Forward
        const fastForwardButton = createButtonWithHover('⏩', 'Fast Forward', () => {
            const video = document.querySelector('video');
            if (video) video.currentTime += ffSeconds; // Usar el valor configurado
            showFeedback(`+${ffSeconds}s`, 'right');
        });
        fastForwardButton.innerHTML = '';
        fastForwardButton.style.display = 'flex';
        fastForwardButton.style.flexDirection = 'column';
        fastForwardButton.style.alignItems = 'center';
        //fastForwardButton.style.gap = '2px'; // Ajusta el gap entre la flecha y el texto

        const ffArrow = document.createElement('span');
        ffArrow.innerHTML = '⏩';
        ffArrow.style.fontSize = '18px';
        fastForwardButton.appendChild(ffArrow);

        const ffText = document.createElement('span');
        ffText.id = 'fftext';
        ffText.textContent = `${ffSeconds}s`;
        ffText.style.color = '#fff';
        ffText.style.fontSize = '12px';
        fastForwardButton.appendChild(ffText);

        // Para el botón de Configure, aplicamos el mismo estilo para que tenga la misma altura en hover
        const configureButton = createButtonWithHover('⚙️', 'Configure', (event) => {
            let modal = document.querySelector('#custom-config-modal');
            if (!modal) {
                createModal(event.target);
            } else {
                modal.style.visibility = modal.style.visibility === 'hidden' ? 'visible' : 'hidden';
            }
        });
        configureButton.style.display = 'flex';
        configureButton.style.flexDirection = 'column';
        configureButton.style.alignItems = 'center';
        configureButton.style.padding = '8px 0px';

        // configureButton.style.gap = '2px';

        // Se mantiene el contenedor principal sin cambios
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.order = '1';

        container.appendChild(rewindButton);
        container.appendChild(configureButton);
        container.appendChild(fastForwardButton);

        const playerControls = document.querySelector('.player-controls__left-control-group');
        if (playerControls) {
            playerControls.appendChild(container);
        } else {
            console.error('No se pudo encontrar el contenedor de controles del reproductor.');
        }


        // Crear el modal de configuración
        function createModal(configureButton) {
            const modal = document.createElement('div');
            modal.id = 'custom-config-modal';
            modal.style.position = 'absolute';
            modal.style.top = '-120px';
            modal.style.left = '0';
            modal.style.width = '200px';
            modal.style.backgroundColor = '#1e1e1e';
            modal.style.color = '#fff';
            modal.style.border = '1px solid #9146FF';
            modal.style.borderRadius = '8px';
            modal.style.padding = '12px';
            modal.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.5)';
            modal.style.display = 'flex';
            modal.style.flexDirection = 'column';
            modal.style.gap = '10px'; // Establecer el gap al crear el modal
            modal.style.zIndex = '1000';

            // Crear las filas
            modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <label for="rewind-seconds" style="margin: 0;">Rewind Seconds</label>
            <input id="rewind-seconds" type="number" min="1" max="60" value="${rewindSeconds}" style="width: 50px; text-align: center;">
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <label for="ff-seconds" style="margin: 0;">FF Seconds</label>
            <input id="ff-seconds" type="number" min="1" max="60" value="${ffSeconds}" style="width: 50px; text-align: center;">
        </div>
        <button id="save-config" style="background-color: #9146FF; color: #fff; border: none; padding: 4px; border-radius: 4px; cursor: pointer;width: -webkit-fill-available;">Save</button>
    `;

            modal.querySelector('#save-config').addEventListener('click', () => {
                const rewindInput = modal.querySelector('#rewind-seconds');
                const ffInput = modal.querySelector('#ff-seconds');

                // Actualizar las variables globales
                rewindSeconds = parseInt(rewindInput.value, 10) || 10;
                ffSeconds = parseInt(ffInput.value, 10) || 10;

                // Guardar los valores en localStorage
                localStorage.setItem('rewindSeconds', rewindSeconds);
                localStorage.setItem('ffSeconds', ffSeconds);

                // Actualizar el texto debajo de los botones
                const rewindText = document.getElementById('rewindtext');
                const ffText = document.getElementById('fftext');

                if (rewindText) rewindText.textContent = `${rewindSeconds}s`;
                if (ffText) ffText.textContent = `${ffSeconds}s`;

                // Ocultar modal
                modal.style.visibility = 'hidden';
            });

            // Agregar el modal al botón de configurar
            configureButton.parentElement.appendChild(modal);
        }

        // Función para aplicar 'order: 2' a todos los elementos del grupo de controles
        function setOrderForNewElements() {
            const controlsGroup = document.querySelector('.player-controls__right-control-group');
            if (controlsGroup) {
                // Aplica 'order: 2' a todos los elementos que no tengan 'order: 1' y que no tengan la clase específica
                controlsGroup.querySelectorAll(':not([style*="order: 1"]):not(.ScTransitionBase-sc-hx4quq-0)').forEach(element => {
                    element.style.order = '2';
                });
            }
        }

        // Inicializamos el observador para detectar cambios en los elementos dentro de player-controls__right-control-group
        const observer = new MutationObserver(() => {
            setOrderForNewElements(); // Llamamos a la función cada vez que se detecta un cambio
        });

        // Configuramos el observador para observar cambios en los elementos hijos del contenedor de los controles
        const controlsGroup = document.querySelector('.player-controls__right-control-group');
        if (controlsGroup) {
            observer.observe(controlsGroup, { childList: true, subtree: true });
        }

        // Aseguramos que el speedContainer tenga order: 1
        const speedContainer = document.querySelector('.player-controls__right-control-group > div:first-child');
        if (speedContainer) {
            speedContainer.style.order = '1';
        }

        let lastPlaybackRate = videoPlayer.playbackRate; // Definir la última velocidad conocida

        // Escuchar el evento de presionar una tecla
        document.addEventListener('keydown', (event) => {
            const video = document.querySelector('video');
            if (!video) return;

            // Detectar la tecla presionada
            switch (event.key) {
                case 'ArrowLeft': // Flecha izquierda: retroceder 10 segundos
                    showFeedback(`-10s`, 'left'); // Mostrar notificación de retroceso
                    break;

                case 'ArrowRight': // Flecha derecha: avanzar 10 segundos
                    showFeedback(`+10s`, 'right'); // Mostrar notificación de avance
                    break;

                default:
                    break;
            }

            // Verificar si se ha cambiado la velocidad del video y mostrar la notificación
            if (video.playbackRate !== lastPlaybackRate) {
                showSpeedNotification(video.playbackRate);
                lastPlaybackRate = video.playbackRate; // Actualizar la última velocidad
            }
        });

        // Función para mostrar el feedback (mensajes de retroceso y avance)
        function showFeedback(message, position) {
            const player = document.querySelector('.video-player'); // Verifica que este selector sea correcto para el reproductor de Twitch
            if (!player) return;

            const feedback = document.createElement('div');
            feedback.style.position = 'absolute';
            feedback.style.color = 'white';
            feedback.style.fontSize = '24px';
            feedback.style.fontWeight = 'bold';
            feedback.style.display = 'flex';
            feedback.style.alignItems = 'center'; // Centrar contenido verticalmente
            feedback.style.justifyContent = 'center'; // Centrar contenido horizontalmente
            feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            feedback.style.padding = '10px';
            feedback.style.borderRadius = '5px';
            feedback.style.zIndex = '9999';
            feedback.style.transform = 'translateY(-50%)';

            // Posición: izquierda o derecha del reproductor
            feedback.style.top = '40%';
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

            // Estilo para las flechas
            const arrowStyle = `
        display: inline-block;
        width: 24px;
        height: 24px;
        transform-origin: center; /* Punto de rotación centrado */
        vertical-align: middle; /* Alineación vertical */
        margin-top: -4px; /* Ajuste fino para centrar con respecto al texto */
        align-self: center; /* Alineación específica */
        `;

            // Añadir las flechas SVG animadas después del texto
            for (let i = 0; i < 3; i++) {
                const arrow = document.createElement('div');
                arrow.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" style="${arrowStyle}">
            <path d="M12 2L3 12L12 22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
                arrow.style.opacity = '0';
                arrow.style.transition = 'opacity 0.5s ease'; // Transición para la opacidad

                // Rotar las flechas del lado derecho (flip)
                if (position === 'left') {
                    arrow.style.animation = `arrowFadeLeft 0.75s ease ${i * 0.1}s forwards`;
                } else if (position === 'right') {
                    arrow.style.transform = 'rotate(180deg)';
                    arrow.style.animation = `arrowFadeRight 0.75s ease ${i * 0.1}s forwards`;
                }

                setTimeout(() => {
                    arrow.style.opacity = '1'; // Hacer las flechas visibles después del retraso de la animación
                }, i * 100);

                feedback.appendChild(arrow);
            }

            player.appendChild(feedback);

            // Eliminar el mensaje después de 1 segundo
            setTimeout(() => {
                feedback.remove();
            }, 1000);
        }

        // Función para mostrar la notificación de la velocidad
        function showSpeedNotification(speed) {
            if (!videoPlayer) return;

            // Crear el elemento de notificación si no existe
            let notification = document.getElementById('speed-notification');
            if (!notification) {
                notification = document.createElement('div');
                notification.id = 'speed-notification';
                notification.style.position = 'absolute';
                notification.style.top = '25%';
                notification.style.left = '50%';
                notification.style.transform = 'translate(-50%, -50%)';
                notification.style.padding = '10px 20px';
                notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                notification.style.color = '#fff';
                notification.style.fontSize = '18px';
                notification.style.borderRadius = '8px';
                notification.style.zIndex = '1000';
                notification.style.textAlign = 'center';
                videoPlayer.parentElement.appendChild(notification);
            }

            // Actualizar texto y mostrar
            notification.textContent = `${speed}x`;
            notification.style.display = 'block';

            // Ocultar después de 1.5 segundos
            clearTimeout(notification.timeout);
            notification.timeout = setTimeout(() => {
                notification.style.display = 'none';
            }, 500);
        }

        // Add highlight styles for hover effect
        var style = document.createElement('style');
        style.innerHTML = `
        @keyframes arrowFadeLeft {
            0% {
                opacity: 0;
                transform: translateX(-10px);
            }
            100% {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes arrowFadeRight {
            0% {
                opacity: 0;
                transform: translateX(10px);
            }
            100% {
                opacity: 1;
                transform: translateX(0);
            }
        }
        `;

        // Iniciar todo
        enableTheatreMode();
        createSpeedControlContainer();
        setOrderForNewElements();

        // Establecer la altura del contenedor
        ['.player-controls__right-control-group', '.player-controls__left-control-group']
            .forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.style.height = '30px';
        });
    }

    // Iniciar el proceso de verificación
    checkElementsReady();

    // También usar MutationObserver como respaldo
    const observer = new MutationObserver(function(mutations) {
        if (!initialized) {
            checkElementsReady();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();