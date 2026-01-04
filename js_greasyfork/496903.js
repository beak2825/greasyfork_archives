// ==UserScript==
// @name         Drawaria Image Chat Importer!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows you to select and upload an image from your computer to the chatbox.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496903/Drawaria%20Image%20Chat%20Importer%21.user.js
// @updateURL https://update.greasyfork.org/scripts/496903/Drawaria%20Image%20Chat%20Importer%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para crear un elemento de imagen con la fuente de la imagen seleccionada
    function createImageElement(src) {
        var img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = '100%'; // Ajusta el tamaño de la imagen al tamaño del contenedor
        return img;
    }

    // Función para agregar un mensaje de chat con una imagen al chatbox
    function addChatMessageWithImage(imageSrc, imageUrl) {
        var chatbox = document.getElementById('chatbox_messages');
        if (!chatbox) {
            console.error('Chatbox element not found.');
            return;
        }

        var messageDiv = document.createElement('div');
        messageDiv.className = 'chatmessage playerchatmessage-highlightable';
        messageDiv.dataset.playerid = '1';
        messageDiv.dataset.ts = Date.now();

        // Elemento para la imagen visible solo para el usuario
        var imageElement = createImageElement(imageSrc);
        messageDiv.appendChild(imageElement);

        // Elemento de enlace para los otros jugadores
        var linkElement = document.createElement('a');
        linkElement.href = imageUrl;
        linkElement.textContent = '';
        linkElement.target = '_blank';
        messageDiv.appendChild(linkElement);

        chatbox.appendChild(messageDiv);
        chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
    }

    /**
     * Utility :
     * Easily upload an Image for your Avatar
     */
    function uploadToAvatar(img, callback) {
        fetch(window.LOGGEDIN ? 'https://drawaria.online/saveavatar' : 'https://drawaria.online/uploadavatarimage', {
            method: 'POST',
            body: 'imagedata=' + encodeURIComponent(img) + '&fromeditor=true',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                Accept: 'text/plain, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest',
            },
        }).then((response) => {
            if (response.ok) {
                const imageUrl = 'https://drawaria.online/avatar/cache/' + encodeURIComponent(img);
                callback(null, imageUrl);
            } else {
                callback(response.statusText);
            }
        }).catch((error) => {
            callback('Upload error: ' + error.message);
        });
    }

    /**
     * Socket event emitters
     */
    const emits = {
        chatmsg: function (message) {
            let data = ['chatmsg', message];
            return `${42}${JSON.stringify(data)}`;
        }
    };

    // Agrega un botón al lado del botón secundario
    var secondaryButton = document.getElementById('gesturespickerbutton');
    if (!secondaryButton) {
        console.error('Secondary button not found.');
        return;
    }

    var uploadButton = document.createElement('button');
    uploadButton.textContent = 'Upload Image';
    uploadButton.style.marginLeft = '5px'; // Espacio entre el botón secundario y el nuevo botón

    // Event listener para el botón de carga de imagen
    uploadButton.addEventListener('click', function() {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/png, image/jpeg';
        fileInput.click();

        fileInput.addEventListener('change', function() {
            var file = fileInput.files[0];
            if (!file) {
                console.error('No file selected.');
                return;
            }

            var reader = new FileReader();
            reader.onload = function(e) {
                var imageSrc = e.target.result;

                // Subir la imagen al servidor
                uploadToAvatar(imageSrc, function(error, imageUrl) {
                    if (error) {
                        console.error(error);
                        return;
                    }

                    // Agregar el mensaje de chat con la imagen y el enlace
                    addChatMessageWithImage(imageSrc, imageUrl);

                    // Emitir el mensaje de chat con el enlace para otros jugadores
                    const socket = io(); // Asumiendo que `io` está disponible en el ámbito global para conectarse al socket
                    socket.emit('chatmsg', emits.chatmsg(imageUrl));
                });
            };
            reader.readAsDataURL(file);
        });
    });

    secondaryButton.parentNode.insertBefore(uploadButton, secondaryButton.nextSibling);

    // Elimina el botón de gestos
    secondaryButton.remove();
})();
