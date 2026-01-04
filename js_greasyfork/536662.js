// ==UserScript==
// @name         Sakhmet Solitaire AP
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @license MIT
// @version      2025-07-13
// @description  Auto plays Sakhmet Solitaire
// @match        https://www.grundos.cafe/games/sakhmet_solitaire/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536662/Sakhmet%20Solitaire%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/536662/Sakhmet%20Solitaire%20AP.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }
    if ($(`[value="Play Sakhmet Solitaire!"]`).length == 1 && Number($(`p:contains(You have earned ) strong:first`).text().replace(",","")) >= 30000 ) {

        new Audio('http://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/eatedible.ogg').play()
    }
    if ($(`[value="Play Sakhmet Solitaire!"]`).length == 1 && Number($(`p:contains(You have earned ) strong:first`).text().replace(",","")) < 30000 ) {
        setTimeout(function () {
            $(`[value="Play Sakhmet Solitaire!"]`).click();
        }, getRandomInt(1000, 3000));
    }
    if ($(`[value="Play Sakhmet Solitaire Again!"]`).length == 1) {
        setTimeout(function () {
            $(`[value="Play Sakhmet Solitaire Again!"]`).click();
        }, getRandomInt(1000, 3000));
    }

    var StackBottomCards = [];

    var handCard = $(`.face_up.hand`).attr("src");
    var handCardNumber = $(`.face_up.hand`).attr("src");

    //    console.log(handCard)

    if ($(`[value="Automatically Finish & Collect Winnings"]`).length == 1 ) {

        new Audio('http://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/eatedible.ogg').play();
        setTimeout(function () {
            $(`[value="Automatically Finish & Collect Winnings"]`).click()
        }, getRandomInt(1000, 3000));

    } else {


        $(`.cards .face_up:last-child`).each(function (index) {
            var faceup = $(this).attr("src");
            var cardNumber = Number(faceup.substring(faceup.indexOf("cards/") + 6, faceup.lastIndexOf("_")));
            var cardSuit = faceup.substring(faceup.indexOf("_") + 1, faceup.lastIndexOf(".gif"));
            var cardColour;
            if (cardSuit == "diamonds" || cardSuit == "hearts") {
                cardColour = "red"
            } else if (cardSuit == "spades" || cardSuit == "clubs") {
                cardColour = "black"
            }

            if (cardNumber == 14) {
                $(this).click();
                $(`.new_open[alt*="foundation"]:first`).click();
                return false
            } else {
                var cardObject = {
                    "cardNumber": cardNumber,
                    "cardColour": cardColour,
                    "cardSuit": cardSuit
                }
                StackBottomCards.push(cardObject)
            }

            if (index + 1 == $(`.cards .face_up:last-child`).length) {
                console.log(`getStackTopCards function`)
                getStackTopCards(StackBottomCards)
            }
        });
    }

    function getStackTopCards(StackBottomCards) {
        var emptyStacks = false;
        var StackTopCards = [];
        $(`.cards`).each(function (index) {

            var firstFaceUp = $(this).find('.face_up:first');

            if (firstFaceUp.length == 1) {
                var faceup = firstFaceUp.attr("src");
                var cardNumber = Number(faceup.substring(faceup.indexOf("cards/") + 6, faceup.lastIndexOf("_")));
                var cardSuit = faceup.substring(faceup.indexOf("_") + 1, faceup.lastIndexOf(".gif"));
                var cardColour;
                if (cardSuit == "diamonds" || cardSuit == "hearts") {
                    cardColour = "red"
                } else if (cardSuit == "spades" || cardSuit == "clubs") {
                    cardColour = "black"
                }
                var cardObject = {
                    "cardNumber": cardNumber,
                    "cardColour": cardColour,
                    "cardSuit": cardSuit
                }
                StackTopCards.push(cardObject)

            } else {
                console.log($(this).find(`img`).attr("class") + ' is empty')
                emptyStacks = true;
            }
            if (index + 1 == $(`.cards`).length) {
                if ($(`.cards [src="https://grundoscafe.b-cdn.net/games/php_games/sakhmetsolitaire/pyramid.gif"]`).length == 0){
                    alert("manual play")
                } else {
                    console.log(`playStackCards function`);
                    playStackCards(StackBottomCards, StackTopCards, emptyStacks)
                }
            }
        });

    }
    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }



    function playStackCards(StackBottomCards, StackTopCards, emptyStacks) {

        var cantPlayStackCards = true;

        for (var i = 0; i < StackTopCards.length; i++) {
            var card = StackTopCards[i];
            var cardNumber = card["cardNumber"];

            // find any bottom cards which are the top card's +1
            var result = StackBottomCards.filter(card => card.cardNumber === cardNumber + 1);
            if (result.length > 0) {
                for (var j = 0; j < result.length; j++) {

                    if (card["cardColour"] != result[j]["cardColour"]) {

                        console.log(`you can put ${cardNumber} of ${card["cardSuit"]} on ${result[j]["cardNumber"]} of ${result[j]["cardSuit"]}`)
                        $(`[src*="/${cardNumber}_${card["cardSuit"]}"]`).click();

                        setTimeout(function () {
                            $(`[src*="/${result[j]["cardNumber"]}_${result[j]["cardSuit"]}"]`).click();
                        }, getRandomInt(1000, 3000));
                        return false
                    }
                }
            } else if (cardNumber == 13 && emptyStacks
                       && $(`[src*="/13_${card["cardSuit"]}"]`).parent().find(`[src="https://grundoscafe.b-cdn.net/games/php_games/sakhmetsolitaire/pyramid.gif"]`).length > 0
                      ) { // if king, put king on blank
                console.log(`playing king`)
                $(`[src*="/13_${card["cardSuit"]}"]`).click();

                setTimeout(function () {
                    $(`.cards [src="https://grundoscafe.b-cdn.net/games/php_games/sakhmetsolitaire/new_open.gif"]:first`).click();
                }, getRandomInt(1000, 3000));
                return false
            }
            if (i + 1 == StackTopCards.length) {
                if ($(`img.face_up.hand`).length == 1) {
                    playHand(StackBottomCards, StackTopCards, emptyStacks);
                } else {
                    console.log(`no legal stacking moves left. checking if can add to foundation`)
                    addToTopPile(StackBottomCards)
                }
            }
        }
    }
    function playHand(StackBottomCards, StackTopCards, emptyStacks) {
        var handCard = $(`img.face_up.hand`).attr("src");
        var cardNumber = Number(handCard.substring(handCard.indexOf("cards/") + 6, handCard.lastIndexOf("_")));

        //   console.log(handCard)
        if (cardNumber == 14) {
            $(`img.face_up.hand`).click();
            setTimeout(function () {
                $(`.new_open[alt*="foundation"]:first`).click();
            }, getRandomInt(1000, 3000));

        } else if (cardNumber == 13 && emptyStacks) {
            $(`img.face_up.hand`).click();
            console.log(`playing king`)
            setTimeout(function () {
                $(`.cards [src="https://grundoscafe.b-cdn.net/games/php_games/sakhmetsolitaire/new_open.gif"]:first`).click();
            }, getRandomInt(1000, 3000));
        } else {

            var cardSuit = handCard.substring(handCard.indexOf("_") + 1, handCard.lastIndexOf(".gif"));
            var cardColour;
            if (cardSuit == "diamonds" || cardSuit == "hearts") {
                cardColour = "red"
            } else if (cardSuit == "spades" || cardSuit == "clubs") {
                cardColour = "black"
            }

            // find any bottom cards which are the hand card's +1
            var result = StackBottomCards.filter(card => card.cardNumber === cardNumber + 1);
            console.log(result);
            if (result.length > 0) {
                for (var j = 0; j < result.length; j++) {
                    // console.log(result[j])

                    if (cardColour != result[j]["cardColour"]) {

                        console.log(`you can put ${cardNumber} of ${cardSuit} on ${result[j]["cardNumber"]} of ${result[j]["cardSuit"]}`);
                        $(`[src*="/${cardNumber}_${cardSuit}"]`).click();

                        setTimeout(function () {
                            // playing cards
                            $(`[src*="/${result[j]["cardNumber"]}_${result[j]["cardSuit"]}"]`).click();
                        }, getRandomInt(1000, 3000));

                        return false
                    }

                    if (j + 1 == result.length) {
                        console.log(`no legal stacking moves left. checking if can add to foundation`)
                        addToTopPile(StackBottomCards)
                    }

                }
            } else {
                console.log(`no legal stacking moves left. checking if can add to foundation`)
                addToTopPile(StackBottomCards)
            }
        }
    }

    function addToTopPile(StackBottomCards) {

        if ($(`img.face_up.hand`).length == 1) {
            var handCard = $(`img.face_up.hand`).attr("src");
            var handCardNumber = Number(handCard.substring(handCard.indexOf("cards/") + 6, handCard.lastIndexOf("_")));
            var handCardSuit = handCard.substring(handCard.indexOf("_") + 1, handCard.lastIndexOf(".gif"));
            var handCardColour;
            if (handCardSuit == "diamonds" || handCardSuit == "hearts") {
                handCardColour = "red"
            } else if (handCardSuit == "spades" || handCardSuit == "clubs") {
                handCardColour = "black"
            }
            StackBottomCards.push({
                "cardNumber": handCardNumber,
                "cardColour": handCardColour,
                "cardSuit": handCardSuit
            })
        }
        //        console.log(StackBottomCards)

        for (var k = 1; k < 5; k++) {
            var foundation = $(`.foundation` + k).attr("src");
            if (foundation.length > 0) {
                var cardNumber = Number(foundation.substring(foundation.indexOf("cards/") + 6, foundation.lastIndexOf("_")));
                if (cardNumber == 14) {
                    cardNumber = 1
                }
                var cardSuit = foundation.substring(foundation.indexOf("_") + 1, foundation.lastIndexOf(".gif"));

                // find any bottom cards which are the foundation card's +1
                var result = StackBottomCards.filter(card => card.cardNumber === cardNumber + 1);
                if (result.length > 0) {
                    for (var j = 0; j < result.length; j++) {
                        //   console.log(result[i])
                        if (cardSuit == result[j]["cardSuit"]) {
                            console.log(`you can put ${result[j]["cardNumber"]} of ${result[j]["cardSuit"]} on ${cardNumber} of ${cardSuit} foundation`)

                            $(`[src*="/${result[j]["cardNumber"]}_${cardSuit}"]`).click();

                            if (cardNumber == 1) { // so that we can put the card on the Ace
                                setTimeout(function () {
                                    $(`[src*="/14_${cardSuit}"]`).click();
                                }, getRandomInt(1000, 3000));
                            } else {

                                setTimeout(function () {
                                    $(`[src*="/${cardNumber}_${cardSuit}"]`).click();
                                }, getRandomInt(1000, 3000));
                            }

                            return false
                        }
                    }
                }
            }
            if (k == 4) {
                console.log(`can't add anything to foundation`)
                setTimeout(function () {
                    $(`.deck[src="https://grundoscafe.b-cdn.net/games/php_games/sakhmetsolitaire/pyramid.gif"]`).click();
                    $(`.new_open.deck[src="https://grundoscafe.b-cdn.net/games/php_games/sakhmetsolitaire/new_open.gif"]`).click();

                    if ($(`.xlfont.mahogany.bold`).length == 1) {
                        $(`input.ignore-button-size.btn-link[value="Collect Winnings"]`).click()
                    }
                }, getRandomInt(1000, 3000));
            }
        }
    }
})();