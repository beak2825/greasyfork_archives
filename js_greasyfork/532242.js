// ==UserScript==
// @name         LinkedIn Auto Connect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Envia automaticamente solicitações de conexão na página "Minha rede" do LinkedIn
// @author       Lorenzo
// @match        https://www.linkedin.com/mynetwork/*
// @icon         https://www.linkedin.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532242/LinkedIn%20Auto%20Connect.user.js
// @updateURL https://update.greasyfork.org/scripts/532242/LinkedIn%20Auto%20Connect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[LinkedIn Auto Connect] Iniciado');

    function autoConnect() {
        // Clica nos botões "Conectar" ou "Convidar"
        const buttons = [...document.querySelectorAll('button')]
            .filter(btn =>
                btn.innerText.includes('Conectar') || btn.innerText.includes('Convidar')
            );

        if (buttons.length === 0) {
            console.log('[LinkedIn Auto Connect] Nenhum botão "Conectar" encontrado.');
        } else {
            buttons.forEach((btn, i) => {
                setTimeout(() => {
                    console.log(`[LinkedIn Auto Connect] Clicando no botão ${i + 1}: ${btn.innerText}`);
                    btn.click();

                    // Espera o popup aparecer e clica em "Enviar"
                    setTimeout(() => {
                        const sendBtn = [...document.querySelectorAll('button')].find(b =>
                            b.innerText.includes('Enviar')
                        );
                        if (sendBtn) {
                            console.log('[LinkedIn Auto Connect] Confirmando envio.');
                            sendBtn.click();
                        }
                    }, 1000);
                }, i * 2500); // 2.5 segundos entre cada clique
            });
        }

        // Faz scroll para carregar mais perfis
        window.scrollBy(0, 1000);
    }

    // Executa a cada 10 segundos
    setInterval(autoConnect, 10000);
})();
