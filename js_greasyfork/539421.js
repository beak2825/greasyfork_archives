// ==UserScript==
// @name         Drawaria Avatar Copy Players
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  You need to click on some player profile, download his picture, then drop the picture in the drag and drop part.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539421/Drawaria%20Avatar%20Copy%20Players.user.js
// @updateURL https://update.greasyfork.org/scripts/539421/Drawaria%20Avatar%20Copy%20Players.meta.js
// ==/UserScript==

(function() {
    'use-strict';

    // --- 1. INYECTAR LA INTERFAZ DE USUARIO (HTML Y CSS) ---

    // Estilos para el panel flotante y la zona de arrastre.
    const styles = `
        #avatar-switcher-panel {
            position: fixed;
            top: 150px;
            left: 20px;
            z-index: 9999;
            background: #f0f8ff;
            border: 1px solid #b0c4de;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            font-family: sans-serif;
            width: 250px;
            cursor: move;
            user-select: none;
        }
        #avatar-drop-zone {
            border: 2px dashed #4682b4;
            border-radius: 5px;
            padding: 20px;
            text-align: center;
            margin-top: 10px;
            color: #4682b4;
            font-weight: bold;
            transition: background-color 0.2s;
        }
        #avatar-drop-zone.hover {
            background-color: #e6f7ff;
            border-style: solid;
        }
        #avatar-upload-button {
            display: block;
            width: 100%;
            padding: 10px;
            margin-top: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
            font-size: 16px;
        }
        #avatar-upload-button:hover {
            background-color: #45a049;
        }
        #avatar-file-input {
            display: none;
        }
        #avatar-status-message {
            margin-top: 10px;
            font-size: 14px;
            text-align: center;
            color: #333;
        }
        #player-name-display-container {
            display: flex;
            align-items: center;
            margin-top: 10px;
        }
        #player-name-field {
            width: calc(100% - 30px);
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #eee;
            color: #555;
            font-size: 14px;
        }
        #copy-name-icon {
            cursor: pointer;
            margin-left: 5px;
            color: #555;
            font-size: 18px;
        }
        /* FontAwesome for copy icon - if not loaded by Drawaria, we need to load it */
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
    `;

    // Crear el panel y sus elementos.             <label id="avatar-upload-button" for="avatar-file-input">Subir Avatar Descargado</label>
    const panelHTML = `
        <div id="avatar-switcher-panel">
            <h3 style="text-align:center; margin:0 0 10px 0; color:#1e90ff;">Avatar Copy Players</h3>
            <div id="avatar-drop-zone">Arrastra y suelta imagen aquí</div>

            <div id="player-name-display-container">
                <input type="text" id="player-name-field" value="" disabled>
                <i id="copy-name-icon" class="fas fa-copy"></i>
            </div>


            <input type="file" id="avatar-file-input" accept="image/*">
            <div id="avatar-status-message">Haz clic en un avatar para descargarlo.</div>
        </div>
    `;

    // Añadir los estilos y el HTML a la página.
    document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // --- 2. LÓGICA DE FUNCIONALIDAD ---

    const panel = document.getElementById('avatar-switcher-panel');
    const dropZone = document.getElementById('avatar-drop-zone');
    const fileInput = document.getElementById('avatar-file-input');
    const statusMessage = document.getElementById('avatar-status-message');
    const playerNameDisplayContainer = document.getElementById('player-name-display-container');
    const playerNameField = document.getElementById('player-name-field');
    const copyNameIcon = document.getElementById('copy-name-icon');

    // Ocultar el contenedor del nombre al inicio si no hay nombre guardado
    playerNameDisplayContainer.style.display = 'none';

    /**
     * Copia el texto al portapapeles.
     * @param {string} text El texto a copiar.
     */
    function copyTextToClipboard(text) {
        if (!navigator.clipboard) {
            console.error('La API del portapapeles no está disponible.');
            statusMessage.textContent = 'Tu navegador no soporta copiar.';
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
            statusMessage.textContent = `"${text}" copiado al portapapeles.`;
            console.log('Nombre copiado al portapapeles.');
        }, function(err) {
            console.error('Falló al copiar el nombre:', err);
            statusMessage.textContent = '¡Fallo al copiar el nombre!';
        });
    }

    /**
     * Descarga una imagen desde una URL al ordenador del usuario.
     * @param {string} url La URL de la imagen.
     * @param {string} filename El nombre con el que se guardará el archivo.
     * @param {string} playerName El nombre del jugador para mostrar en el campo del panel.
     */
    function downloadImage(url, filename, playerName) {
        statusMessage.textContent = `Descargando ${filename}...`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: function(response) {
                const urlCreator = window.URL || window.webkitURL;
                const imageUrl = urlCreator.createObjectURL(response.response);
                const a = document.createElement('a');
                a.href = imageUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                urlCreator.revokeObjectURL(imageUrl);

                // Actualizar el campo de texto con el nombre y mostrarlo
                playerNameField.value = playerName;
                playerNameDisplayContainer.style.display = 'flex'; // Mostrar el campo de nombre
                localStorage.setItem('lastDownloadedPlayerName', playerName); // Guardar para autocompletar en recarga
                localStorage.setItem('autoPasteNameFlag', 'true'); // Indicar que se debe pegar en recarga

                statusMessage.textContent = `${filename} descargado. Nombre "${playerName}" listo para pegar.`;
            },
            onerror: function() {
                statusMessage.textContent = '¡Fallo en la descarga!';
            }
        });
    }

    /**
     * Sube el archivo de imagen seleccionado al servidor de Drawaria.
     * @param {File} file El archivo de imagen.
     */
    async function handleFileUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            statusMessage.textContent = 'Por favor, selecciona un archivo de imagen.';
            return;
        }

        statusMessage.textContent = 'Subiendo...';
        const reader = new FileReader();
        reader.onload = async function(e) {
            let base64ImageData = e.target.result;
            // Estandarizar el tipo MIME para máxima compatibilidad
            base64ImageData = base64ImageData.replace(/^data:image\/\w+;/, "data:image/jpeg;");

            const isLoggedIn = typeof window.LOGGEDIN !== 'undefined' && window.LOGGEDIN;
            const uploadUrl = isLoggedIn ? 'https://drawaria.online/saveavatar' : 'https://drawaria.online/uploadavatarimage';

            try {
                const response = await fetch(uploadUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: 'imagedata=' + encodeURIComponent(base64ImageData)
                });

                if (response.ok && response.status === 200) {
                    const responseText = await response.text();
                    if (responseText && responseText.trim()) {
                        statusMessage.textContent = '¡Subida exitosa!';
                        alert('¡Avatar subido con éxito! La página se recargará para ver los cambios.');
                        location.reload(); // Recargar para aplicar el avatar y el nombre
                    } else {
                        throw new Error('El servidor devolvió una respuesta vacía o inválida.');
                    }
                } else {
                    throw new Error(`El servidor respondió con estado: ${response.status}`);
                }
            } catch (error) {
                console.error('Fallo en la subida:', error);
                statusMessage.textContent = '¡Fallo en la subida! Revisa la consola.';
                alert('Fallo en la subida. El servidor pudo haber rechazado la imagen. Revisa la consola (F12) para detalles.');
            }
        };
        reader.readAsDataURL(file);
    }

    // --- 3. LÓGICA DE INTERACCIÓN (CLICS, ARRASTRAR, ETC.) ---

    // Lógica para hacer el panel movible.
    let isDragging = false;
    let offsetX, offsetY;
    panel.addEventListener('mousedown', (e) => {
        // Asegurarse de que no estamos arrastrando elementos interactivos dentro del panel
        if (e.target !== fileInput && e.target !== playerNameField && e.target !== copyNameIcon && e.target !== dropZone && e.target.tagName !== 'LABEL') {
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            panel.style.transition = 'none'; // Desactivar transición mientras se arrastra
        }
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        panel.style.transition = ''; // Reactivar transición
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            panel.style.left = `${e.clientX - offsetX}px`;
            panel.style.top = `${e.clientY - offsetY}px`;
        }
    });

    // Eventos para la zona de arrastrar y soltar.
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('hover');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('hover');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('hover');
        const file = e.dataTransfer.files[0];
        handleFileUpload(file);
    });

    // Evento para el botón de subida de archivo.
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFileUpload(file);
    });

    // Evento para el icono de copiar nombre.
    copyNameIcon.addEventListener('click', () => {
        copyTextToClipboard(playerNameField.value);
    });

    // Listener principal para descargar el avatar y guardar el nombre al hacer clic.
    document.body.addEventListener('click', async function(event) {
        const playerRow = event.target.closest('.playerlist-row');

        if (playerRow) {
            const playerAvatarImg = playerRow.querySelector('.playerlist-avatar');
            const playerNameLink = playerRow.querySelector('.playerlist-name a');

            if (playerAvatarImg && playerNameLink) {
                event.preventDefault(); // Evitar cualquier acción por defecto del clic
                event.stopPropagation();

                const avatarSrc = playerAvatarImg.src;
                const playerName = playerNameLink.textContent.trim();
                const filename = `${playerName.replace(/[^a-z0-9]/gi, '_')}.jpg`;

                // Descargar la imagen y guardar el nombre para autocompletado/visualización
                downloadImage(avatarSrc, filename, playerName);
            }
        }
    });

    // --- 4. LÓGICA DE INICIO (AUTOCOMPLETADO AL CARGAR PÁGINA) ---
    // Se ejecuta al cargar el script (document-idle)
    const lastDownloadedName = localStorage.getItem('lastDownloadedPlayerName');
    const autoPasteFlag = localStorage.getItem('autoPasteNameFlag');

    if (lastDownloadedName && autoPasteFlag === 'true') {
        const selfPlayerNameInput = document.getElementById('playername');
        if (selfPlayerNameInput) {
            selfPlayerNameInput.value = lastDownloadedName;
            selfPlayerNameInput.dispatchEvent(new Event('input', { bubbles: true }));
            statusMessage.textContent = `Nombre "${lastDownloadedName}" establecido automáticamente.`;
            console.log(`Nombre de perfil establecido automáticamente a: ${lastDownloadedName}`);
        } else {
            // Si el campo de nombre no está disponible inmediatamente (ej. en la pantalla de login)
            // lo mostramos en el panel y esperamos la interacción manual.
            playerNameField.value = lastDownloadedName;
            playerNameDisplayContainer.style.display = 'flex';
            statusMessage.textContent = `Nombre "${lastDownloadedName}" listo para pegar.`;
            console.warn('Campo de nombre de perfil (#playername) no encontrado en la carga automática.');
        }
        // Limpiar las banderas después de procesar para evitar re-pegar en futuras recargas no deseadas.
        localStorage.removeItem('lastDownloadedPlayerName');
        localStorage.removeItem('autoPasteNameFlag');
    } else if (lastDownloadedName) {
        // Si hay un nombre guardado pero no la bandera de auto-pegar (ej. recarga manual, o error previo),
        // solo lo mostramos en el panel.
        playerNameField.value = lastDownloadedName;
        playerNameDisplayContainer.style.display = 'flex';
        statusMessage.textContent = `Nombre "${lastDownloadedName}" listo para pegar.`;
    }

})();