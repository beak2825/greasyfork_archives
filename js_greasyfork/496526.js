// ==UserScript==
// @name         Grabador de pantalla
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script para grabar la pantalla utilizando pyautogui en Python.
// @author       LARA'scripts
// @match        *://*/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/496526/Grabador%20de%20pantalla.user.js
// @updateURL https://update.greasyfork.org/scripts/496526/Grabador%20de%20pantalla.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para grabar la pantalla
    function grabarPantalla(nombreArchivo, duracionSegundos) {
        // URL del servidor donde se ejecutará el script Python para grabar la pantalla
        var url = 'https://ejemplo.com/grabar_pantalla';
        
        // Crear y enviar la solicitud HTTP
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status === 200) {
                // Descargar el archivo de video generado
                GM_download(JSON.parse(xhr.responseText).url, nombreArchivo);
            } else {
                console.error('Error al grabar la pantalla:', xhr.statusText);
            }
        };

        xhr.onerror = function () {
            console.error('Error al grabar la pantalla:', xhr.statusText);
        };

        // Enviar datos al servidor
        xhr.send(JSON.stringify({ nombre_archivo: nombreArchivo, duracion_segundos: duracionSegundos }));
    }

    // Nombre del archivo de salida y duración de la grabación en segundos
    var nombreArchivo = 'grabacion_pantalla.avi';
    var duracionSegundos = 60;

    // Llamar a la función para grabar la pantalla
    grabarPantalla(nombreArchivo, duracionSegundos);
})();
