// ==UserScript==
// @name         YouTube Mass Unsubscribe + Auto Scroll
// @namespace    https://greasyfork.org/users/eruma19
// @version      1.4
// @description  Desuscribe masivamente todos tus canales en YouTube. Funciona en cualquier página de YouTube, pero el proceso solo tendrá efecto en /feed/channels (lista de suscripciones).
// @author       Eruma19
// @license      MIT
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/547672/YouTube%20Mass%20Unsubscribe%20%2B%20Auto%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/547672/YouTube%20Mass%20Unsubscribe%20%2B%20Auto%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function unsubscribeAll() {
        let lastHeight = 0;
        let sameHeightCount = 0;

        while (true) {
            // Buscar todos los botones "Suscrito"
            let buttons = document.querySelectorAll('ytd-subscribe-button-renderer button');

            for (let btn of buttons) {
                if (btn.innerText.includes("Suscrito")) {
                    console.log("Intentando desuscribirse...");

                    // Abrir menú desplegable
                    btn.click();
                    await new Promise(r => setTimeout(r, 800));

                    // Opción "Anular"
                    let menuItem = [...document.querySelectorAll("tp-yt-paper-item")]
                        .find(el => el.innerText.includes("Anular"));

                    if (menuItem) {
                        menuItem.click();
                        console.log("Se hizo clic en 'Anular'.");
                        await new Promise(r => setTimeout(r, 800));

                        // Confirmar popup
                        let confirmBtn = [...document.querySelectorAll("yt-button-renderer button")]
                            .find(el => el.innerText.includes("Anular suscripción"));
                        if (confirmBtn) {
                            confirmBtn.click();
                            console.log("Confirmada la desuscripción.");
                        }
                    }

                    // Pausa entre acciones
                    await new Promise(r => setTimeout(r, 2000));
                }
            }

            // Scroll para cargar más
            window.scrollBy(0, 2000);
            await new Promise(r => setTimeout(r, 2500));

            // Detectar fin de scroll
            let newHeight = document.body.scrollHeight;
            if (newHeight === lastHeight) {
                sameHeightCount++;
            } else {
                sameHeightCount = 0;
            }
            lastHeight = newHeight;

            if (sameHeightCount >= 3) {
                break; // Fin
            }
        }

        alert("✅ Proceso terminado: ya no hay más canales a los que estés suscrito.");
    }

    // Botón flotante
    let myBtn = document.createElement("button");
    myBtn.innerText = "❌ Desuscribir Todo (Auto)";
    myBtn.style.position = "fixed";
    myBtn.style.top = "100px";
    myBtn.style.right = "20px";
    myBtn.style.zIndex = 9999;
    myBtn.style.padding = "12px";
    myBtn.style.background = "#d60000";
    myBtn.style.color = "white";
    myBtn.style.border = "none";
    myBtn.style.borderRadius = "8px";
    myBtn.style.fontSize = "14px";
    myBtn.style.cursor = "pointer";
    document.body.appendChild(myBtn);

    myBtn.addEventListener("click", unsubscribeAll);
})();
