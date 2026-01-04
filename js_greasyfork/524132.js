// ==UserScript==
// @name         Kour.io- Speed Hack (LC MOD MENU)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  x2 hack kour.io
// @author       LC|K
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524132/Kourio-%20Speed%20Hack%20%28LC%20MOD%20MENU%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524132/Kourio-%20Speed%20Hack%20%28LC%20MOD%20MENU%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para alterar a multiplicação do tempo
    function speeeed(multiplier) {
        function apply(target, thisArg, argArray) {
            try {
                throw new Error();
            } catch (e) {
                if (!e.stack.includes("invoke_")) {
                    return target.apply(thisArg, argArray) * multiplier;
                }
            }

            return target.apply(thisArg, argArray);
        }

        // Substitui a função performance.now() com o Proxy
        performance.now = new Proxy(performance.now, {apply});

        // Mensagem estilizada no console
        console.log("%cLC|K MOD MENU", "font-size: 24px; color: #ffffff; background-color: #007bff; padding: 10px 15px; border-radius: 8px; font-weight: bold; box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.3); text-align: center;");
    }

    // Verifica se está no site kour.io
    if (window.location.hostname === 'kour.io') {

        // Cria a mensagem na tela
        const message = document.createElement('div');
        message.textContent = 'LC|K MOD MENU';
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.right = '20px';
        message.style.padding = '10px 20px';
        message.style.backgroundColor = '#007bff';
        message.style.color = '#ffffff';
        message.style.fontSize = '18px';
        message.style.fontWeight = 'bold';
        message.style.borderRadius = '8px';
        message.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
        message.style.zIndex = '9999';
        message.style.textAlign = 'center';
        message.style.display = 'inline-block';

        // Adiciona o elemento à página
        document.body.appendChild(message);

        // Chama a função com o multiplicador 2
        speeeed(2);
    }

})();
