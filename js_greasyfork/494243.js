// ==UserScript==
// @name         Duolingo Avatar Uploader
// @namespace    http://yournamespace.com
// @version      0.1
// @description  Agrega un botón para subir una foto como avatar en Duolingo
// @author       Your Name
// @license      MIT
// @match        https://www.duolingo.com/settings/avatar
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494243/Duolingo%20Avatar%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/494243/Duolingo%20Avatar%20Uploader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Esperar a que la página esté completamente cargada
    window.addEventListener('load', function() {

        // Función para manejar la carga de la imagen
        function handleImageUpload(event) {
            const file = event.target.files[0]; // Obtener el archivo seleccionado
            if (file) {
                const formData = new FormData(); // Crear objeto FormData
                formData.append('avatar', file); // Agregar archivo al FormData

                // Enviar la imagen al servidor
                fetch('https://www.duolingo.com/api/1/avatar', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Imagen subida exitosamente');
                        // Recargar la página para ver el avatar actualizado
                        window.location.reload();
                    } else {
                        console.error('Error al subir la imagen');
                        alert('Hemos tenido problemas al procesar el envío. Por favor, inténtalo de nuevo.');
                    }
                })
                .catch(error => {
                    console.error('Error al subir la imagen:', error);
                    alert('Hubo un error al subir la imagen. Por favor, inténtalo de nuevo.');
                });
            }
        }

        // Encontrar el contenedor donde quieres agregar el botón (ajusta el selector según tu necesidad)
        const avatarSettingsContainer = document.querySelector('.avatar-settings-container');

        if (avatarSettingsContainer) {
            // Crear un botón personalizado para subir la imagen
            const uploadButton = document.createElement('button');
            uploadButton.textContent = 'Subir Imagen'; // Texto del botón
            uploadButton.addEventListener('click', function() {
                // Crear un input de tipo file al hacer clic en el botón
                const fileInput = document.createElement('input');
                fileInput.type = 'file'; // Establecer el tipo como 'file'
                fileInput.accept = 'image/*'; // Permitir solo archivos de imagen
                fileInput.style.display = 'none'; // Ocultar el input de forma inicial

                // Escuchar eventos de cambio en el input de tipo file
                fileInput.addEventListener('change', handleImageUpload);

                // Simular clic en el input de tipo file para abrir el selector de archivos
                fileInput.click();
            });

            // Agregar el botón al contenedor
            avatarSettingsContainer.appendChild(uploadButton);
        } else {
            console.error('No se encontró el contenedor para agregar el botón.');
        }

    });

})();
