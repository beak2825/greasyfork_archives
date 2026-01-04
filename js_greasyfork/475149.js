// ==UserScript==
// @name         Rastrear IP do Remetente
// @namespace https://github.com/TalkLounge
// @version      1.0
// @description  Rastreia o IP do remetente de uma mensagem anônima no Tellonym
// @author       Seu Nome
// @match        https://www.tellonym.me/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/475149/Rastrear%20IP%20do%20Remetente.user.js
// @updateURL https://update.greasyfork.org/scripts/475149/Rastrear%20IP%20do%20Remetente.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para rastrear o IP
    function getIP(username) {
        // Monta a URL da API
        var url = "https://api.tellonym.me/v1/users/" + username + "/messages";

        // Faz uma requisição GET usando GM_xmlhttpRequest
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                // Verifica o status da requisição
                if (response.status === 200) {
                    // Decodifica a resposta JSON
                    var data = JSON.parse(response.responseText);

                    // Obtém o IP do remetente
                    var ip = data.ip;

                    // Exibe o IP do remetente no console
                    console.log("IP do remetente: " + ip);
                } else {
                    console.log("Erro ao obter o IP do remetente.");
                }
            }
        });
    }

    // Função para lidar com mensagens
    function onMessage(message) {
        // Obtém o username do remetente
        var username = message.sender;

        // Obtém o IP do remetente
        getIP(username);
    }

    // Adicione a função onMessage() ao evento de mensagem
    window.addEventListener("message", function(event) {
        if (event.data.type === "message") {
            onMessage(event.data.message);
        }
    });
})();
