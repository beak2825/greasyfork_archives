// ==UserScript==
// @name         AutoCupom ML
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Clica em todos cupons do ML.
// @author       unknow
// @match        https://www.mercadolivre.com.br/*
// @match        https://myaccount.mercadolivre.com.br/my_purchases/*
// @grant        none
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @downloadURL https://update.greasyfork.org/scripts/475165/AutoCupom%20ML.user.js
// @updateURL https://update.greasyfork.org/scripts/475165/AutoCupom%20ML.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INACTIVE_COUPONS_URL = "https://www.mercadolivre.com.br/cupons?source_page=mperfil#nav-header";


    // Estilos CSS
    const style = document.createElement('style');
    style.innerHTML = `
.loading-spinner {
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 3px solid white;
    width: 15px;
    height: 15px;
    animation: spin 1s linear infinite;
    display: inline-block;
    margin-left: 10px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.checkmark-icon {
    display: inline-block;
    margin-left: 10px;
}
`;

    document.head.appendChild(style);

    let activationButton;

    function createStyledButton(text, onClick) {
        if (activationButton) {
            // Se o botão já existe, apenas atualize seu texto e retorne
            activationButton.innerText = text;
            return activationButton;
        }

        const button = document.createElement('button');
        button.innerText = text;
        button.style.position = 'fixed';
        button.style.bottom = '16px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 20px';
        button.style.fontSize = '18px';
        button.style.cursor = 'pointer';
        button.style.border = '1px solid #333';
        button.style.borderRadius = '6px';
        button.style.fontWeight = '600';
        button.style.background = '#60238E';
        button.style.color = 'white';
        button.style.boxShadow = '0px 1px 1px #797979';
        button.style.fontFamily = 'Proxima Nova,-apple-system,Roboto,Arial,sans-serif';
        button.onclick = function() {
            button.innerText = "Processando, aguarde...";
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            button.appendChild(spinner);
            onClick();
        };

        document.body.appendChild(button);
        activationButton = button; // Guarda a referência do botão
        return button;
    }

    function processCompleted() {
        activationButton.innerText = "Concluído ✓";
        const spinner = activationButton.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }

    function clickButtonsSequentially(elements, index = 0) {
    if (index < elements.length) {
        elements[index].click();
        setTimeout(() => clickButtonsSequentially(elements, index + 1), 400);
    } else {
        setTimeout(() => {
            const nextPageClicked = clickNextPageButton();
            if (!nextPageClicked) {
                if (window.location.href === INACTIVE_COUPONS_URL) {
                    swal({
                        title: "Todos os cupons foram ativados!",
                        button: "OK",
                        closeOnClickOutside: true,
                        icon: "success"
                    }).then((value) => {
                        if (value) { // Se o usuário clicar em OK
                            sessionStorage.removeItem('autoClickerRunning'); // Remover o state
                            location.reload(); // Recarregar a página
                        }
                    });
                } else {
                    window.location.href = INACTIVE_COUPONS_URL;
                }
            }
        }, 1000);
    }
}

    function clickNextPageButton() {
        const nextButton = document.querySelector("#filtercoupons > div > nav > ul > li.andes-pagination__button.andes-pagination__button--next > a > span");
        if (nextButton) {
            nextButton.click();
            return true;
        }
        return false;
    }

    function main() {
        if (sessionStorage.getItem('autoClickerRunning') === 'true') {
            // Verifique se o botão existe e crie ou atualize-o se necessário
            if (!activationButton || !document.body.contains(activationButton)) {
                createStyledButton('Processando, aguarde...', function() {});
                const spinner = document.createElement('div');
                spinner.className = 'loading-spinner';
                activationButton.appendChild(spinner);
            }

            const checkInterval = setInterval(() => {
                const buttons = document.querySelectorAll('.andes-button.andes-button--small.andes-button--loud');
                const nextButton = document.querySelector("#filtercoupons > div > nav > ul > li.andes-pagination__button.andes-pagination__button--next > a > span");

                if (buttons.length > 0) {
                    clearInterval(checkInterval);
                    clickButtonsSequentially(buttons);
                } else if (!nextButton && window.location.href !== INACTIVE_COUPONS_URL) {
                    clearInterval(checkInterval);
                    window.location.href = INACTIVE_COUPONS_URL;
                }
            }, 500);
        }
    }

    if (window.location.href === INACTIVE_COUPONS_URL) {
        if (sessionStorage.getItem('autoClickerRunning') === 'true') {
            createStyledButton('Processando, aguarde...', function() {});
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            activationButton.appendChild(spinner);
        } else {
            createStyledButton('Iniciar Script de Ativação', function() {
                sessionStorage.setItem('autoClickerRunning', 'true');
                main();
            });
        }

    let checkAttempts = 0;
    const maxAttempts = 20;
    const checkInterval = setInterval(() => {
        let couponTextElement = document.querySelector('.coupons-quantity-label');
        if (couponTextElement && couponTextElement.textContent.trim() === "0 Cupons") {
            activationButton.disabled = true; // Desativa o botão
            activationButton.innerText = "Nenhum cupom disponível"; // Altera o texto do botão
            activationButton.style.backgroundColor = "#A9A9A9"; // Altera a cor de fundo para cinza
            clearInterval(checkInterval);
        }
        checkAttempts++;
        if (checkAttempts >= maxAttempts) {
            clearInterval(checkInterval);
        }
    }, 500);
}

if (window.location.href === "https://www.mercadolivre.com.br/") {
    createStyledButton('Ativar Cupons', function() {
        window.location.href = INACTIVE_COUPONS_URL;
    });
}

    if (window.location.href === "https://myaccount.mercadolivre.com.br/my_purchases/list#nav-header") {
        createStyledButton('Ativar Cupons', function() {
            window.location.href = INACTIVE_COUPONS_URL;
        });
    }
    if (window.location.href === "https://myaccount.mercadolivre.com.br/my_purchases/list#menu-user") {
        createStyledButton('Ativar Cupons', function() {
            window.location.href = INACTIVE_COUPONS_URL;
        });
    }

    if (window.location.href === "https://www.mercadolivre.com.br/cupons?source_page=mperfil#menu-user") {
        createStyledButton('Ver todos os Cupons', function() {
            window.location.href = INACTIVE_COUPONS_URL;
        });
    }

    if (window.location.href === "https://www.mercadolivre.com.br/cupons?source_page=int_breadcrumb") {
        createStyledButton('Ver todos os Cupons', function() {
            window.location.href = INACTIVE_COUPONS_URL;
        });
    }

    main();

})();
