// ==UserScript==
// @name         Drawaria Block Spam Friend Requests
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Designed for blocking otyano, a known user associated with spam in the Drawaria community.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @icon         https://cdn.discordapp.com/emojis/1406278506463363074.webp?size=96
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546098/Drawaria%20Block%20Spam%20Friend%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/546098/Drawaria%20Block%20Spam%20Friend%20Requests.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utilidad para registrar mensajes en la consola del navegador
    function log(message, ...args) {
        console.log('[Drawaria Auto-Reject]', message, ...args);
    }

    log('Script de rechazo automático de solicitudes iniciado.');

    // Función principal para buscar y rechazar solicitudes.
    function processIncomingFriendRequests() {
        const requestsTab = document.querySelector('#friends-tabrequests .content');

        if (!requestsTab) {
            // El contenedor de solicitudes aún no existe, reintentar más tarde.
            log('Contenedor de solicitudes de amistad no encontrado, reintentando...');
            return;
        }

        // Selecciona todas las filas de solicitudes entrantes que aún no han sido procesadas por este script.
        const incomingRequestRows = requestsTab.querySelectorAll('.tabrow.incoming:not([data-processed="true"])');

        if (incomingRequestRows.length === 0) {
            // No hay nuevas solicitudes entrantes para procesar.
            return;
        }

        log(`Detectadas ${incomingRequestRows.length} nuevas solicitudes de amistad entrantes.`);

        incomingRequestRows.forEach(rowElement => {
            const playerUid = rowElement.dataset.playeruid; // Obtiene el UID del jugador.
            const playerNameElement = rowElement.querySelector('.playername');
            const playerName = playerNameElement ? playerNameElement.textContent.trim() : 'Desconocido';

            log(`Procesando solicitud de amistad de: ${playerName} (UID: ${playerUid}).`);

            // Busca el botón de "Rechazar" dentro de la fila de la solicitud.
            // Según la estructura HTML, es el <span> con clase 'secondary' dentro del div 'buttons'.
            const rejectButton = rowElement.querySelector('.buttons .secondary');

            if (rejectButton) {
                // Simula un clic en el botón de rechazar.
                // Usamos un pequeño retardo para asegurar que el DOM y los listeners del juego estén listos.
                setTimeout(() => {
                    rejectButton.click();
                    log(`Solicitud de ${playerName} (UID: ${playerUid}) RECHAZADA automáticamente.`);
                    // Marcar la fila como procesada después de intentar el clic.
                    rowElement.dataset.processed = 'true';
                }, 100); // Pequeño retardo de 100ms.
            } else {
                log(`ERROR: Botón de rechazar no encontrado para la solicitud de ${playerName} (UID: ${playerUid}).`);
                rowElement.dataset.processed = 'true'; // Marcar para no reintentar sin éxito.
            }
        });

        // Opcional: Actualizar el contador de solicitudes pendientes y ocultar la notificación si no hay más.
        // La propia lógica del juego debería manejar esto después del rechazo, pero añadimos una comprobación.
        setTimeout(() => {
            const remainingRequests = requestsTab.querySelectorAll('.tabrow.incoming').length;
            const friendsNotifyRequest = document.getElementById('friendsnotify-request');

            if (remainingRequests === 0 && friendsNotifyRequest && friendsNotifyRequest.style.display !== 'none') {
                friendsNotifyRequest.style.display = 'none';
                log('Notificación de solicitudes de amistad ocultada (ya no hay solicitudes pendientes).');
            }
        }, 500); // Un retardo para que la UI del juego se actualice.
    }


    // Usamos un MutationObserver para detectar cambios en el DOM,
    // específicamente cuando se añaden nuevas solicitudes de amistad a la lista.
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            // Revisa si se han añadido nodos al DOM.
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Si la mutación ocurrió en el contenedor de solicitudes o sus hijos, o si se añadió un tabrow.
                // Esto es para ser eficiente y no procesar todo el DOM por cada cambio.
                const relevantChange = Array.from(mutation.addedNodes).some(node =>
                    node.matches && node.matches('.tabrow.incoming, #friends-tabrequests .content')
                );
                if (relevantChange || mutation.target.id === 'friends-tabrequests') {
                    processIncomingFriendRequests();
                }
            }
        }
    });

    // Esperar a que el DOM esté completamente cargado y jQuery esté disponible,
    // ya que el juego usa jQuery para construir su interfaz.
    jQuery(document).ready(function() {
        const friendsTabContent = document.querySelector('#friends-tabrequests .content');
        if (friendsTabContent) {
            // Empezar a observar el contenedor donde aparecen las solicitudes.
            observer.observe(friendsTabContent, {
                childList: true, // Observar adiciones/eliminaciones directas de hijos.
                subtree: true    // Observar cambios en todos los descendientes del nodo.
            });
            log('MutationObserver iniciado en #friends-tabrequests .content');

            // Ejecuta una primera comprobación en caso de que ya haya solicitudes al cargar la página.
            processIncomingFriendRequests();
        } else {
            // Si el contenedor no está listo al inicio (ej. el widget de amigos se carga tarde),
            // se puede observar un nodo más general y refinar la observación después.
            // Para la mayoría de los casos de Drawaria, `friendsTabContent` debería estar disponible
            // en `document.ready` si el widget de amigos está en el HTML inicial.
            log('Contenedor de solicitudes no disponible al inicio. Es posible que el MutationObserver necesite ser configurado en un nodo padre más general si el widget se carga dinámicamente más tarde.');
            // Si el widget se carga MUY dinámicamente, podríamos observar document.body:
            // observer.observe(document.body, { childList: true, subtree: true });
            // y dentro de processIncomingFriendRequests, buscar #friends-tabrequests cada vez.
        }
    });

})();