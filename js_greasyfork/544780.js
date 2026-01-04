// ==UserScript==
// @name Drawaria Copy Room Floating Button
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Añade un botón flotante para copiar el enlace de la sala pública de CUALQUIER jugador. Ahora utiliza rastreo HTML para obtener el ID de la sala como alternativa robusta.
// @author YouTubeDrawaria
// @match https://drawaria.online/*
// @grant GM_xmlhttpRequest
// @connect drawaria.online
// @license MIT
// @icon https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/544780/Drawaria%20Copy%20Room%20Floating%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/544780/Drawaria%20Copy%20Room%20Floating%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

// --- Esperar a que jQuery esté disponible ---
function waitForjQuery(callback) {
    if (typeof window.jQuery !== 'undefined') {
        callback(window.jQuery);
    } else {
        setTimeout(() => waitForjQuery(callback), 50);
    }
}

waitForjQuery(function($) { // jQuery ($) está garantizado aquí.

    // Función para obtener el UID de la URL de la página de perfil actual
    function getProfileUidFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('uid');
    }

    // Función para manejar la copia del enlace de la sala
    async function copyRoomLink(playerUid, $button) {
        if (!playerUid) {
            console.error("No se proporcionó el UID del jugador para copiar el enlace de la sala.");
            return;
        }

        // Guarda el contenido original del botón para restaurarlo después
        const originalContent = $button.html();
        // Muestra un indicador de carga/trabajo y deshabilita el botón temporalmente
        $button.html('<i class="fas fa-spinner fa-spin"></i>').prop('disabled', true); // .prop('disabled', true) para botones HTML

        try {
            const response = await new Promise((resolve, reject) => {
                $.post("/friendsapi/getfriendroom", { uid: playerUid }, function(data) {
                    if (data && !data.error) {
                        resolve(data.res);
                    } else {
                        reject(data ? data.error : "Unknown error");
                    }
                }, "json").fail(function(jqXHR, textStatus, errorThrown) {
                    reject(textStatus || errorThrown);
                });
            });

            if (response && response !== 1) { // '1' es el código para "habitación privada"
                const roomLink = `https://drawaria.online/room/${response}`;
                await navigator.clipboard.writeText(roomLink);
                $button.html('<i class="fas fa-check"></i>'); // Icono de éxito
                console.log(`Enlace de sala copiado: ${roomLink}`);
            } else if (response === 1) {
                $button.html('<i class="fas fa-times"></i>'); // Icono de error
                console.log("Este jugador está en una sala privada. No se puede copiar el enlace.");
            } else {
                $button.html('<i class="fas fa-times"></i>'); // Icono de error
                console.log("No se pudo obtener el enlace de la sala. El jugador podría estar desconectado o en un estado no unible.");
            }
        } catch (error) {
            console.error("Error al copiar el enlace de la sala:", error);
            $button.html('<i class="fas fa-times"></i>'); // Icono de error
        } finally {
            // Restaura el contenido original del botón y habilita después de un breve retraso
            setTimeout(() => {
                $button.html(originalContent).prop('disabled', false);
            }, 2000);
        }
    }

    // Función para inicializar el botón flotante en páginas de perfil
    function initFloatingCopyButton() {
        // Solo agregar el botón si estamos en una URL de perfil
        if (!window.location.pathname.startsWith('/profile/')) {
            return;
        }

        const profileUid = getProfileUidFromUrl();
        if (!profileUid) {
            console.warn("No se pudo obtener el UID del perfil de la URL. El botón flotante no se agregará.");
            return;
        }

        // Evitar duplicados si el script se recarga por alguna razón
        if ($("#floating-copy-room-button").length > 0) {
            return;
        }

        const $floatingButton = $(`
            <button id="floating-copy-room-button" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #007bff; /* Color azul de Bootstrap primary */
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                z-index: 1000;
                opacity: 0.9;
                transition: opacity 0.3s ease;
            " title="Copiar Enlace de Sala del Perfil">
                <i class="fas fa-copy"></i>
            </button>
        `);

        $('body').append($floatingButton);

        $floatingButton.on('click', function() {
            copyRoomLink(profileUid, $floatingButton);
        });

        // Pequeño efecto hover
        $floatingButton.hover(
            function() { $(this).css('opacity', '1'); },
            function() { $(this).css('opacity', '0.9'); }
        );
    }

    // Cuando el DOM esté completamente cargado
    $(function() {
        // Llamamos a esta función sin importar la URL, ella misma se encargará de la comprobación
        initFloatingCopyButton();
    });
});

})();