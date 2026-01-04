// ==UserScript==
// @name         Wallapop Descargar Info de Producto
// @namespace    https://violentmonkey.github.io/
// @version      1.0
// @description  Extrae información y fotos de productos de Wallapop y las descarga en un archivo comprimido.
// @author       Sergi0
// @match        https://es.wallapop.com/item/*
// @icon         https://es.wallapop.com/favicon.ico
// @language     es
// @grant        none
// @license      MIT
// @homepageURL  https://greasyfork.org/es/scripts/512221-wallapop-descargar-info-de-producto
// @supportURL   https://greasyfork.org/es/scripts/512221-wallapop-descargar-info-de-producto/feedback
// @downloadURL https://update.greasyfork.org/scripts/512221/Wallapop%20Descargar%20Info%20de%20Producto.user.js
// @updateURL https://update.greasyfork.org/scripts/512221/Wallapop%20Descargar%20Info%20de%20Producto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cargar JSZip y FileSaver.js
    const loadScripts = () => {
        return new Promise((resolve, reject) => {
            const script1 = document.createElement('script');
            script1.src = 'https://stuk.github.io/jszip/dist/jszip.min.js';
            script1.onload = () => {
                const script2 = document.createElement('script');
                script2.src = 'https://stuk.github.io/jszip-utils/dist/jszip-utils.min.js';
                script2.onload = () => {
                    const script3 = document.createElement('script');
                    script3.src = 'https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js';
                    script3.onload = resolve;
                    script3.onerror = reject;
                    document.body.appendChild(script3);
                };
                script2.onerror = reject;
                document.body.appendChild(script2);
            };
            script1.onerror = reject;
            document.body.appendChild(script1);
        });
    };

    loadScripts().then(() => {
        // Agregar un botón a la página
        const buttonId = 'scraper-button';
        let button = document.getElementById(buttonId);
        if (!button) {
            button = document.createElement('button');
            button.id = buttonId;
            button.textContent = 'Descargar Info del Producto';
            button.style.cssText = `
                position: fixed;
                right: -50%;
                top: 50%;
                transform: translateY(-50%);
                /* width: 440px; */
                background-color: #1abc9c;
                opacity: 0.7;
                color: white;
                padding: 15px;
                border: none;
                border-radius: 10px 0 0 10px;
                cursor: pointer;
                z-index: 1000;
                font-size: 16px;
                font-weight: bold;
                transition: opacity 2s ease, right 2s ease;
            `;
            document.body.appendChild(button);
            button.offsetHeight; // Trigger reflow
            button.style.right = '0'; // Slide in the button
        }

        button.addEventListener('mouseover', () => {
            button.style.opacity = '1'; // Aumentar opacidad al pasar el ratón
        });

        button.addEventListener('mouseout', () => {
            button.style.opacity = '0.7'; // Volver a la opacidad original
        });

        button.addEventListener('click', async () => {
            console.log("Botón presionado");

            try {
                // Crear un nuevo archivo ZIP
                const zip = new JSZip();

                // Obtener el título
                const titleElement = document.querySelector('h1.item-detail_ItemDetail__title__wcPRl');
                const title = titleElement ? titleElement.textContent.trim() : 'Sin título';
                console.log("Título:", title);

                // Obtener la categoría
                const categoryElements = document.querySelectorAll('nav.item-detail-taxonomies_ItemDetailTaxonomies__bubblesContainer__SVfKE div.item-detail-taxonomies_ItemDetailTaxonomies__bubbles__yO53X span');
                const categories = Array.from(categoryElements).map(el => el.textContent.trim()).join(', ') || 'Sin categoría';
                console.log("Categoría:", categories);

                // Obtener la descripción
                const descriptionElement = document.querySelector('section.item-detail_ItemDetail__description__7rXXT');
                const description = descriptionElement ? descriptionElement.textContent.trim() : 'Sin descripción';
                console.log("Descripción:", description);

                // Obtener detalles adicionales
                const detailsElement = document.querySelector('span.item-detail-additional-specifications_ItemDetailAdditionalSpecifications__characteristics__Ut9iT');
                const details = detailsElement ? detailsElement.textContent.trim() : 'Sin detalles adicionales';
                console.log("Detalles adicionales:", details);

                // Obtener hashtags
                const hashtagElements = document.querySelectorAll('div.d-flex a span.item-detail-hashtags_ItemDetailHashtag__text__Rlrpq');
                const hashtags = Array.from(hashtagElements).map(el => el.textContent.trim()).join(', ') || 'Sin hashtags';
                console.log("Hashtags:", hashtags);

                // Obtener precio
                const priceElement = document.querySelector('span.item-detail-price_ItemDetailPrice--standard__TxPXr');
                const price = priceElement ? priceElement.textContent.trim() : 'Sin precio';
                console.log("Precio:", price);

                // Agregar información de texto al ZIP
                const info = `---------- Título ----------\n${title}\n---------- Categoría ----------\n${categories}\n---------- Descripción ----------\n${description}\n---------- Detalles adicionales ----------\n${details}\n---------- Hashtags ----------\n${hashtags}\n---------- Precio ----------\n${price}`;
                zip.file('info.txt', info);

                // Obtener imágenes
                const images = document.querySelectorAll('img[slot="carousel-content"]');
                if (images.length === 0) {
                    console.log("No se encontraron imágenes");
                } else {
                    console.log("Imágenes encontradas:", images.length);
                }

                for (let i = 0; i < images.length; i++) {
                    const imgUrl = images[i].src;
                    console.log(`Descargando imagen ${i + 1}: ${imgUrl}`);

                    const imgBlob = await fetch(imgUrl).then(res => res.blob());
                    zip.file(`imagen_${i + 1}.jpg`, imgBlob);
                }

                // Generar ZIP y solicitar descarga con el título del producto como nombre de archivo
                zip.generateAsync({type: 'blob'}).then((blob) => {
                    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_'); // Remover caracteres especiales del título
                    saveAs(blob, `${sanitizedTitle}.zip`);
                    console.log("Archivo ZIP generado y descargado con el nombre:", sanitizedTitle);
                }).catch(err => {
                    console.error("Error generando el archivo ZIP:", err);
                });

            } catch (error) {
                console.error("Error capturando información:", error);
            }
        });
    }).catch((err) => {
        console.error("Error cargando scripts:", err);
    });
})();
