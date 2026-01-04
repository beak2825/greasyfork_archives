// ==UserScript==
// @name         Freebitco.in BONUS 1000% BTC only NO ROLL 2025
// @license      MIT
// @version      1.3
// @description  resgate automático de pontos no Freebitco.in
// @match        https://freebitco.in/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace    bitcoin channel youtube
// @downloadURL https://update.greasyfork.org/scripts/527009/Freebitcoin%20BONUS%201000%25%20BTC%20only%20NO%20ROLL%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/527009/Freebitcoin%20BONUS%201000%25%20BTC%20only%20NO%20ROLL%202025.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        console.log("Script iniciado...");

        function RedeemRPProductSafe(productId) {
            if (typeof unsafeWindow.RedeemRPProduct === "function") {
                console.log(`Resgatando pontos: ${productId}`);
                unsafeWindow.RedeemRPProduct(productId);
            } else {
                console.warn("Função RedeemRPProduct não encontrada no contexto da página. Tentando eval...");
                var script = document.createElement("script");
                script.textContent = `RedeemRPProduct('${productId}');`;
                document.body.appendChild(script);
                document.body.removeChild(script);
            }
        }

        function verificarResgate() {
            var pointsText = $('.user_reward_points').text().replace(',', "").trim();
            var points = parseInt(pointsText) || 0;

            if (points >= 70 && points < 139) {
                RedeemRPProductSafe('fp_bonus_50');
            } else if (points >= 139 && points < 701) {
                RedeemRPProductSafe('fp_bonus_100');
            } else if (points >= 701 && points < 1404) {
                RedeemRPProductSafe('fp_bonus_500');
            } else if (points >= 1404) {
                RedeemRPProductSafe('fp_bonus_1000');
            }
        }

        // Executa a verificação de resgate a cada 30 segundos
        setInterval(verificarResgate, 30000);
    });
})();
