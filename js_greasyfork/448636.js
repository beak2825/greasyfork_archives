// ==UserScript==
// @name         Idler
// @namespace    SobieskiCodes
// @version      0.3
// @description  fights naga's but should be dynamic later, chicken - black knight.
// @author       probsjustin
// @match        http*://*idlescape.com/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448636/Idler.user.js
// @updateURL https://update.greasyfork.org/scripts/448636/Idler.meta.js
// ==/UserScript==
(function () {
    // she's pretty buggy. but it works without inspect open!
    "use strict";
    function onGameReady(callback) {
        const gameContainer = document.getElementsByClassName("play-area-container")[0];
        if (!gameContainer) {
            setTimeout(function () {
                onGameReady(callback);
            }, 250);
        } else {
            callback();
        }
    }
    onGameReady(() => {console.log('Ready to go.')});
    var offline = document.getElementsByClassName("offline-progress-box all-items");
    if (offline.length !== 0) {
        var close_offline = document.getElementsByClassName("close-dialog-button idlescape-button idlescape-button-red")[0].click()
    }
    let observer = new MutationObserver(onMutation);
    observer.observe(document.body, { childList: true, subtree: true });
    function onMutation(mutations) {
        for (let mutation of mutations) {
            const mob = document.getElementsByClassName("combat-info-bar-name")
            const playerStatus = document.getElementsByClassName("status-action");
            if (!mob) {
                return
            }
            if (!playerStatus) {
                return
            }
            if (mob && mob.length === 2) {
                farm(mob[1].innerHTML);
            }
            if (playerStatus.length !== 0) {
                if(playerStatus[0].innerText === 'Fighting') {
                    if (mob.length === 0) {
                        var fighting_button = document.getElementsByClassName("buff personal");
                        fighting_button[0].click()
                    }
                }
                if(playerStatus[0].innerText === 'Idling') {
                    var menu = document.getElementsByClassName("navbar1-box left drawer-button noselect");
                    menu[0].click()
                    var attackMenuButton = document.getElementsByClassName("drawer-item active noselect");
                    if (attackMenuButton.length > 11) {
                        attackMenuButton[11].click()
                        var emptyFood = document.getElementsByClassName("combat-empty-slot");
                        if (emptyFood.length !== 0) {
                            fill_combat_food()
                            return
                        }
                        var corrupted_zone = document.getElementsByClassName("combat-zone-text")[4];
                        corrupted_zone.click()
                    }
                }
            }
        }
    }
    function farm(mob) {
        console.log('the fuck ', mob)
        if(mob !== 'Infected Naga') {
            const run_away = document.getElementsByClassName("combat-bar-button")[4];
            run_away.click()
        }
        if (mob === 'Infected Naga') {
            document.title = "nagabby";
        }
    }
    function xpath(path) {
        return document.evaluate(path,document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    function fill_combat_food() {
        var seared_fish = document.querySelector('[data-for="41689854Seared Fish +11stockpile"]');
        seared_fish.click()
        var dialogMenu = document.getElementsByClassName("MuiDialogActions-root item-dialogue-button-div MuiDialogActions-spacing");
        var menuButtons = dialogMenu[0].getElementsByClassName("item-dialogue-button");
        var combatFoodButton = menuButtons[2]
        combatFoodButton.click()
    }
})();