// ==UserScript==
// @name         Grundos Cafe Solitaire Tracker
// @license      GPL 3.0
// @namespace    https://greasyfork.org/en/users/1272286-wreckstation
// @version      1.4.1
// @description  Track the cards you've seen in the deck in GC's Sakhmet Solitaire.
// @author       Dij
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @match        https://www.grundos.cafe/games/sakhmet_solitaire/
// @match        https://grundos.cafe/games/sakhmet_solitaire/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @connect      https://www.grundos.cafe/games/sakhmet_solitaire/
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/492633/Grundos%20Cafe%20Solitaire%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/492633/Grundos%20Cafe%20Solitaire%20Tracker.meta.js
// ==/UserScript==

/*global $*/
//blank blank 2 3 4 5 6 7 8 9 10 J Q K A
const UNK_DECK = [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
const RANK_DICT = ['?', '?', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUIT_SYM = ['?','♠','♥','♥','♣'];
const SUIT_DICT = {"spades":'♠', "hearts":'♥', "diamonds":'♦', "clubs":'♣'};
const CARD_RE = /(?<rank>[0-9]?[0-9])_(?<suit>[a-z]+)$/;
var deck;
var hand;

function init() {
    /*Initialize deck. 28 cards are on the table, 21 in the deck, 3 in hand.*/
    GM_deleteValue("deck");
    GM_deleteValue("hand");
    GM_setValue("deck", Array(21).fill({rank:'?', suit:'?'}));
    GM_setValue("hand", Array(3).fill({rank:'?', suit:'?'}));
}

function cardToString(card) {
    if(card) {
        if(card.rank == '?') {
            return "<span class=\"unkcard\">🂠</span>";
        }
        var str = `${card.rank}${card.suit}`;
        if (card.suit == '♥' || card.suit == '♦') {
            str = `<span class="b r">${str}</span>`;
        } else {
            str = `<span class="b">${str}</span>`;
        }
        return str.toString();
    } else {
        return "<span class=\"b\" style=\"color:lawngreen;font-weight:bold;\">◯</span>";
    }
}

function stackToString(stack, marksize, offset, preview) {
    // Turn diamonds and hearts red.
    // if preview is on, mark upcoming and next cards.
    var stacktemp = Array(stack.length);
    if (stack.length > 0) {
        for (var i = stack.length-1; i >= 0; i--) {
            stacktemp[i] = cardToString(stack[i]);
            if (preview) {
                if ((marksize == 3 && i == 0 ) || (stack.length-i-(3-offset))%3 === 0 ) {
                    stacktemp[i] = `<span class="Dij_Card upcoming">${stacktemp[i]}</span>`
                }
            }
        }
        if (preview) {
            //If the deck is empty and hand size is <3, only show next card underneath,
            //because a second pass through the deck would go back to the current card
            if (marksize >= 3 && stack.length > 3) {
                stacktemp.splice(-3,3, `<span style="display:inline-block;"><span class="Dij_Card next">${stacktemp.slice(-3).join('')}</span>`);
            }
            if (marksize%3 == 1){
                stacktemp[0]= `<span class="Dij_Card next">${stacktemp[0]}</span>`;
            }
        }
        return stacktemp.join('');
    } else {
        return "<span style=\"color:lawngreen;font-weight:bold;\">◯</span>";
    }
}

function draw() {
    // move last three cards from deck (the top) to the top of the hand
    if (deck.length == 0 ) {
        deck = hand.splice(0);
        hand = deck.splice(-3);
        GM_deleteValue("deck");
        GM_deleteValue("hand");
    } else {
        let drawStack = deck.splice(-3);
        hand.unshift(...drawStack);
    }
    GM_setValue("deck", deck);
    GM_setValue("hand", hand);
}

async function removeCard(response) {
    // Pop top card off hand if card is moved.
    /*BUG: Refreshing/navigating away from the page with the hand selected will make
      make the program think a move has been made, subtracting the hand even if nothing happened.
      Not sure how to get around this yet. in the mean time don't do that.
    */
    if (GM_getValue("selected",0)) {
        hand.shift();
        GM_setValue("hand", hand);
        GM_setValue("selected", 0);
    }
}

async function formatHTML() {
    var faceup = cardToString(hand[0]);
    var handstr = `${stackToString(GM_getValue("hand").slice(1), 1, 0,true)}`;
    var deckstr = `${stackToString(GM_getValue("deck"), 3, GM_getValue("hand").length%3,true)}`;
    if(deck.length == 0 ) {
        deckstr = "<span style=\"color:lawngreen;font-weight:bold;\">◯</span>";
        handstr = `${stackToString(hand.slice(1), 4, 0 , hand.length>3)}`;
    }
    $("#Dij_HandHelper").replaceWith(`<div id="Dij_HandHelper" style="text-align:right;">Hand[${hand.length}]:</div>
    <div id="Dij_Hand"><span class="Dij_InHand">
    ${faceup}</span> > ${handstr}</div>`);
    $("#Dij_DeckHelper").replaceWith(`<div id="Dij_DeckHelper" style="text-align:right;word-wrap:normal;">Deck[${deck.length}]:</div>
    <div id="Dij_Deck"> ${deckstr}&nbsp;<&nbsp;<span class="Dij_InHand">${faceup}</span></span></span></div>`);
    /*$("#Dij_HandHelper").replaceWith(`<div id="Dij_HandHelper"> Deck[${deck.length}] <b>${deckstr}</b> < <span id="Dij_InHand">
    ${cardToString(hand[0])}</span>> Hand[${hand.length}]:<b>${handstr}</b> ></div>`);*/
}

function cardConverter(cardalt){
    // Convert card alt into a dictionary
    let a = cardalt.attr("alt").match(CARD_RE);
    return {"rank":RANK_DICT[a.groups.rank], "suit":SUIT_DICT[a.groups.suit]};
}

(async function() {
    'use strict';
    // HTML
    $("head").append(`
            <style>#ss_board {height:400px;}
            #Dij_helper {max-width:492px;padding:7px 0px;margin:0px auto;
              line-height:2em;border:1px var(--color) solid;border-top:none;}
            .Dij_Card{border-radius:5px;border-style:solid;border-width:1px;border-color:transparent;padding:3px;
              margin:0px 1px;}
            .r {color:crimson;}
            .unkcard {font-size:1.2em; vertical-align:-0.05em;font-weight:normal;min-width:16px;padding:2px;}
            .ss_footer{font-size:0.8em;width:400px;line-height:1.5em;}
            .Dij_Card.upcoming {border-color:cornflowerblue;}
            .next>.upcoming {border-radius:5px;border:1px solid cornflowerblue;padding:0 2px;}
            .Dij_Card.next {border-color:crimson;background-color:var(--grid_even);}
            .Dij_InHand {font-size:18px;padding:4px 3px;border:1px solid var(--color);border-radius:3px;}
            #Dij_helper .grid {width:100%;margin:auto;display:grid;grid-template-columns: 0.2fr 1fr;grid-autorows:auto;gap:5px;}
            .b {font-weight:bold;}
            #Dij_Hand,#Dij_Deck {text-align:left;}

            </style>
            `);
    $("#gamearea").append(`<div id="Dij_helper"><div class="grid">
            <div id="Dij_HandHelper">Hand[]: > ... ></div>
            <div id="Dij_DeckHelper">Deck[]: < ... <</div></div></div>
            <div class="ss_footer margin-1"><span class="Dij_Card next">Red boxed</span> cards will be drawn next.</br>
            <span class="Dij_Card upcoming">Blue boxed</span> cards will be the top card drawn on the next round if no other cards are removed from the hand/deck.</div></div>`);
    if (GM_getValue("deck", null) == null) {
        init();
    }
    deck = GM_getValue("deck", null);
    hand = GM_getValue("hand", null);
    if ($("#ss_board").length == 0) {
        $("input[value=\"Play Sakhmet Solitaire!\"]").on("click", init);
    } else {
        /*deck draw listener*/
        $(".deck").on("click", draw);
        var currHand = $(".face_up.hand");
        const r = await GM.xmlHttpRequest({ url: "/games/sakhmet_solitaire/process/", onload:removeCard});
        if (currHand.length > 0) {
            const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.attributeName === "id") {
                    GM_setValue("selected", 1-GM_getValue("selected", 0));
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(currHand[0], {attributes:true});
            var card = cardConverter(currHand);
            hand[0] = card;
        }

        formatHTML();
    }
})();
