// ==UserScript==
// @name         Menéame Auto-fill con Banner
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto-rellenar titular, entradilla y etiquetas en Menéame al compartir una URL, con notificaciones visuales.
// @author       Tu Nombre
// @match        https://www.meneame.net/submit
// @license MIT
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/519197/Men%C3%A9ame%20Auto-fill%20con%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/519197/Men%C3%A9ame%20Auto-fill%20con%20Banner.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('DOMContentLoaded', () => {
    // Código del script aquí
});
'use strict';

    // Crear el banner de notificación
    function createBanner() {
        const banner = document.createElement('div');
        banner.id = 'meneame-banner';
        banner.style.position = 'fixed';
        banner.style.top = '10px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.padding = '10px 20px';
        banner.style.backgroundColor = '#007bff';
        banner.style.color = '#fff';
        banner.style.fontSize = '16px';
        banner.style.borderRadius = '5px';
        banner.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        banner.style.zIndex = '9999';
        banner.style.display = 'none'; // Oculto inicialmente
        document.body.appendChild(banner);
        return banner;
    }

    // Mostrar el banner
    function showBanner(message) {
        const banner = document.getElementById('meneame-banner') || createBanner();
        banner.textContent = message;
        banner.style.display = 'block';
    }

    // Ocultar el banner
    function hideBanner() {
        const banner = document.getElementById('meneame-banner');
        if (banner) banner.style.display = 'none';
    }

    // Función para obtener metadatos de una URL
    function fetchMetadata(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: (response) => {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const title = doc.querySelector('title')?.innerText || '';
                        const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
                        resolve({ title, description });
                    } else {
                        reject('Error al obtener los metadatos de la página');
                    }
                },
                onerror: () => reject('Error al conectar con la URL')
            });
        });
    }

    // Función para sugerir etiquetas a partir del título y la descripción
    function suggestTags(text) {
        const keywords = text.toLowerCase().split(/\W+/).filter(word => word.length > 4); // Palabras clave con más de 4 letras
        const uniqueKeywords = [...new Set(keywords)].slice(0, 5); // Selecciona las 5 primeras únicas
        return uniqueKeywords.join(', ');
    }

    // Obtén los campos del formulario
    const urlInput = document.querySelector('#url'); // Campo de URL
    const titleInput = document.querySelector('#title'); // Campo de título
    const descriptionInput = document.querySelector('#description'); // Campo de descripción
    const tagsInput = document.querySelector('#tags'); // Campo de etiquetas

    // Escucha cambios en el campo de URL
    if (urlInput) {
        urlInput.addEventListener('change', async () => {
            const url = urlInput.value.trim();
            if (url) {
                try {
                    // Mostrar banner de procesamiento
                    showBanner('Procesando datos de la URL...');

                    // Obtén metadatos de la página
                    const { title, description } = await fetchMetadata(url);

                    // Inserta los datos en los campos correspondientes
                    if (titleInput) titleInput.value = title;
                    if (descriptionInput) descriptionInput.value = description;
                    if (tagsInput) tagsInput.value = suggestTags(title + ' ' + description);

                    // Mostrar banner de éxito
                    showBanner('¡Datos completados automáticamente!');
                    setTimeout(hideBanner, 3000); // Ocultar después de 3 segundos
                } catch (error) {
                    console.error(error);
                    showBanner('Error al procesar la URL.');
                    setTimeout(hideBanner, 3000);
                }
            }
        });
    }
})();