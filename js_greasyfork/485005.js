// ==UserScript==
// @name         Modificar Contagem Regressiva
// @namespace    http://seu-namespace.org/
// @version      0.1
// @description  Modificar a contagem regressiva nas configurações de assinatura
// @author       Você
// @match        https://poe.com/settings* 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485005/Modificar%20Contagem%20Regressiva.user.js
// @updateURL https://update.greasyfork.org/scripts/485005/Modificar%20Contagem%20Regressiva.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Encontre o elemento com a classe específica
    var subscriptionSection = document.querySelector('.SettingsSubscriptionSection_sectionBubble__WGioU');

    if (subscriptionSection) {
        // Modifique o conteúdo para o desejado
        var countRowElement = subscriptionSection.querySelector('.SettingsSubscriptionSection_countsSection__rDdS0');
        if (countRowElement) {
            // Substitua o texto da contagem regressiva
            var countdownTimerElement = countRowElement.querySelector('.SettingsSubscriptionSection_subtext__cZuI6');
            if (countdownTimerElement) {
                countdownTimerElement.textContent = 'Reinicia em 00:00:00';  // Modifique para o valor desejado
            }

            // Substitua o texto da quantidade restante
            var remainingCountElement = countRowElement.querySelector('.SettingsSubscriptionSection_subtitle__3fnw4');
            if (remainingCountElement) {
                remainingCountElement.textContent = '200 Todas as outras mensagens';  // Modifique para o valor desejado
            }
        }
    }
})();

