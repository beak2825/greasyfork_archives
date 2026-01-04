// ==UserScript==
// @name         Mousehunt Floating Islands Script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Donate: paypal.me/mousehuntscripter
// @author       You
// @match        https://www.mousehuntgame.com/camp.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/503907/Mousehunt%20Floating%20Islands%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/503907/Mousehunt%20Floating%20Islands%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function(){
        // Leave the map right after warden defeated, but stay for paragons and empress and 2 loot caches
        if (document.querySelectorAll('.floatingIslandsHUD-modPanel.loot_cache').length != 2 && window.getComputedStyle(document.querySelector('.floatingIslandsHUD-enemy-state.enemyDefeated')).display == "block" && !document.querySelector('.floatingIslandsHUD-enemy-name').textContent.includes('Empress') && !document.querySelector('.floatingIslandsHUD-enemy-name').textContent.includes('Paragon')) {
            document.querySelector('.floatingIslandsHUD-retreatButton').click();
            document.querySelector('.floatingIslandsHUD-dialog-actions > a:nth-child(2)').click();
        }


        // lny jet stream leave after done
        // red candle div.lunarNewYearCampHUD-biscuitNub:nth-child(6) > div:nth-child(2) > a:nth-child(1)
//         if (window.getComputedStyle(document.querySelector('.floatingIslandsHUD-enemy-state.enemyDefeated')).display == "block" && !document.querySelector('.floatingIslandsHUD-enemy-name').textContent.includes('Empress')) {
//             //disarm red candle
//             if (window.getComputedStyle(document.querySelector('div.lunarNewYearCampHUD-biscuitNub:nth-child(5) > div:nth-child(2) > a:nth-child(1)')).getPropertyValue('background-position-y') != '-29px') {
//                 document.querySelector('div.lunarNewYearCampHUD-biscuitNub:nth-child(5) > div:nth-child(2) > a:nth-child(1)').click();
//             }
//             if (window.getComputedStyle(document.querySelector('div.lunarNewYearCampHUD-biscuitNub:nth-child(6) > div:nth-child(2) > a:nth-child(1)')).getPropertyValue('background-position-y') != '-29px') {
//                 document.querySelector('div.lunarNewYearCampHUD-biscuitNub:nth-child(6) > div:nth-child(2) > a:nth-child(1)').click();
//             }
//             document.querySelector('.floatingIslandsHUD-retreatButton').click();
//             document.querySelector('.floatingIslandsHUD-dialog-actions > a:nth-child(2)').click();
//         }

//         // arm red candle when warden or paragon
//         if (window.getComputedStyle(document.querySelector('.floatingIslandsHUD-goalContainer > div:nth-child(2)')).display == "block") {
//             if (document.querySelector('.floatingIslandsHUD-enemy-name').textContent.includes('Paragon')) {
//                 if (window.getComputedStyle(document.querySelector('div.lunarNewYearCampHUD-biscuitNub:nth-child(6) > div:nth-child(2) > a:nth-child(1)')).getPropertyValue('background-position-y') == '-29px') {
//                 document.querySelector('div.lunarNewYearCampHUD-biscuitNub:nth-child(6) > div:nth-child(2) > a:nth-child(1)').click();
//             }
//             }
//             else if (window.getComputedStyle(document.querySelector('div.lunarNewYearCampHUD-biscuitNub:nth-child(6) > div:nth-child(2) > a:nth-child(1)')).getPropertyValue('background-position-y') == '-29px') {
//                 document.querySelector('div.lunarNewYearCampHUD-biscuitNub:nth-child(6) > div:nth-child(2) > a:nth-child(1)').click();
//             }
//         }

        // Disarm when paragon is active, so that can snipe for somebody else
        // if (window.getComputedStyle(document.querySelector('.floatingIslandsHUD-goalContainer > div:nth-child(2)')).display == "block" && document.querySelector('.floatingIslandsHUD-enemy-name').textContent.includes('Paragon') && !document.querySelector('.campPage-trap-baitName').textContent.includes('No Bait')) {
        //     document.querySelector('a.bait').click();
        //     document.querySelector('.campPage-trap-itemBrowser-item-disarmButton').click();
        // }

        // Use bottle wind
        // if (!document.querySelector('.floatingIslandsHUD-fuel-button.active')) {
        //     document.querySelector('.floatingIslandsHUD-fuel-button').click();
        // }

        if (document.querySelector('.floatingIslandsHUD-islandTitle').textContent == "Launch Pad") {
            if (document.querySelector('.floatingIslandsHUD-skyMapButton')) {
            document.querySelector('.floatingIslandsHUD-skyMapButton').click();
            let roll = true;
            setTimeout(()=>{

            const elements = document.querySelectorAll('.treasureMapView-goals-group-goal.complete');
            const caughtMice = Array.from(elements).map(element => element.textContent);

            let tiles = document.querySelector('.floatingIslandsAdventureBoardSkyMap-islandModContainer').children
                if (tiles[13].children[1].textContent.includes('Shrine') && !(document.querySelector('.floatingIslandsHUD-skyMapButton.paragon')  && caughtMice.includes('Paragon of the Lawless'))) {
                            document.querySelector('.floatingIslandsHUD-powerType.law').click();
                            if (!document.querySelector('.floatingIslandsAdventureBoard-trapLibrary.mousehuntTooltipParent.active')) {
                                document.querySelector('.floatingIslandsAdventureBoard-trapLibrary.mousehuntTooltipParent').click();
                            }
                            document.querySelector('.floatingIslandsAdventureBoard-launchButton').click();
                            roll = false;
                        }
                if (tiles[15].children[1].textContent.includes('Shrine')&& !(document.querySelector('.floatingIslandsHUD-skyMapButton.paragon')  && caughtMice.includes('Paragon of Tactics'))) {
                            document.querySelector('.floatingIslandsHUD-powerType.tactical').click();
                            if (!document.querySelector('.floatingIslandsAdventureBoard-trapLibrary.mousehuntTooltipParent.active')) {
                                document.querySelector('.floatingIslandsAdventureBoard-trapLibrary.mousehuntTooltipParent').click();
                            }
                            document.querySelector('.floatingIslandsAdventureBoard-launchButton').click();
                            roll = false;
                        }
                if (tiles[0].children[1].textContent.includes('Shrine')&& !(document.querySelector('.floatingIslandsHUD-skyMapButton.paragon') && caughtMice.includes('Paragon of Arcane'))) {
                    document.querySelector('.floatingIslandsHUD-powerType.arcane').click();
                    if (!document.querySelector('.floatingIslandsAdventureBoard-trapLibrary.mousehuntTooltipParent.active')) {
                        document.querySelector('.floatingIslandsAdventureBoard-trapLibrary.mousehuntTooltipParent').click();
                    }
                    document.querySelector('.floatingIslandsAdventureBoard-launchButton').click();
                    roll = false;
                }
                        if (tiles[8].children[1].textContent.includes('Shrine')&& !(document.querySelector('.floatingIslandsHUD-skyMapButton.paragon')  && caughtMice.includes('Paragon of Water'))) {
                            document.querySelector('.floatingIslandsHUD-powerType.hydro').click();
                            if (!document.querySelector('.floatingIslandsAdventureBoard-trapLibrary.mousehuntTooltipParent.active')) {
                                document.querySelector('.floatingIslandsAdventureBoard-trapLibrary.mousehuntTooltipParent').click();
                            }
                            document.querySelector('.floatingIslandsAdventureBoard-launchButton').click();
                            roll = false;
                        }
                if (tiles[4].children[1].textContent.includes('Shrine')&& !(document.querySelector('.floatingIslandsHUD-skyMapButton.paragon')  && caughtMice.includes('Paragon of Forgotten'))) {
                            document.querySelector('.floatingIslandsHUD-powerType.forgotten').click();
                            if (!document.querySelector('.floatingIslandsAdventureBoard-trapLibrary.mousehuntTooltipParent.active')) {
                                document.querySelector('.floatingIslandsAdventureBoard-trapLibrary.mousehuntTooltipParent').click();
                            }
                            document.querySelector('.floatingIslandsAdventureBoard-launchButton').click();
                            roll = false;
                        }
                        if (tiles[12].children[1].textContent.includes('Shrine')&& !(document.querySelector('.floatingIslandsHUD-skyMapButton.paragon') && caughtMice.includes('Paragon of Dragons'))) {
                            document.querySelector('.floatingIslandsHUD-powerType.draconic').click();
                            if (!document.querySelector('.floatingIslandsAdventureBoard-trapLibrary.mousehuntTooltipParent.active')) {
                                document.querySelector('.floatingIslandsAdventureBoard-trapLibrary.mousehuntTooltipParent').click();
                            }
                            document.querySelector('.floatingIslandsAdventureBoard-launchButton').click();
                            roll = false;
                        }
                if (tiles[12].children[1].textContent.includes('Shrine')&& !(document.querySelector('.floatingIslandsHUD-skyMapButton.paragon') && caughtMice.includes('Paragon of Shadow'))) {
                            document.querySelector('.floatingIslandsHUD-powerType.shadow').click();
                            if (!document.querySelector('.floatingIslandsAdventureBoard-trapLibrary.mousehuntTooltipParent.active')) {
                                document.querySelector('.floatingIslandsAdventureBoard-trapLibrary.mousehuntTooltipParent').click();
                            }
                            document.querySelector('.floatingIslandsAdventureBoard-launchButton').click();
                            roll = false;
                        }
                        if (tiles[14].children[1].textContent.includes('Shrine')&& !(document.querySelector('.floatingIslandsHUD-skyMapButton.paragon')  && caughtMice.includes('Paragon of Strength'))) {
                            document.querySelector('.floatingIslandsHUD-powerType.physical').click();
                            if (!document.querySelector('.floatingIslandsAdventureBoard-trapLibrary.mousehuntTooltipParent.active')) {
                                document.querySelector('.floatingIslandsAdventureBoard-trapLibrary.mousehuntTooltipParent').click();
                            }
                            document.querySelector('.floatingIslandsAdventureBoard-launchButton').click();
                            roll = false;
                        }
                if (roll) {
                    document.querySelector('.floatingIslandsAdventureBoardSkyMap-rerollButton').click();
                }

            }, 2*1000);
        }

        }


    }, 10*1000);
}) ();