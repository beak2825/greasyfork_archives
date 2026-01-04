// ==UserScript==
// @name         Reproducir SWF en Forocoches
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Encuentra enlaces .swf e inyecta embed para reproducir con Ruffle
// @author       Satoshi++
// @match        https://forocoches.com/*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/498354/Reproducir%20SWF%20en%20Forocoches.user.js
// @updateURL https://update.greasyfork.org/scripts/498354/Reproducir%20SWF%20en%20Forocoches.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inyectar el script de Ruffle
    var ruffleScript = document.createElement('script');
    ruffleScript.src = 'https://unpkg.com/@ruffle-rs/ruffle';
    document.head.appendChild(ruffleScript);

    // Función para eliminar enlaces específicos
    function eliminarEnlacesEspecificos() {
        var enlaces = document.querySelectorAll('a[href="https://forocoches.com/foro/showthread.php?p=476415828"]');
        enlaces.forEach(function(enlace) {
            GM_log('Eliminando enlace: ' + enlace.href);
            enlace.remove();
        });
    }

    // Función para embeber el SWF
    function embeberSwf(enlace) {
        GM_log('Embeber: ' + enlace.href);

        // Crear un contenedor para el embed
        var container = document.createElement('div');
        container.style.width = '640px';
        container.style.height = '480px';
        container.style.marginBottom = '20px';

        // Crear el elemento embed
        var embed = document.createElement('embed');
        embed.src = enlace.href;
        embed.width = '100%';
        embed.height = '100%';

        // Crear el enlace "Cerrar"
        var cerrarEnlace = document.createElement('a');
        cerrarEnlace.href = '#';
        cerrarEnlace.textContent = 'Cerrar';
        cerrarEnlace.style.display = 'block';
        cerrarEnlace.style.marginBottom = '10px';
        cerrarEnlace.addEventListener('click', function(event) {
            event.preventDefault();
            container.remove();
            enlace.style.display = 'block'; // Mostrar el enlace .swf nuevamente
        });

        // Añadir el embed y el enlace "Cerrar" al contenedor
        container.appendChild(cerrarEnlace);
        container.appendChild(embed);

        // Insertar el contenedor después del enlace
        enlace.parentNode.insertBefore(container, enlace.nextSibling);

        // Ocultar el enlace original
        enlace.style.display = 'none';
    }

    // Función principal para encontrar los enlaces .swf
    function encontrarYTransformarEnlacesSwf() {
        // Encuentra todos los enlaces en la página
        var enlaces = document.getElementsByTagName('a');
        var enlacesSwf = [];

        for (var i = 0; i < enlaces.length; i++) {
            var href = enlaces[i].href;
            if (href.endsWith('.swf')) {
                enlacesSwf.push(enlaces[i]);
            }
        }

        if (enlacesSwf.length > 0) {
            GM_log('Enlaces .swf encontrados:');
            enlacesSwf.forEach(function(enlace) {
                GM_log(enlace.href);
                enlace.addEventListener('click', function(event) {
                    event.preventDefault();
                    embeberSwf(enlace);
                });
            });
        } else {
            GM_log('No se encontraron enlaces .swf en esta página.');
        }
    }



    // Asegurarse de que el DOM esté completamente cargado antes de ejecutar la función principal
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            eliminarEnlacesEspecificos();
            encontrarYTransformarEnlacesSwf();
        });
    } else {
        // El DOM ya está cargado
        eliminarEnlacesEspecificos();
        encontrarYTransformarEnlacesSwf();
    }
})();