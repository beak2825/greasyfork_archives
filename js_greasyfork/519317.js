// ==UserScript==
// @name         Banner con Votos Negativos en Menéame (Solo en Noticias)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Muestra un banner con el número de votos negativos en Menéame, solo en páginas de noticias
// @author       You
// @match        https://www.meneame.net/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519317/Banner%20con%20Votos%20Negativos%20en%20Men%C3%A9ame%20%28Solo%20en%20Noticias%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519317/Banner%20con%20Votos%20Negativos%20en%20Men%C3%A9ame%20%28Solo%20en%20Noticias%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Verificar si estamos en una página de noticia (URL que contiene '/story/')
    if (!window.location.pathname.includes('/story/')) {
        console.log("No es una página de noticia. El script se detiene.");
        return; // No hacer nada si no estamos en una página de noticia
    }

    console.log("Estamos en una página de noticia.");

    // Función para obtener el número de votos negativos
    function obtenerVotosNegativos() {
        // Usar un selector de clase más confiable
        var negativosElement = document.querySelector('.votes .negative');
        console.log("Votos negativos element encontrado: ", negativosElement);

        if (negativosElement) {
            var votosNegativos = negativosElement.textContent.trim().replace(/\D/g, ''); // Limpiar caracteres no numéricos
            console.log("Votos negativos encontrados: ", votosNegativos);
            return parseInt(votosNegativos, 10) || 0; // Si no se puede convertir, devolver 0
        }
        return 0;
    }

    // Crear el banner con el número de votos negativos
    function crearBanner(votosNegativos) {
        var banner = document.createElement('div');
        var bannerText = document.createElement('p');
        bannerText.innerHTML = `Votos Negativos: ${votosNegativos}`;

        // Estilo del banner
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '0';
        banner.style.width = '100%';
        banner.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        banner.style.color = 'white';
        banner.style.textAlign = 'center';
        banner.style.padding = '10px';
        banner.style.fontSize = '20px';
        banner.style.zIndex = '9999';

        // Insertar el texto en el banner
        banner.appendChild(bannerText);
        document.body.appendChild(banner);

        // Opcional: cerrar el banner después de 10 segundos
        setTimeout(function() {
            banner.style.display = 'none';
        }, 10000);
    }

    // Ejecutar al cargar la página
    window.addEventListener('load', function() {
        console.log("La página ha cargado completamente.");

        var votosNegativos = obtenerVotosNegativos();

        // Si ya tenemos votos negativos al cargar la página, mostramos el banner inmediatamente
        if (votosNegativos > 0) {
            console.log("Votos negativos encontrados al cargar: ", votosNegativos);
            crearBanner(votosNegativos);
        } else {
            console.log("No se encontraron votos negativos al cargar.");
            // Si no, esperar a que se carguen los votos negativos dinámicamente
            setTimeout(function() {
                votosNegativos = obtenerVotosNegativos();
                if (votosNegativos > 0) {
                    console.log("Votos negativos encontrados después de esperar: ", votosNegativos);
                    crearBanner(votosNegativos);
                }
            }, 1000); // Esperar 1 segundo para dar tiempo a que cargue dinámicamente
        }
    });
})();