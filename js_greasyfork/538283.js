// ==UserScript==
// @name         Scarab 21 AP
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      20250604
// @description  Scarab 21 Autoplayer. Needs an external autoclicker. I use AHK.
// @match        https://www.grundos.cafe/games/scarab21/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538283/Scarab%2021%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/538283/Scarab%2021%20AP.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    $(`body`).append(`<div id="asdf" style="top: 100px; left: 400px;background:red;position:absolute;height: 100px; width: 100px; cursor: pointer;">adsf</div>`)

    $(`#asdf`).click(function () {
        if ($(`body:contains(There are no more legal moves!)`).length == 1) {
           $(`[value="Collect Winnings"]`).attr("style", "top: 100px; left: 400px; position: absolute; height: 100px; width: 100px; z-index: 2;");

            //  $(`[value="Collect Winnings"]`).click()
        } else if ($(`[value="Play Scarab 21 Again!"]`).length == 1) {
            //    $(`[value="Play Scarab 21 Again!"]`).click()
            $(`[value="Play Scarab 21 Again!"]`).attr("style", "top: 100px; left: 400px; position: absolute; height: 100px; width: 100px; z-index: 2;");

        } else if ($(`[value="Play Scarab 21!"]`).length == 1) {
              $(`[value="Play Scarab 21!"]`).attr("style", "top: 100px; left: 400px; position: absolute; height: 100px; width: 100px; z-index: 2;");


            if (Number($(`p:contains(You have earned) strong:first`).text().replace(",", "")) < 30000) {
                $(`[value="Play Scarab 21!"]`).attr("style", "top: 100px; left: 400px; position: absolute; height: 100px; width: 100px; z-index: 2;");

                //          $(`[value="Play Scarab 21!"]`).click()
            }
        } else {

            var pointsArray = [];

            $(`td[height="32"]`).each(function (index) {
                var text = $(this).text();

                if (text.includes("or")) {
                    var total1 = Number(text.substring(
                        text.indexOf(" or ") + 4
                    ));
                    var total2 = Number(text.substring(0,
                                                       text.lastIndexOf(" or ")
                                                      ));

                    pointsArray.push({
                        "total": total1,
                        "column": index,
                    })
                    pointsArray.push({
                        "total": total2,
                        "column": index,
                    })
                } else {
                    var total = Number(text);

                    pointsArray.push({
                        "total": total,
                        "column": index,
                    })
                }

                if (index == 4) {

                    var card = $(`.card`).attr("src")
                    var cardNumber = Number(card.substring(card.indexOf("cards/") + 6, card.lastIndexOf("_")));
                    if (cardNumber == 14) {
                        cardNumber = 11;
                    } else if (cardNumber > 10) {
                        cardNumber = 10;
                    }
                    console.log(cardNumber)
                    console.log(pointsArray)
                    if (cardNumber == 11) {

                        var filteredArray = pointsArray.filter(item => item.total !== 1 && item.total !== 11);
                        console.log(filteredArray);

                        ifAce(cardNumber, filteredArray)
                    } else {
                        create11or21(cardNumber, pointsArray)
                    }

                }
            })
        }
    })

    function ifAce(cardNumber, pointsArray) {
        console.log(`ifAce`)
        for (var i = 0; i < pointsArray.length; i++) {
            if (pointsArray[i]["total"] == 10 || pointsArray[i]["total"] == 20) {
                $(`.arrow`).eq(pointsArray[i]["column"]).attr("style", "filter: hue-rotate(270deg);top: 100px; left: 400px; position: absolute; height: 100px; width: 100px; z-index: 2;")
                console.log(`put in column ${i + 1} to create 21`)
                break
            } else if (i == pointsArray.length - 1) {
                create11or21(cardNumber, pointsArray)
            }
        }

    }
    function create11or21(cardNumber, pointsArray) {
        console.log(`create11or21`)
        for (var i = 0; i < pointsArray.length; i++) {
            if (pointsArray[i]["total"] + cardNumber == 11 ||
                pointsArray[i]["total"] + cardNumber == 21
               ) {

                //$(`.arrow`).eq(pointsArray[i]["column"]).parent().click();
                $(`.arrow`).eq(pointsArray[i]["column"]).attr("style", "filter: hue-rotate(270deg);top: 100px; left: 400px; position: absolute; height: 100px; width: 100px; z-index: 2;");

                $(`.arrow`).eq(pointsArray[i]["column"]).parent().click(function () {
                console.log(`p`)

                    $(this).remove();
                })
                console.log(`put in column ${i + 1} to create ${pointsArray[i]["total"] + cardNumber}`)
                break
            } else if (i == pointsArray.length - 1) {
                putInEmptyColumn(cardNumber, pointsArray)
            }
        }
    }
    function putInEmptyColumn(cardNumber, pointsArray) {
        console.log(`putInEmptyColumn`)
        for (var i = 0; i < pointsArray.length; i++) {
            if (pointsArray[i]["total"] == 0) {
                //      $(`.arrow`).eq(pointsArray[i]["column"]).click();
                $(`.arrow`).eq(pointsArray[i]["column"]).attr("style", "filter: hue-rotate(90deg);top: 100px; left: 400px; position: absolute; height: 100px; width: 100px; z-index: 2;")
                console.log(`put in empty column ${i + 1}`)
                break
            } else if (i == pointsArray.length - 1) {
                if (cardNumber < 10) {
                    ifLessThan10(cardNumber, pointsArray)
                } else if (cardNumber == 11) {
                    randoLegalMove(cardNumber, pointsArray)
                } else {
                    ifIs10(cardNumber, pointsArray)
                }
            }
        }
    }
    function ifLessThan10(cardNumber, pointsArray) {
        console.log(`ifLessThan10`)
        for (var i = 0; i < pointsArray.length; i++) {
            if (pointsArray[i]["total"] == 10) { // check if any columns are 10
                //      $(`.arrow`).eq(pointsArray[i]["column"]).click();
                $(`.arrow`).eq(pointsArray[i]["column"]).attr("style", "filter: hue-rotate(90deg);top: 100px; left: 400px; position: absolute; height: 100px; width: 100px; z-index: 2;")
                console.log(`putting in column with 10`)
                break
            } else if (i == pointsArray.length - 1) {
                notCreating10(cardNumber, pointsArray)
            }
        }
    }


    function notCreating10(cardNumber, pointsArray) {
        console.log(`notCreating10`)
        for (var i = 0; i < pointsArray.length; i++) {
            if (pointsArray[i]["total"] < 10 && pointsArray[i]["total"] + cardNumber !== 10) {
                //      $(`.arrow`).eq(pointsArray[i]["column"]).click();
                $(`.arrow`).eq(pointsArray[i]["column"]).attr("style", "filter: hue-rotate(90deg);top: 100px; left: 400px; position: absolute; height: 100px; width: 100px; z-index: 2;")
                console.log(`putting in column less than 10 and doesn't create 10`)
                break
            } else if (i == pointsArray.length - 1) {
                putInColumnMoreThan10(cardNumber, pointsArray)
            }
        }
    }

    function putInColumnMoreThan10(cardNumber, pointsArray) {
        console.log(`putInColumnMoreThan10`)
        for (var i = 0; i < pointsArray.length; i++) {
            if (pointsArray[i]["total"] > 10 && pointsArray[i]["total"] + cardNumber < 21) {
                //      $(`.arrow`).eq(pointsArray[i]["column"]).click();
                $(`.arrow`).eq(pointsArray[i]["column"]).attr("style", "filter: hue-rotate(90deg);top: 100px; left: 400px; position: absolute; height: 100px; width: 100px; z-index: 2;")
                console.log(`putting in column less than 10 and doesn't create 10`)
                break
            } else if (i == pointsArray.length - 1) {
                checkIfColumnsLessThan10(cardNumber, pointsArray)
            }
        }

    }
    function checkIfColumnsLessThan10(cardNumber, pointsArray) {
        console.log(`checkIfColumnsLessThan10`);
        for (var i = 0; i < pointsArray.length; i++) {
            if (pointsArray[i]["total"] < 10) {
                //      $(`.arrow`).eq(pointsArray[i]["column"]).click();
                $(`.arrow`).eq(pointsArray[i]["column"]).attr("style", "filter: hue-rotate(90deg);top: 100px; left: 400px; position: absolute; height: 100px; width: 100px; z-index: 2;")
                console.log(`putting in column less than 10`)
                break
            } else if (i == pointsArray.length - 1) {
                randoLegalMove(cardNumber, pointsArray)
            }
        }
    }

    function randoLegalMove(cardNumber, pointsArray) {
        console.log(`randoLegalMove`)
        for (var i = 0; i < pointsArray.length; i++) {
            if (pointsArray[i]["total"] + cardNumber < 21) { 
                //      $(`.arrow`).eq(pointsArray[i]["column"]).click();
                $(`.arrow`).eq(pointsArray[i]["column"]).attr("style", "filter: hue-rotate(90deg);top: 100px; left: 400px; position: absolute; height: 100px; width: 100px; z-index: 2;")
                console.log(`randoLegalMove`)
                break
            } else if (pointsArray[i]["total"] + 1 < 21 && cardNumber == 11) { // if ace, and ace can't be used as 11
                //      $(`.arrow`).eq(pointsArray[i]["column"]).click();
                $(`.arrow`).eq(pointsArray[i]["column"]).attr("style", "filter: hue-rotate(90deg);top: 100px; left: 400px; position: absolute; height: 100px; width: 100px; z-index: 2;")
                console.log(`randoLegalMove`)
                break
            }
        }
    }

    function ifIs10(cardNumber, pointsArray) {
        console.log(`ifIs10`)
        for (var i = 0; i < pointsArray.length; i++) {
            if (pointsArray[i]["total"] + cardNumber < 21 && pointsArray[i]["total"] != 10) {
                //      $(`.arrow`).eq(pointsArray[i]["column"]).click();
                $(`.arrow`).eq(pointsArray[i]["column"]).attr("style", "filter: hue-rotate(180deg);top: 100px; left: 400px; position: absolute; height: 100px; width: 100px; z-index: 2;")

                console.log(pointsArray[i]["total"])
                console.log(`making rando legal move`)
                break
            } else {
                checkIfColumnsLessThan10(cardNumber, pointsArray)
            }
        }
    }

})(jQuery);