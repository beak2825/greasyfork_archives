// ==UserScript==
// @name         Demiplane Cosmere to Discord
// @namespace    yournamespace
// @version      1.1
// @description  Sends rolls from Demiplane Cosmere RPG character sheets to a Discord channel.
// @author
// @match        https://app.demiplane.com/*
// @icon         https://youriconurl.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516513/Demiplane%20Cosmere%20to%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/516513/Demiplane%20Cosmere%20to%20Discord.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL de la webhook de Discord
    const discordWebhookURL = 'https://discordapp.com/api/webhooks/1285456128943329290/9rdO2-mpz1RFEwy2VULiskGS7mAhKhjTjJWpl8yxsVkTrxBBgUBe3U7jy2iO3jWeAP32';

    // Función para enviar mensajes a Discord
    function sendToDiscord(messageContent) {
        const payload = {
            content: messageContent
        };
        fetch(discordWebhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(response => {
            if (response.ok) {
                console.log('Mensaje enviado a Discord.');
            } else {
                console.error('Error al enviar mensaje a Discord:', response.statusText);
            }
        }).catch(error => {
            console.error('Error de red al enviar mensaje a Discord:', error);
        });
    }

    // Configuración específica para Cosmere RPG
    const cosmereConfig = {
        rollVals: ['dice-history-item-result-value'],
        nameVal: 'dice-history-item-name',
        secondaryNameVal: 'dice-history-item-name--source',
        charName: 'character-name',
        plotDice: {
            'Complication': 'dice-roller-history--complication',
            'Opportunity': 'dice-roller-history--opportunity'
        },
        damage: {
            'Hit': 'dice-history-damage-container--hit-container',
            'Graze': 'dice-history-damage-container--graze-container',
            'Critical': 'dice-history-damage-container--critical-hit-container'
        }
    };

    // Función para observar tiradas
    function rollWatcher(previousState, characterId) {
        const sessionId = characterId + '-dice-history';
        const currentState = localStorage.getItem(sessionId);

        if (previousState === currentState) {
            setTimeout(() => rollWatcher(previousState, characterId), 500);
            return;
        }

        // Verificar si hay nuevas tiradas
        const rollElements = document.getElementsByClassName(cosmereConfig.rollVals[0]);
        if (rollElements.length === 0) {
            setTimeout(() => rollWatcher(currentState, characterId), 500);
            return;
        }

        // Obtener la última tirada
        const latestRollIndex = rollElements.length - 1;
        const latestRollElement = rollElements[latestRollIndex];
        const rollResult = latestRollElement.textContent.trim();

        // Obtener el nombre de la acción
        const actionNameElements = document.getElementsByClassName(cosmereConfig.nameVal);
        const actionName = actionNameElements[latestRollIndex] ? actionNameElements[latestRollIndex].textContent.trim() : 'Acción desconocida';

        // Obtener el tipo de tirada (secundario)
        const secondaryNameElements = document.getElementsByClassName(cosmereConfig.secondaryNameVal);
        const rollType = secondaryNameElements[latestRollIndex] ? secondaryNameElements[latestRollIndex].textContent.trim() : '';

        // Obtener el nombre del personaje
        const characterNameElement = document.getElementsByClassName(cosmereConfig.charName)[0];
        const characterName = characterNameElement ? characterNameElement.textContent.trim() : 'Personaje desconocido';

        // Obtener efectos adicionales (complication, opportunity)
        let additionalEffects = [];
        let damageValues =[];
        const rollCaseElement = latestRollElement.closest('.dice-roller-history');
        if (rollCaseElement) {
            for (const [effectName, className] of Object.entries(cosmereConfig.plotDice)) {
                if (rollCaseElement.classList.contains(className)) {
                    additionalEffects.push(effectName);
                }
            }

            for (const [damageName, className] of Object.entries(cosmereConfig.damage)) {
                const damageElement = rollCaseElement.getElementsByClassName(className)[0];
                if (damageElement) {
                    const damageValue = damageElement.querySelector('.history-item-calculated__value')?.textContent.trim() || '';
                    if (damageValue) {
                        damageValues.push(`${damageName}: ${damageValue}`);
                    }
                }
            }
        }

        const effectsText = additionalEffects.length > 0 ? additionalEffects.join(', ') : null;
        const damageText = damageValues.length > 0 ? damageValues.join(', ') : null;


        // Construir el mensaje para Discord con formato Markdown
        let messageContent = `**${characterName}** ha realizado una tirada`;

        if (actionName) {
            messageContent += ` para **${actionName}**`;
        }

        if (rollType) {
            messageContent += ` (${rollType})`;
        }

        messageContent += `.\n**Resultado:** ${rollResult}`;

        if (effectsText) {
            messageContent += `\n**Efectos adicionales:** ${effectsText}`;
        }

        if (damageText) {
            messageContent += `\n**Daño:** ${damageText}`;
        }

        // Enviar el mensaje a Discord
        sendToDiscord(messageContent);

        // Continuar observando
        setTimeout(() => rollWatcher(currentState, characterId), 500);
    }

    function initRollWatcher() {
        const characterId = window.location.href.split('/').pop();
        const initialState = localStorage.getItem(characterId + '-dice-history') || '';
        rollWatcher(initialState, characterId);
    }

    // Observador de URL
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            initRollWatcher(); // Reiniciar el observador de tiradas cuando la URL cambie
        }
    }).observe(document, { subtree: true, childList: true });

    initRollWatcher();

})();
