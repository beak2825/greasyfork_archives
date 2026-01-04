// ==UserScript==
// @name         Pendoria - Battle End Health Calculation
// @namespace    http://pendoria.net/
// @version      1.0.4
// @author       Xortrox, Kidel
// @match        https://pendoria.net/game
// @match        https://dev.pendoria.net/game
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pendoria.net
// @grant        none
// @description  Show final health remaining
// @downloadURL https://update.greasyfork.org/scripts/452612/Pendoria%20-%20Battle%20End%20Health%20Calculation.user.js
// @updateURL https://update.greasyfork.org/scripts/452612/Pendoria%20-%20Battle%20End%20Health%20Calculation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    socket.on('battle data', (data) => {
        if (data.rounds === 1500) { return; }
        
        if (!document.getElementById("newphp")) {
            $('#fightPlayer').before('<div id="newphp" style="width: 45%; color: white; font-size: 13px;"><div class="actionrow" style="text-align: center;">This is your health after <span id="newphprounds" class="timeshit" style="color: lightgreen;">#</span> theoretical rounds</div></div>');
        }
        // Skip 1 frame (might be unecessary if this is scheduled after other battle data listeners)
        setTimeout(() => {
            if (data?.victory) {

                const lifeLostPerRoundPlayer = (data.playerMaxLife - data.playerLife) / 1500;
                const lifeLostPerRoundMonster = (data.monsterMaxLife - data.monsterLife) / 1500;

                const roundsUntilMonsterDead = Math.ceil(data.monsterLife / lifeLostPerRoundMonster);

                const playerLifeRemaining = data.playerLife - lifeLostPerRoundPlayer * roundsUntilMonsterDead;
                const playerLifeRemainingPercentage = (playerLifeRemaining / data.playerMaxLife * 100);

                const monsterHealthDisplay = $('#mhp-value');
                monsterHealthDisplay.text(`0/${formatNumber(data.monsterMaxLife)} (0.0000%)`);

                const monsterHealthBackground = $('#mhp-background');
                monsterHealthBackground[0].style['width'] = 0;

                const playerHealthDisplay = $('#php-value');
                playerHealthDisplay.text(`${formatNumber(playerLifeRemaining)}/${formatNumber(data.playerMaxLife)} (${playerLifeRemainingPercentage.toFixed(4)}%)`);

                const playerHealthBackground = $('#php-background');
                playerHealthBackground[0].style['width'] = playerLifeRemainingPercentage + '%';

                document.getElementById("newphprounds").innerHTML = formatNumber(roundsUntilMonsterDead);

            } else {

                const lifeLostPerRoundPlayer = (data.playerMaxLife - data.playerLife) / 1500;
                const lifeLostPerRoundMonster = (data.monsterMaxLife - data.monsterLife) / 1500;

                const roundsUntilPlayerDead = Math.ceil(data.playerLife / lifeLostPerRoundPlayer);

                const monsterLifeRemaining = data.monsterLife - lifeLostPerRoundMonster * roundsUntilPlayerDead;
                const monsterLifeRemainingPercentage = (monsterLifeRemaining / data.monsterMaxLife * 100);

                const playerHealthDisplay = $('#php-value');
                playerHealthDisplay.text(`0/${formatNumber(data.playerMaxLife)} (0.0000%)`);

                const playerHealthBackground = $('#php-background');
                playerHealthBackground[0].style['width'] = 0;

                const monsterHealthDisplay = $('#mhp-value');
                monsterHealthDisplay.text(`${formatNumber(monsterLifeRemaining)}/${formatNumber(data.monsterMaxLife)} (${monsterLifeRemainingPercentage.toFixed(4)}%)`);

                const monsterHealthBackground = $('#mhp-background');
                monsterHealthBackground[0].style['width'] = monsterLifeRemainingPercentage + '%';

                document.getElementById("newphprounds").innerHTML = formatNumber(roundsUntilPlayerDead);

            }
        });
    });
})();