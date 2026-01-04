// ==UserScript==
// @name         Pyramids AP
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      2025-05-21-1
// @description  Auto plays Pyramids
// @author       AyBeCee
// @match        https://www.grundos.cafe/games/pyramids/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535445/Pyramids%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/535445/Pyramids%20AP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }


    setTimeout(function () {
        if ( $(`[value="Play Pyramids Again!"]`).length > 0 ) {
            console.log(`Play Pyramids Again!`)
            $(`[value="Play Pyramids Again!"]`).click()
        } else if ( $(`[value="Play Pyramids!"]`).length > 0 ) {
            if (Number($(`p:contains(You have earned ) strong:nth-child(1)`).text().replace(",","")) > 30000) {
                alert('Donezo')
            } else {
                console.log(`Play Pyramids!`)
                $(`[value="Play Pyramids!"]`).click()
            }
        } else {
            console.log(`Playing game`)
            nextRow(7)
        }
    }, getRandomInt(2000, 3000));

    if ($(`img.hand.face_up`).length > 0) {
        var newCard = $(`img.hand.face_up`).attr("src");
        newCard = Number(newCard.substring(
            newCard.indexOf("solitaire/") + 10,
            newCard.lastIndexOf("_")
        ));
    }
    function nextRow(rowNumber) {
        if (rowNumber > 0) {
            if ( $(`.row${rowNumber} img.face_up.clickable`).length > 0 ) {
                $(`.row${rowNumber} img.face_up.clickable`).each(function(index){
                    var yourCard = $(this).attr("src");
                    yourCard = Number(yourCard.substring(
                        yourCard.indexOf("solitaire/") + 10,
                        yourCard.lastIndexOf("_")
                    ));
                    //        console.log(yourCard)

                    if (yourCard - 1 == newCard ||
                        yourCard + 1 == newCard ) {
                        console.log(`can play ${yourCard}`)
                        $(this).click()
                        return false
                    } else if ( yourCard == 14 && newCard == 2){
                        $(this).click()
                        return false
                    } else if (yourCard == 2 && newCard == 14 ){
                        $(this).click()
                        return false
                    }

                    if ($(`.row${rowNumber} img.face_up.clickable`).length == index + 1 ) {
                        console.log(`next row ${rowNumber - 1}`)
                        nextRow(rowNumber - 1)
                    }

                });
            } else {
                console.log(`next row ${rowNumber - 1}`)
                nextRow(rowNumber - 1)
            }
        } else if ( $(`.xlfont.mahogany.bold:contains(You do not have any draws left!)`).length > 0) {
            console.log(`Collect Winnings`)
            $(`[value="Collect Winnings"]:first`).click();
        } else {
            console.log(`no available cards. getting new card.`)
            $(`.row_deck img.deck.clickable`).click()

        }

    }



})();