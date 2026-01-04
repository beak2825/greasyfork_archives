// ==UserScript==
// @name         Modificar Limite Diário Gratuito em Poe
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modifica o limite diário gratuito para 300 em Poe
// @author       You
// @match        https://poe.com/Claude-instant-100k* 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485006/Modificar%20Limite%20Di%C3%A1rio%20Gratuito%20em%20Poe.user.js
// @updateURL https://update.greasyfork.org/scripts/485006/Modificar%20Limite%20Di%C3%A1rio%20Gratuito%20em%20Poe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Aguarda o carregamento da página
    window.addEventListener('load', function() {
        // Função para modificar o limite diário gratuito
        function modifyDailyLimit() {
            // Verifica se o componente CountRow existe
            var countRow = document.querySelector('.SettingsSubscriptionSection_countRowContainer__gTe1b');

                        if (countRow) {
                // Modifica o limite diário gratuito para 300
                var dailyLimitElement = countRow.querySelector('.SettingsSubscriptionSection_countRow__8Ek9H .SettingsSubscriptionSection_subtitle__3fnw4');
                if (dailyLimitElement) {
                    dailyLimitElement.textContent = "Diário (gratuito)";
                }

                var balanceElement = countRow.querySelector('.SettingsSubscriptionSection_countRow__8Ek9H .SettingsSubscriptionSection_subtitle__3fnw4 + .SettingsSubscriptionSection_subtext__cZuI6');
                if (balanceElement) {
                    balanceElement.textContent = "300 restante";  // Altere este valor para 300
                }
            }
        }

        // Chama a função para modificar o limite diário gratuito
        modifyDailyLimit();
    });
})();
