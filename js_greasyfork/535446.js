// ==UserScript==
// @name         Go! Go! Go!
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      2025-05-09
// @description  Auto plays Go! Go! Go!
// @author       AyBeCee
// @match        https://www.grundos.cafe/games/gogogo/play/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535446/Go%21%20Go%21%20Go%21.user.js
// @updateURL https://update.greasyfork.org/scripts/535446/Go%21%20Go%21%20Go%21.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function removeEvens(numbers) {
        return numbers.filter(n => n % 2 !== 0); // if a number is even, remove it
    }

    $(`body`).append(`<style>#header-message{display:none}#actions{display:block!important}#actions {
    input {
        height: 100px!important;
    }
}#no-action {
    input {
        height: 100px!important;
    }
}</style>`)

    $("#page_content").hover(function () {
        if ($(`[id="play"]`).length == 1
            || $(`body:contains(You get to go again since your last play completed a full set and cleared the center pile!!!)`)) {
            var cardValue = $(`#stack img`).attr("src");
            if (cardValue == "https://grundoscafe.b-cdn.net/games/cards/blank.gif") {
                cardValue = 0;
            } else {
                cardValue = Number(cardValue.match(/\d+/)[0]);
            }
            if ($(`body:contains(You do not have any cards in your hand.)`).length == 1) {
                noHandCards(cardValue);
            } else {
                var hand = [];
                $(`#player-hand-cards .clickable`).each(function (index) {
                    var hand_cardValue = $(this).attr("src");
                    hand_cardValue = Number(hand_cardValue.match(/\d+/)[0]);
                    hand.push(hand_cardValue);

                    if ($(`#player-hand-cards .clickable`).length == index + 1) {
                        if ( hand.length == 0) {
                            noHandCards(cardValue)
                        } else {
                            hand = hand.sort(function (a, b) { return a - b; });
                            if ($(`#stack img[src="https://grundoscafe.b-cdn.net/games/cards/blank.gif"]`).length > 0) {
                                playLowest(hand, "hand");
                            } else {
                                playHand(cardValue, hand);
                            }
                        }
                    }
                });
            }
        } else if ($(`[value="Continue..."]`).length == 1) {
            console.log(`Continue...`);
        }


    });

    function playHand(cardValue, hand) {
        // console.log(cardValue)
        // console.log(hand)

        if (cardValue == 3) {
            hand = removeEvens(hand);
        } else if (cardValue == 4) {
            hand = hand.filter(e => e % 2 === 0)
        }

        for (let i = 0; i < hand.length; i++) {
            //   console.log(hand[i])
            if (hand[i] >= cardValue) {
                console.log(`#player-hand-cards .clickable[src*="/${hand[i]}_"]`)
                $(`#player-hand-cards .clickable[src*="/${hand[i]}_"]`).click();
                $(`#pick`).hide();


                return false
            } else if (i + 1 == hand.length) {
                if (hand.includes(2)) {
                    $(`#player-hand-cards .clickable[src*="/2_"]:first`).click();
                    $(`#pick`).hide();
                } else {
                    console.log(`no legal moves. pick up pile`);
                    $(`#play`).hide();
                }
            }
        }
    }
    function playLowest(hand, location) {
        console.log(`play lowest`)
     //   console.log(hand)
        for (let i = 0; i < hand.length; i++) {
         //   console.log(hand[i])
            if (hand[i] > 2) {
                $(`#player-${location}-cards .clickable[src*="/${hand[i]}_"]`).click();
                $(`#pick`).hide();
                return false
            }
            if (i + 1 == hand.length) {
                if (hand.includes(2)) {
                    $(`#player-${location}-cards .clickable[src*="/2_"]:first`).click();
                    $(`#pick`).hide();
                } else {
                    $(`#play`).hide();
                }
            }
        }
    }
    function noHandCards(cardValue) {
        console.log("No hand cards function called.");
       // console.log(cardValue)
        if ($(`#player-faceups-cards .clickable`).length> 0){
            var faceUps = [];
            $(`#player-faceups-cards .clickable`).each(function (index) {
                var hand_cardValue = $(this).attr("src");
                hand_cardValue = Number(hand_cardValue.match(/\d+/)[0]);
                faceUps.push(hand_cardValue);
                if ($(`#player-faceups-cards .clickable`).length == index + 1) {
                    console.log(faceUps)
                    if (cardValue == 0) {
                        playLowest(faceUps, "faceups")
                        $(`#pick`).hide();
                    } else {
                        $(`#play`).hide();
                    }
                }
            })
        } else {
            noFaceUpCards(cardValue)
        }

    }
    function noFaceUpCards(cardValue) {
        $(`#player-facedowns-cards .clickable:first`).click()
    }

})();