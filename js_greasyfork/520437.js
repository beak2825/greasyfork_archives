// ==UserScript==
// @name         Traductor español
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Traduce los textos claves al español
// @author       shurtmato
// @match        https://spiritislandbuilder.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spiritislandbuilder.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520437/Traductor%20espa%C3%B1ol.user.js
// @updateURL https://update.greasyfork.org/scripts/520437/Traductor%20espa%C3%B1ol.meta.js
// ==/UserScript==

/* global $ */
/* global jQuery */

(function() {
    // Función para cargar jQuery dinámicamente
    function cargarJQuery(callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Función que se ejecutará cuando jQuery esté listo
    function jQueryListo() {
        console.log('jQuery cargado');

        // Asegura que el script se ejecute solo cuando el DOM esté listo
        $(document).ready(function() {
            console.log("Página lista");

            // Esperar 1 segundo antes de insertar el botón
            setTimeout(function() {
                // Busca cualquier elemento que tenga la clase 'navbar-brand', aunque tenga más clases
                $('[class*="navbar-brand"]').append('<button id="traducir" class="button navbar-item"></button>');

                $('#traducir').css({
                    'background': 'linear-gradient(to bottom, #c00 33%, #fc0 33%, #fc0 66%, #c00 66%)',
                    'color': 'white',
                    'border': 'none',
                    'font-size': '16px',
                    'cursor': 'pointer',
                    'border-radius': '5px',
                    'width': '69px'
                });

                // Añade el evento click al botón que ejecuta la función traducir
                $('#traducir').on('click', function() {
                    traducir();
                });

                console.log('Botón añadido después de 1 segundo');
            }, 1000); // 1000 ms = 1 segundo
        });
    }

    // Verifica si jQuery ya está cargado
    if (typeof jQuery === 'undefined') {
        console.log('jQuery no está cargado, cargando ahora...');
        cargarJQuery(jQueryListo);
    } else {
        console.log('jQuery ya está disponible');
        jQueryListo();
    }

    // Función principal para traducir el contenido
    window.traducir = function() {
        // Obtener el iframe por su id
        var iframe = document.getElementById('preview-iframe');

        // Verificar si el iframe existe
        if (!iframe) {
            console.log('Iframe no encontrado');
            return;
        }

        console.log('Iframe encontrado');

        // Intentar acceder al contenido del iframe directamente
        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        // Verificar si el contenido del iframe ya está accesible
        if (iframeDocument) {
            console.log('Contenido del iframe accesible, comenzando a traducir...');
            // Si ya está cargado, ejecutar la función para traducir
            traducirContenido(iframeDocument);
        } else {
            console.log('Esperando que el iframe cargue...');
            // Si el contenido no está accesible, esperar al evento load
            iframe.addEventListener('load', function() {
                console.log('Iframe cargado');
                iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                traducirContenido(iframeDocument);
            });
        }
    };

    // Función para traducir el contenido del iframe
    function traducirContenido(iframeDocument) {
        // Reemplazar los textos en los elementos dentro del iframe usando jQuery
        $(iframeDocument).find('setup-title').text("Preparación:").css('letter-spacing','1px');
        $(iframeDocument).find('play-style-title').text("Estilo de juego:").css('letter-spacing','1px');
        $(iframeDocument).find('complexity-title').text("Complejidad").css('letter-spacing','1px');
        $(iframeDocument).find('[class*="summary-of-powers-title"]').text("Características").css('letter-spacing','1px');
        $(iframeDocument).find('.powers-summary div:contains("OFFENSE")').text("ATAQUE");
        $(iframeDocument).find('.powers-summary div:contains("FEAR")').text("MIEDO");
        $(iframeDocument).find('.powers-summary div:contains("DEFENSE")').text("DEFENSA");
        $(iframeDocument).find('.powers-summary div:contains("UTILITY")').text("UTILIDAD");
        $(iframeDocument).find('.powers-summary div').css('letter-spacing','1px');

        // Frontal espiritu
        $(iframeDocument).find('info-title-speed').text("Velocidad");
        $(iframeDocument).find('info-title-range').text("Distancia");
        $(iframeDocument).find('#section-title-innate').text("PODERES INNATOS");
        $(iframeDocument).find('#section-title-special').text("REGLAS ESPECIALES");
        $(iframeDocument).find('#section-title-presence').text("PRESENCIA");
        $(iframeDocument).find('#section-title-growth').text("CRECIMIENTO (ELEGIR UNA)");
        $(iframeDocument).find('info-title-target').each(function() {
            var texto = $(this).text();

            if (texto === "TARGET") {
                $(this).text("OBJETIVO");
            } else if (texto === "TARGET LAND") {
                $(this).text("Territorio Obj");
            }
        });


        // Objeto clave-valor con los textos a reemplazar
        var reemplazos = {
            'Add a Presence to Mountain or Sands': '+1 Presencia: Montaña/Arenal',
            'Energy/Turn': 'Energía/Turno',
            'Card Plays': 'Cartas para jugar',
            'Sun': 'Sol',
            'Moon': 'Luna',
            'Water': 'Agua',
            'Earth': 'Tierra',
            'Fire': 'Fuego',
            'Air': 'Aire',
            'Plant': 'Planta',
            'Reclaim Cards': 'Recuperar Todas',
            'Add a Presence': 'Añadir una Presencia',
            'Gain Power Card': 'Ganar Carta de Poder',
            'Gain Energy': 'Ganar Energía'
        };

        // Crea una única expresión regular que busque todas las claves
        var regex = new RegExp(Object.keys(reemplazos).join("|"), "g");

        // Itera sobre cada elemento con clase 'subtext' dentro del iframe
        $(iframeDocument).find('subtext').each(function() {
            var texto = $(this).text();

            // Reemplaza usando una sola función que contemple todas las claves
            texto = texto.replace(regex, function(matched){
                return reemplazos[matched];
            });

            $(this).text(texto);
        });

        console.log('Texto reemplazado en elementos con clase .subtext');

        // Reemplazar el texto en elementos con clase 'growth-text' dentro del iframe
        $(iframeDocument).find('growth-text').each(function() {
            var texto = $(this).text();

            // Reemplaza usando una sola función que contemple todas las claves
            texto = texto.replace(regex, function(matched){
                return reemplazos[matched];
            });

            $(this).text(texto);
        });

    }
})();
