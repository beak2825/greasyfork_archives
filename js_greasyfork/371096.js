// ==UserScript==
// @name         Pendoria - Chance to die
// @description  Implements some extra information per finished fight in the battle view on pendoria.
// @namespace    http://pendoria.net/
// @version      0.0.33
// @author       Xortrox
// @contributor  Tester: euphone
// @contributor  Tester: fourkade
// @contributor  Coder: Kidel
// @match        http://pendoria.net/game
// @match        https://pendoria.net/game
// @match        http://www.pendoria.net/game
// @match        https://www.pendoria.net/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371096/Pendoria%20-%20Chance%20to%20die.user.js
// @updateURL https://update.greasyfork.org/scripts/371096/Pendoria%20-%20Chance%20to%20die.meta.js
// ==/UserScript==

(function () {
    function showChanceToDie(data) {
        let playerHealth = $('#php-value')[0];

        if (!playerHealth) {
            return console.log('playerHealth element was not found.');
        }

        let fightDiv = $('#fight')[0];

        if (!fightDiv) {
            return console.log('fightDiv element was not found.');
        }

        let playerHPBackground = $('#php-background')[0];

        if (!playerHPBackground) {
            return console.log('playerHPBackground element was not found.');
        }

        function createHistoricallyLowestHealthTrackerIfNotExists() {
            let historicallyLowestHPTracker = $('#ctdInfoHistoriallyLowestDiv')[0];

            if(!historicallyLowestHPTracker) {
                let infoDiv = document.createElement('div');
                infoDiv.id = 'ctdInfoHistoriallyLowestDiv';
                playerHPBackground.parentElement.prepend(infoDiv);
            }

            return historicallyLowestHPTracker;
        }

        function createInfoDivIfNotExists() {
            let ctdInfoDiv = $('#ctdInfoDiv')[0];

            if (!ctdInfoDiv) {
                let infoDiv = document.createElement('div');
                infoDiv.id = 'ctdInfoDiv';
                fightDiv.parentElement.appendChild(infoDiv);
            }

            return ctdInfoDiv;
        }

        let enemyHitChanceFactor = data.monsterChanceToHit / 100.0;

        let playerMaxHealth = data.playerMaxLife;
        let enemyAverageDamage = data.damageTaken / data.hitsTaken;

        let enemyHitsToKill = Math.ceil(playerMaxHealth / enemyAverageDamage);

        let playerChanceFactorDeath = enemyHitChanceFactor ** enemyHitsToKill;

        let playerHitChanceFactor = data.playerChanceToHit / 100.0;


        let playerAverageDamage = data.damageDone / data.timesHit;

        let enemyMaxHealth = data.monsterMaxLife;

        let enemyMaxHealthWithChanceFactor = (enemyMaxHealth / playerHitChanceFactor);
        let playerHitsToKillEnemy = Math.ceil(enemyMaxHealthWithChanceFactor / playerAverageDamage);
        let playerHitsToKillEnemyNoChanceFactor = Math.ceil(enemyMaxHealth / playerAverageDamage);

        // console.log('enemyHitsToKill:', enemyHitsToKill);
        // console.log('playerHitChanceFactor:', playerHitChanceFactor);
        // console.log('(1 - (1 - playerHitChanceFactor) ** enemyHitsToKill) * 100');
        // let playerWinChance = (1 - (1 - playerHitChanceFactor) ** playerHitsToKillEnemyNoChanceFactor) * 100

        let enemyChanceFactorDeath = playerHitChanceFactor ** playerHitsToKillEnemy;

        let likelinessPrediction = ``;

        // TODO: Make this based on some amount of % within proximity of max healths and damages.
        if (playerHitsToKillEnemy < enemyHitsToKill) {
            likelinessPrediction +=
                `It seems <b style="color:lightgreen">unlikely</b> that you will die as the enemy is required to hit you ${enemyHitsToKill} times, but you need to hit it roughly ${playerHitsToKillEnemy} times.<br>
                <br>
                `;
        } else if (playerHitsToKillEnemy >= enemyHitsToKill){
            likelinessPrediction +=
                `It seems <b style="color:red">likely</b> that you will die as the enemy needs to hit you ${enemyHitsToKill} times, but you need to hit it roughly ${playerHitsToKillEnemy} times.<br>
                <br>
                `;
        }

        let ctdInfoDiv = createInfoDivIfNotExists();

        let diffHits = enemyHitsToKill - playerHitsToKillEnemy;

        if (ctdInfoDiv){
            ctdInfoDiv.innerHTML =
                `
                <div style="border-bottom: 1px solid white; margin-bottom: 3px;">
                  Chance to die<button id="ctdClearHistoricalTracker" style="padding-top: 0; padding-bottom: 0; height:21px; border: 1px solid white; background: transparent; border-radius: 0; float:right; line-height: 21px;">Reset lowest health tracker</button>
                </div>
                ${likelinessPrediction}
                You would die after <b style="color:red;">${enemyHitsToKill}</b>~ rounds of battle if the enemy is still alive.<br>
                You would win after <b style="color:lightgreen;">${playerHitsToKillEnemy}</b>~ rounds of battle.<br>
                <br>
                You have a chance of ${(((1 - playerHitChanceFactor) ** diffHits) * 100).toPrecision(3)}%~ to miss enough in order to receive ${enemyHitsToKill} hits from this enemy, which would kill you.<br>
                `
        }

        /**
         * Bind click event of ctdClearHistoricalTracker
         * */
        $('#ctdClearHistoricalTracker').click(() => {
            let pendCtdSettings = window.localStorage.getItem('PendoriaChanceToDie');
            if (pendCtdSettings) {
               pendCtdSettings = JSON.parse(pendCtdSettings);
            }

            delete(pendCtdSettings.historiallyLowestHealth);

            localStorage.setItem('PendoriaChanceToDie', JSON.stringify(pendCtdSettings));
        });

        playerCurrentHealth = data.playerLife;
        if (playerCurrentHealth < 0) {
            playerCurrentHealth = 0;
        }

        // console.log('playerCurrentHealth:', playerCurrentHealth);

        let ctdInfoHistoriallyLowestDiv = createHistoricallyLowestHealthTrackerIfNotExists();

        // TODO: Also show how many hits you took and for what average damage the hits were, in the tooltip
        if(ctdInfoHistoriallyLowestDiv) {
            let pendCtdSettings = window.localStorage.getItem('PendoriaChanceToDie');
            if (!pendCtdSettings) {
                pendCtdSettings = {
                    historiallyLowestHealth: playerCurrentHealth
                };

                localStorage.setItem('PendoriaChanceToDie', JSON.stringify(pendCtdSettings));
            } else {
                pendCtdSettings = JSON.parse(pendCtdSettings);

                if (pendCtdSettings.historiallyLowestHealth === undefined) {
                    pendCtdSettings.historiallyLowestHealth = playerCurrentHealth
                    localStorage.setItem('PendoriaChanceToDie', JSON.stringify(pendCtdSettings));
                }
            }

            if (playerCurrentHealth < pendCtdSettings.historiallyLowestHealth) {
                pendCtdSettings.historiallyLowestHealth = playerCurrentHealth;
                localStorage.setItem('PendoriaChanceToDie', JSON.stringify(pendCtdSettings))
            }

            let playerHealthPercentage = (pendCtdSettings.historiallyLowestHealth / playerMaxHealth * 100);

            /**
             * Only update qtip if the contents changed.
             **/
            if (ctdInfoHistoriallyLowestDiv.innerText !== commarize(pendCtdSettings.historiallyLowestHealth)) {
                setTimeout(() => {
                    $('#php-value').qtip({
                        style: {
                            classes: 'qtip-dark'
                        },
                        position: {
                            target: $('#ctdInfoHistoriallyLowestDiv'),
                            at: 'bottom left'
                        },
                        content: {
                            text: pendCtdSettings.historiallyLowestHealth,
                            // title: 'Historically lowest health'
                        }
                    });
                })
            }

            ctdInfoHistoriallyLowestDiv.innerText = commarize(pendCtdSettings.historiallyLowestHealth);
            ctdInfoHistoriallyLowestDiv.style =
                `
                z-index: 9999;
                position: absolute;
                background-color: #14723c;
                height: 25px;
                line-height: 26px;
                padding-left: 5px;
                border-radius: 10px;
                font-size: 12px;
                width: ${playerHealthPercentage}%;
                `;

            playerHealth.style.zIndex = '9999';
        }
    }

    $(function () {
        function load() {
            if(window.socket) {
                socket.on('battle data', (data) => {
                    showChanceToDie(data);
                });
            } else {
                setTimeout(load, 500);
            }
        }
        load();
    });


    /**
     * Appends a suffix to the number and shortens it generally.
     * */
    function commarize(number) {
        if(number < 999999) { return number; }
        var sizes = [
            '',
            '',
            'Mill',
            'Bill',
            'Trill',
            'Quad',
            'Quint',
            'Sext',
            'Sept',
            'Oct'
        ];
        if (number == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(number) / Math.log(1000)));
        return (number / Math.pow(1000, i)).toPrecision(4) + ' ' + sizes[i];
    }

    /**
     * Shows the full precision of a number up to 100 digits.
     * */
    function fullZeroes(number) {
        return number.toFixed(100).replace(/.?0+$/,"")     // 0.0000005
    }

    /**
     * Takes a number string
     * */
    function fourLastDigits(numberString) {
        let index = 0;
        let theValAfterDot = numberString.substr(numberString.indexOf('.') + 1);

        while(theValAfterDot[index] === '0'){
            index++;
        }
        return '0.' + theValAfterDot.substr(0, index + 3)
    }
}());
