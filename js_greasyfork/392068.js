// ==UserScript==
// @name     BetterSmutstone
// @version  0.0.5
// @author   Grooman
// @grant    none
// @include  *v2.smutstone.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js

// @description:en Adding new functions to Smutstone (displaying winchances, calculation best farmlocations, duel support). 

// @namespace https://greasyfork.org/users/395513
// @description Adding new functions to Smutstone (displaying winchances, calculation best farmlocations, duel support).
// @downloadURL https://update.greasyfork.org/scripts/392068/BetterSmutstone.user.js
// @updateURL https://update.greasyfork.org/scripts/392068/BetterSmutstone.meta.js
// ==/UserScript==

let DEBUG = false;
let storage, battles, currentLocation, refBattle, selectedBattleDeck = 0;
let scriptURL = initBattleScript(), worker = null;
function Battle(title, _class, gold, energy, level, enemies) {
    return {
        'title': title,
        'class': _class,
        'gold': gold,
        'energy': energy,
        'level': level,
        'enemies': enemies
    };
}
function Card(name, attack, defense, color, set = null, spell = null, pos = 0) {
    return {
        'name': name,
        'attack': attack,
        'defense': defense,
        'color': color,
        'set': set,
        'spell': spell,
        'pos': pos
    };
}
function getLocationByUrl() {
    let urlParts = window.location.href.replace('//', '/').split('/');
    while (urlParts[0] !== 'v2.smutstone.com')
        urlParts.shift();
    switch (urlParts[2]) {
        case 'story': return { 'location': 'story', 'oldLocation': null, 'chapter': urlParts[3] };
        case 'dungeon': return { 'location': 'dungeon', 'oldLocation': null, 'color': $('.main-bk.dungeon').attr("class").split(/\s+/)[2] };
        case 'cards': return { 'location': 'cards', 'oldLocation': null };
        case 'event': return { 'location': 'event', 'oldLocation': null };
    }
    return { 'location': null, 'oldLocation': null };
}
function changeToOldLocationFun(location) {
    return () => {
        currentLocation = location.oldLocation;
        currentLocation.oldLocation = location;
        location.oldLocation = null;
        updateView();
    };
}
function updateView() {
    let menuBtns = $('.main-menu .btn-list .btn-menu');
    if (menuBtns.length) {
        if (!currentLocation)
            currentLocation = getLocationByUrl();
        let oldLocation = Object.assign({}, currentLocation);
        oldLocation.oldLocation = null;
        $.each(menuBtns, function (i, elem) {
            $(elem).unbind();
            switch (i) {
                case 0: // Campaign
                    $(elem).click(function () {
                        setTimeout(() => {
                            currentLocation = getLocationByUrl();
                            currentLocation.oldLocation = oldLocation;
                            updateView();
                        }, 500);
                    });
                    break;
                case 1: // Cards
                    $(elem).click(function () {
                        setTimeout(() => {
                            currentLocation = getLocationByUrl();
                            currentLocation.oldLocation = oldLocation;
                            updateView();
                        }, 500);
                    });
                    break;
                case 2: // Deck
                    $(elem).click(function () {
                        currentLocation = { 'location': 'deck', 'oldLocation': oldLocation };
                        updateView();
                    });
                    break;
                case 3: // Duels
                    $(elem).click(function () {
                        currentLocation = { location: 'duels', 'oldLocation': oldLocation };
                        updateView();
                    });
                    break;
                case 4: // Tournament
                    $(elem).click(function () {
                        currentLocation = { location: 'tournament', 'oldLocation': oldLocation };
                        updateView();
                    });
                    break;
                case 5: // Inventory
                    $(elem).click(function () {
                        currentLocation = { location: 'inventory', 'oldLocation': oldLocation };
                        updateView();
                    });
                    break;
                case 6: // Store
                    $(elem).click(function () {
                        currentLocation = { location: 'store', 'oldLocation': oldLocation };
                        updateView();
                    });
                    break;
            }
        });
        switch (currentLocation.location) {
            case 'story':
                setTimeout(() => {
                    updateStoryView();
                }, 500);
                break;
            case 'dungeon':
                break;
            case 'cards':
                break;
            case 'deck':
                updateDeckView();
                break;
            case 'duels':
                setTimeout(() => {
                    $('#popupContainer .button.x-pop.bronze.close').unbind();
                    $('#popupContainer .button.x-pop.bronze.close').click(changeToOldLocationFun(currentLocation));
                }, 500);
                break;
            case 'tournament':
                setTimeout(() => {
                    $('#popupContainer .button.x-pop.bronze.close').unbind();
                    $('#popupContainer .button.x-pop.bronze.close').click(changeToOldLocationFun(currentLocation));
                }, 500);
                break;
            case 'inventory':
                setTimeout(() => {
                    $('#popupContainer .button.x-pop.bronze.close').unbind();
                    $('#popupContainer .button.x-pop.bronze.close').click(changeToOldLocationFun(currentLocation));
                }, 500);
                break;
            case 'store':
                setTimeout(() => {
                    $('#popupContainer .button.x-pop.bronze.close').unbind();
                    $('#popupContainer .button.x-pop.bronze.close').click(changeToOldLocationFun(currentLocation));
                }, 500);
                break;
        }
    }
    else {
        setTimeout(updateView, 100);
    }
}
function updateStoryView() {
    let locations = $('#root main-map ml');
    locations.unbind();
    let battleList = battles.story[currentLocation.chapter];
    for (let i = 0; i < battleList.length; i++) {
        let battle = battleList[i];
        $(`.${battle.class}`).click(showStoryBattleFun(battle));
    }
    let wmapBtn = $('.wmap');
    wmapBtn.unbind();
    wmapBtn.click(() => wait(() => {
        let locationBtns = $('.loc');
        console.log(locationBtns);
        locationBtns.unbind();
        locationBtns.click(() => wait(() => {
            let newLocation = getLocationByUrl();
            console.log('click on new Loc', newLocation);
            newLocation.oldLocation = currentLocation;
            currentLocation.oldLocation = null;
            currentLocation = newLocation;
            updateView();
        }, () => true, 500));
    }));
}
function showStoryBattleFun(battle) {
    return () => wait(() => {
        $('#popupWrapper .header p').text(`${battle.title} - ${battle.gold}G / ${battle.energy}E = ${round(battle.gold / battle.energy, 3)}G/E`);
        let lvl = ~~$('.person.hero .lvl').text();
        if (lvl != storage.playerLevel) {
            storage.playerLevel = lvl;
            save();
        }
        $('#popupWrapper .btn.mission').unbind();
        $('#popupWrapper .btn.mission').click(() => {
            $('#popupWrapper .header p').text(battle.title);
            wait(() => {
                let winChances = ['?', '?', '?'];
                let updateTitle = () => {
                    let win = '?';
                    if (typeof winChances[0] === 'number')
                        win = round(battle.gold / battle.energy * winChances[0] / 100, 2);
                    $('#popupWrapper .header p').text(`Winchance: ${winChances[0]}% ${winChances[1]}% ${winChances[2]}% => ${win}G (${battle.gold}G/${battle.energy}E = ${round(battle.gold / battle.energy, 2)}G/E)`);
                    $('#popupWrapper .header p').css('font-size', '18px');
                };
                let recalcWinchances = () => {
                    calcWinchances(battle.enemies, storage.decks[selectedBattleDeck], getHealth(storage.playerLevel), getHealth(battle.level))
                        .then((result) => {
                        console.log(result);
                        winChances = result.starChances;
                        updateTitle();
                    }).catch((e) => {
                        console.log('unable to calculate winchances for', battle.title, battle.class);
                        switch (e) {
                            case 'error':
                                $('#popupWrapper .header p').text(`${battle.title} - Simulation Error`);
                                break;
                            case 'enemies':
                                $('#popupWrapper .header p').text(`${battle.title} - This battle is not supported yet`);
                                break;
                            case 'deck':
                                $('#popupWrapper .header p').text(`${battle.title} - Deck not saved`);
                                break;
                        }
                    });
                };
                let enemyCards = $('.fight-deck.enemy .card');
                enemyCards.each((i, element) => {
                    if (battle.enemies.filter(e => e.pos === i).length === 0) {
                        let layer = $('<div></div>');
                        layer.css('position', 'absolute')
                            .css('top', '0')
                            .css('left', '0')
                            .css('width', '100%')
                            .css('height', '100%')
                            .css('border-radius', '10px')
                            .css('background-color', 'rgba(100, 100, 100, 0.5)');
                        $(element).append(layer);
                    }
                });
                updateTitle();
                recalcWinchances();
            }, () => !!document.querySelector('.go2fight-2[style*="visibility: visible"]'));
        });
    });
}
function updateDeckView() {
    let updateDeckButtonText;
    let updateDeckButton;
    let selectedDeck;
    let getDeckStrength = () => ~~$('#popupContainer .deck-tab.selected .info p:nth-child(2)').text().split(': ')[1];
    let getSelectedDeck = () => {
        let tab = $('#popupContainer .deck-tab.selected');
        if (tab.hasClass('tab1'))
            return 0;
        else if (tab.hasClass('tab2'))
            return 1;
        else
            return 2;
    };
    let updateDeckView = () => {
        selectedDeck = getSelectedDeck();
        let deckStrength = getDeckStrength();
        updateDeckButton.removeClass('grey');
        updateDeckButton.removeClass('blue');
        if (storage.deckStrengths[selectedDeck] === deckStrength) {
            updateDeckButton.addClass('grey');
        }
        else {
            updateDeckButton.addClass('blue');
        }
    };
    setTimeout(() => {
        $('#popupContainer .button.x-pop.bronze.close, #popupContainer .deck-card-list .btn.norm.bronze.grey.edit').unbind();
        $('#popupContainer .button.x-pop.bronze.close, #popupContainer .deck-card-list .btn.norm.bronze.grey.edit').click(changeToOldLocationFun(currentLocation));
        $('#popupContainer .deck-tab').click(() => { setTimeout(updateDeckView, 500); });
        let container = $('#popupContainer .deck-card-list');
        updateDeckButton = $('<div class="btn norm bronze blue edit" style="cursor:pointer"></div>').append(updateDeckButtonText = $('<p>Update Deck</p>'));
        updateDeckButton.css('margin-left', '50px');
        container.append(updateDeckButton);
        updateDeckButton.click(() => {
            let cards = $('#popupContainer .deck-card-list .card');
            storage.decks[selectedDeck] = [null, null, null, null, null, null, null];
            $.each(cards, (i, card) => {
                storage.decks[selectedDeck][i] = parseCard(card);
            });
            storage.deckStrengths[selectedDeck] = getDeckStrength();
            save();
            updateDeckView();
        });
        updateDeckView();
    }, 500);
}
function initBattles() {
    battles = {
        'story': {
            '1': [
                Battle('City 1', 'p001', 896, 10, 1, [
                    Card('', 11, 132, 0 /* FIRE */, null, null, 0),
                    Card('', 16, 171, 0 /* FIRE */, null, null, 1),
                    Card('', 11, 132, 0 /* FIRE */, null, null, 5)
                ]),
                Battle('City 2', 'p002', 896, 10, 1, [
                    Card('', 41, 123, 2 /* EARTH */, null, null, 1),
                    Card('', 41, 123, 2 /* EARTH */, null, null, 4),
                    Card('', 41, 123, 2 /* EARTH */, null, null, 5)
                ]),
                Battle('City 3', 'p003', 896, 10, 1, [
                    Card('', 49, 123, 0 /* FIRE */, null, null, 2),
                    Card('', 11, 132, 0 /* FIRE */, null, null, 6),
                    Card('', 49, 123, 0 /* FIRE */, null, null, 4)
                ]),
                Battle('City 4', 'p004', 896, 10, 1, [
                    Card('', 35, 138, 3 /* LIGHT */, null, null, 4),
                    Card('', 35, 243, 4 /* DARK */, null, null, 0),
                    Card('', 35, 138, 3 /* LIGHT */, null, null, 6)
                ]),
                Battle('City 5', 'p005', 999, 12, 2, [
                    Card('', 43, 195, 0 /* FIRE */, null, null, 3),
                    Card('', 27, 243, 2 /* EARTH */, null, null, 5),
                    Card('', 33, 228, 1 /* ICE */, null, null, 0)
                ]),
                Battle('City 6', 'p006', 999, 12, 2, [
                    Card('', 49, 123, 0 /* FIRE */, null, null, 2),
                    Card('', 35, 138, 3 /* LIGHT */, null, null, 6),
                    Card('', 49, 123, 0 /* FIRE */, null, null, 5)
                ]),
                Battle('City 7', 'p007', 1014, 12, 3, [
                    Card('', 65, 132, 0 /* FIRE */, null, null, 0),
                    Card('', 16, 171, 0 /* FIRE */, null, null, 2),
                    Card('', 68, 102, 3 /* LIGHT */, null, 33 /* RAGE_4 */, 4)
                ]),
                Battle('City 8', 'p008', 1014, 13, 3, [
                    Card('', 38, 210, 0 /* FIRE */, null, null, 0),
                    Card('', 43, 195, 1 /* ICE */, null, null, 5),
                    Card('', 27, 243, 2 /* EARTH */, null, null, 4)
                ]),
                Battle('City 9', 'p009', 1103, 13, 4, [
                    Card('', 75, 123, 4 /* DARK */, null, null, 0),
                    Card('', 75, 123, 0 /* FIRE */, null, null, 6),
                    Card('', 75, 123, 4 /* DARK */, null, null, 3)
                ]),
                Battle('City 10', 'p010', 1103, 13, 4, [
                    Card('', 43, 240, 1 /* ICE */, null, null, 4),
                    Card('', 58, 210, 1 /* ICE */, null, 17 /* FREEZE */, 0),
                    Card('', 52, 234, 1 /* ICE */, null, null, 2)
                ]),
                Battle('City 11', 'p011', 1103, 13, 5, [
                    Card('', 46, 255, 2 /* EARTH */, null, null, 0),
                    Card('', 33, 294, 2 /* EARTH */, null, null, 5),
                    Card('', 46, 255, 2 /* EARTH */, null, null, 1)
                ]),
                Battle('City 12', 'p012', 1169, 13, 5, [
                    Card('', 44, 306, 1 /* ICE */, null, null, 5),
                    Card('', 94, 141, 3 /* LIGHT */, null, 33 /* RAGE_4 */, 0),
                    Card('', 87, 174, 1 /* ICE */, null, null, 6)
                ]),
                Battle('City 13', 'p013', 1169, 13, 6, [
                    Card('', 56, 312, 1 /* ICE */, null, null, 1),
                    Card('', 56, 312, 4 /* DARK */, null, null, 5),
                    Card('', 56, 312, 1 /* ICE */, null, null, 2)
                ]),
                Battle('City 14', 'p014', 1169, 13, 6, [
                    Card('', 101, 201, 0 /* FIRE */, null, null, 3),
                    Card('', 59, 327, 4 /* DARK */, null, null, 1),
                    Card('', 59, 327, 4 /* DARK */, null, null, 2)
                ]),
                Battle('City 15', 'p015', 1959, 14, 7, [
                    Card('', 45, 405, 2 /* EARTH */, null, null, 0),
                    Card('', 41, 483, 2 /* EARTH */, null, 10 /* CURSE */, 6),
                    Card('', 81, 297, 2 /* EARTH */, "N" /* NATURE */, null, 5)
                ]),
                Battle('City 16', 'p016', 1959, 14, 7, [
                    Card('', 85, 312, 1 /* ICE */, "F" /* FAIRY */, null, 6),
                    Card('', 75, 339, 1 /* ICE */, null, null, 4),
                    Card('', 57, 396, 3 /* LIGHT */, null, null, 5)
                ]),
                Battle('City 16.1', 'p017', 1959, 14, 8, [
                    Card('', 102, 306, 4 /* DARK */, null, null, 5),
                    Card('', 92, 336, 2 /* EARTH */, null, null, 4),
                    Card('', 91, 333, 1 /* ICE */, null, 17 /* FREEZE */, 1)
                ]),
                Battle('City 16.2', 'p018', 2056, 14, 8, [
                    Card('', 142, 231, 0 /* FIRE */, null, null, 1),
                    Card('', 142, 231, 4 /* DARK */, null, null, 2),
                    Card('', 109, 327, 3 /* LIGHT */, null, null, 6)
                ]),
                Battle('City 17', 'p019', 2056, 14, 9, [
                    Card('', 82, 456, 2 /* EARTH */, null, null, 3),
                    Card('', 70, 489, 3 /* LIGHT */, null, null, 6),
                    Card('', 46, 546, 2 /* EARTH */, null, 10 /* CURSE */, 4)
                ]),
                Battle('City 18', 'p020', 2056, 14, 9, [
                    Card('', 67, 543, 2 /* EARTH */, null, null, 3),
                    Card('', 149, 297, 0 /* FIRE */, "P" /* PASSION */, null, 2),
                    Card('', 87, 483, 2 /* EARTH */, null, null, 1)
                ])
            ],
            '2': [
                Battle('Forest 1', 'p021', 2074, 15, 10, [
                    Card('', 130, 390, 3 /* LIGHT */, null, null, 2),
                    Card('', 68, 606, 4 /* DARK */, null, null, 3),
                    Card('', 130, 390, 3 /* LIGHT */, null, null, 4)
                ]),
                Battle('Forest 2', 'p022', 2074, 15, 10, [
                    Card('', 108, 486, 2 /* EARTH */, "N" /* NATURE */, null, 2),
                    Card('', 95, 525, 3 /* LIGHT */, null, null, 3),
                    Card('', 108, 486, 2 /* EARTH */, "N" /* NATURE */, null, 5)
                ]),
                Battle('Forest 3', 'p023', 2074, 15, 11, [
                    Card('', 131, 480, 3 /* LIGHT */, null, null, 1),
                    Card('', 81, 726, 4 /* DARK */, null, null, 0),
                    Card('', 131, 480, 3 /* LIGHT */, null, null, 4)
                ]),
                Battle('Forest 4', 'p024', 2065, 15, 11, [
                    Card('', 194, 387, 0 /* FIRE */, "P" /* PASSION */, null, 4),
                    Card('', 215, 276, 2 /* EARTH */, null, null, 0),
                    Card('', 138, 504, 2 /* EARTH */, null, null, 1)
                ]),
                Battle('Forest 5', 'p025', 2065, 15, 12, [
                    Card('', 97, 678, 3 /* LIGHT */, null, null, 1),
                    Card('', 96, 672, 1 /* ICE */, null, null, 3),
                    Card('', 226, 291, 0 /* FIRE */, "P" /* PASSION */, null, 5)
                ]),
                Battle('Forest 6', 'p026', 2065, 15, 12, [
                    Card('', 132, 735, 0 /* FIRE */, null, null, 2),
                    Card('', 218, 354, 4 /* DARK */, null, null, 0),
                    Card('', 241, 312, 2 /* EARTH */, null, null, 6)
                ]),
                Battle('Forest 7', 'p027', 2072, 15, 13, [
                    Card('', 189, 567, 1 /* ICE */, "F" /* FAIRY */, null, 0),
                    Card('', 198, 486, 4 /* DARK */, null, null, 3),
                    Card('', 245, 396, 4 /* DARK */, "P" /* PASSION */, null, 6)
                ]),
                Battle('Forest 8', 'p028', 2072, 15, 13, [
                    Card('', 151, 678, 2 /* EARTH */, null, null, 6),
                    Card('', 244, 396, 4 /* DARK */, null, null, 1),
                    Card('', 192, 576, 2 /* EARTH */, null, null, 0)
                ]),
                Battle('Forest 9', 'p029', 2609, 15, 14, [
                    Card('', 176, 645, 3 /* LIGHT */, null, null, 4),
                    Card('', 264, 426, 0 /* FIRE */, null, null, 0),
                    Card('', 195, 585, 1 /* ICE */, "F" /* FAIRY */, null, 6)
                ]),
                Battle('Forest 9.1', 'p030', 2609, 15, 14, [
                    Card('', 207, 621, 1 /* ICE */, "F" /* FAIRY */, null, 6),
                    Card('', 126, 882, 1 /* ICE */, null, null, 1),
                    Card('', 153, 750, 1 /* ICE */, null, 21 /* HEAL_4 */, 2)
                ]),
                Battle('Forest 9.2', 'p031', 2733, 15, 14, [
                    Card('', 305, 393, 0 /* FIRE */, "P" /* PASSION */, null, 3),
                    Card('', 109, 981, 4 /* DARK */, null, null, 2),
                    Card('', 218, 654, 3 /* LIGHT */, null, null, 4)
                ]),
                Battle('Forest 10', 'p032', 2733, 15, 15, [
                    Card('', 196, 720, 3 /* LIGHT */, null, null, 4),
                    Card('', 174, 783, 4 /* DARK */, null, null, 1),
                    Card('', 225, 675, 4 /* DARK */, null, null, 3)
                ]),
                Battle('Forest 10.1', 'p033', 2733, 15, 15, [
                    Card('', 117, 1047, 2 /* EARTH */, null, null, 5),
                    Card('', 115, 1032, 4 /* DARK */, null, null, 4),
                    Card('', 183, 825, 4 /* DARK */, null, null, 3),
                ]),
                Battle('Forest 10.2', 'p034', 2685, 15, 16, [
                    Card('', 216, 792, 3 /* LIGHT */, null, null, 6),
                    Card('', 288, 576, 0 /* FIRE */, "P" /* PASSION */, null, 0),
                    Card('', 312, 504, 4 /* DARK */, null, null, 5)
                ]),
                Battle('Forest 10.3', 'p035', 2685, 15, 16, [
                    Card('', 240, 720, 1 /* ICE */, "F" /* FAIRY */, null, 3),
                    Card('', 124, 1116, 3 /* LIGHT */, null, null, 4),
                    Card('', 120, 1080, 4 /* DARK */, null, null, 1)
                ]),
                Battle('Forest 10.4', 'p036', 2839, 15, 16, [
                    Card('', 201, 906, 2 /* EARTH */, null, null, 1),
                    Card('', 327, 528, 2 /* EARTH */, null, null, 5),
                    Card('', 223, 819, 3 /* LIGHT */, null, null, 0)
                ]),
                Battle('Forest 10.5', 'p037', 2839, 16, 17, [
                    Card('', 204, 918, 0 /* FIRE */, null, null, 5),
                    Card('', 201, 906, 2 /* EARTH */, null, null, 4),
                    Card('', 252, 756, 1 /* ICE */, "F" /* FAIRY */, null, 6)
                ]),
                Battle('Forest 11', 'p038', 2839, 16, 18, [
                    Card('', 207, 933, 4 /* DARK */, null, null, 6),
                    Card('', 182, 1011, 1 /* ICE */, null, null, 3),
                    Card('', 214, 963, 1 /* ICE */, null, null, 2)
                ]),
                Battle('Forest 12', 'p039', 2827, 16, 19, [
                    Card('', 138, 1239, 3 /* LIGHT */, null, null, 0),
                    Card('', 324, 648, 0 /* FIRE */, "P" /* PASSION */, null, 6),
                    Card('', 135, 1215, 4 /* DARK */, null, null, 5)
                ]),
                Battle('Forest 13', 'p040', 2827, 16, 19, [
                    Card('', 141, 1266, 4 /* DARK */, null, null, 2),
                    Card('', 225, 1014, 4 /* DARK */, null, null, 5),
                    Card('', 283, 849, 3 /* LIGHT */, null, null, 1)
                ]),
                Battle('Forest 14', 'p041', 2827, 16, 20, [
                    Card('', 219, 657, 3 /* LIGHT */, null, null, 1),
                    Card('', 197, 1098, 1 /* ICE */, null, null, 0),
                    Card('', 377, 609, 0 /* FIRE */, null, null, 6)
                ]),
                Battle('Forest 14.1', 'p042', 3439, 16, 20, [
                    Card('', 349, 699, 0 /* FIRE */, null, null, 0),
                    Card('', 206, 1146, 0 /* FIRE */, null, null, 4),
                    Card('', 320, 786, 4 /* DARK */, null, null, 5)
                ]),
                Battle('Forest 14.2', 'p043', 3439, 16, 21, [
                    Card('', 285, 462, 4 /* DARK */, null, null, 2),
                    Card('', 365, 729, 0 /* FIRE */, "P" /* PASSION */, null, 3),
                    Card('', 330, 810, 2 /* EARTH */, "N" /* NATURE */, null, 4)
                ]),
                Battle('Forest 14.3', 'p044', 3439, 16, 22, [
                    Card('', 212, 1179, 0 /* FIRE */, null, null, 5),
                    Card('', 420, 1032, 0 /* FIRE */, "P" /* PASSION */, null, 0),
                    Card('', 243, 1095, 2 /* EARTH */, null, null, 3)
                ]),
                Battle('Forest 15', 'p045', 3599, 16, 23, [
                    Card('', 217, 1209, 3 /* LIGHT */, null, null, 2),
                    Card('', 284, 1041, 3 /* LIGHT */, null, null, 6),
                    Card('', 315, 945, 1 /* ICE */, "F" /* FAIRY */, null, 0)
                ])
            ],
            '3': [
                Battle('Sands 1', 'p046', 3599, 16, 24, [
                    Card('', 351, 861, 1 /* ICE */, "F" /* FAIRY */, null, 2),
                    Card('', 252, 1134, 2 /* EARTH */, "N" /* NATURE */, null, 6),
                    Card('', 441, 567, 0 /* FIRE */, "P" /* PASSION */, null, 4)
                ]),
                Battle('Sands 2', 'p047', 3467, 16, 24, [
                    Card('', 228, 1269, 3 /* LIGHT */, null, null, 0),
                    Card('', 455, 585, 2 /* EARTH */, null, null, 6),
                    Card('', 164, 1476, 2 /* EARTH */, null, null, 5)
                ]),
                Battle('Sands 3', 'p048', 3467, 16, 24, [
                    Card('', 402, 804, 1 /* ICE */, null, null, 0),
                    Card('', 402, 804, 1 /* ICE */, null, null, 4),
                    Card('', 368, 903, 1 /* ICE */, "F" /* FAIRY */, null, 1)
                ]),
                Battle('Sands 4', 'p049', 3379, 16, 25, [
                    Card('', 379, 930, 2 /* EARTH */, "N" /* NATURE */, null, 5),
                    Card('', 172, 1548, 4 /* DARK */, null, null, 6),
                    Card('', 379, 930, 4 /* DARK */, null, null, 4)
                ]),
                Battle('Sands 4.1', 'p050', 3379, 16, 25, [
                    Card('', 239, 1332, 0 /* FIRE */, null, null, 4),
                    Card('', 454, 735, 2 /* EARTH */, null, null, 1),
                    Card('', 452, 732, 0 /* FIRE */, null, null, 2)
                ]),
                Battle('Sands 4.2', 'p051', 3328, 16, 26, [
                    Card('', 248, 1380, 3 /* LIGHT */, null, null, 2),
                    Card('', 389, 954, 4 /* DARK */, null, null, 4),
                    Card('', 248, 1380, 3 /* LIGHT */, null, null, 3)
                ]),
                Battle('Sands 4.3', 'p052', 3328, 16, 26, [
                    Card('', 254, 1416, 3 /* LIGHT */, null, null, 1),
                    Card('', 399, 981, 4 /* DARK */, null, null, 5),
                    Card('', 254, 1416, 3 /* LIGHT */, null, null, 4)
                ]),
                Battle('Sands 4.4', 'p053', 3328, 16, 26, [
                    Card('', 447, 894, 1 /* ICE */, null, null, 6),
                    Card('', 223, 1560, 3 /* LIGHT */, null, null, 0),
                    Card('', 298, 1341, 1 /* ICE */, null, null, 2)
                ]),
                Battle('Sands 4.5', 'p054', 4356, 16, 27, [
                    Card('', 335, 1227, 3 /* LIGHT */, null, null, 2),
                    Card('', 483, 780, 2 /* EARTH */, null, null, 3),
                    Card('', 483, 780, 2 /* EARTH */, null, null, 6)
                ]),
                Battle('Sands 5', 'p055', 4356, 16, 27, [
                    Card('', 306, 1377, 2 /* EARTH */, null, null, 6),
                    Card('', 459, 917, 0 /* FIRE */, null, null, 5),
                    Card('', 305, 1371, 2 /* EARTH */, null, null, 4)
                ]),
                Battle('Sands 6', 'p056', 4312, 16, 28, [
                    Card('', 507, 819, 2 /* EARTH */, null, null, 5),
                    Card('', 195, 1755, 4 /* DARK */, null, null, 2),
                    Card('', 468, 936, 0 /* FIRE */, "P" /* PASSION */, null, 3)
                ]),
                Battle('Sands 7', 'p057', 4312, 16, 28, [
                    Card('', 321, 1446, 4 /* DARK */, null, null, 5),
                    Card('', 402, 1206, 1 /* ICE */, "F" /* FAIRY */, null, 0),
                    Card('', 400, 1200, 3 /* LIGHT */, null, null, 4)
                ]),
                Battle('Sands 8', 'p058', 4095, 16, 29, [
                    Card('', 562, 723, 0 /* FIRE */, "P" /* PASSION */, null, 1),
                    Card('', 241, 1686, 3 /* LIGHT */, null, null, 4),
                    Card('', 326, 1467, 2 /* EARTH */, "N" /* NATURE */, null, 0)
                ]),
                Battle('Sands 9', 'p059', 4095, 16, 29, [
                    Card('', 330, 1485, 4 /* DARK */, null, null, 0),
                    Card('', 330, 1485, 4 /* DARK */, null, null, 6),
                    Card('', 372, 1362, 3 /* LIGHT */, null, null, 2)
                ]),
                Battle('Sands 9.1', 'p060', 4317, 16, 30, [
                    Card('', 413, 1239, 1 /* ICE */, "F" /* FAIRY */, null, 0),
                    Card('', 372, 1362, 3 /* LIGHT */, null, null, 1),
                    Card('', 372, 1362, 3 /* LIGHT */, null, null, 3)
                ]),
                Battle('Sands 9.2', 'p061', 4317, 16, 30, [
                    Card('', 594, 765, 0 /* FIRE */, "P" /* PASSION */, null, 6),
                    Card('', 336, 1512, 2 /* EARTH */, "N" /* NATURE */, null, 0),
                    Card('', 551, 891, 2 /* EARTH */, null, null, 3)
                ]),
                Battle('Sands 10', 'p062', 4317, 16, 30, [
                    Card('', 566, 915, 2 /* EARTH */, null, null, 0),
                    Card('', 348, 1566, 2 /* EARTH */, null, null, 3),
                    Card('', 435, 1305, 1 /* ICE */, "F" /* FAIRY */, null, 6)
                ]),
                Battle('Sands 11', 'p063', 4573, 16, 31, [
                    Card('', 218, 1959, 4 /* DARK */, null, null, 1),
                    Card('', 392, 1437, 3 /* LIGHT */, null, null, 6),
                    Card('', 218, 1959, 4 /* DARK */, null, null, 5)
                ]),
                Battle('Sands 12', 'p064', 4573, 16, 31, [
                    Card('', 581, 939, 2 /* EARTH */, null, null, 4),
                    Card('', 313, 1743, 1 /* ICE */, null, null, 5),
                    Card('', 402, 1473, 3 /* LIGHT */, null, null, 2)
                ]),
                Battle('Sands 12.1', 'p065', 4573, 16, 31, [
                    Card('', 229, 2061, 4 /* DARK */, null, null, 6),
                    Card('', 641, 825, 0 /* FIRE */, "P" /* PASSION */, null, 5),
                    Card('', 447, 1341, 1 /* ICE */, "F" /* FAIRY */, null, 3)
                ]),
                Battle('Sands 12.2', 'p066', 4664, 17, 32, [
                    Card('', 549, 1098, 0 /* FIRE */, "P" /* PASSION */, null, 3),
                    Card('', 641, 825, 0 /* FIRE */, "P" /* PASSION */, null, 2),
                    Card('', 549, 1098, 0 /* FIRE */, "P" /* PASSION */, null, 5)
                ]),
                Battle('Sands 13', 'p067', 4758, 17, 32, [
                    Card('', 469, 1407, 1 /* ICE */, "F" /* FAIRY */, null, 3),
                    Card('', 469, 1407, 1 /* ICE */, "F" /* FAIRY */, null, 5),
                    Card('', 469, 1407, 1 /* ICE */, "F" /* FAIRY */, null, 6)
                ]),
                Battle('Sands 13.1', 'p068', 4853, 17, 33, [
                    Card('', 0, 0, null, null, null, 2),
                    Card('', 0, 0, null, null, null, 1),
                    Card('', 0, 0, null, null, null, 0)
                ]),
                Battle('Sands 13.2', 'p069', 4950, 17, 34, [
                    Card('', 626, 1011, 4 /* DARK */, "P" /* PASSION */, null, 4),
                    Card('', 626, 1011, 4 /* DARK */, "P" /* PASSION */, null, 5),
                    Card('', 626, 1011, 4 /* DARK */, "P" /* PASSION */, null, 6)
                ]),
                Battle('Sands 14', 'p070', 5049, 17, 35, [
                    Card('', 578, 1155, 3 /* LIGHT */, null, null, 0),
                    Card('', 578, 1155, 3 /* LIGHT */, null, null, 4),
                    Card('', 578, 1155, 3 /* LIGHT */, null, null, 6)
                ]),
                Battle('Sands 15', 'p071', 5150, 17, 36, [
                    Card('', 347, 1929, 0 /* FIRE */, null, null, 2),
                    Card('', 347, 1929, 0 /* FIRE */, null, null, 5),
                    Card('', 396, 1782, 2 /* EARTH */, "N" /* NATURE */, null, 6)
                ]),
                Battle('Sands 16', 'p072', 5253, 17, 37, [
                    Card('', 643, 1041, 4 /* DARK */, "P" /* PASSION */, null, 0),
                    Card('', 347, 1929, 0 /* FIRE */, null, null, 4),
                    Card('', 396, 1782, 2 /* EARTH */, "N" /* NATURE */, null, 6)
                ]),
                Battle('Sands 17', 'p073', 5358, 17, 37, [
                    Card('', 0, 0, null, null, null, -1),
                    Card('', 0, 0, null, null, null, -1),
                    Card('', 0, 0, null, null, null, -1)
                ])
            ],
            '4': [
                Battle('Rivers 1', 'p200', 5217, 17, 37, [
                    Card('', 660, 1068, 4 /* DARK */, "P" /* PASSION */, null, 4),
                    Card('', 508, 1524, 1 /* ICE */, "F" /* FAIRY */, null, 2),
                    Card('', 356, 1980, 0 /* FIRE */, null, null, 0)
                ]),
                Battle('Rivers 2', 'p201', 5321, 17, 38, [
                    Card('', 677, 1095, 4 /* DARK */, "P" /* PASSION */, null, 6),
                    Card('', 417, 1875, 2 /* EARTH */, "N" /* NATURE */, null, 2),
                    Card('', 365, 2031, 0 /* FIRE */, null, null, 3)
                ]),
                Battle('Rivers 3', 'p202', 5427, 17, 39, [
                    Card('', 677, 1095, 4 /* DARK */, "P" /* PASSION */, null, 4),
                    Card('', 521, 1563, 1 /* ICE */, "F" /* FAIRY */, null, 6),
                    Card('', 365, 2031, 0 /* FIRE */, null, null, 0)
                ]),
                Battle('Rivers 3.1', 'p203', 5536, 17, 40, [
                    Card('', 427, 1923, 2 /* EARTH */, "N" /* NATURE */, null, 1),
                    Card('', 323, 2259, 3 /* LIGHT */, null, null, 3),
                    Card('', 430, 1935, 1 /* ICE */, null, null, 4)
                ]),
                Battle('Rivers 3.2', 'p204', 5647, 17, 41, [
                    Card('', 645, 1290, 0 /* FIRE */, null, null, 4),
                    Card('', 272, 2448, 4 /* DARK */, null, null, 6),
                    Card('', 320, 2238, 3 /* LIGHT */, null, null, 2)
                ]),
                Battle('Rivers 4', 'p205', 5759, 17, 42, [
                    Card('', 711, 1149, 4 /* DARK */, "P" /* PASSION */, null, 2),
                    Card('', 438, 1971, 2 /* EARTH */, "N" /* NATURE */, null, 4),
                    Card('', 657, 1314, 3 /* LIGHT */, null, null, 0)
                ]),
                Battle('Rivers 5', 'p206', 5875, 17, 43, [
                    Card('', 711, 1149, 4 /* DARK */, "P" /* PASSION */, null, 0),
                    Card('', 547, 1641, 1 /* ICE */, "F" /* FAIRY */, null, 2),
                    Card('', 657, 1314, 3 /* LIGHT */, null, null, 3)
                ]),
                Battle('Rivers 5.1', 'p207', 5992, 17, 44, [
                    Card('', 0, 0, null, null, null, -1),
                    Card('', 0, 0, null, null, null, -1),
                    Card('', 0, 0, null, null, null, -1)
                ]),
                Battle('Rivers 6', 'p208', 6112, 17, 45, [
                    Card('', 672, 1344, 3 /* LIGHT */, null, null, 0),
                    Card('', 448, 2016, 2 /* EARTH */, "N" /* NATURE */, null, 2),
                    Card('', 392, 2184, 0 /* FIRE */, null, null, 5)
                ]),
                Battle('Rivers 7', 'p209', 6234, 17, 46, [
                    Card('', 688, 1377, 3 /* LIGHT */, null, null, 1),
                    Card('', 459, 2064, 2 /* EARTH */, "N" /* NATURE */, null, 4),
                    Card('', 574, 1722, 1 /* ICE */, "F" /* FAIRY */, null, 5)
                ]),
                Battle('Rivers 8', 'p210', 6359, 17, 47, [
                    Card('', 688, 1377, 3 /* LIGHT */, null, null, 0),
                    Card('', 574, 1722, 1 /* ICE */, "F" /* FAIRY */, null, 3),
                    Card('', 746, 1206, 4 /* DARK */, "P" /* PASSION */, null, 4)
                ]),
                Battle('Rivers 9', 'p211', 6486, 17, 48, [
                    Card('', 746, 1206, 4 /* DARK */, "P" /* PASSION */, null, 0),
                    Card('', 688, 1377, 3 /* LIGHT */, null, null, 5),
                    Card('', 459, 2064, 2 /* EARTH */, "N" /* NATURE */, null, 6)
                ]),
                Battle('Rivers 10', 'p212', 6616, 17, 49, [
                    Card('', 469, 2112, 2 /* EARTH */, "N" /* NATURE */, null, 1),
                    Card('', 587, 1761, 1 /* ICE */, "F" /* FAIRY */, null, 3),
                    Card('', 411, 2289, 0 /* FIRE */, null, null, 2)
                ]),
                Battle('Rivers 11', 'p213', 6748, 18, 50, [
                    Card('', 0, 0, null, null, null, -1),
                    Card('', 0, 0, null, null, null, -1),
                    Card('', 0, 0, null, null, null, -1)
                ]),
                Battle('Rivers 11.1', 'p214', 6883, 18, 51, [
                    Card('', 0, 0, null, null, null, -1),
                    Card('', 0, 0, null, null, null, -1),
                    Card('', 0, 0, null, null, null, -1)
                ]),
                Battle('Rivers 11.2', 'p215', 7021, 18, 52, [
                    Card('', 720, 1440, 3 /* LIGHT */, null, null, 0),
                    Card('', 780, 1260, 4 /* DARK */, "P" /* PASSION */, null, 1),
                    Card('', 600, 1800, 1 /* ICE */, "F" /* FAIRY */, null, 4)
                ]),
                Battle('Rivers 12', 'p216', 7161, 18, 53, [
                    Card('', 0, 0, null, null, null, -1),
                    Card('', 0, 0, null, null, null, -1),
                    Card('', 0, 0, null, null, null, -1)
                ]),
                Battle('Rivers 13', 'p217', 7304, 18, 54, [
                    Card('', 447, 2350, 3 /* LIGHT */, null, null, 5),
                    Card('', 746, 1491, 3 /* LIGHT */, null, null, 1),
                    Card('', 622, 1866, 1 /* ICE */, "F" /* FAIRY */, null, 3)
                ]),
                Battle('Rivers 13.1', 'p218', 7451, 18, 55, [
                    Card('', 497, 2238, 2 /* EARTH */, "N" /* NATURE */, null, 2),
                    Card('', 622, 1866, 1 /* ICE */, "F" /* FAIRY */, null, 4),
                    Card('', 746, 1491, 3 /* LIGHT */, null, null, 1)
                ]),
                Battle('Rivers 13.2', 'p219', 7600, 18, 56, [
                    Card('', 622, 1866, 1 /* ICE */, "F" /* FAIRY */, null, 1),
                    Card('', 808, 1305, 4 /* DARK */, null, null, 5),
                    Card('', 746, 1491, 3 /* LIGHT */, null, null, 3)
                ]),
                Battle('Rivers 13.3', 'p220', 7752, 18, 57, [
                    Card('', 445, 2475, 0 /* FIRE */, null, null, 1),
                    Card('', 508, 2286, 2 /* EARTH */, "N" /* NATURE */, null, 2),
                    Card('', 762, 1524, 3 /* LIGHT */, null, null, 5)
                ]),
                Battle('Rivers 13.4', 'p221', 7907, 18, 58, [
                    Card('', 635, 1905, 1 /* ICE */, "F" /* FAIRY */, null, 0),
                    Card('', 762, 1524, 3 /* LIGHT */, null, null, 4),
                    Card('', 508, 2286, 2 /* EARTH */, null, null, 6)
                ]),
                Battle('Rivers 14', 'p222', 8065, 18, 59, [
                    Card('', 518, 2331, 2 /* EARTH */, "N" /* NATURE */, null, 6),
                    Card('', 648, 1944, 1 /* ICE */, "F" /* FAIRY */, null, 1),
                    Card('', 777, 1554, 3 /* LIGHT */, null, null, 0)
                ]),
                Battle('Rivers 15', 'p223', 8226, 16, 60, [
                    Card('', 518, 2331, 2 /* EARTH */, "N" /* NATURE */, null, 3),
                    Card('', 454, 2526, 0 /* FIRE */, null, null, 4),
                    Card('', 777, 1554, 3 /* LIGHT */, null, null, 5)
                ]),
                Battle('Rivers 15.1', 'p224', 8390, 18, 61, [
                    Card('', 463, 2577, 0 /* FIRE */, null, null, 1),
                    Card('', 661, 1983, 1 /* ICE */, "F" /* FAIRY */, null, 2),
                    Card('', 859, 1389, 4 /* DARK */, "P" /* PASSION */, null, 6)
                ]),
                Battle('Rivers 15.2', 'p225', 8558, 18, 62, [
                    Card('', 529, 2379, 2 /* EARTH */, "N" /* NATURE */, null, 0),
                    Card('', 793, 1587, 3 /* LIGHT */, null, null, 1),
                    Card('', 661, 1983, 1 /* ICE */, "F" /* FAIRY */, null, 2)
                ]),
                Battle('Rivers 16', 'p226', 8729, 18, 63, [
                    Card('', 1118, 2006, 3 /* LIGHT */, null, null, 5),
                    Card('', 822, 2894, 2 /* EARTH */, "N" /* NATURE */, null, 0),
                    Card('', 748, 3116, 0 /* FIRE */, null, null, 4)
                ])
            ],
            '5': [
                Battle('Island 1', 'p227', 8904, 19, 64, [
                    Card('', 923, 3067, 2 /* EARTH */, "N" /* NATURE */, null, 1),
                    Card('', 1076, 2608, 1 /* ICE */, "F" /* FAIRY */, null, 4),
                    Card('', 1229, 2149, 3 /* LIGHT */, null, null, 5)
                ]),
                Battle('Island 2', 'p228', 9082, 19, 65, [
                    Card('', 1013, 3157, 2 /* EARTH */, "N" /* NATURE */, null, 0),
                    Card('', 936, 3388, 0 /* FIRE */, null, null, 2),
                    Card('', 1319, 2239, 3 /* LIGHT */, null, null, 4)
                ]),
                Battle('Island 3', 'p229', 9264, 19, 66, [
                    Card('', 1428, 2316, 3 /* LIGHT */, null, null, 2),
                    Card('', 1132, 3204, 2 /* EARTH */, "N" /* NATURE */, null, 3),
                    Card('', 1280, 2760, 1 /* ICE */, "F" /* FAIRY */, null, 4)
                ]),
                Battle('Island 4', 'p230', 9449, 19, 67, [
                    Card('', 1599, 2201, 4 /* DARK */, "P" /* PASSION */, null, 1),
                    Card('', 1523, 2426, 3 /* LIGHT */, null, null, 3),
                    Card('', 1222, 3329, 2 /* EARTH */, "N" /* NATURE */, null, 5)
                ]),
                Battle('Island 5', 'p231', 9638, 19, 68, [
                    Card('', 1619, 2539, 3 /* LIGHT */, null, null, 1),
                    Card('', 1236, 3688, 0 /* FIRE */, null, null, 2),
                    Card('', 1313, 3457, 2 /* EARTH */, null, null, 5)
                ]),
                Battle('Island 6', 'p232', 9831, 19, 69, [
                    Card('', 1781, 2446, 4 /* DARK */, "P" /* PASSION */, null, 3),
                    Card('', 1698, 2695, 3 /* LIGHT */, null, null, 4),
                    Card('', 1532, 3196, 1 /* ICE */, "F" /* FAIRY */, null, 5)
                ]),
                Battle('Island 7', 'p233', 10027, 19, 70, [
                    Card('', 1328, 4198, 0 /* FIRE */, null, null, 2),
                    Card('', 1777, 2854, 3 /* LIGHT */, null, null, 3),
                    Card('', 1866, 2584, 4 /* DARK */, "P" /* PASSION */, null, 4)
                ]),
                Battle('Island 8', 'p234', 15342, 19, 71, [ //
                ]),
            ],
        },
        dungeon: [
            /* FIRE */
            [
                [
                    Battle('Fire Dungeon 1', 'p001', 0, 1, 5, [
                        Card('', 86, 387, 0 /* FIRE */),
                        Card('', 119, 291, 0 /* FIRE */),
                        Card('', 76, 420, 0 /* FIRE */),
                        Card('', 140, 228, 0 /* FIRE */),
                        Card('', 120, 240, 0 /* FIRE */),
                        Card('', 130, 210, 0 /* FIRE */),
                        Card('', 120, 294, 0 /* FIRE */)
                    ]),
                    Battle('Fire Dungeon 2', 'p002', 0, 1, 6, [
                        Card('', 179, 291, 0 /* FIRE */),
                        Card('', 97, 537, 0 /* FIRE */),
                        Card('', 152, 372, 0 /* FIRE */),
                        Card('', 110, 495, 0 /* FIRE */),
                        Card('', 175, 285, 0 /* FIRE */),
                        Card('', 162, 324, 0 /* FIRE */),
                        Card('', 194, 387, 0 /* FIRE */)
                    ]),
                    Battle('Fire Dungeon 3', 'p003', 0, 1, 7, [
                        Card('', 193, 474, 0 /* FIRE */),
                        Card('', 228, 369, 0 /* FIRE */),
                        Card('', 140, 630, 0 /* FIRE */),
                        Card('', 123, 684, 0 /* FIRE */),
                        Card('', 207, 414, 0 /* FIRE */),
                        Card('', 224, 363, 0 /* FIRE */),
                        Card('', 207, 414, 0 /* FIRE */)
                    ]),
                    Battle('Fire Dungeon 4', 'p004', 0, 1, 8, [
                        Card('', 231, 567, 0 /* FIRE */),
                        Card('', 168, 756, 0 /* FIRE */),
                        Card('', 273, 441, 0 /* FIRE */),
                        Card('', 147, 819, 0 /* FIRE */),
                        Card('', 273, 441, 0 /* FIRE */),
                        Card('', 252, 504, 0 /* FIRE */),
                        Card('', 248, 495, 0 /* FIRE */, "P" /* PASSION */)
                    ]),
                    Battle('Fire Dungeon 5', 'p005', 0, 1, 9, [
                        Card('', 192, 864, 0 /* FIRE */),
                        Card('', 264, 648, 0 /* FIRE */),
                        Card('', 168, 936, 0 /* FIRE */),
                        Card('', 317, 513, 0 /* FIRE */),
                        Card('', 317, 513, 0 /* FIRE */),
                        Card('', 293, 585, 0 /* FIRE */),
                        Card('', 216, 792, 0 /* FIRE */)
                    ]),
                    Battle('Fire Dungeon 6', 'p006', 0, 1, 10, [
                        Card('', 358, 579, 0 /* FIRE */),
                        Card('', 220, 990, 0 /* FIRE */),
                        Card('', 193, 1074, 0 /* FIRE */),
                        Card('', 303, 744, 0 /* FIRE */),
                        Card('', 366, 591, 0 /* FIRE */),
                        Card('', 338, 675, 0 /* FIRE */),
                        Card('', 338, 675, 0 /* FIRE */)
                    ]),
                    Battle('Fire Dungeon 7', 'p007', 0, 1, 11, [
                        Card('', 407, 657, 0 /* FIRE */),
                        Card('', 250, 1125, 0 /* FIRE */),
                        Card('', 344, 846, 0 /* FIRE */),
                        Card('', 219, 1221, 0 /* FIRE */),
                        Card('', 372, 744, 0 /* FIRE */),
                        Card('', 403, 651, 0 /* FIRE */),
                        Card('', 284, 1041, 0 /* FIRE */)
                    ]),
                    Battle('Fire Dungeon 8', 'p008', 0, 1, 12, [
                        Card('', 245, 1365, 0 /* FIRE */),
                        Card('', 455, 735, 0 /* FIRE */),
                        Card('', 385, 945, 0 /* FIRE */),
                        Card('', 280, 1260, 0 /* FIRE */),
                        Card('', 460, 744, 0 /* FIRE */),
                        Card('', 460, 744, 0 /* FIRE */),
                        Card('', 384, 942, 0 /* FIRE */)
                    ]),
                    Battle('Fire Dungeon 9', 'p009', 0, 1, 13, [
                        Card('', 270, 1503, 0 /* FIRE */),
                        Card('', 501, 810, 0 /* FIRE */),
                        Card('', 424, 1041, 0 /* FIRE */),
                        Card('', 308, 1386, 0 /* FIRE */),
                        Card('', 496, 801, 0 /* FIRE */),
                        Card('', 458, 915, 0 /* FIRE */),
                        Card('', 459, 918, 0 /* FIRE */, "P" /* PASSION */)
                    ]),
                    Battle('Fire Dungeon 10', 'p010', 0, 1, 14, [
                        Card('', 540, 873, 0 /* FIRE */),
                        Card('', 291, 1620, 0 /* FIRE */),
                        Card('', 332, 1497, 0 /* FIRE */),
                        Card('', 457, 1122, 0 /* FIRE */),
                        Card('', 503, 1005, 0 /* FIRE */),
                        Card('', 545, 882, 0 /* FIRE */),
                        Card('', 594, 765, 0 /* FIRE */, "P" /* PASSION */)
                    ]),
                    Battle('Fire Dungeon 11', 'p011', 0, 1, 15, [
                        Card('', 594, 946, 0 /* FIRE */),
                        Card('', 375, 1600, 0 /* FIRE */),
                        Card('', 507, 1207, 0 /* FIRE */),
                        Card('', 332, 1732, 0 /* FIRE */),
                        Card('', 544, 1089, 0 /* FIRE */),
                        Card('', 590, 954, 0 /* FIRE */),
                        Card('', 549, 1098, 0 /* FIRE */, "P" /* PASSION */)
                    ]),
                    Battle('Fire Dungeon 12', 'p012', 0, 1, 16, [
                        Card('', 438, 1621, 0 /* FIRE */),
                        Card('', 552, 1252, 0 /* FIRE */),
                        Card('', 639, 991, 0 /* FIRE */),
                        Card('', 377, 1777, 0 /* FIRE */),
                        Card('', 638, 1032, 0 /* FIRE */),
                        Card('', 638, 1032, 0 /* FIRE */),
                        Card('', 688, 885, 0 /* FIRE */)
                    ])
                ],
                [
                    Battle('Fire Dungeon 13', 'p001', 0, 1, 17, [
                        Card('', 512, 1677, 0 /* FIRE */),
                        Card('', 637, 1302, 0 /* FIRE */),
                        Card('', 720, 1053, 0 /* FIRE */),
                        Card('', 599, 1470, 0 /* FIRE */),
                        Card('', 645, 1290, 0 /* FIRE */),
                        Card('', 699, 1131, 0 /* FIRE */),
                        Card('', 653, 1305, 0 /* FIRE */, "P" /* PASSION */)
                    ]),
                    Battle('Fire Dungeon 14', 'p002', 0, 1, 18, [
                        Card('', 527, 1927, 0 /* FIRE */),
                        Card('', 789, 1141, 0 /* FIRE */),
                        Card('', 596, 1737, 0 /* FIRE */),
                        Card('', 707, 1413, 0 /* FIRE */, "P" /* PASSION */),
                        Card('', 769, 1201, 0 /* FIRE */),
                        Card('', 769, 1201, 0 /* FIRE */),
                        Card('', 707, 1413, 0 /* FIRE */)
                    ]),
                    Battle('Fire Dungeon 15', 'p003', 0, 1, 19, [
                        Card('', 676, 1817, 0 /* FIRE */),
                        Card('', 799, 1451, 0 /* FIRE */),
                        Card('', 636, 1940, 0 /* FIRE */),
                        Card('', 571, 2094, 0 /* FIRE */),
                        Card('', 855, 1272, 0 /* FIRE */),
                        Card('', 855, 1272, 0 /* FIRE */),
                        Card('', 888, 1143, 0 /* FIRE */, "P" /* PASSION */)
                    ]),
                    Battle('Fire Dungeon 16', 'p004', 0, 1, 20, [
                        Card('', 712, 1979, 0 /* FIRE */),
                        Card('', 667, 2117, 0 /* FIRE */),
                        Card('', 848, 1574, 0 /* FIRE */),
                        Card('', 772, 1823, 0 /* FIRE */),
                        Card('', 919, 1351, 0 /* FIRE */),
                        Card('', 877, 1534, 0 /* FIRE */),
                        Card('', 641, 2216, 0 /* FIRE */)
                    ]),
                    Battle('Fire Dungeon 17', 'p005', 0, 1, 21, [
                        Card('', 1007, 1412, 0 /* FIRE */),
                        Card('', 906, 1715, 0 /* FIRE */),
                        Card('', 754, 2168, 0 /* FIRE */),
                        Card('', 850, 1883, 0 /* FIRE */),
                        Card('', 1013, 1421, 0 /* FIRE */),
                        Card('', 1013, 1421, 0 /* FIRE */),
                        Card('', 914, 1688, 0 /* FIRE */, "P" /* PASSION */)
                    ]),
                    Battle('Fire Dungeon 18', 'p006', 0, 1, 22, [
                        Card('', 796, 2357, 0 /* FIRE */),
                        Card('', 964, 1856, 0 /* FIRE */),
                        Card('', 1075, 1523, 0 /* FIRE */),
                        Card('', 1119, 1382, 0 /* FIRE */, "P" /* PASSION */),
                        Card('', 1074, 1520, 0 /* FIRE */),
                        Card('', 1018, 1685, 0 /* FIRE */),
                        Card('', 791, 2366, 0 /* FIRE */)
                    ]),
                    Battle('Fire Dungeon 19', 'p007', 0, 1, 23, [
                        Card('', 772, 2702, 0 /* FIRE */),
                        Card('', 1013, 1979, 0 /* FIRE */),
                        Card('', 646, 3098, 0 /* FIRE */, null, 15 /* FIREBALL_4 */),
                        Card('', 1071, 1831, 0 /* FIRE */, "P" /* PASSION */),
                        Card('', 1074, 1799, 0 /* FIRE */),
                        Card('', 1135, 1619, 0 /* FIRE */),
                        Card('', 1008, 2023, 0 /* FIRE */)
                    ]),
                    Battle('Fire Dungeon 20', 'p008', 0, 1, 24, [
                        Card('', 874, 2708, 0 /* FIRE */),
                        Card('', 1202, 1727, 0 /* FIRE */),
                        Card('', 727, 3137, 0 /* FIRE */),
                        Card('', 1263, 1521, 0 /* FIRE */),
                        Card('', 1208, 1736, 0 /* FIRE */),
                        Card('', 1208, 1736, 0 /* FIRE */),
                        Card('', 941, 2490, 0 /* FIRE */)
                    ]),
                    Battle('Fire Dungeon 21', 'p009', 0, 1, 25, [
                        Card('', 1129, 2261, 0 /* FIRE */),
                        Card('', 1270, 1838, 0 /* FIRE */),
                        Card('', 796, 3248, 0 /* FIRE */),
                        Card('', 1214, 1988, 0 /* FIRE */, "P" /* PASSION */),
                        Card('', 1269, 1835, 0 /* FIRE */),
                        Card('', 1198, 2045, 0 /* FIRE */),
                        Card('', 1343, 1601, 0 /* FIRE */, "P" /* PASSION */)
                    ]),
                    Battle('Fire Dungeon 22', 'p010', 0, 1, 26, [
                        Card('', 1329, 1931, 0 /* FIRE */),
                        Card('', 877, 3287, 0 /* FIRE */),
                        Card('', 887, 3297, 0 /* FIRE */),
                        Card('', 1428, 1683, 0 /* FIRE */, "P" /* PASSION */),
                        Card('', 1330, 1934, 0 /* FIRE */),
                        Card('', 1254, 2159, 0 /* FIRE */),
                        Card('', 1238, 2253, 0 /* FIRE */)
                    ]),
                    Battle('Fire Dungeon 23', 'p011', 0, 1, 27, [
                        Card('', 914, 3491, 0 /* FIRE */),
                        Card('', 1236, 2525, 0 /* FIRE */),
                        Card('', 967, 3377, 0 /* FIRE */, null, 15 /* FIREBALL_4 */),
                        Card('', 1368, 2117, 0 /* FIRE */, "P" /* PASSION */),
                        Card('', 1403, 2051, 0 /* FIRE */),
                        Card('', 1322, 2294, 0 /* FIRE */),
                        Card('', 1492, 1742, 0 /* FIRE */, "P" /* PASSION */)
                    ]),
                    Battle('Fire Dungeon 24', 'p012', 0, 1, 28, [
                        Card('', 1294, 2666, 0 /* FIRE */),
                        Card('', 1465, 2153, 0 /* FIRE */),
                        Card('', 1026, 3478, 0 /* FIRE */),
                        Card('', 1572, 1822, 0 /* FIRE */, "P" /* PASSION */),
                        Card('', 1464, 2150, 0 /* FIRE */),
                        Card('', 1464, 2150, 0 /* FIRE */),
                        Card('', 1261, 2755, 0 /* FIRE */)
                    ])
                ],
                [
                    Battle('Fire Dungeon 25', 'p001', 0, 1, 29, [
                        Card('', 1528, 2356, 0 /* FIRE */),
                        Card('', 1549, 2288, 0 /* FIRE */),
                        Card('', 1138, 3506, 0 /* FIRE */),
                        Card('', 1321, 2977, 0 /* FIRE */),
                        Card('', 1457, 2564, 0 /* FIRE */),
                        Card('', 1549, 2288, 0 /* FIRE */),
                        Card('', 1528, 2356, 0 /* FIRE */, "P" /* PASSION */)
                    ]),
                    Battle('Fire Dungeon 26', 'p002', 0, 1, 30, [
                        Card('', 1634, 2426, 0 /* FIRE */),
                        Card('', 1634, 2426, 0 /* FIRE */),
                        Card('', 1227, 3637, 0 /* FIRE */),
                        Card('', 1609, 2518, 0 /* FIRE */, "P" /* PASSION */),
                        Card('', 1535, 2720, 0 /* FIRE */),
                        Card('', 1634, 2426, 0 /* FIRE */),
                        Card('', 1534, 2746, 0 /* FIRE */)
                    ]),
                    Battle('Fire Dungeon 28', 'p003', 0, 1, 31, [
                        Card('', 1319, 4147, 0 /* FIRE */),
                        Card('', 1693, 3035, 0 /* FIRE */),
                        Card('', 1319, 4147, 0 /* FIRE */, null, 15 /* FIREBALL_4 */),
                        Card('', 1934, 2287, 0 /* FIRE */, "P" /* PASSION */),
                        Card('', 1805, 2702, 0 /* FIRE */),
                        Card('', 1319, 4147, 0 /* FIRE */),
                        Card('', 1758, 2815, 0 /* FIRE */)
                    ]),
                    Battle('Fire Dungeon 28', 'p004', 0, 1, 32, [
                        Card('', 1319, 4147, 0 /* FIRE */),
                        Card('', 1693, 3035, 0 /* FIRE */),
                        Card('', 1319, 4147, 0 /* FIRE */, null, 15 /* FIREBALL_4 */),
                        Card('', 1934, 2287, 0 /* FIRE */, "P" /* PASSION */),
                        Card('', 1805, 2702, 0 /* FIRE */),
                        Card('', 1319, 4147, 0 /* FIRE */),
                        Card('', 1758, 2815, 0 /* FIRE */)
                    ]),
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                ]
            ],
            /* Water */
            [
                [
                    Battle('Water Dungeon 1', 'p001', 0, 1, 5, [
                        Card('', 65, 453, 1 /* ICE */),
                        Card('', 86, 387, 1 /* ICE */),
                        Card('', 86, 387, 1 /* ICE */),
                        Card('', 76, 420, 1 /* ICE */),
                        Card('', 120, 240, 1 /* ICE */),
                        Card('', 110, 270, 1 /* ICE */),
                        Card('', 77, 426, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 2', 'p002', 0, 1, 6, [
                        Card('', 97, 537, 1 /* ICE */),
                        Card('', 110, 495, 1 /* ICE */),
                        Card('', 110, 495, 1 /* ICE */),
                        Card('', 83, 579, 1 /* ICE */),
                        Card('', 162, 324, 1 /* ICE */),
                        Card('', 162, 324, 1 /* ICE */),
                        Card('', 178, 438, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 3', 'p003', 0, 1, 7, [
                        Card('', 123, 684, 1 /* ICE */),
                        Card('', 140, 630, 1 /* ICE */),
                        Card('', 105, 735, 1 /* ICE */),
                        Card('', 140, 630, 1 /* ICE */),
                        Card('', 207, 414, 1 /* ICE */),
                        Card('', 190, 465, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 173, 519, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 4', 'p004', 0, 1, 8, [
                        Card('', 168, 756, 1 /* ICE */),
                        Card('', 168, 756, 1 /* ICE */),
                        Card('', 126, 882, 1 /* ICE */),
                        Card('', 147, 819, 1 /* ICE */),
                        Card('', 231, 567, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 252, 504, 1 /* ICE */),
                        Card('', 207, 621, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 5', 'p005', 0, 1, 9, [
                        Card('', 168, 936, 1 /* ICE */),
                        Card('', 144, 1008, 1 /* ICE */),
                        Card('', 192, 864, 1 /* ICE */),
                        Card('', 195, 879, 1 /* ICE */),
                        Card('', 293, 585, 1 /* ICE */),
                        Card('', 293, 585, 1 /* ICE */),
                        Card('', 240, 720, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 6', 'p006', 0, 1, 10, [
                        Card('', 220, 990, 1 /* ICE */),
                        Card('', 165, 1155, 1 /* ICE */),
                        Card('', 220, 990, 1 /* ICE */),
                        Card('', 193, 1074, 1 /* ICE */),
                        Card('', 338, 675, 1 /* ICE */),
                        Card('', 310, 762, 1 /* ICE */),
                        Card('', 282, 846, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 7', 'p007', 0, 1, 11, [
                        Card('', 188, 1314, 1 /* ICE */),
                        Card('', 250, 1125, 1 /* ICE */),
                        Card('', 219, 1221, 1 /* ICE */),
                        Card('', 250, 1125, 1 /* ICE */),
                        Card('', 248, 1116, 1 /* ICE */),
                        Card('', 341, 837, 1 /* ICE */),
                        Card('', 347, 852, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 8', 'p008', 0, 1, 12, [
                        Card('', 210, 1470, 1 /* ICE */),
                        Card('', 280, 1260, 1 /* ICE */),
                        Card('', 280, 1260, 1 /* ICE */),
                        Card('', 245, 1365, 1 /* ICE */),
                        Card('', 424, 849, 1 /* ICE */),
                        Card('', 424, 849, 1 /* ICE */),
                        Card('', 349, 1047, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 9', 'p009', 0, 1, 13, [
                        Card('', 270, 1503, 1 /* ICE */),
                        Card('', 231, 1617, 1 /* ICE */),
                        Card('', 308, 1386, 1 /* ICE */),
                        Card('', 308, 1386, 1 /* ICE */),
                        Card('', 420, 1032, 1 /* ICE */),
                        Card('', 305, 1374, 1 /* ICE */),
                        Card('', 421, 1035, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 10', 'p010', 0, 1, 14, [
                        Card('', 332, 1497, 1 /* ICE */),
                        Card('', 291, 1620, 1 /* ICE */),
                        Card('', 250, 1743, 1 /* ICE */),
                        Card('', 332, 1497, 1 /* ICE */),
                        Card('', 503, 1005, 1 /* ICE */),
                        Card('', 461, 1131, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 467, 1146, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 11', 'p011', 0, 1, 15, [
                        Card('', 288, 1864, 1 /* ICE */),
                        Card('', 375, 1600, 1 /* ICE */),
                        Card('', 332, 1732, 1 /* ICE */),
                        Card('', 375, 1600, 1 /* ICE */),
                        Card('', 363, 1632, 1 /* ICE */),
                        Card('', 499, 1224, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 549, 1098, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 12', 'p012', 0, 1, 16, [
                        Card('', 438, 1621, 1 /* ICE */),
                        Card('', 377, 1777, 1 /* ICE */),
                        Card('', 438, 1621, 1 /* ICE */),
                        Card('', 333, 1909, 1 /* ICE */),
                        Card('', 393, 1767, 1 /* ICE */),
                        Card('', 589, 1179, 1 /* ICE */),
                        Card('', 492, 1476, 1 /* ICE */, "F" /* FAIRY */)
                    ])
                ],
                [
                    Battle('Water Dungeon 13', 'p001', 0, 1, 17, [
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 14', 'p002', 0, 1, 18, [
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 15', 'p003', 0, 1, 19, [
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 16', 'p004', 0, 1, 20, [
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 17', 'p005', 0, 1, 21, [
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 18', 'p006', 0, 1, 22, [
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 19', 'p007', 0, 1, 23, [
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 20', 'p008', 0, 1, 24, [
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 21', 'p009', 0, 1, 25, [
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 22', 'p010', 0, 1, 26, [
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 23', 'p011', 0, 1, 27, [
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 24', 'p012', 0, 1, 28, [
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */),
                        Card('', 0, 0, 1 /* ICE */)
                    ])
                ],
                [
                    Battle('Water Dungeon 25', 'p001', 0, 1, 29, [
                        Card('', 1390, 2770, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1457, 2564, 1 /* ICE */),
                        Card('', 1360, 2840, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1528, 2356, 1 /* ICE */),
                        Card('', 1365, 2840, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1088, 3671, 1 /* ICE */),
                        Card('', 1459, 2563, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 26', 'p002', 0, 1, 30, [
                        Card('', 1272, 3502, 1 /* ICE */),
                        Card('', 1437, 3017, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1528, 2734, 1 /* ICE */),
                        Card('', 1534, 2746, 1 /* ICE */),
                        Card('', 1140, 3905, 1 /* ICE */),
                        Card('', 1535, 2720, 1 /* ICE */),
                        Card('', 1231, 3655, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 27', 'p003', 0, 1, 31, [
                        Card('', 1677, 2653, 1 /* ICE */),
                        Card('', 1193, 4142, 1 /* ICE */),
                        Card('', 1519, 3157, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1514, 3142, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1614, 2879, 1 /* ICE */),
                        Card('', 1614, 2879, 1 /* ICE */),
                        Card('', 1270, 3874, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 28', 'p004', 0, 1, 32, [
                        Card('', 1240, 4355, 1 /* ICE */),
                        Card('', 1245, 4379, 1 /* ICE */),
                        Card('', 1584, 3352, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1670, 3082, 1 /* ICE */),
                        Card('', 1581, 3371, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1372, 3988, 1 /* ICE */),
                        Card('', 1582, 3346, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 29', 'p005', 0, 1, 33, [
                        Card('', 1653, 3548, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1298, 4616, 1 /* ICE */),
                        Card('', 1422, 4234, 1 /* ICE */, null, 21 /* HEAL_4 */),
                        Card('', 1744, 3262, 1 /* ICE */),
                        Card('', 1772, 3194, 1 /* ICE */),
                        Card('', 1745, 3265, 1 /* ICE */, null, 17 /* FREEZE */),
                        Card('', 1649, 3547, 1 /* ICE */, "F" /* FAIRY */)
                    ]),
                    Battle('Water Dungeon 30', 'p006', 0, 1, 34, [
                        Card('', 1224, 5216, 1 /* ICE */),
                        Card('', 1850, 3550, 1 /* ICE */),
                        Card('', 1817, 3442, 1 /* ICE */, null, 17 /* FREEZE */),
                        Card('', 1818, 3445, 1 /* ICE */),
                        Card('', 1350, 4850, 1 /* ICE */),
                        Card('', 1715, 3745, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1920, 3139, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 31', 'p007', 0, 1, 35, [
                        Card('', 1522, 4720, 1 /* ICE */, null, 21 /* HEAL_4 */),
                        Card('', 1787, 3878, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1781, 3943, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1773, 3919, 1 /* ICE */),
                        Card('', 1918, 3485, 1 /* ICE */),
                        Card('', 1889, 3619, 1 /* ICE */, null, 17 /* FREEZE */),
                        Card('', 1880, 3598, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 32', 'p008', 0, 1, 36, [
                        Card('', 1997, 3644, 1 /* ICE */),
                        Card('', 1860, 4055, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1572, 4966, 1 /* ICE */),
                        Card('', 1840, 4120, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1997, 3644, 1 /* ICE */),
                        Card('', 1847, 4141, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1954, 3778, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 33', 'p009', 0, 1, 37, [
                        Card('', 2150, 3601, 1 /* ICE */),
                        Card('', 1932, 4232, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1912, 4336, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 2029, 3961, 1 /* ICE */),
                        Card('', 2075, 3800, 1 /* ICE */),
                        Card('', 2034, 3973, 1 /* ICE */, null, 17 /* FREEZE */),
                        Card('', 2029, 3961, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 34', 'p010', 0, 1, 38, [
                        Card('', 2230, 3760, 1 /* ICE */),
                        Card('', 2154, 3959, 1 /* ICE */),
                        Card('', 2106, 4150, 1 /* ICE */, null, 17 /* FREEZE */),
                        Card('', 1593, 5674, 1 /* ICE */),
                        Card('', 1553, 5762, 1 /* ICE */),
                        Card('', 1978, 4534, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 2103, 4144, 1 /* ICE */)
                    ]),
                    Battle('Water Dungeon 35', 'p011', 0, 1, 39, [
                        Card('', 1640, 5938, 1 /* ICE */),
                        Card('', 2233, 4115, 1 /* ICE */),
                        Card('', 2044, 4732, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 2177, 4327, 1 /* ICE */),
                        Card('', 2076, 4586, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 1721, 5698, 1 /* ICE */, null, 21 /* HEAL_4 */),
                        Card('', 2043, 4729, 1 /* ICE */, "F" /* FAIRY */)
                    ]),
                    Battle('Water Dungeon 36', 'p012', 0, 1, 40, [
                        Card('', 3027, 5353, 1 /* ICE */),
                        Card('', 2953, 5558, 1 /* ICE */),
                        Card('', 2828, 5923, 1 /* ICE */, null, 17 /* FREEZE */),
                        Card('', 2058, 8263, 1 /* ICE */),
                        Card('', 2086, 8159, 1 /* ICE */),
                        Card('', 2634, 6502, 1 /* ICE */, "F" /* FAIRY */),
                        Card('', 2639, 6517, 1 /* ICE */)
                    ])
                ]
            ],
            /* EARTH */
            [
                [
                    Battle('Earth Dungeon 1', 'p001', 0, 1, 5, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 2', 'p002', 0, 1, 6, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 3', 'p003', 0, 1, 7, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 4', 'p004', 0, 1, 8, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 5', 'p005', 0, 1, 9, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 6', 'p006', 0, 1, 10, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 7', 'p007', 0, 1, 11, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 8', 'p008', 0, 1, 12, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 9', 'p009', 0, 1, 13, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 10', 'p010', 0, 1, 14, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 11', 'p011', 0, 1, 15, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 12', 'p012', 0, 1, 16, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ])
                ],
                [
                    Battle('Earth Dungeon 13', 'p001', 0, 1, 17, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 14', 'p002', 0, 1, 18, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 15', 'p003', 0, 1, 19, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 16', 'p004', 0, 1, 20, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 17', 'p005', 0, 1, 21, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 18', 'p006', 0, 1, 22, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 19', 'p007', 0, 1, 23, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 20', 'p008', 0, 1, 24, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 21', 'p009', 0, 1, 25, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 22', 'p010', 0, 1, 26, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 23', 'p011', 0, 1, 27, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 24', 'p012', 0, 1, 28, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ])
                ],
                [
                    Battle('Earth Dungeon 25', 'p001', 0, 1, 29, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 26', 'p002', 0, 1, 30, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 27', 'p003', 0, 1, 31, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 28', 'p004', 0, 1, 32, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 29', 'p005', 0, 1, 33, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 30', 'p006', 0, 1, 34, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 31', 'p007', 0, 1, 35, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 32', 'p008', 0, 1, 36, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 33', 'p009', 0, 1, 37, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 34', 'p010', 0, 1, 38, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 35', 'p011', 0, 1, 39, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ]),
                    Battle('Earth Dungeon 36', 'p012', 0, 1, 40, [
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */),
                        Card('', 0, 0, 2 /* EARTH */)
                    ])
                ]
            ],
            /* LIGHT */
            [
                [
                    Battle('Light Dungeon 1', 'p001', 0, 1, 5, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 2', 'p002', 0, 1, 6, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 3', 'p003', 0, 1, 7, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 4', 'p004', 0, 1, 8, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 5', 'p005', 0, 1, 9, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 6', 'p006', 0, 1, 10, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 7', 'p007', 0, 1, 11, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 8', 'p008', 0, 1, 12, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 9', 'p009', 0, 1, 13, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 10', 'p010', 0, 1, 14, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 11', 'p011', 0, 1, 15, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 12', 'p012', 0, 1, 16, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ])
                ],
                [
                    Battle('Light Dungeon 13', 'p001', 0, 1, 17, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 14', 'p002', 0, 1, 18, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 15', 'p003', 0, 1, 19, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 16', 'p004', 0, 1, 20, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 17', 'p005', 0, 1, 21, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 18', 'p006', 0, 1, 22, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 19', 'p007', 0, 1, 23, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 20', 'p008', 0, 1, 24, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 21', 'p009', 0, 1, 25, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 22', 'p010', 0, 1, 26, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 23', 'p011', 0, 1, 27, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 24', 'p012', 0, 1, 28, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ])
                ],
                [
                    Battle('Light Dungeon 25', 'p001', 0, 1, 29, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 26', 'p002', 0, 1, 30, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 27', 'p003', 0, 1, 31, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 28', 'p004', 0, 1, 32, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 29', 'p005', 0, 1, 33, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 30', 'p006', 0, 1, 34, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 31', 'p007', 0, 1, 35, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 32', 'p008', 0, 1, 36, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 33', 'p009', 0, 1, 37, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 34', 'p010', 0, 1, 38, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 35', 'p011', 0, 1, 39, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ]),
                    Battle('Light Dungeon 36', 'p012', 0, 1, 40, [
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */),
                        Card('', 0, 0, 3 /* LIGHT */)
                    ])
                ]
            ],
            /* DARK */
            [
                [
                    Battle('Dark Dungeon 1', 'p001', 0, 1, 5, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 2', 'p002', 0, 1, 6, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 3', 'p003', 0, 1, 7, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 4', 'p004', 0, 1, 8, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 5', 'p005', 0, 1, 9, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 6', 'p006', 0, 1, 10, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 7', 'p007', 0, 1, 11, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 8', 'p008', 0, 1, 12, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 9', 'p009', 0, 1, 13, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 10', 'p010', 0, 1, 14, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 11', 'p011', 0, 1, 15, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 12', 'p012', 0, 1, 16, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ])
                ],
                [
                    Battle('Dark Dungeon 13', 'p001', 0, 1, 17, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 14', 'p002', 0, 1, 18, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 15', 'p003', 0, 1, 19, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 16', 'p004', 0, 1, 20, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 17', 'p005', 0, 1, 21, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 18', 'p006', 0, 1, 22, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 19', 'p007', 0, 1, 23, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 20', 'p008', 0, 1, 24, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 21', 'p009', 0, 1, 25, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 22', 'p010', 0, 1, 26, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 23', 'p011', 0, 1, 27, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 24', 'p012', 0, 1, 28, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ])
                ],
                [
                    Battle('Dark Dungeon 25', 'p001', 0, 1, 29, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 26', 'p002', 0, 1, 30, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 27', 'p003', 0, 1, 31, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 28', 'p004', 0, 1, 32, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 29', 'p005', 0, 1, 33, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 30', 'p006', 0, 1, 34, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 31', 'p007', 0, 1, 35, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 32', 'p008', 0, 1, 36, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 33', 'p009', 0, 1, 37, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 34', 'p010', 0, 1, 38, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 35', 'p011', 0, 1, 39, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ]),
                    Battle('Dark Dungeon 36', 'p012', 0, 1, 40, [
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */),
                        Card('', 0, 0, 4 /* DARK */)
                    ])
                ]
            ]
        ]
    };
}
function parseCard(element) {
    let card = $(element);
    let name = card.find('.p-name p').text();
    let attack = ~~card.find('.p-attack').text();
    let defense = ~~card.find('.p-shield').text();
    let color = getColor(card);
    let set = getSet(card);
    let spell = getSpell(card);
    console.log(set);
    return Card(name, attack, defense, color, set, spell);
}
function getColor(element) {
    if (element.hasClass('fire'))
        return 0 /* FIRE */;
    else if (element.hasClass('ice'))
        return 1 /* ICE */;
    else if (element.hasClass('earth'))
        return 2 /* EARTH */;
    else if (element.hasClass('light'))
        return 3 /* LIGHT */;
    else if (element.hasClass('dark'))
        return 4 /* DARK */;
    return null;
}
function getSet(element) {
    let set = element.find('.set .icon').text();
    if (set)
        return set;
    else
        return null;
}
function getSpell(element) {
    let effect = element.find('.artifact .desc, .effect .desc').text().split(':')[0];
    switch (effect) {
        case 'Aegis': return 0 /* AEGIS */;
        case 'Allied Strike': return 1 /* ALLIED_STRIKE */;
        case 'Backstab': return 2 /* BACKSTAB */;
        case 'Chilling Touch': return 8 /* CHILLING_TOUCH */;
        case 'Confusion': return 9 /* CONFUSION */;
        case 'Curse': return 10 /* CURSE */;
        case 'Fluch': return 10 /* CURSE */;
        case 'Fear Blow': return 11 /* FEAR_BLOW */;
        case 'Fireball': return 15 /* FIREBALL_4 */;
        case 'Feuerball': return 15 /* FIREBALL_4 */;
        case 'Fireball I': return 12 /* FIREBALL_1 */;
        case 'Fireball II': return 13 /* FIREBALL_2 */;
        case 'Fireball III': return 14 /* FIREBALL_3 */;
        case 'Fireball IV': return 15 /* FIREBALL_4 */;
        case 'Fireball V': return 16 /* FIREBALL_5 */;
        case 'Freeze': return 17 /* FREEZE */;
        case 'Heal': return 21 /* HEAL_4 */;
        case 'Heilung': return 21 /* HEAL_4 */;
        case 'Heal I': return 18 /* HEAL_1 */;
        case 'Heal II': return 19 /* HEAL_2 */;
        case 'Heal III': return 20 /* HEAL_3 */;
        case 'Heal IV': return 21 /* HEAL_4 */;
        case 'Heal V': return 22 /* HEAL_5 */;
        case 'Lovers Dream': return 24 /* LOVERS_DREAM */;
        case 'Lucky Dodge': return 26 /* LUCKY_DODGE */;
        case 'Lucky Heal': return 25 /* LUCKY_HEAL */;
        case 'Lucky Spell': return 27 /* LUCKY_SPELL */;
        case 'Lucky Strike': return 28 /* LUCKY_STRIKE */;
        case 'Poison': return 29 /* POISON */;
        case 'Rage': return 33 /* RAGE_4 */;
        case 'Wut': return 33 /* RAGE_4 */;
        case 'Rage I': return 30 /* RAGE_1 */;
        case 'Rage II': return 31 /* RAGE_2 */;
        case 'Rage III': return 32 /* RAGE_3 */;
        case 'Rage IV': return 33 /* RAGE_4 */;
        case 'Rage V': return 34 /* RAGE_5 */;
        case 'Resurrect': return 35 /* RESURRECT */;
        case 'Retribution': return 36 /* RETRIBUTION */;
        case 'Shield': return 40 /* SHIELD_4 */;
        case 'Shield I': return 37 /* SHIELD_1 */;
        case 'Shield II': return 38 /* SHIELD_2 */;
        case 'Shield III': return 39 /* SHIELD_3 */;
        case 'Shield IV': return 40 /* SHIELD_4 */;
        case 'Shield V': return 41 /* SHIELD_5 */;
        case 'Vengeance Song': return 43 /* VENGEANCE_SONG */;
        case 'Vengeance Strike': return 44 /* VENGEANCE_STRIKE */;
        default:
            console.log('unable to find spell:', effect);
    }
    return null;
}
function getHealth(level) {
    let health = 205;
    let add = 7;
    for (let l = 1; level > l; l++) {
        health += add;
        if (l % 2 === 0) {
            add += 2;
        }
    }
    return health;
}
function calcWinchances(enemies, deck, heroLife, enemyLife, rules = 0 /* CAMPAIGN */) {
    if (worker)
        worker.terminate();
    let ret = new Promise((resolve, reject) => {
        if (enemies && enemies.length && deck) {
            worker = new Worker(scriptURL);
            worker.onmessage = function (e) {
                console.log(e.data);
                resolve(e.data);
                worker = null;
            };
            worker.onerror = function (e) {
                console.log(e);
                reject('error');
            };
            let postData = {
                'enemies': enemies,
                'deck': deck,
                'rules': rules,
                'heroLife': 1928,
                'enemyLife': enemyLife
            };
            worker.postMessage(postData);
        }
        else {
            reject(enemies && enemies.length ? 'deck' : 'enemies');
        }
    });
    return ret;
}
function save() {
    localStorage.setItem('storage', JSON.stringify(storage));
}
function load() {
    storage = JSON.parse(localStorage.getItem('storage'));
    if (!storage) {
        storage = {
            refBattleSelector: null,
            decks: [null, null, null],
            deckStrengths: [0, 0, 0],
            playerLevel: 1
        };
    }
}
function initBattleScript() {
    window.URL = window.URL || window.webkitURL;
    let script = `function Fighter(card){return Object.assign({},card,{life:card.defense,strength:card.attack,frozen:!1,poisoned:!1,silent:!1,dreaming:!1,spellCast:!1,armor:0})}function isEffective(a,b){switch(b.color){case 3:return 4===a.color;case 4:return 3===a.color;case 2:return 0===a.color;case 0:return 1===a.color;case 1:return 2===a.color}return!1}function duel(enemyCards,heroCards,enemyLife,heroLife){let enemyFighters=enemyCards.map(card=>Fighter(card)),heroFighters=heroCards.map(card=>Fighter(card)),enemyGroup=[null,null,null],heroGroup=[null,null,null],i;for(i=0;i<3;i++)enemyGroup[i]=enemyFighters.shift(),heroGroup[i]=heroFighters.shift();loop:for(;enemyLife>0&&heroLife>0;){let hAlive=3,eAlive=3;for(i=0;i<3;i++)enemyGroup[i].life<=0&&(enemyFighters.length?enemyGroup[i]=enemyFighters.shift():eAlive--),heroGroup[i].life<=0&&(heroFighters.length?heroGroup[i]=heroFighters.shift():hAlive--);if(0===hAlive)heroLife=0;else if(0===eAlive)enemyLife=0;else for(i=0;i<3;i++){let spellEnemy=enemyGroup[i].life>0&&!enemyGroup[i].silent&&!enemyGroup[i].frozen&&!enemyGroup[i].spellCast?enemyGroup[i].spell:null,spellHero=heroGroup[i].life>0&&!heroGroup[i].silent&&!heroGroup[i].frozen&&!heroGroup[i].spellCast?heroGroup[i].spell:null;if(null!==spellEnemy&&castPreFightSpell(spellEnemy,enemyGroup,heroGroup,i),null!==spellHero&&castPreFightSpell(spellHero,heroGroup,enemyGroup,i),enemyGroup[i].life>0){if(heroGroup[i].life>0){let enemyDamage=enemyGroup[i].strength,heroDamage=heroGroup[i].strength;enemyGroup[i].frozen?enemyDamage=0:isEffective(enemyGroup[i],heroGroup[i])&&(enemyDamage=Math.floor(1.5*enemyDamage)),heroGroup[i].frozen?heroDamage=0:isEffective(heroGroup[i],enemyGroup[i])&&(heroDamage=Math.floor(1.5*heroDamage)),enemyGroup[i].life-=heroDamage,heroGroup[i].life-=enemyDamage}else if((heroLife-=enemyGroup[i].strength)<=0)break loop}else if(heroGroup[i].life>0&&(enemyLife-=heroGroup[i].strength)<=0)break loop;enemyGroup[i].frozen=!1,heroGroup[i].frozen=!1}}if(heroLife<=0)return{stars:0,livingEnemyCards:[enemyGroup[0].life>0,enemyGroup[1].life>0,enemyGroup[2].life>0]};let livingFighters=0;for(i=0;i<3;i++)heroGroup[i].life>0&&livingFighters++;return{stars:livingFighters=Math.min(3,livingFighters+heroFighters.length),livingHeroCards:[heroGroup[0].life>0,heroGroup[1].life>0,heroGroup[2].life>0]}}function castPreFightSpell(spell,team,enemies,index){switch(spell){case 0:for(let i=0;i<3;i++)team[i].armor+=.2;team[index].spellCast=!0;break;case 1:{let dmg=0;for(let i=0;i<3;i++)dmg+=team[i].strength;enemies[index].life-=dmg,team[index].spellCast=!0}break;case 2:for(let i=0;i<3;i++)enemies[i].life-=Math.floor(.15*enemies[i].defense);break;case 3:case 4:case 5:case 6:case 7:break;case 8:for(let i=0;i<3;i++)enemies[i].strength=Math.ceil(.9*enemies[i].strength);break;case 9:break;case 10:enemies[index].strength=Math.ceil(.8*enemies[index].strength);break;case 11:enemies[index].life-=Math.floor(.3*enemies[index].life);break;case 12:case 13:case 14:case 15:case 16:{let rate=0;switch(spell){case 12:rate=.1;break;case 13:rate=.2;break;case 14:rate=.35;break;case 15:rate=.5;break;case 16:rate=.65}let dmg=Math.floor(team[index].strength*rate);for(let i=0;i<3;i++)enemies[i].life-=dmg;team[index].spellCast=!0}break;case 17:enemies[index].frozen=!0,team[index].spellCast=!0;break;case 18:case 19:case 20:case 21:case 22:{let rate=0;switch(spell){case 18:rate=.1;break;case 19:rate=.2;break;case 20:rate=.3;break;case 21:rate=.4;break;case 22:rate=.5}for(let i=0;i<3;i++)team[i].life>0&&(team[i].life+=Math.floor(team[i].defense*rate),team[i].life>team[i].defense&&(team[i].life=team[i].defense));team[index].spellCast=!0}break;case 26:case 25:case 27:case 28:break;case 29:enemies[index].poisoned=!0,team[index].spellCast=!0;break;case 30:case 31:case 32:case 33:case 34:{let rate=0;switch(spell){case 30:rate=.05;break;case 31:rate=.1;break;case 32:rate=.15;break;case 33:rate=.2;break;case 34:rate=.3}team[index].strength+=Math.floor(team[index].strength*rate)}break;case 37:case 38:case 39:case 40:case 41:{let rate=0;switch(spell){case 37:rate=.15;break;case 38:rate=.2;break;case 39:rate=.25;break;case 40:rate=.3;break;case 41:rate=.4}team[index].armor+=rate,team[index].spellCast=!0}break;case 43:for(let i=0;i<3;i++)team[i].strength+=Math.floor(.15*team[i].strength);team[index].spellCast=!0}}function calcWinchances(data){console.log(data);let winCount=[0,0,0],livingHeroes=[0,0,0,0,0,0,0],livingEnemies=[0,0,0],games=0;switch(data.rules){case 0:for(let a=0;a<7;a++)for(let b=0;b<7;b++)for(let c=0;c<7;c++){if(a===b||a===c||b===c)continue;let result=duel(data.enemies,[data.deck[a],data.deck[b],data.deck[c]],data.enemyLife,data.heroLife);switch(result.stars){case 3:winCount[2]++;case 2:winCount[1]++;case 1:winCount[0]++}result.livingHeroCards&&(result.livingHeroCards[0]&&livingHeroes[a]++,result.livingHeroCards[1]&&livingHeroes[b]++,result.livingHeroCards[2]&&livingHeroes[c]++),result.livingEnemyCards&&(result.livingEnemyCards[0]&&livingEnemies[0]++,result.livingEnemyCards[1]&&livingEnemies[1]++,result.livingEnemyCards[2]&&livingEnemies[2]++),games++}}return 0===games?{starChances:[-999,-999,-999]}:{starChances:winCount.map(i=>Math.round(i/games*1e4)/100),heroLivingChances:livingHeroes.map(i=>i/games),enemyLivingChances:livingEnemies.map(i=>i/games)}}self.onmessage=e=>{let data=e.data;postMessage(calcWinchances(data)),self.close()};`;
    let blob = new Blob([script], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
}
load();
initBattles();
function wait(callback, test = () => !document.querySelector('.cssloader'), time = 100) {
    setTimeout(() => {
        if (test())
            callback();
        else
            wait(callback, test, time);
    }, time);
}
function round(v, f) {
    return Math.round(v * Math.pow(10, f)) / Math.pow(10, f);
}
wait(() => {
    updateView();
    if (DEBUG) {
        let debugPanel = $('<div id="DEBUG-PANEL"></div>');
        debugPanel.css('position', 'fixed');
        debugPanel.css('top', '20px');
        debugPanel.css('left', '20px');
        debugPanel.css('width', '300px');
        debugPanel.css('height', '400px');
        debugPanel.css('padding', '20px');
        debugPanel.css('background-color', 'rgba(255,255,255, 0.2)');
        debugPanel.css('z-index', '100');
        debugPanel.css('overflow', 'scroll');
        debugPanel.css('text-align', 'left');
        debugPanel.hover(function () {
            $(this).css("background-color", "rgba(255,255,255, 0.8");
        }, function () {
            $(this).css("background-color", "rgba(255,255,255, 0.2");
        });
        let deck1Span = $('<span></span>');
        let deck2Span = $('<span></span>');
        let deck3Span = $('<span></span>');
        let locationSpan = $('<span></span>');
        debugPanel.append($('<table></table>').append($('<tr></tr>').append($('<td>Deck1:</td>')).append($('<td></td>').append(deck1Span)))
            .append($('<tr></tr>').append($('<td>Deck2:</td>')).append($('<td></td>').append(deck2Span)))
            .append($('<tr></tr>').append($('<td>Deck3:</td>')).append($('<td></td>').append(deck3Span)))
            .append($('<tr></tr>').append($('<td>Location:</td>')).append($('<td></td>').append(locationSpan))));
        debugPanel.find('td').css('padding', '10px');
        setInterval(() => {
            deck1Span.text(JSON.stringify(storage.decks[0]));
            deck2Span.text(JSON.stringify(storage.decks[1]));
            deck3Span.text(JSON.stringify(storage.decks[2]));
            locationSpan.text(JSON.stringify(currentLocation));
        }, 100);
        $(document.body).append(debugPanel);
    }
}, () => !!document.querySelector('#root[style*="display: block"]'));
