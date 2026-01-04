// ==UserScript==
// @name         LordBinary's DHM Extension
// @namespace    Tampermonkey
// @version      1.9
// @description  Improve the desktop experience of Diamond Hunt Mobile
// @author       Lord Binary
// @match        *.diamondhunt.app/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391048/LordBinary%27s%20DHM%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/391048/LordBinary%27s%20DHM%20Extension.meta.js
// ==/UserScript==
/*jshint multistr: true */
/*jslint es5: true */

(function() {
    'use strict';

    var monsterSwingTimer = 3;
    var loggedInn = false;
    var previousTickMonsterName = "none";
    var teleportNotification = document.getElementById('notification-exploringNotification');
    var previousTickTeleportNotificationState = "none";
    var previousTickExplorerCooldown = 0;
    var teleportNotificationAudio = new Audio('sounds/success1.wav');
    teleportNotificationAudio.volume = 0.1;
    var previousTickFightStartTimer = 5;

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    var generalObserver = new MutationObserver(resetTimer);
    var timer = setTimeout(action, 100, generalObserver); // wait for the page to stay still for 0.1 seconds
    generalObserver.observe(document.querySelector("#inner-skill-level-mining"), {childList: true, subtree: true});

    function resetTimer(changes, observer) {
        clearTimeout(timer);
        timer = setTimeout(action, 100, observer);
    }

    var swingTimerObserver;
    var swingTimer;

    function resetSwingTimer(changes, observer) {
        clearTimeout(swingTimer);
        swingTimer = setTimeout(swingTimerAction, 1, observer);
    }

    var hitChanceTimerObserver = new MutationObserver(resetHitChanceTimer);
    var hitChanceTimer = setTimeout(resetHitChanceTimer, 10, hitChanceTimerObserver);
    hitChanceTimerObserver.observe(document.getElementById("tab-combat"), {childList: true, subtree: true});

    function resetHitChanceTimer(changes, observer) {
        clearTimeout(hitChanceTimer);
        hitChanceTimer = setTimeout(updateHitChances, 10, observer);
    }

    function calculateHitChance(accuracy, defence) {
        if (defence % 2 == 1) {
            return (calculateHitChance(accuracy, defence + 1) + calculateHitChance(accuracy, defence - 1)) / 2;
        }
        return 1 / Math.max(1, ((defence / 2) - accuracy + 1));
    }

    function action(observer) {
        // Accuracy Display
        if (document.getElementById("LBMonsterHitChanceImage") == null) {
            //var enemyStatsList = getElementByXpath('//*[@id="tab-combat"]/center/table[1]/tbody/tr[2]/td');

            var monsterDefence = document.getElementById('monster-defence');
            monsterDefence.style = "padding-right:30px";

            var newEnemyStatImage = document.createElement("img");
            newEnemyStatImage.src = "images/accuracy.png";
            newEnemyStatImage.className = "img-small";
            newEnemyStatImage.id = "LBMonsterHitChanceImage";
            $(newEnemyStatImage).insertAfter(monsterDefence);

            var newEnemyStatText = document.createElement("span");
            newEnemyStatText.style = "padding-right:30px";
            newEnemyStatText.id = "LBMonsterHitChanceText";
            newEnemyStatText.innerHTML = "1/?";
            $(newEnemyStatText).insertAfter(newEnemyStatImage);

            var newMonsterSwingTimerImage = document.createElement("img");
            newMonsterSwingTimerImage.src = "images/attack.png";
            newMonsterSwingTimerImage.className = "img-small";
            newMonsterSwingTimerImage.id = "LBMonsterSwingTimerImage";
            $(newMonsterSwingTimerImage).insertAfter(newEnemyStatText);

            var newMonsterSwingTimerText = document.createElement("span");
            newMonsterSwingTimerText.style = "padding-right:30px";
            newMonsterSwingTimerText.id = "LBMonsterSwingTimerText";
            newMonsterSwingTimerText.innerHTML = "3?";
            $(newMonsterSwingTimerText).insertAfter(newMonsterSwingTimerImage);

            //var heroStatsList = getElementByXpath('//*[@id="tab-combat"]/center/table[5]/tbody/tr[3]/td/table/tbody/tr/td/center');
            var playerDefence = document.getElementById('hero-defence');

            playerDefence.style = "padding-right:10px;";

            var newHeroStatImage = document.createElement("img");
            newHeroStatImage.src = "images/accuracy.png";
            newHeroStatImage.className = "img-small";
            newHeroStatImage.id = "LBHeroHitChanceImage";
                    $(newHeroStatImage).insertAfter(playerDefence);

            var newHeroStatText = document.createElement("span");
            newHeroStatText.style = "padding-right:30px";
            newHeroStatText.id = "LBHeroHitChanceText";
            newHeroStatText.innerHTML = "1/?";
            $(newHeroStatText).insertAfter(newHeroStatImage);

            updateHitChances();
        }

        // Swing Timer Display
        if (!loggedInn && document.querySelector("#inner-skill-level-mining") != null) {
            //console.log("LB Logged Inn check successful");
            swingTimerObserver = new MutationObserver(resetSwingTimer);
            swingTimer = setTimeout(swingTimerAction, 100, swingTimerObserver);
            swingTimerObserver.observe(document.querySelector("#inner-skill-level-mining"), {childList: true, subtree: true});
            loggedInn = true;
        }

        // Teleport Notification
        if (!document.getElementById('lb_notification-teleportationNotification')) {
            //console.log("LB Teleport Notification Created!");
            var newTeleportNotification = document.createElement("div");

            var newOnclickAttribute = document.createAttribute("onclick");
            newOnclickAttribute.value = "navigateAndLoadImages('exploring','item-section-exploring-1');";
            newTeleportNotification.setAttributeNode(newOnclickAttribute);

            newTeleportNotification.style = "cursor: pointer; display: none;";
            newTeleportNotification.id = "lb_notification-teleportationNotification";

            var newClassAttribute = document.createAttribute("class");
            newClassAttribute.value = "notification";
            newTeleportNotification.setAttributeNode(newClassAttribute);


            var newTeleportNotificationImage = document.createElement("img");
            newTeleportNotificationImage.src = "images/teleportSpell.png";

            var newImgClassAttribute = document.createAttribute("class");
            newImgClassAttribute.value = "img-small";
            newTeleportNotificationImage.setAttributeNode(newImgClassAttribute);

            newTeleportNotification.appendChild(newTeleportNotificationImage);
            newTeleportNotification.innerHTML += " Ready";

            document.getElementById("notfications-area-top").insertBefore(newTeleportNotification, document.getElementById('notification-exploringNotification'));
            teleportNotification = document.getElementById('lb_notification-teleportationNotification');
        }

        UpdateTeleportNotification();
    }

    function updateHitChances() {
        if (typeof document.getElementById('LBMonsterHitChanceText') !== 'undefined' &&
            typeof document.getElementById('LBHeroHitChanceText') !== 'undefined' &&
            loggedInn) {
            var enemyAccuracy = document.getElementById('monster-accuracy').innerHTML;
            var heroDefence = document.getElementById('hero-defence').innerHTML;
            if (monsterName == "gargoyle") {
                document.getElementById('LBMonsterHitChanceText').innerHTML = parseFloat(calculateHitChance(parseInt(enemyAccuracy), parseInt(heroDefence) * 0.5 + 0.5) * 100).toFixed(1) + "%";
            } else if (monsterName == "fireSkeletonCemetery") {
                document.getElementById('LBMonsterHitChanceText').innerHTML = parseFloat(calculateHitChance(parseInt(enemyAccuracy), parseInt(heroDefence) * 0.75 + 0.25) * 100).toFixed(1) + "%";
            } else if (monsterName == "castleMage" ||
                       monsterName == "castleMage2" ||
                       monsterName == "castleMage3" ||
                       monsterName == "robotMage" ||
                       monsterName == "robotMage2" ||
                       monsterName == "fireMage" ||
                       monsterName == "bloodFireMage" ||
                       monsterName == "bloodFrozenEnt" ||
                       monsterName == "bloodIceHawk" ||
                       monsterName == "angel" ||
                       monsterName == "babySkeleton" ||
                       monsterName == "darkMage" ||
                       monsterName == "skeletonMage" ||
                       monsterName == "skeletonMage2" ||
                       monsterName == "skeletonMage3" ||
                       monsterName == "skeletonMage4" ||
                       monsterName == "ghostPack" ||
                       monsterName == "ghostPack2Visible" ||
                       monsterName == "ghostPack3Visible" ||
                       monsterName == "ghostPack4Visible" ||
                       monsterName == "poisonSquid" ||
                       monsterName == "bloodSkeletonGhost") {
                document.getElementById('LBMonsterHitChanceText').innerHTML = parseFloat(100).toFixed(1) + "%";
            } else {
                document.getElementById('LBMonsterHitChanceText').innerHTML = parseFloat(calculateHitChance(parseInt(enemyAccuracy), parseInt(heroDefence)) * 100).toFixed(1) + "%";
            }
            var heroAccuracy = document.getElementById('hero-accuracy').innerHTML;
            var enemyDefence = document.getElementById('monster-defence').innerHTML;
            document.getElementById('LBHeroHitChanceText').innerHTML = parseFloat(calculateHitChance(parseInt(heroAccuracy), parseInt(enemyDefence)) * 100).toFixed(1) + "%";
        }
    }

    function notStunned() {
        let debuffTable = getElementByXpath('//*[@id="monster-affected-table"]/tbody/tr');
        let i = 0;
        let cell;
        while (cell = debuffTable.cells[i++]) {
            if (cell.children[0].children[0].src == "https://www.diamondhunt.app/images/freezeCombatPotionEnemyTimer.png" ||
                cell.children[0].children[0].src == "https://www.diamondhunt.app/images/thunderStrikeSpellEnemyTimer.png") {
                return false;
            }
        }
        return true;
    }

    function swingTimerAction(observer) {
        //console.log("LB Swing Timer Tick");
        if(document.querySelector("#inner-skill-level-mining") != null){
            if (previousTickMonsterName == "none" && monsterName != "none") {
                if (typeof monsterSpeed !== 'undefined') {
                    monsterSwingTimer = monsterSpeed;
                }
            }
            previousTickMonsterName = monsterName;
            if (typeof monsterSpeed !== 'undefined') {
                if (notStunned() && fightStartTimer == 0 && previousTickFightStartTimer == 0) {
                    monsterSwingTimer--;
                    if (monsterSwingTimer <= 0) {
                        monsterSwingTimer = monsterSpeed;
                    }
                }
                previousTickFightStartTimer = fightStartTimer;
            }
            if (document.getElementById('LBMonsterSwingTimerText') != null) {
                document.getElementById('LBMonsterSwingTimerText').innerHTML = monsterSwingTimer;
            }
        }
    }

    function UpdateTeleportNotification() {
        //console.log("LB TeleportNotification Tick");
        if (explorerCooldown != 0) {
            if (fightDone == 0 && teleportSpellCooldown == 0) {
                if (previousTickTeleportNotificationState == "inactive") {
                    teleportNotificationAudio.play();
                }
                previousTickTeleportNotificationState = "active";
                teleportNotification.style = "cursor: pointer;";
            } else {
                teleportNotification.style = "cursor: pointer; display: none;";
                previousTickTeleportNotificationState = "inactive";
            }
        }
        if (explorerCooldown != previousTickExplorerCooldown) {
            previousTickExplorerCooldown = explorerCooldown;
            if (explorerCooldown == 0) {
                teleportNotificationAudio.play();
            }
        }
    }
})();