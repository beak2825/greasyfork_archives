// ==UserScript==
// @name           Gmail Manual POP3 Check Enhaced
// @author         JorgeATX + Claude IA
// @version        2.0.11
// @description    Manual Google Mail POP3 check with custom button
// @license        MIT
// @match          https://mail.google.com/*
// @match          https://mail.google.com/mail/u/0/*
// @grant          none
// @run-at         document-end
// @namespace https://greasyfork.org/users/158561
// @downloadURL https://update.greasyfork.org/scripts/514085/Gmail%20Manual%20POP3%20Check%20Enhaced.user.js
// @updateURL https://update.greasyfork.org/scripts/514085/Gmail%20Manual%20POP3%20Check%20Enhaced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        buttonText: "POP3",
        debug: false,
        checkMailText: "Check mail now",
        retryInterval: 10000,
        maxRetries: 2,
        buttonStyles: {
            position: 'fixed',
            top: '37px',
            right: '6px',
            zIndex: '9999999',
            backgroundColor: '#1a73e8',
            color: 'white',
            padding: '3px 6px',
            borderRadius: '4px 0 0 4px',
            cursor: 'pointer',
            fontFamily: "'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif",
            fontSize: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '24px',
            height: '18px',
            fontWeight: '500',
            lineHeight: '1',
            transform: 'rotate(270deg)',
            transformOrigin: 'right center',
            opacity: '0.9'
        }
    };


    function log(msg) {
        if (config.debug) console.log(`[Gmail POP3 Checker] ${msg}`);
    }

    function findLinks() {
        const links = [];
        // Buscar en todos los elementos que podrían ser enlaces POP3
        const allElements = document.querySelectorAll('*[role="link"], span, div, a');
        log(`[findLinks] Se buscarán enlaces con el texto "${config.checkMailText}".`);

        for (const element of allElements) {
            // Verificar el texto del elemento y sus elementos hijos
            const elementText = element.textContent.trim();
            if (elementText.includes(config.checkMailText)) {
                // Verificar si el elemento es clickeable
                if (element.onclick || element.role === 'link' || element.tagName === 'A' ||
                    element.getAttribute('role') === 'link' ||
                    element.style.cursor === 'pointer') {
                    links.push(element);
                    log(`Enlace encontrado: ${elementText}`);
                }
            }
        }

        log(`Encontrados ${links.length} enlaces POP3.`);
        return links;
    }

    function handleLinksFound(links) {
        if (links.length > 0) {
            // Agregar un pequeño retraso entre cada clic
            links.forEach((link, index) => {
                setTimeout(() => {
                    log(`Haciendo clic en el enlace ${index + 1}: ${link.textContent}`);
                    link.click();
                }, index * 500); // 500ms entre cada clic
            });

            // Esperar a que todos los clics se completen antes de redirigir
            const totalDelay = (links.length * 500) + 1000;
            setTimeout(() => {
                window.location.href = 'https://mail.google.com/mail/u/0/#inbox';
            }, totalDelay);
        } else {
            log('No se encontraron enlaces POP3');
        }
    }


    function checkPop3() {
    const currentURL = window.location.href;

    if (!currentURL.includes('#settings/accounts')) {
        log('Redirigiendo a configuración de cuentas...');
        window.location.href = 'https://mail.google.com/mail/u/0/#settings/accounts';
        return;
    }

    // Configurar el MutationObserver
    const observer = new MutationObserver(async (mutations, obs) => {
        const links = await findLinks();
        if (links && links.length > 0) {
            obs.disconnect(); // Detener la observación una vez encontrados los enlaces
            handleLinksFound(links);
        }
    });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

        // Timeout de seguridad con cleanup
        const timeoutId = setTimeout(() => {
            observer.disconnect();
            log('Observer desconectado por timeout');
        }, 10000);

        // Cleanup si la página cambia antes del timeout
        window.addEventListener('beforeunload', () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        }, { once: true });
    }

    function createCustomButton() {
        const existingButton = document.getElementById('gmail-pop3-checker');
        if (existingButton) {
            existingButton.remove();
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'gmail-pop3-checker';
        Object.assign(buttonContainer.style, config.buttonStyles);
        buttonContainer.textContent = config.buttonText;

        // Eventos del botón con mejor manejo de estados
        let isClicking = false;

        buttonContainer.addEventListener('mouseover', () => {
            if (!isClicking) {
                buttonContainer.style.backgroundColor = '#1557b0';
                buttonContainer.style.opacity = '1';
            }
        });

        buttonContainer.addEventListener('mouseout', () => {
            if (!isClicking) {
                buttonContainer.style.backgroundColor = '#1a73e8';
                buttonContainer.style.opacity = '0.8';
            }
        });

        buttonContainer.addEventListener('click', () => {
            if (isClicking) return;
            isClicking = true;

            buttonContainer.style.transform = 'rotate(270deg) scale(0.95)';
            log('Click Botón');

            const targetURL = 'https://mail.google.com/mail/u/0/#settings/accounts';

            if (window.location.href === targetURL) {
                checkPop3();
            } else {
                const urlObserver = new MutationObserver((mutations, obs) => {
                    if (window.location.href.includes('#settings/accounts')) {
                        obs.disconnect();
                        checkPop3();
                    }
                });

                urlObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                window.location.href = targetURL;
            }

            setTimeout(() => {
                buttonContainer.style.transform = 'rotate(270deg)';
                isClicking = false;
            }, 300);
        });

        document.body.appendChild(buttonContainer);
        log('Botón agregado al documento');
    }

    function isInGmail() {
        return window.location.hostname === 'mail.google.com';
    }

    function init() {
        if (isInGmail()) {
            createCustomButton();
        }
    }

    log('Iniciando script...');
    init();

    // Observer para mantener el botón
    const domObserver = new MutationObserver(() => {
        if (!document.getElementById('gmail-pop3-checker') && isInGmail()) {
            createCustomButton();
        }
    });

    domObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
})();