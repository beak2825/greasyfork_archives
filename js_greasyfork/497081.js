// ==UserScript==
// @name         TMOHentai Image Resizer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Ajusta el tamaño de las imágenes para que quepan en la pantalla y añade botones para cambiar el tamaño manualmente, configurable desde Tampermonkey, con detección de idioma y actualizaciones.
// @author       Luis123456xp
// @license      MIT
// @match        https://tmohentai.com/reader/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @connect      sleazyfork.org
// @downloadURL https://update.greasyfork.org/scripts/497081/TMOHentai%20Image%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/497081/TMOHentai%20Image%20Resizer.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const currentVersion = '1.2';
    const scriptUrl = 'https://sleazyfork.org/es/scripts/497081-tmohentai-image-resizer/code';

    // Determinar el idioma del navegador
    const userLang = navigator.language || navigator.userLanguage;
    const isEnglish = userLang.startsWith('en');

    // Función para comparar versiones
    function compareVersions(v1, v2) {
        const v1parts = v1.split('.').map(Number);
        const v2parts = v2.split('.').map(Number);
        for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
            if ((v1parts[i] || 0) > (v2parts[i] || 0)) return 1;
            if ((v1parts[i] || 0) < (v2parts[i] || 0)) return -1;
        }
        return 0;
    }

    // Verificar si hay una nueva versión disponible
    GM_xmlhttpRequest({
        method: 'GET',
        url: scriptUrl,
        onload: function(response) {
            const match = response.responseText.match(/@version\s+(\d+\.\d+)/);
            if (match) {
                const latestVersion = match[1];
                if (compareVersions(latestVersion, currentVersion) > 0) {
                    $('body').prepend(`
                        <div id="updateNotification" style="position:fixed; top:0; left:0; width:100%; background-color:yellow; z-index:9999; text-align:center; padding:10px;">
                            ${isEnglish ? 'A new version of the script is available. --TMOHentai Image Resizer--' : 'Hay una nueva versión disponible del script. --TMOHentai Image Resizer--'} <a href="https://sleazyfork.org/es/scripts/497081-tmohentai-image-resizer/code" target="_blank">${isEnglish ? 'Click here to update' : 'Haz clic aquí para actualizar'}.</a>
                        </div>
                    `);
                }
            }
        }
    });

    // Función para ajustar el tamaño de la imagen
    function adjustImageSize(scale) {
        let images = document.querySelectorAll('.col-xs-12.text-center img.content-image');
        images.forEach(img => {
            img.style.width = scale + '%';
            img.style.height = 'auto';
            console.log(isEnglish ? `Resizing image to ${scale}%` : `Redimensionando imagen a ${scale}%`);
        });
    }

    // Añadir botones para aumentar y reducir el tamaño de la imagen
    function addResizeButtons() {
        let container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.zIndex = '1000';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.display = 'flex';
        container.style.gap = '5px';

        let zoomInButton = document.createElement('button');
        zoomInButton.innerHTML = '+';
        zoomInButton.style.fontSize = '20px';
        zoomInButton.onclick = function() {
            currentScale += 10;
            adjustImageSize(currentScale);
        };

        let zoomOutButton = document.createElement('button');
        zoomOutButton.innerHTML = '-';
        zoomOutButton.style.fontSize = '20px';
        zoomOutButton.onclick = function() {
            currentScale -= 10;
            adjustImageSize(currentScale);
        };

        container.appendChild(zoomInButton);
        container.appendChild(zoomOutButton);
        document.body.appendChild(container);
    }

    // Función para establecer la escala predeterminada desde la configuración
    function setDefaultScale() {
        let newScale = prompt(isEnglish ? "Enter the new default scale value (in percentage):" : "Ingrese el nuevo valor de escala predeterminado (en porcentaje):", currentScale);
        if (newScale !== null) {
            currentScale = parseInt(newScale, 10);
            GM_setValue('defaultScale', currentScale);
            adjustImageSize(currentScale);
            alert(isEnglish ? `New default scale value set to ${currentScale}%` : `Nuevo valor de escala predeterminado establecido a ${currentScale}%`);
        }
    }

    // Escala inicial de la imagen
    let currentScale = GM_getValue('defaultScale', 40); // Obtener la escala predeterminada almacenada o usar 40%

    // Ajustar el tamaño inicial de las imágenes
    adjustImageSize(currentScale);

    // Añadir los botones de redimensionamiento
    addResizeButtons();

    // Registrar el comando de menú para cambiar la escala predeterminada
    GM_registerMenuCommand(isEnglish ? "Set default scale" : "Configurar escala predeterminada", setDefaultScale);
})(window.jQuery);
