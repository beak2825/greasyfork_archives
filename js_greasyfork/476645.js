
// ==UserScript==
// @name         m1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adicione aqui a descrição do seu script
// @author       Você
// @match        https://faucetpay.io/mines
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476645/m1.user.js
// @updateURL https://update.greasyfork.org/scripts/476645/m1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function calculateMinesResult() {
        var client_seed = $("#client_seed").val();
        var server_seed = $("#server_seed").val();
        var mines = $("#mines").val();
        var nonce = $("#nonce").val();

        var result = [];
        var seeds = [];
        var deck = Array.from(Array(25).keys());
        var roll_numbers = [];
        var position = 0;

        var md = forge.md.sha256.create();
        md.update(server_seed);
        var server_seed_hash = md.digest().toHex();

        var series_1 = forge.hmac.create();
        series_1.start('sha256', server_seed);
        series_1.update(client_seed + ":" + nonce + ":0");
        series_1 = series_1.digest().toHex();

        var series_2 = forge.hmac.create();
        series_2.start('sha256', server_seed);
        series_2.update(client_seed + ":" + nonce + ":1");
        series_2 = series_2.digest().toHex();

        var series_3 = forge.hmac.create();
        series_3.start('sha256', server_seed);
        series_3.update(client_seed + ":" + nonce + ":2");
        series_3 = series_3.digest().toHex();

        let s = 0;

        for (x = 0; x < 32; x++) {
            s = x * 2;
            seeds.push(series_1.substring(x * 2, s + 2));
        }

        for (x = 0; x < 32; x++) {
            s = x * 2;
            seeds.push(series_2.substring(x * 2, s + 2));
        }

        for (x = 0; x < 32; x++) {
            s = x * 2;
            seeds.push(series_3.substring(x * 2, s + 2));
        }

        for (x = 25; x > 1; x--) {

            let num1 = parseFloat(parseInt(seeds[position + 0], 16) / Math.pow(256, 1)).toFixed(12);
            let num2 = parseFloat(parseInt(seeds[position + 1], 16) / Math.pow(256, 2)).toFixed(12);
            let num3 = parseFloat(parseInt(seeds[position + 2], 16) / Math.pow(256, 3)).toFixed(12);
            let num4 = parseFloat(parseInt(seeds[position + 3], 16) / Math.pow(256, 4)).toFixed(12);
            let sum = toFixed((+num1 + +num2 + +num3 + +num4), 12);
            let roll_number = toFixed(sum * x, 0);

            position += 4;

            roll_numbers.push(roll_number);

        }

        for (i = 0; i < 25; i++) {
            $("#pos" + i).css("color", "green");
        }

        for (i = 0; i < mines; i++) {
            let number = deck[roll_numbers[i]];
            if (number !== 17) { // Verifica se a posição não é 17
                deck.splice(roll_numbers[i], 1);
            }
            $("#pos" + number).css("color", "red");
        }

        $("#server_seed_hash").val(server_seed_hash);
    }

    
    $("#mines-calculate-result").click(function (e) {
        calculateMinesResult();
    });

    

})();

