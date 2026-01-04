// ==UserScript==
// @name         Filtro buscar ciudades pulpo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Agrega un filtro para las filas de la tabla basándose en el jugador y la alianza
// @author       You
// @match        https://*.grepolis.com/game/*
// @match        http://*.grepolis.com/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489083/Filtro%20buscar%20ciudades%20pulpo.user.js
// @updateURL https://update.greasyfork.org/scripts/489083/Filtro%20buscar%20ciudades%20pulpo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var filtroInput;

    var targetNode = document.querySelector('body');
    var config = { attributes: false, childList: true, subtree: true };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    function callback(mutationsList, observer) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                var grcrt = document.getElementById('grcrt_radar_result');
                if(grcrt == null && filtroInput){
                    filtroInput = false;
                }
                var grcrtTable = grcrt.querySelector('.js-scrollbar-viewport');
                var searchDiv = document.querySelector('.grcrt_radar');
                if (grcrtTable && !filtroInput && searchDiv) {
                    filtroInput = crearFiltro(searchDiv);
                } else if (grcrtTable && filtroInput) {
                    filtrar(filtroInput, grcrtTable);
                }
            }
        }
    }

    function crearFiltro(searchDiv) {
        if (!filtroInput) {
            filtroInput = document.createElement('input');
            filtroInput.type = 'text';
            filtroInput.id = 'filtro';
            filtroInput.placeholder = 'Filtrar';

            // Añadir una clase al campo de entrada para aplicar el estilo necesario
            filtroInput.classList.add('filtro-input');

            // Insertar el campo de entrada del filtro justo después del div de búsqueda
            searchDiv.appendChild(filtroInput);

            return filtroInput;
        }
    }

    function filtrar(filtroInput, grcrtTable){
        const elementosLista = grcrtTable.querySelectorAll('.js-scrollbar-content li');

        filtroInput.addEventListener('input', function() {
            const valorFiltro = filtroInput.value.toLowerCase();

            elementosLista.forEach(li => {
                const nombreJugador = li.querySelector('.gp_player_link').textContent.toLowerCase();
                const nombreAlianzaElemento = li.querySelector('.gp_alliance_link');
                const nombreAlianza = nombreAlianzaElemento ? nombreAlianzaElemento.textContent.toLowerCase() : '';

                if (nombreJugador.includes(valorFiltro) || nombreAlianza.includes(valorFiltro)) {
                    li.style.display = '';
                } else {
                    li.style.display = 'none';
                }
            });
        });

        // Filtrar inicialmente al llamar a la función
        const valorFiltroInicial = filtroInput.value.toLowerCase();
        elementosLista.forEach(li => {
            const nombreJugador = li.querySelector('.gp_player_link').textContent.toLowerCase();
            const nombreAlianzaElemento = li.querySelector('.gp_alliance_link');
            const nombreAlianza = nombreAlianzaElemento ? nombreAlianzaElemento.textContent.toLowerCase() : '';

            if (nombreJugador.includes(valorFiltroInicial) || nombreAlianza.includes(valorFiltroInicial)) {
                li.style.display = '';
            } else {
                li.style.display = 'none';
            }
        });
    }

    // Estilos CSS directamente en HTML
    var estiloCSS = `
        .filtro-input {
            position: absolute;
            top: 10%;
            right: 50%;
        }
    `;

    var estiloElemento = document.createElement('style');
    estiloElemento.type = 'text/css';
    estiloElemento.appendChild(document.createTextNode(estiloCSS));

    document.head.appendChild(estiloElemento);
})();
