// ==UserScript==
// @name         Customize Mine Locations
// @namespace    tampermonkey.org
// @version      1.0
// @description  Customize mine locations in the calculateMines function
// @author       Your Name
// @match        https://faucetpay.io/mines
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476593/Customize%20Mine%20Locations.user.js
// @updateURL https://update.greasyfork.org/scripts/476593/Customize%20Mine%20Locations.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Função para calcular as minas personalizadas
    function calculateCustomMines(client_seed, server_seed, nonce, customMinePositions) {
        var seeds = [];
        var deck = Array.from(Array(25).keys());
        var roll_numbers = [];
        var position = 0;

        var md = forge.md.sha256.create();
        md.update(server_seed);
        var server_seed_hash = md.digest().toHex();

        var series_1 = forge.hmac.create();
        series_1.start("sha256", server_seed);
        series_1.update(client_seed + ":" + nonce + ":0");
        const series_1_result = series_1.digest().toHex();

        var series_2 = forge.hmac.create();
        series_2.start("sha256", server_seed);
        series_2.update(client_seed + ":" + nonce + ":1");
        const series_2_result = series_2.digest().toHex();

        var series_3 = forge.hmac.create();
        series_3.start("sha256", server_seed);
        series_3.update(client_seed + ":" + nonce + ":2");
        const series_3_result = series_3.digest().toHex();

        let s = 0;

        for (let x = 0; x < 32; x++) {
            s = x * 2;
            seeds.push(series_1_result.substring(x * 2, s + 2));
        }

        for (let x = 0; x < 32; x++) {
            s = x * 2;
            seeds.push(series_2_result.substring(x * 2, s + 2));
        }

        for (let x = 0; x < 32; x++) {
            s = x * 2;
            seeds.push(series_3_result.substring(x * 2, s + 2));
        }

        for (let x = 25; x > 1; x--) {
            const seedForNum_1 = parseInt(seeds[position + 0], 16) / Math.pow(256, 1);
            const seedForNum_2 = parseInt(seeds[position + 1], 16) / Math.pow(256, 2);
            const seedForNum_3 = parseInt(seeds[position + 2], 16) / Math.pow(256, 3);
            const seedForNum_4 = parseInt(seeds[position + 3], 16) / Math.pow(256, 4);

            let num1 = parseFloat(seedForNum_1.toString()).toFixed(12);
            let num2 = parseFloat(seedForNum_2.toString()).toFixed(12);
            let num3 = parseFloat(seedForNum_3.toString()).toFixed(12);
            let num4 = parseFloat(seedForNum_4.toString()).toFixed(12);

            let sum = toFixed(+num1 + +num2 + +num3 + +num4, 12);
            let roll_number = toFixed(+sum * x, 0);

            position += 4;

            roll_numbers.push(+roll_number);
        }

        const cells = [];

        for (let i = 0; i < 25; i++) {
            cells.push(false);
        }

        // Verifique se o usuário forneceu posições personalizadas das minas
        if (customMinePositions && customMinePositions.length > 0) {
            for (let i = 0; i < customMinePositions.length; i++) {
                const mineLocation = customMinePositions[i];
                cells[mineLocation] = true;
            }
        } else {
            // Se nenhuma posição personalizada foi fornecida, use a lógica de geração aleatória de minas original
            for (let i = 0; i < mines; i++) {
                let number = deck[roll_numbers[i]];
                deck.splice(roll_numbers[i], 1);

                cells[number] = true;
            }
        }

        return {
            cells,
            seed: server_seed_hash,
        };
    }

    // Substitua a função original com a função personalizada
    window.calculateMines = calculateCustomMines;
})();
