// ==UserScript==
// @name         Banfaucet
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Renda Extra
// @icon         img[src="https://cryptosspace.com/assets/upload/logo/07a91998063dfe19c6aae6e5683a2734.png"]
// @author       Groland
// @match        https://banfaucet.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480361/Banfaucet.user.js
// @updateURL https://update.greasyfork.org/scripts/480361/Banfaucet.meta.js
// ==/UserScript==
(function() {
    'use strict';


    function removeAreasByNames(names) {
        var elements = document.querySelectorAll('.col-xl-4.col-lg-6 .card-lg');
elements.forEach(function(element) {
            var elementText = element.textContent.trim();
            names.forEach(function(name) {
                if (elementText.includes(name)) {
                    element.parentElement.remove();
                }
            });
        });
    }


    var namesToRemove = [
         'sli',
        'ShrinkEarn',
        'Octolinkz',
        'forexly',
        'Exe',
        'goldly',
        'botfly',
        'clks.pro',
        'Shortest',
        'Shortino',
        'Shortano',
        'Gainlink',
        'Exalink',
        'Promo-Visits',
        'Rsshort.com',
        'Clks.Pro',
        'insurancly',
        'linkdam',
        'promo-visits.site',
        'Linkdam',
        'Try2link.com',
        'Shrinkearn.com',
        'Exe.io',
        'Cutp',
        'Doshrink',
        'clk.st',
        'adbit',
        'Try2link',
        'Rsshort',
        'Adlink',
        'Shorti',
        'Usalink',
        'LTC25.in',
        'Wez.info',
        'FlyAd',
        'octolinkz',
        'earnow',
        'Short1'
        //  Banfaucet
    ];

    removeAreasByNames(namesToRemove);
(function() {
    'use strict';

    let canClickPrimaryButton = true;
    let hasAdditionalButtonClicked = false;

    // Função para clicar no próximo botão disponível
    function clickNextButton() {
        if (!canClickPrimaryButton) return;

        const buttons = document.querySelectorAll('.col-xl-4.col-lg-6:nth-of-type(1) .btn-one');
        const nextButton = buttons[0];
        if (nextButton) {
            nextButton.click();
            canClickPrimaryButton = false;
            setTimeout(() => {
                canClickPrimaryButton = true;
            }, 9999999999999999); // 1 minuto em milissegundos
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
})();