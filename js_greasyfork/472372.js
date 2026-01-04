// ==UserScript==
// @name         Cryptos Space Shortlinks
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Renda Extra
// @icon         img[src="https://cryptosspace.com/assets/upload/logo/07a91998063dfe19c6aae6e5683a2734.png"]
// @author       Venas
// @match        https://cryptosspace.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472372/Cryptos%20Space%20Shortlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/472372/Cryptos%20Space%20Shortlinks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let canClickPrimaryButton = true;
    let hasAdditionalButtonClicked = false;

    // Função para clicar no próximo botão disponível
    function clickNextButton() {
        if (!canClickPrimaryButton) return;

        const buttons = document.querySelectorAll('a[class="btn btn-primary mt-4 mb-2"]');
        const nextButton = buttons[0];
        if (nextButton) {
            nextButton.click();
            canClickPrimaryButton = false;
            setTimeout(() => {
                canClickPrimaryButton = true;
            }, 60000); // 1 minuto em milissegundos
        } else {
            console.log('Todos os botões foram clicados!');
        }
    }

    // Função para fechar a janela modal do SweetAlert2 clicando no botão 'button.swal2-cancel'
    function closeModal() {
        const modalButton = document.querySelector('button.swal2-cancel');
        if (modalButton) {
            modalButton.click();
        }
    }

    // Função para aguardar a presença do botão com texto 'eu sou humano' e atributo 'type="submit"' e clicá-lo após o delay de 15 segundos
    function clickAdditionalButton() {
        const additionalButton = document.querySelector('button[type="submit"][class="btn btn-primary w-md"]');
        if (additionalButton && !hasAdditionalButtonClicked && isElementVisible(additionalButton)) {
            setTimeout(() => {
                additionalButton.click();
                hasAdditionalButtonClicked = true;
            }, 15000); // 15 segundos em milissegundos
        } else {
            setTimeout(clickAdditionalButton, 1000); // Tenta novamente após 1 segundo
        }
    }

    // Função para verificar se um elemento é visível na página
    function isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style && style.display !== 'none' && style.visibility !== 'hidden';
    }

    // Clique no botão com texto 'eu sou humano' e atributo 'type="submit"' após 90 segundos da página carregar
    setTimeout(() => {
        clickAdditionalButton();
    }, 15000); // 15 segundos em milissegundos

    // Monitorar se a página mudou após o clique do botão
    const observer = new MutationObserver(function(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                clickNextButton();
                closeModal(); // Tenta fechar o modal caso esteja aberto
                break;
            }
        }
    });

    const observerOptions = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, observerOptions);
})();