// ==UserScript==
// @name         DealerSenha
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Altera o campo de senha na tela de login para password, para permitir que o navegador complete a senha.
// @author       Igor Lima
// @match        https://*.dealernetworkflow.com.br/LoginAux.aspx*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519056/DealerSenha.user.js
// @updateURL https://update.greasyfork.org/scripts/519056/DealerSenha.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Usa um timer para verificar repetidamente o campo de entrada
    const interval = setInterval(() => {
        const inputField = document.getElementById("vUSUARIOSENHA_SENHA");

        if (inputField) {
            // Altera o tipo para 'password'
            inputField.type = "password";
            console.log("Tipo do campo de entrada alterado para password.");

            // Para o intervalo assim que o campo for encontrado e modificado
            clearInterval(interval);
        }
        else {
            console.log("Campo não encontrado, tentando novamente em 100ms");
        }
    }, 100); // Verifica a cada 100ms
})();
