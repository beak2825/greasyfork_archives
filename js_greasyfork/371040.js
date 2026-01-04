// ==UserScript==
// @name         Traveling Merchant
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically attacks the enemies during the "Traveling Merchant" event
// @author       FunnyPocketBook
// @match        https://*/game.php?village=*&screen=event_trump_card
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371040/Traveling%20Merchant.user.js
// @updateURL https://update.greasyfork.org/scripts/371040/Traveling%20Merchant.meta.js
// ==/UserScript==

window.onload = function() {
    'use strict';
    if(__("#battle_container > div > a").style.display !== "none") {
        __("#battle_container > div > a").click(); // Click on "Battle"
    }

    const chestOpen = document.querySelectorAll(".button-chest-open");
    const chestUnlock = document.querySelectorAll(".button-chest-unlock");

    chestOpen.forEach(function(chest) {
        if(chest.style.display !== "none") {
            chest.click();
        }
    });

    chestUnlock.forEach(function(chest) {
        if(!chest.classList.contains("btn-disabled") && chest.style.display !== "none") {
            chest.click();
        }
    });

    let enemiesNodeList;
    let enemies;
    let ownNodeList;
    let own;
    let minArray = [];
    let maxArray = [];
    let minAttack;
    let maxAttack;

    function getInfo() {
        try {
            enemiesNodeList = __("#battle_container > div > div.enemy-unit-zone").querySelectorAll(".trump-unit"); // Get enemies
            enemies = [].slice.call(enemiesNodeList);
            ownNodeList = __("#battle_container > div > div.own-unit-zone").querySelectorAll(".trump-unit"); // Get own units
            own = [].slice.call(ownNodeList);
            getAttack(own, "min", minArray);
            getAttack(own, "max", maxArray);
            minAttack = parseInt(__(".trump-unit.active").querySelector(".min").innerText);
            maxAttack = parseInt(__(".trump-unit.active").querySelector(".max").innerText);
            attack(enemies.length);
        } catch(e) {
            console.log(e);
            setTimeout(function () {
                window.location.reload();
            }, 800);
        }
    }
    getInfo();
    function attack(counter) {
        try {
            let attackEnemy = enemies[counter - 1];
            let attackEnemyHealth = parseInt(attackEnemy.querySelector(".health").innerText);
            if (attackEnemy.classList.contains("dead")) {
                counter--;
                attack(counter);
            } else if (getUnitsLeft(enemies) === 1 || getUnitsLeft(enemies) <= 2 && attackEnemyHealth - maxAttack <= 0 ||
                getUnitsLeft(own) === 1 || minAttack <= attackEnemyHealth || (attackEnemyHealth < Math.min(...minArray) &&
                    minAttack === Math.min(...minArray))) {
                attackEnemy.click();
                setTimeout(function() {
                    checkActiveTurn();
                }, 900);
            } else {
                let tempCounter = counter - 1;
                attack(tempCounter);
            }
        } catch(e) {
            console.log(e);
            setTimeout(function () {
                window.location.reload();
            }, 800);
        }
    }

    function getAttack(troops, select, array) {
        troops.forEach(function(unit) {
            if(unit.classList.contains("dead")) {
                if(select === "min") {
                    array.push(9999);
                } else {
                    array.push(-1);
                }
            } else {
                array.push(parseInt(unit.querySelector("." + select).innerText));
            }
        });
        return array;
    }

    function checkActiveTurn() {
        try {
            if(parseInt(document.querySelector("#battle_container > div > div.turn-order-container > div > div.turn.active > div.active-turn-frame").parentElement.getAttribute("data-unit_id")) <= 5) {
                setTimeout(function() {
                    getInfo();
                }, 200);
            } else {
                window.location.reload();
            }
        } catch(e) {
            console.log(e);
            setTimeout(function() {
                window.location.reload();
            }, 800);
        }

    }

    function getUnitsLeft(array) {
        let counter = 0;
        array.forEach(function(e) {
            if(!e.classList.contains("dead")) {
                counter++;
            }
        });
        return counter;
    }

    function __(selector) {
        return document.querySelector(selector);
    }
};