// ==UserScript==
// @name         ALL FAucet
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Renda Extra
// @author       Groland
// @match        https://allfaucet.xyz/*
// @match        https://trxking.xyz/*
// @match        https://ourcoincash.xyz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481775/ALL%20FAucet.user.js
// @updateURL https://update.greasyfork.org/scripts/481775/ALL%20FAucet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeAreasByNames(names) {
        var elements = document.querySelectorAll('.link-block   .row');
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
        'Clks',
        'Exe',
        'Earnow',
        'Shortyfi',
        'Shortino',
        'Shortano',
        'octolinkz',
        'Gainlink',
        'Exalink',
        'Promo-Visits',
        'Shrinkearn',
        'Earnow',
        'PROMO',
        'Fc.lc',
        'MegaURL',
        'Try2link.com',
        'Shrinkearn.com',
        'Exe.io',
        'Cutp',
        'dot link',
        'Doshrink',
        'LTC25.in',
        'Wez.info',
        'FlyAd',
        'octolinkz',
        'earnow',
        'clkspro',
        '1short',
        'Clk',
        'Clks',
        'Cbshort',
        'Droplink',
        'Hrshort(5steps)',
        'usalink',
        'cuty',
        'link1s',
        'clicksfly',
        'urlcorner',
        'Shrinkme',
        'ShrinkEarn',
        'ClkSh',
        'Clkst',
        'Usalink',
        'EARN NOW 250 TOKEN',
        'AdLink',
        'CLK 150 TOKEN',
        'Short1'
        // autobitcoin,autofaucet
    ];

    removeAreasByNames(namesToRemove);






    let canClickPrimaryButton = true;
    let hasAdditionalButtonClicked = false;

    // Função para clicar no próximo botão disponível
    function clickNextButton() {
        if (!canClickPrimaryButton) return;

        const buttons = document.querySelectorAll('.link-block:nth-of-type(4) .claim-button.btn-success.btn');
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