// ==UserScript==
// @name         EarnBitMoon Auto Faucet
// @namespace    
// @version      1.1
// @description  Automate actions on 
// @author       lucano
// @match        https://earnbitmoon.club/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522424/EarnBitMoon%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/522424/EarnBitMoon%20Auto%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuração: Número de repetições
    let repeatCount = 300; // Pode ser alterado pelo usuário

    // Função para aguardar o carregamento completo do site
    function waitForPageLoad(callback) {
        const checkReady = setInterval(() => {
            if (document.readyState === "complete") {
                clearInterval(checkReady);
                callback();
            }
        }, 100);
    }

    // Função para criar delays com randomização
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms + Math.random() * 4000));
    }

    // Função para gerar delays entre 4 minutos e 57 segundos e 4 minutos e 59 segundos
    function randomDelay457To459() {
        const min = 457000; // 4 minutos e 57 segundos em ms
        const max = 459000; // 4 minutos e 59 segundos em ms
        const randomMs = Math.random() * (max - min) + min;
        return delay(randomMs);
    }

    // Função principal
    async function automateFaucet() {
        for (let i = 0; i < repeatCount; i++) {
            console.log(`Iniciando repetição ${i + 1} de ${repeatCount}`);

            // Clique no botão claimFaucet
            const claimButton = document.querySelector('#claimFaucet > button');
            if (claimButton) {
                claimButton.click();
                console.log("Clicou em claimFaucet");

                // Aguarda o carregamento e adiciona delay de 18 segundos
                await delay(18000);

                // Clique no botão zxz
                const zxzButton = document.querySelector('button.zxz');
                if (zxzButton) {
                    zxzButton.click();
                    console.log("Clicou em zxz");

                    // Aguarda o carregamento e adiciona delay de 6-7 segundos
                    await delay(6000);

                    // Clique no botão close
                    const closeButton = document.querySelector('button.close');
                    if (closeButton) {
                        closeButton.click();
                        console.log("Clicou em close");

                        // Aguarda o carregamento completo do site e adiciona delay aleatório entre 4 minutos e 57 segundos e 4 minutos e 59 segundos
                        await waitForPageLoad(() => console.log("Site carregado novamente"));
                        await randomDelay457To459();

                        // Recarrega a página
                        location.reload();
                        console.log("Página recarregada");
                    } else {
                        console.warn("Botão close não encontrado");
                        break;
                    }
                } else {
                    console.warn("Botão zxz não encontrado");
                    break;
                }
            } else {
                console.warn("Botão claimFaucet não encontrado");
                break;
            }
        }
        console.log("Automação concluída.");
    }

    // Inicializa o script após o carregamento do site
    waitForPageLoad(automateFaucet);
})();