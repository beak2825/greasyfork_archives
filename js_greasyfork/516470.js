// ==UserScript==
// @name         Captura de articulo
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Añade un botón para copiar la imagen del artículo completo al portapapeles usando Canvas
// @match        https://devox.me/*/*
// @match        https://devox.me/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @grant        GM_xmlhttpRequest
// @connect      media.devox.me
// @downloadURL https://update.greasyfork.org/scripts/516470/Captura%20de%20articulo.user.js
// @updateURL https://update.greasyfork.org/scripts/516470/Captura%20de%20articulo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showDialog(message, isError = false) {
        // Crear el overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9999';
        overlay.style.animation = 'fadeInOutOverlay 1s ease-in-out';

        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = isError ? '#ff4444' : '#4CAF50';
        dialog.style.color = 'white';
        dialog.style.padding = '20px 40px';
        dialog.style.borderRadius = '10px';
        dialog.style.fontSize = '24px';
        dialog.style.fontWeight = 'bold';
        dialog.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        dialog.style.zIndex = '10000';
        dialog.style.textAlign = 'center';
        dialog.style.minWidth = '200px';
        dialog.style.animation = 'fadeInOut 1s ease-in-out';

        // Agregar el estilo de la animación
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
                            @keyframes fadeInOut {
                                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
                                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
                            }
                            @keyframes fadeInOutOverlay {
                                0% { opacity: 0; }
                                20% { opacity: 1; }
                                80% { opacity: 1; }
                                100% { opacity: 0; }
                            }
                        `;
        document.head.appendChild(styleSheet);

        dialog.textContent = message;
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        setTimeout(() => {
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
            styleSheet.remove();
        }, 1000);
    }

    const addButtonAboveArticle = () => {
        const article = document.querySelector('.voxContent');

        if (article && !article.previousElementSibling || !article.previousElementSibling.classList.contains('copy-image-button-container')) {
            // Crear el contenedor para el botón
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('copy-image-button-container');
            buttonContainer.style.textAlign = 'center';
            buttonContainer.style.marginBottom = '10px';

            // Crear el botón
            const button = document.createElement('button');
            button.innerHTML = '📸 Copiar Imagen del Artículo';
            button.classList.add('copy-image-button');
            button.style.padding = '10px 15px';
            button.style.backgroundColor = '#007BFF';
            button.style.color = '#FFFFFF';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.zIndex = '1000';
            button.style.fontSize = '14px';

            // Insertar el contenedor con el botón justo antes del artículo
            article.parentElement.insertBefore(buttonContainer, article);
            buttonContainer.appendChild(button);

            // Obtener el contenedor de la imagen (etiqueta <a> con clase .voxImage)
            const imageLink = article.querySelector('.voxImage');
            const imageElement = imageLink ? imageLink.querySelector('img') : null;

            if (imageElement) {
                const imageUrl = imageElement.src;

                // Hacer una solicitud GM_xmlhttpRequest para obtener la imagen
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: imageUrl,
                    responseType: 'blob',
                    onload: function(response) {
                        if (response.status === 200) {
                            // Crear un objeto URL para la imagen obtenida
                            const imageUrlObject = URL.createObjectURL(response.response);

                            // Asignar la imagen al contenedor <a> (esto reemplazará la imagen existente)
                            imageElement.src = imageUrlObject;
                        }
                    },
                    onerror: function(error) {
                        console.error('Error al hacer la solicitud:', error);
                    }
                });
            }

            // Evento del botón para capturar el artículo completo y copiarlo
            button.addEventListener('click', () => {
                // Asegurarse de que el documento esté enfocado
                window.focus();

                // Usar html2canvas para capturar el artículo completo
                html2canvas(article, {
                    backgroundColor: "#1d1d1d",  // Fondo transparente
                    useCORS: true,          // Permite imágenes de otros dominios
                    scale: 5                // Escala para mayor resolución
                }).then((canvas) => {
                    // Convertir el canvas a un Blob (imagen en formato binario)
                    canvas.toBlob((blob) => {
                        const clipboardItem = new ClipboardItem({'image/png': blob});
                        navigator.clipboard.write([clipboardItem]).then(() => {
                            showDialog('¡Imagen del artículo copiada! ✅', false);
                        }).catch((err) => {
                            showDialog("Error al copiar la imagen ❌", true);
                            console.error('Error al copiar al portapapeles:', err);
                        });
                    });
                }).catch((error) => {
                    console.error('Error al generar la imagen con html2canvas:', error);
                    showDialog("Error al generar la imagen ❌", true);
                });
            });
        }
    };

    let timePassed = 0;  

    const interval = setInterval(() => {
        const targetNode = document.querySelector('.voxContent');
        if (targetNode) {
            setTimeout(() => {
                addButtonAboveArticle();
            }, 1000);

            const targetNode = document.body;
            const observer = new MutationObserver(() => {
                const article = document.querySelector('.voxContent');
                if (article) {
                    addButtonAboveArticle();
                }
            });

            observer.observe(targetNode, { childList: true, subtree: true });
            clearInterval(interval);
        }

        timePassed++;
        if (timePassed >= 10) {
            clearInterval(interval);
        }

    }, 1000);
})();
