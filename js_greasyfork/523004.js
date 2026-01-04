// ==UserScript==
// @name         Playdede AutoLogin + Redirección + AutoClick Ads
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Redirige dominios playdede.*, autocompleta login, cambia el título de la página y hace clic automático en botones dentro de iframes.
// @author       Tú
// @run-at       document-end
// @noframes     false
// @match        https://playdede.*/*
// @match        https://www*.playdede.link/*
// @include      https://playdede.*/*
// @include      https://www*.playdede.link/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playdede.club
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523004/Playdede%20AutoLogin%20%2B%20Redirecci%C3%B3n%20%2B%20AutoClick%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/523004/Playdede%20AutoLogin%20%2B%20Redirecci%C3%B3n%20%2B%20AutoClick%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickLoginButtonWhenReady() {
        const selector = 'a.authLinks.redButton[data-uia="header-login-link"][href="/login"]';

        const tryClick = () => {
            const loginLink = document.querySelector(selector);
            if (loginLink) {
                console.log("Botón 'Iniciar sesión' encontrado. Simulando clic...");

                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                loginLink.dispatchEvent(event);
                return true;
            }
            return false;
        };

        if (tryClick()) return;

        const observer = new MutationObserver(() => {
            if (tryClick()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Función para cambiar el título de la página
    function changeTitle() {
        let titleElement = document.querySelector('div.data:nth-child(2) > h1:nth-child(1)');
        if (!titleElement) {
            titleElement = document.querySelector('#info > h1:nth-child(2)');
        }

        if (titleElement) {
            const newTitle = titleElement.textContent.trim();
            document.title = "Playdede - " + newTitle;
        }
    }


    // Función para autocompletar el login
    function autoCompleteLogin() {
        const usernameInput = document.querySelector('input[type="text"][name="user"][placeholder="Nombre de usuario"]');
        const passwordInput = document.querySelector('input[type="password"][name="pass"][placeholder="Contraseña"]');

        if (usernameInput && passwordInput) {
            // usernameInput.value = "vanlic43@gmail.com";
            // passwordInput.value = "fAXsFjCazpGiM98";
            usernameInput.value = "nombreapellidos433@gmail.com";
            passwordInput.value = "aq12wsxZ";

            setTimeout(() => {
                const submitButton = document.querySelector('button[type="submit"]');
                if (submitButton) {
                    console.log("Autocompletado. Clic en botón 'Iniciar sesión'.");
                    submitButton.click();
                } else {
                    console.log("Botón 'Iniciar sesión' no encontrado.");
                }
            }, 500);
        }
    }

    function autoClickPlayButton() {
        const playButtonInterval = setInterval(() => {
            const iframe = document.querySelector('iframe');
            if (iframe) {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc) {
                    const playButton = iframeDoc.getElementById("start");
                    if (playButton) {
                        console.log("Clic en 'Reproducir' dentro del iframe...");
                        playButton.click();
                        clearInterval(playButtonInterval); // <- IMPORTANTE: solo hacer clic una vez
                    }
                }
            }
        }, 500);
    }


    // Función para hacer clic en el botón "Saltar" dentro del iframe
    function autoClickSkipButtonInIframe() {
        const skipButtonInterval = setInterval(() => {
            const iframe = document.querySelector('iframe');
            if (iframe) {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const skipButton = iframeDoc ? iframeDoc.getElementById("skipCountdown") : null;

                // Esperar a que el contador llegue a cero
                const countdownText = skipButton ? skipButton.textContent.trim() : '';
                if (skipButton && skipButton.style.display === "block" && countdownText === "Saltar") {
                    console.log("Clic en 'Saltar' dentro del iframe...");
                    skipButton.click();
                    clearInterval(skipButtonInterval); // Detener el intervalo después de hacer clic
                }
            }
        }, 500);
    }

    function observeIframeAndClickPlay() {
        let currentIframe = null;
        let playButtonInterval = null;

        const observer = new MutationObserver(() => {
            const iframe = document.querySelector('iframe');
            if (iframe && iframe !== currentIframe) {
                currentIframe = iframe;

                // Limpia el intervalo anterior si lo hubiera
                if (playButtonInterval) clearInterval(playButtonInterval);

                playButtonInterval = setInterval(() => {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (iframeDoc) {
                        const playButton = iframeDoc.getElementById("start");
                        if (playButton) {
                            console.log("Clic en 'Reproducir' dentro del nuevo iframe...");
                            playButton.click();
                            clearInterval(playButtonInterval);
                        }
                    }
                }, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    // Ejecutar las funciones una vez que la página haya cargado
    window.addEventListener('load', function() {
        clickLoginButtonWhenReady();
        changeTitle();
        autoCompleteLogin();
        autoClickPlayButton();
        autoClickSkipButtonInIframe();
        observeIframeAndClickPlay();
    });
})();

