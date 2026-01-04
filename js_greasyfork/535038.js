// ==UserScript==
// @name         CDN Image to Base64 Title
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convierte la primera imagen de la página en Base64 usando fetch y FileReader, guarda en el title del iframe padre; luego redirige a devox.re
// @match        https://cdn.devox.re/*
// @run-at       document-end
// @license MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535038/CDN%20Image%20to%20Base64%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/535038/CDN%20Image%20to%20Base64%20Title.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    try {
        // Buscar la primera imagen en el iframe
        const img = document.querySelector('img');
        if (!img) {
            console.error('No se encontró ninguna imagen para procesar.');
            return;
        }
        const imageUrl = img.src;

        // Obtener imagen como Blob mediante fetch
        const response = await fetch(imageUrl, { mode: 'cors' });
        if (!response.ok) {
            throw new Error(`Error al descargar la imagen: ${response.status}`);
        }
        const blob = await response.blob();

        // Convertir Blob a Base64 usando FileReader
        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Error al convertir Blob a Base64'));
            reader.readAsDataURL(blob);
        });

        // Asignar Base64 al title del iframe padre (o document.title como fallback)
        try {
            window.name = dataUrl;
        } catch (e) {
            console.warn('Erro al asignar la imagne');
        }
        document.location.href = "https://devox.re/"

    } catch (e) {
        console.error('Error en el UserScript:', e);
    }
})();
