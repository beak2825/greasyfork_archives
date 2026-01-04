// ==UserScript==
// @name         YouTube Comment Spammer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Script para spammar comentários em um vídeo específico do YouTube.
// @author       SXD3008
// @match        https://www.youtube.com/watch?v=VIDEO_ID
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497742/YouTube%20Comment%20Spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/497742/YouTube%20Comment%20Spammer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configurações
    var SPAM_MESSAGE = 'Seu comentário de spam aqui!'; // Mensagem de spam
    var SPAM_INTERVAL = 2000; // Intervalo entre cada spam em milissegundos

    // Função para enviar o spam
    function spamComments() {
        // Localiza o campo de comentário e o botão de envio
        var commentField = document.getElementById('simplebox-placeholder');
        var submitButton = document.querySelector('#submit-button');

        // Verifica se os elementos foram encontrados
        if (commentField && submitButton) {
            // Insere a mensagem de spam no campo de comentário
            commentField.value = SPAM_MESSAGE;

            // Dispara o evento de input no campo de comentário
            var inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true
            });
            commentField.dispatchEvent(inputEvent);

            // Clica no botão de envio
            submitButton.click();
        }
    }

    // Função para spammar comentários em intervalos regulares
    function startSpamming() {
        setInterval(spamComments, SPAM_INTERVAL);
    }

    // Chama a função para iniciar o spamming
    startSpamming();

})();
