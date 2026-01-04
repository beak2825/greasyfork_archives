// ==UserScript==
// @name         Grepolis Attack Detector and Troop Evacuator
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Detecta ataque inimigo e desvia tropas 5 segundos antes do impacto, retornando-as depois (apenas para fins educacionais)
// @author       li-mousin
// @match        https://*.grepolis.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503349/Grepolis%20Attack%20Detector%20and%20Troop%20Evacuator.user.js
// @updateURL https://update.greasyfork.org/scripts/503349/Grepolis%20Attack%20Detector%20and%20Troop%20Evacuator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ID da cidade de destino para desviar as tropas
    const targetCityId = '67890';  // Substitua pelo ID real da cidade de destino

    // Função para criar e adicionar o botão na interface do Grepolis
    function createButton() {
        let btn = document.createElement("button");
        btn.innerHTML = "Iniciar Detecção de Ataques";
        btn.style.position = "fixed";
        btn.style.bottom = "10px";
        btn.style.left = "10px";
        btn.style.zIndex = 1000;
        document.body.appendChild(btn);

        btn.addEventListener("click", function() {
            monitorAttacks();
        });
    }

    // Função para obter o ID da cidade atual a partir da URL
    function getCurrentCityId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('town_id');
    }

    // Função para monitorar ataques
    function monitorAttacks() {
        setInterval(() => {
            const incomingAttacks = document.querySelectorAll('.incoming_attack');  // Substitua com o seletor correto

            incomingAttacks.forEach(attack => {
                const arrivalTime = new Date(attack.dataset.arrivalTime);  // Substitua com a forma correta de obter o horário de chegada
                const currentTime = new Date();
                const timeToImpact = arrivalTime - currentTime;

                if (timeToImpact > 0 && timeToImpact <= 5000) {
                    evacuateTroops();
                }
            });
        }, 1000);  // Verifica a cada segundo
    }

    // Função para desviar tropas
    function evacuateTroops() {
        const currentCityId = getCurrentCityId();
        if (!currentCityId) {
            alert("ID da cidade atual não encontrado!");
            return;
        }

        console.log(`Desviando tropas da cidade ${currentCityId} para a cidade ${targetCityId}`);

        // Obtendo todas as tropas disponíveis
        const troops = document.querySelectorAll('.unit_input');

        // Selecionando todas as tropas
        troops.forEach(troop => {
            troop.value = troop.max;
        });

        // Simulando o envio de tropas como apoio (essa parte precisa ser ajustada de acordo com a API real do Grepolis)
        document.querySelector('#send_command .btn_send').click();

        console.log(`Tropas enviadas de ${currentCityId} para ${targetCityId}`);

        // Esperar um tempo antes de cancelar o apoio (substitua '10000' com o tempo apropriado em milissegundos para retorno)
        setTimeout(() => {
            // Cancelar o apoio e retornar tropas
            cancelSupportAndReturnTroops();
        }, 10000);
    }

    // Função para cancelar o apoio e retornar as tropas
    function cancelSupportAndReturnTroops() {
        const supportCommands = document.querySelectorAll('.support_command_cancel .btn_cancel'); // Substitua com o seletor correto para cancelar apoios

        supportCommands.forEach(btn => {
            btn.click();
        });

        console.log('Apoio cancelado e tropas retornando.');
    }

    // Esperar até que a página esteja completamente carregada
    window.addEventListener('load', function() {
        createButton();
    });

})();