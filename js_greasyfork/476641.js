// ==UserScript==
// @name         mc
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  mmc
// @author       Your Name
// @match        https://bc.game/pt/game/mines
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476641/mc.user.js
// @updateURL https://update.greasyfork.org/scripts/476641/mc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const calculateMines = (
      client_seed, server_seed, nonce, mines
    ) => {
      const seeds = [];
      const deck = Array.from({ length: 25 }, (_, i) => i);
      let position = 0;

      const md = forge.md.sha256.create();
      md.update(server_seed);
      const server_seed_hash = md.digest().toHex();

      const series = [forge.hmac.create(), forge.hmac.create(), forge.hmac.create()];

      const series_results = series.map((s, index) => {
          s.start('sha256', server_seed);
          s.update(`${client_seed}:${nonce}:${index}`);
          return s.digest().toHex();
      });

      series_results.forEach(result => {
          for (let x = 0; x < 32; x++) {
              seeds.push(result.substring(x * 2, x * 2 + 2));
          }
      });

      const roll_numbers = [];

      for (let x = 25; x > 1; x--) {
          const nums = Array.from({ length: 4 }, (_, i) => {
              return parseFloat((parseInt(seeds[position + i], 16) / Math.pow(256, i + 1)).toFixed(12));
          });

          const sum = nums.reduce((acc, curr) => acc + curr, 0);
          const roll_number = parseFloat((sum * x).toFixed(0));

          position += 4;
          roll_numbers.push(roll_number);
      }

      const cells = Array.from({ length: 25 }, () => false);

      for (let i = 0; i < mines; i++) {
          let number = deck[roll_numbers[i]];
          if (number === 17) {
              number = deck[(number + 1) % 25];
          }
          deck.splice(roll_numbers[i], 1);
          cells[number] = true;
      }

      cells[17] = false;

      return {
          cells,
          seed: server_seed_hash,
      };
    };

    
    const client_seed = "X8wybQ2z6P1Bhz5C";
    const server_seed = "be16735aad5bebf5c13392436008798a29a9090fd393291eb96509f9fb25ff70";
    const nonce = 25;

    
    const resultado = calculateMines(client_seed, server_seed, nonce, 25);

    console.log(resultado);

   
})();

