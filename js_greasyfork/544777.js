// ==UserScript==
// @name         Drawaria Copy Room Friend List
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add an option to copy the public room link to the context menu of the friends list in Drawaria.online.
// @author YouTubeDrawaria
// @match https://drawaria.online/*
// @grant none
// @license MIT
// @icon https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/544777/Drawaria%20Copy%20Room%20Friend%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/544777/Drawaria%20Copy%20Room%20Friend%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof jQuery === 'undefined') {
        console.error("jQuery no está disponible. El script no se ejecutará.");
        return;
    }

    // Función para manejar la copia del enlace de la sala
    async function copyRoomLink(playerUid, $button) {
        // Guarda el contenido original del botón/enlace para restaurarlo después
        const originalContent = $button.html();
        // Muestra un indicador de carga/trabajo y deshabilita el botón temporalmente
        $button.html('<i class="fas fa-spinner fa-spin"></i>').addClass('disabled');

        try {
            // Replicar la llamada a la API que friends.js hace para obtener la sala
            const response = await new Promise((resolve, reject) => {
                jQuery.post("/friendsapi/getfriendroom", { uid: playerUid }, function(data) {
                    if (data && !data.error) {
                        resolve(data.res); // Si es pública, devuelve el ID de la sala
                    } else {
                        // Si hay un error, rechaza con el mensaje de error o un error genérico
                        reject(data ? data.error : "Unknown error");
                    }
                }, "json").fail(function(jqXHR, textStatus, errorThrown) {
                    // Manejo de errores de red o del servidor
                    reject(textStatus || errorThrown);
                });
            });

            // Si la respuesta es un ID de sala válido (no '1', que indica sala privada)
            if (response && response !== 1) { // '1' es el código para "habitación privada" según friends.js
                const roomLink = `https://drawaria.online/room/${response}`;
                await navigator.clipboard.writeText(roomLink);
                // Feedback visual de éxito
                $button.html('<i class="fas fa-check"></i>').removeClass('disabled');
                console.log(`Enlace de sala copiado: ${roomLink}`);
            } else if (response === 1) {
                // Caso específico para sala privada
                $button.html('<i class="fas fa-times"></i>').removeClass('disabled'); // Icono de error
                console.log("Este jugador está en una sala privada. No se puede copiar el enlace.");
            } else {
                // Otros casos de error (jugador no encontrado, etc.)
                $button.html('<i class="fas fa-times"></i>').removeClass('disabled'); // Icono de error
                console.log("No se pudo obtener el enlace de la sala. El jugador podría estar desconectado o en un estado no unible.");
            }
        } catch (error) {
            console.error("Error al copiar el enlace de la sala:", error);
            $button.html('<i class="fas fa-times"></i>').removeClass('disabled'); // Icono de error
        } finally {
            // Restaura el contenido original del botón después de un breve retraso
            setTimeout(() => {
                $button.html(originalContent).removeClass('disabled');
            }, 2000);
        }
    }

    // Cuando el DOM esté completamente cargado
    jQuery(function() {
        const $friendMenu = jQuery("#tabfriendlist-rowmenu");

        if ($friendMenu.length) {
            // Crea el nuevo elemento del menú para "Copiar Enlace de Sala"
            const $copyRoomItem = jQuery(
                `<a class="dropdown-item" href="#" id="tabfriendlist-rowmenu-copyroom">Copiar Enlace de Sala <i class="fas fa-copy" style="margin-left: 5px;"></i></a>`
            );

            // Inserta el nuevo elemento justo después de "Join room" y añade un nuevo divisor
            $friendMenu.find("#tabfriendlist-rowmenu-joinroom").after(
                $copyRoomItem,
                `<div class="dropdown-divider" id="divider-copyroom-link"></div>` // Nuevo divisor
            );

            // Adjunta el event listener al nuevo elemento del menú
            $copyRoomItem.on("click", function(event) {
                event.preventDefault(); // Previene el comportamiento predeterminado del enlace
                event.stopPropagation(); // Detiene la propagación para evitar que el menú se cierre inmediatamente

                const $targetRow = $friendMenu.data("target"); // Este es el elemento .tabrow del amigo
                if ($targetRow && !$copyRoomItem.hasClass('disabled')) { // Solo procede si el botón no está deshabilitado
                    const playerUid = $targetRow.data("playeruid");
                    copyRoomLink(playerUid, $copyRoomItem);
                }
            });

            // Escucha cuándo se muestra el menú desplegable para habilitar/deshabilitar la opción
            $friendMenu.on("show.bs.dropdown", function() {
                const $joinRoomItem = $friendMenu.find("#tabfriendlist-rowmenu-joinroom");
                const $targetRow = $friendMenu.data("target"); // El elemento .tabrow del amigo

                if ($targetRow && $targetRow.hasClass('inroom')) {
                    // Si el amigo está en una sala, verifica si la opción "Join room" está activa (no disabled)
                    if (!$joinRoomItem.hasClass('disabled')) { // Si "Join room" NO está deshabilitado, es una sala pública
                        $copyRoomItem.removeClass("disabled").css("cursor", "pointer");
                        $copyRoomItem.show(); // Asegura que el botón sea visible
                        $friendMenu.find("#divider-copyroom-link").show();
                    } else { // Está en sala, pero "Join room" está deshabilitado, lo que implica sala privada
                        $copyRoomItem.addClass("disabled").css("cursor", "not-allowed");
                        $copyRoomItem.show(); // Mostrarlo pero deshabilitado
                        $friendMenu.find("#divider-copyroom-link").show();
                    }
                } else {
                    // Si el amigo no está en una sala, deshabilita y oculta la opción
                    $copyRoomItem.addClass("disabled").css("cursor", "not-allowed");
                    $copyRoomItem.hide(); // Oculta el botón si no está en una sala
                    $friendMenu.find("#divider-copyroom-link").hide();
                }
            });

            // Restablece el estado del botón cuando el menú se oculta
            $friendMenu.on('hidden.bs.dropdown', function () {
                $copyRoomItem.html('Copy Room Link <i class="fas fa-copy" style="margin-left: 5px;"></i>');
                $copyRoomItem.removeClass('disabled');
            });

        } else {
            console.warn("No se encontró el elemento #tabfriendlist-rowmenu. El script no funcionará como se espera.");
        }
    });

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