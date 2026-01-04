// ==UserScript==
// @name         GC Cheat! Helper
// @namespace    https://greasyfork.org/en/users/1175371
// @version      1.8
// @description  Adds play history for the current round and pile contents to the game Cheat! on Grundo's Cafe
// @author       sanjix
// @match        https://www.grundos.cafe/games/cheat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507890/GC%20Cheat%21%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/507890/GC%20Cheat%21%20Helper.meta.js
// ==/UserScript==
(function() {
    //'use strict';

    function CheatGameData(cards, plays, yourOldHand) {
        this.cards = cards;
        this.plays = plays;
        this.yourOldHand = yourOldHand;
    }
    var cheatGameData;
    if (localStorage.cheatGameData == undefined) {
        cheatGameData = new CheatGameData([],[],[]);
        localStorage.setItem('cheatGameData', JSON.stringify(new CheatGameData([],[],[])));
    } else {
        cheatGameData = JSON.parse(localStorage.getItem('cheatGameData'));
    }
    console.log('page loaded');
    var cheatRoundCards = cheatGameData.cards;
    var cheatRoundPlays = cheatGameData.plays;
    var pileStatus = document.querySelector('#cheat-cast + p');
    var pileContents = document.createElement('p');
    var returnToHome = document.querySelector('#cheat-cast ~ #cheat-cards ~ p.center ~ div.button-group');
    var playHistory = document.createElement('div');

    var playersCardCounts = document.querySelectorAll('#cheat-cast .cheat-player b');
    var areAllEqual = true;
    var yourCardCount = document.querySelectorAll('#cheat-cards .cheat-card img.arrow.hide').length;
    if (playersCardCounts.length > 0) {
        if (Number(playersCardCounts[0].textContent) != yourCardCount) {
            areAllEqual = false;
        } else {
            for (i = 1; i < playersCardCounts.length; i++) {
                if (playersCardCounts[i].textContent != playersCardCounts[0].textContent) {
                    areAllEqual = false;
                    break;
                }
            }
        }

        if ((pileStatus.textContent.match(/(\d+)/)[0] == '0') && (areAllEqual) && (cheatRoundPlays.length > 0)) {
            var button = document.createElement('input');
            button.type = 'button';
            button.value = 'Reset Script Game Data?'
            button.addEventListener('click', () => {
                if (confirm('Are you sure? This will reset all script game play history and pile contents.')) {
                    localStorage.setItem('cheatGameData', JSON.stringify(new CheatGameData([],[],[])));
                    location.reload();
                }
            })
            pileStatus.after(button);
        }
    }

    function Play(player, cards, accused, innocence) {
        this.player = player;
        this.cards = cards;
        this.accused = accused;
        this.innocence = innocence;
    }

    function updatePlayHistory(plays) {
        var exceptLatest = plays.slice(0,plays.length - 1);
        exceptLatest.forEach((play) => {
            let cur = document.createElement('p');
            //console.log(play);
            cur.innerHTML = play.player + ' played <b>' + play.cards.join(', ') + '</b>.';
            let pronounObj = play.player == 'You' ? 'you' : 'them';
            let pronounSub = play.player == 'You' ? 'you' : 'they';
            if (play.accused != null) {
                cur.innerHTML += ' ' + play.accused + ' ';
                if (play.innocence) {
                    cur.innerHTML += 'accused ' + pronounObj + ' but ' + pronounSub + ' weren\'t cheating!';
                } else {
                    cur.innerHTML += 'caught ' + pronounObj + ' cheating!';
                }
            } else {
                cur.innerHTML += ' No one accused ' + pronounObj + ' of cheating.';
            }
            playHistory.prepend(cur);
        });
    }

    function updateInfo(cards, plays) {
         //console.log(cards);
         //console.log(plays);
        cheatGameData.cards = cards;
        cheatGameData.plays = plays;
        localStorage.setItem('cheatGameData', JSON.stringify(cheatGameData));
        cheatRoundCards = cards;
        cheatRoundPlays = plays;
    }

    function buildPlayedCards(quant, card) {
        let playedCards = []
        for (let i = 0; i < quant; i++) {
            playedCards.push(card);
        }
        return playedCards;
    }

    function parsePlay(text) {
        let parsed = text.match(/(.*?) Played (\d) (\w+)$/);
        let cards = []
        switch (parsed[3]) {
            case 'Ace':
            case 'Aces':
                cards = buildPlayedCards(parsed[2], 'A');
                break;
            case 'Two':
            case 'Twos':
                cards = buildPlayedCards(parsed[2], '2');
                break;
            case 'Three':
            case 'Threes':
                cards = buildPlayedCards(parsed[2], '3');
                break;
            case 'Four':
            case 'Fours':
                cards = buildPlayedCards(parsed[2], '4');
                break;
            case 'Five':
            case 'Fives':
                cards = buildPlayedCards(parsed[2], '5');
                break;
            case 'Six':
            case 'Sixes':
                cards = buildPlayedCards(parsed[2], '6');
                break;
            case 'Seven':
            case 'Sevens':
                cards = buildPlayedCards(parsed[2], '7');
                break;
            case 'Eight':
            case 'Eights':
                cards = buildPlayedCards(parsed[2], '8');
                break;
            case 'Nine':
            case 'Nines':
                cards = buildPlayedCards(parsed[2], '9');
                break;
            case 'Ten':
            case 'Tens':
                cards = buildPlayedCards(parsed[2], '10');
                break;
            case 'Jack':
            case 'Jacks':
                cards = buildPlayedCards(parsed[2], 'J');
                break;
            case 'Queen':
            case 'Queens':
                cards = buildPlayedCards(parsed[2], 'Q');
                break;
            case 'King':
            case 'Kings':
                cards = buildPlayedCards(parsed[2], 'K');
                break;
        }
        return new Play(parsed[1], cards, null, null);
    }

    function objection(play, accusedBy, innocence) {
        play.accused = accusedBy;
        play.innocence = innocence;
        //console.log('someone objected to:');
        //console.log(play);
        if ((play.player == 'You') && (play.innocence == false)) {
            console.log('oh no the cheater was you!');
            play.cards = ['something'];
        }
        return play;
    }

    function getHand(hand) {
    //input ex "12_diamonds,11_hearts"
        document.querySelectorAll('#cheat-cards .cheat-card i.cheat-arrow.hide').forEach((card) => {
            //console.log(card.id);
            switch (card.id.split('_')[1]) {
                case '11':
                    hand.push('J');
                    break;
                case '12':
                    hand.push('Q');
                    break;
                case '13':
                    hand.push('K');
                    break;
                case '14':
                    hand.push('A');
                    break
                default:
                    hand.push(card.id.split('_')[1]);
                    break;
            }
        });
            return hand;
    }

    function handToObj(hand) {
        let handObj = {};
        hand.forEach((card) => {
            handObj[card] = (handObj[card] || 0) + 1;
        });
        return handObj;
    }

    function subtractHands(a, b){
        let result = {};
        for (let card in a) {
            result[card] = Math.max(a[card] - (b[card] || 0), 0);
        }
        return result;
    }

    var currentPlay = document.querySelector('#cheat-cards + p strong');
    var yourTurn = document.querySelector('form[action="/games/cheat/play/"]');

    if (currentPlay != null) {
        cheatGameData = JSON.parse(localStorage.getItem('cheatGameData'));
        cheatRoundCards = cheatGameData.cards;
        cheatRoundPlays = cheatGameData.plays;
        if ((yourTurn != null) && (document.querySelector('select[name="card_type"]') != null)) {
            console.log('it\'s your turn!');
            cheatGameData.yourOldHand = getHand([]);
            //localStorage.setItem('cheatGameData',JSON.stringify(cheatGameData.yourOldHand));
            cheatRoundPlays.push(new Play('You', [], null, null));
            updateInfo(cheatRoundCards, cheatRoundPlays);
        } else {
            console.log('it\'s not your turn!');
            var storedHand = cheatGameData.yourOldHand;
            let hand = getHand([]);
            let playedCards = [];
            let lastPlay = cheatRoundPlays.at(-1) || 0;
            console.log(hand);
            console.log(storedHand);
            console.log(lastPlay.player);
            if ((JSON.stringify(hand) != JSON.stringify(storedHand)) && (lastPlay.player == 'You')) {
            //if (lastPlay.player == 'You') {
                console.log('it was just your turn');
                let storedHandObj = handToObj(storedHand);
                let curHandObj = handToObj(hand);
                if (hand.length < storedHand.length) {
                    console.log('figuring out what cards you played');
                    for (var i in storedHandObj) {
                        var curHandCount = curHandObj[i] || 0;
                        if (storedHandObj[i] != curHandCount) {
                            for (let j = 0; j < storedHandObj[i] - curHandCount; j++) {
                                playedCards.push(i);
                            }
                        }
                    }
                } else {
                    playedCards.push('something');
                }
                if (lastPlay.accused == null) {
                    cheatRoundCards = cheatRoundCards.concat(playedCards);
                }
                cheatRoundPlays.at(-1).cards = playedCards;
                updateInfo(cheatRoundCards, cheatRoundPlays);
                pileContents.textContent = JSON.parse(localStorage.getItem('cheatGameData')).plays.join(', ');
                pileStatus.after(pileContents);
                updatePlayHistory(cheatRoundPlays);
                //console.log(playHistory);
            }
            let cur = parsePlay(currentPlay.textContent);
            //console.log(cur);
            cheatRoundCards = cheatRoundCards.concat(cur.cards);
            //console.log(cheatRoundCards);
            cheatRoundPlays.push(cur);
            updateInfo(cheatRoundCards, cheatRoundPlays);
        }
    }

    var cheating = document.evaluate(
        '//p[contains(.,"caught")]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null).singleNodeValue;
    var accused = document.evaluate(
        '//p[contains(.,"accused")][contains(strong,"NOT CHEATING")]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null).singleNodeValue;

    function accusationHelper(text, match, innocence) {
        let lastPlay = cheatRoundPlays.pop();
        cheatRoundPlays.push(objection(lastPlay, text.match(match)[1], innocence));
        updateInfo([], cheatRoundPlays);
        //console.log(cheatGameData);
        //console.log(JSON.parse(localStorage.getItem('cheatGameData')));
    }

    if (cheating != null) {
        console.log('someone\'s a cheater');
        //they cheated
        accusationHelper(cheating.textContent, /^(.*?) caught/, false);

    } else if (accused != null) {
        console.log('no one cheated tho');
        //they didn't cheat tho
        accusationHelper(accused.textContent, /^(.*?) accused \w+/, true);
    }

    if (pileStatus != null) {
        pileContents.textContent = JSON.parse(localStorage.getItem('cheatGameData')).cards.join(', ');
        pileStatus.after(pileContents);
        updatePlayHistory(cheatRoundPlays);
        // console.log(playHistory);
        returnToHome.after(playHistory);
    }

    if ((document.evaluate(
        '//p[contains(.,"You have won") or contains(.,"won this round")]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null).singleNodeValue != null
    ) || (document.querySelector('input[value="Start a New Game"]') != null)) {
        console.log('resetting for new game');
        updateInfo([],[]);
    }
})();