// ==UserScript==

// @name         Unlock DeepSqueak model.

// @namespace    https://character.ai/

// @version      2025-08-02

// @description  Get model DeepSqueak.

// @author       providence

// @match        https://character.ai/chat/*

// @match        https://character.ai/*

// @icon         https://character.ai/favicon.ico

// @license MIT

// @grant        GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/544329/Unlock%20DeepSqueak%20model.user.js
// @updateURL https://update.greasyfork.org/scripts/544329/Unlock%20DeepSqueak%20model.meta.js
// ==/UserScript==

(function() {

    'use strict';

    let capturedToken = null;

    // Interceptar fetch para capturar el token de authorization

    const originalFetch = window.fetch;

    window.fetch = async function(...args) {

        const response = await originalFetch.apply(this, args);

        // Revisar si la petición tiene authorization header

        if (args[1] && args[1].headers && args[1].headers.authorization) {

            capturedToken = args[1].headers.authorization;

        }

        return response;

    };

    // Interceptar XMLHttpRequest también

    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {

        if (header.toLowerCase() === 'authorization') {

            capturedToken = value;

        }

        return originalSetRequestHeader.call(this, header, value);

    };

    function getAccessToken() {

        // Primero intenta los métodos anteriores

        const meta = document.querySelector('meta[cai_token]');

        const tokenFromMeta = meta?.getAttribute('cai_token');

        if (tokenFromMeta) return tokenFromMeta;

        const tokenFromLocalStorage =

            localStorage.getItem('cai_token') ||

            localStorage.getItem('token') ||

            localStorage.getItem('auth_token');

        if (tokenFromLocalStorage) return tokenFromLocalStorage;

        const cookieMatch = document.cookie.match(/(?:^|; )cai_token=([^;]*)/);

        if (cookieMatch) return cookieMatch[1];

        // Si no encuentra nada, usa el token capturado de headers

        return capturedToken;

    }

    GM_registerMenuCommand('Make DeepRat default', makeDeepSynthDefault);

    function makeDeepSynthDefault() {

        const AccessToken = getAccessToken();

        if (!AccessToken) {

            alert("No se encontró el token. Navega un poco por el sitio para que se capturen las peticiones, luego intenta de nuevo.");

            return;

        }

        fetch("https://plus.character.ai/chat/user/update_settings/", {

            headers: {

                "accept": "application/json, text/plain, */*",

                "authorization": AccessToken,

                "content-type": "application/json",

            },

            body: JSON.stringify({

                "modelPreferenceSettings": {

                    "defaultModelType": "MODEL_TYPE_DEEP_SYNTH"

                }

            }),

            method: "POST",

        }).then(res => {

            if (res.ok) {

                alert("¡Éxito! El modelo DeepRat es ahora predeterminado. Recarga la página.");

            } else {

                throw new Error("Solicitud rechazada. Código: " + res.status);

            }

        }).catch((error) => {

            alert("Error al cambiar a DeepRat: " + error.message);

        });

    }

    // Mostrar información del token capturado (opcional, para debug)

    GM_registerMenuCommand('Ver token capturado', function() {

        const token = getAccessToken();

        if (token) {

            console.log("Token encontrado:", token.substring(0, 20) + "...");

            alert("Token encontrado (revisa la consola para más detalles)");

        } else {

            alert("No se ha capturado ningún token aún. Navega por el sitio.");

        }

    });

})();

