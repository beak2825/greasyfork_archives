// ==UserScript==
// @name         Wallapop Filtrar articulos de un vendedor por palabras
// @namespace    http://tampermonkey.net/
// @author       Sergi0
// @version      1.1
// @description  Añade un campo de texto siempre visible en la parte lateral inferior de la página de perfil de usuario de Wallapop y filtra artículos según el texto ingresado.
// @match        https://es.wallapop.com/*
// @grant        none
// @icon         https://es.wallapop.com/favicon.ico
// @language     es
// @grant        none
// @license MIT
// @homepageURL  https://greasyfork.org/es/scripts/500126-wallapop-filtrar-articulos-de-un-vendedor-por-palabras
// @supportURL   https://greasyfork.org/es/scripts/500126-wallapop-filtrar-articulos-de-un-vendedor-por-palabras/feedback
// @downloadURL https://update.greasyfork.org/scripts/500126/Wallapop%20Filtrar%20articulos%20de%20un%20vendedor%20por%20palabras.user.js
// @updateURL https://update.greasyfork.org/scripts/500126/Wallapop%20Filtrar%20articulos%20de%20un%20vendedor%20por%20palabras.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        let currentURL = window.location.href;
        let cargarProductosInterval = null;

        console.log("Página cargada:", currentURL);

        function crearCampoDeTexto() {
            console.log("Creando campo de texto...");

            if (document.getElementById('customNoteContainer')) {
                console.log("El campo de texto ya existe. Saliendo de la función.");
                return;
            }

            const container = document.createElement('div');
            container.id = 'customNoteContainer';
            container.style.position = 'fixed';
            container.style.bottom = '10px';
            container.style.right = '-310px';
            container.style.width = '300px';
            container.style.backgroundColor = '#1abc9c';
            container.style.opacity = '0';
            container.style.color = 'white';
            container.style.padding = '10px';
            container.style.textAlign = 'left';
            container.style.zIndex = '9999';
            container.style.fontWeight = 'bold';
            container.style.transition = 'opacity 2s ease, right 2s ease';
            container.style.borderRadius = '10px';
            container.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

            const textArea = document.createElement('textarea');
            textArea.style.width = '100%';
            textArea.style.height = '100%';
            textArea.style.backgroundColor = 'inherit';
            textArea.style.color = 'inherit';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.fontFamily = 'inherit';
            textArea.style.fontSize = 'inherit';
            textArea.style.resize = 'none';
            textArea.style.fontWeight = 'bold';
            textArea.style.color = '#ffffff';
            textArea.placeholder = 'Escribe aquí para filtrar artículos...';

            const style = document.createElement('style');
            style.textContent = `
                #customNoteContainer textarea::placeholder {
                    color: #ffffff;
                    font-weight: bold;
                }
            `;
            document.head.appendChild(style);

            textArea.addEventListener('input', function() {
                const searchText = textArea.value.toLowerCase();
                console.log("Filtrando artículos por texto:", searchText);
                const items = document.querySelectorAll('.public-profile-published-items_PublicProfileItems__card__E2D5a');
                console.log("Número de artículos encontrados:", items.length);

                items.forEach((item, index) => {
                    const titleElement = item.querySelector('.item-card_ItemCard__title__8eq2b');
                    if (titleElement) {
                        const titleText = titleElement.textContent.toLowerCase();
                        console.log(`Artículo ${index + 1}: ${titleText}, Visible: ${titleText.includes(searchText)}`);

                        item.style.display = titleText.includes(searchText) ? '' : 'none';
                    } else {
                        console.log(`Artículo ${index + 1} no tiene título.`);
                    }
                });
            });

            container.appendChild(textArea);
            document.body.appendChild(container);

            setTimeout(() => {
                container.style.opacity = '0.7';
                container.style.right = '10px';
                console.log("Campo de texto visible.");
            }, 100);
        }

        function ocultarCampoDeTexto() {
            const container = document.getElementById('customNoteContainer');
            if (container) {
                console.log("Ocultando campo de texto...");
                container.style.opacity = '0';
                container.style.right = '-310px';
                setTimeout(() => {
                    if (container.parentNode) {
                        container.parentNode.removeChild(container);
                        console.log("Campo de texto eliminado.");
                    }
                }, 2000);
            }
        }

        function checkURLChange() {
            if (currentURL !== window.location.href) {
                console.log("Cambio de URL detectado:", currentURL, " -> ", window.location.href);
                currentURL = window.location.href;
                if (currentURL.startsWith('https://es.wallapop.com/app/user/') || currentURL.startsWith('https://es.wallapop.com/user/')) {
                    crearCampoDeTexto();
                    iniciarCargaProductos();
                } else {
                    ocultarCampoDeTexto();
                    detenerCargaProductos();
                }
            }
        }

        function iniciarCargaProductos() {
            cargarProductosInterval = setInterval(() => {
                const botonVerMas = document.querySelector('walla-button[text="Ver más productos"]');

                if (botonVerMas) {
                    console.log("Botón 'Ver más productos' encontrado.");

                    if (!botonVerMas.hasAttribute('disabled')) {
                        console.log("Botón 'Ver más productos' habilitado y listo para clic.");

                        botonVerMas.click(); // Intenta hacer clic directamente
                        console.log("Clic ejecutado.");
                    } else {
                        console.log("Botón 'Ver más productos' está deshabilitado.");
                    }
                } else {
                    console.log("Botón 'Ver más productos' no encontrado.");
                }
            }, 1000);
        }

        function detenerCargaProductos() {
            clearInterval(cargarProductosInterval);
            console.log("Carga de productos detenida.");
        }

        function isVisible(element) {
            return element.offsetWidth > 0 || element.offsetHeight > 0;
        }

        const observer = new MutationObserver(checkURLChange);
        observer.observe(document.body, { childList: true, subtree: true });

        setInterval(checkURLChange, 1000);

        if (currentURL.startsWith('https://es.wallapop.com/app/user/') || currentURL.startsWith('https://es.wallapop.com/user/')) {
            crearCampoDeTexto();
            iniciarCargaProductos();
        }
    });
})();
