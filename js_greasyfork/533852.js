// ==UserScript==
// @license mit
// @name         Khan Academy (ES) Pantalla Completa con Botones Comprobar y Seguir Mejorado
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Mantiene la pantalla completa al presionar "Seguir" y muestra mensajes correctamente
// @author       EL tols/Tails bonil
// @match        *://es.khanacademy.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533852/Khan%20Academy%20%28ES%29%20Pantalla%20Completa%20con%20Botones%20Comprobar%20y%20Seguir%20Mejorado.user.js
// @updateURL https://update.greasyfork.org/scripts/533852/Khan%20Academy%20%28ES%29%20Pantalla%20Completa%20con%20Botones%20Comprobar%20y%20Seguir%20Mejorado.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let fullscreenCheckButton;
    let fullscreenNextButton;
    let fullscreenButton;
    let responseMessageBox;

    function toggleFullScreen() {
        const quizContainer = document.querySelector('.exercise-chrome-content-for-mobile-zoom');
        if (!quizContainer) {
            console.error("No se encontró el contenedor del cuestionario.");
            return;
        }

        if (!document.fullscreenElement) {
            quizContainer.requestFullscreen().then(() => {
                console.log("Modo pantalla completa activado.");
                adjustStyles(true);
                createCheckButtonInsideQuiz();
                createNextButtonInsideQuiz();
                createResponseMessageBox();
            }).catch(err => {
                console.error("Error al activar pantalla completa:", err);
            });
        } else {
            console.log("Modo pantalla completa sigue activo.");
            adjustStyles(true); // Asegurar que los estilos se mantengan
        }
    }

    function adjustStyles(enable) {
        const quizContainer = document.querySelector('.exercise-chrome-content-for-mobile-zoom');
        if (!quizContainer) return;

        if (enable) {
            quizContainer.style.width = "100vw";
            quizContainer.style.height = "100vh";
            quizContainer.style.position = "fixed";
            quizContainer.style.top = "0";
            quizContainer.style.left = "0";
            quizContainer.style.zIndex = "9999";
            quizContainer.style.backgroundColor = "#fff";
            quizContainer.style.display = "flex";
            quizContainer.style.flexDirection = "column";
            quizContainer.style.alignItems = "center";
            quizContainer.style.justifyContent = "space-between";
            document.body.style.overflow = "hidden";
        } else {
            quizContainer.style = "";
            document.body.style.overflow = "";
        }
    }

    function createCheckButtonInsideQuiz() {
        const quizContainer = document.querySelector('.exercise-chrome-content-for-mobile-zoom');
        if (!quizContainer) return;

        fullscreenCheckButton = document.createElement("button");
        fullscreenCheckButton.innerText = "Comprobar";
        fullscreenCheckButton.style.position = "absolute";
        fullscreenCheckButton.style.bottom = "60px";
        fullscreenCheckButton.style.right = "10px";
        fullscreenCheckButton.style.zIndex = "10000";
        fullscreenCheckButton.style.padding = "10px";
        fullscreenCheckButton.style.backgroundColor = "#28a745";
        fullscreenCheckButton.style.color = "white";
        fullscreenCheckButton.style.border = "none";
        fullscreenCheckButton.style.borderRadius = "5px";
        fullscreenCheckButton.style.cursor = "pointer";
        fullscreenCheckButton.onclick = clickCheckButton;

        quizContainer.appendChild(fullscreenCheckButton);
    }

    function createNextButtonInsideQuiz() {
        const quizContainer = document.querySelector('.exercise-chrome-content-for-mobile-zoom');
        if (!quizContainer) return;

        fullscreenNextButton = document.createElement("button");
        fullscreenNextButton.innerText = "Seguir";
        fullscreenNextButton.style.position = "absolute";
        fullscreenNextButton.style.bottom = "10px";
        fullscreenNextButton.style.right = "10px";
        fullscreenNextButton.style.zIndex = "10000";
        fullscreenNextButton.style.padding = "10px";
        fullscreenNextButton.style.backgroundColor = "#1865f2";
        fullscreenNextButton.style.color = "white";
        fullscreenNextButton.style.border = "none";
        fullscreenNextButton.style.borderRadius = "5px";
        fullscreenNextButton.style.cursor = "pointer";
        fullscreenNextButton.onclick = clickNextButton;

        quizContainer.appendChild(fullscreenNextButton);
    }

    function createResponseMessageBox() {
        responseMessageBox = document.createElement("div");
        responseMessageBox.innerText = "";
        responseMessageBox.style.position = "absolute";
        responseMessageBox.style.bottom = "110px";
        responseMessageBox.style.left = "50%";
        responseMessageBox.style.transform = "translateX(-50%)";
        responseMessageBox.style.zIndex = "10000";
        responseMessageBox.style.padding = "10px";
        responseMessageBox.style.borderRadius = "5px";
        responseMessageBox.style.fontSize = "20px";
        responseMessageBox.style.fontWeight = "bold";
        responseMessageBox.style.display = "none";
        document.body.appendChild(responseMessageBox);
    }

    function clickCheckButton() {
        const realCheckButton = document.querySelector('[data-testid="exercise-check-answer"]');
        if (realCheckButton) {
            realCheckButton.click();

            setTimeout(() => {
                const responseMessage = document.querySelector('._ly8ffo, ._1pskjt1');
                if (responseMessage) {
                    responseMessageBox.innerText = responseMessage.innerText;
                    responseMessageBox.style.display = "block";
                    responseMessageBox.style.backgroundColor = responseMessage.innerText.includes("Lo lograste") ? "#28a745" :
                                                               responseMessage.innerText.includes("Todavía no del todo") ? "#ffcc00" :
                                                               "#dc3545";
                    responseMessageBox.style.color = "white";

                    setTimeout(() => {
                        responseMessageBox.style.display = "none";
                    }, 2000);
                }
            }, 1000);
        }
    }

    function clickNextButton() {
        const realNextButton = document.querySelector('[data-testid="exercise-next-question"]');
        if (realNextButton) {
            realNextButton.click();
            toggleFullScreen(); // Mantiene la pantalla completa activa después de avanzar
        }
    }

    function createFullscreenButton() {
        fullscreenButton = document.createElement("button");
        fullscreenButton.innerText = "Pantalla Completa Cuestionario";
        fullscreenButton.style.position = "fixed";
        fullscreenButton.style.top = "10px";
        fullscreenButton.style.right = "10px";
        fullscreenButton.style.zIndex = "10000";
        fullscreenButton.style.padding = "10px";
        fullscreenButton.style.backgroundColor = "#0071bc";
        fullscreenButton.style.color = "white";
        fullscreenButton.style.border = "none";
        fullscreenButton.style.cursor = "pointer";
        fullscreenButton.onclick = toggleFullScreen;
        document.body.appendChild(fullscreenButton);
    }

    function checkPageLoad() {
        if (document.readyState === "complete") {
            createFullscreenButton();
        } else {
            window.addEventListener("load", createFullscreenButton);
        }
    }

    checkPageLoad(); // Ahora correctamente definido y llamado

})();