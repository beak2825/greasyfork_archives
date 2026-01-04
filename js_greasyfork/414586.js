// ==UserScript==
// @name         Subeta: Memory Helper
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.0.1
// @description  There's two modes to this: Auto Player and Manual Helper. Auto Player mode automatically plays the game without any input needed. It will stop at when you reach 10/10 games. Play as normal in Manual Helper mode, except it allows you to see the tile after it has been clicked (so you don't need to memorise it).
// @author       AyBeCee
// @match        https://subeta.net/games/memory.php*
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/414586/Subeta%3A%20Memory%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/414586/Subeta%3A%20Memory%20Helper.meta.js
// ==/UserScript==

var autoModeKey;
var autoMode = GM_getValue('autoModeKey', 0);
console.log(autoMode)
$(`h1:contains('Memory')`).after(`
<div style="padding: 15px; border-radius: 15px; box-shadow: 2px 2px 2px #d3d3d3; display: inline-block; margin-left: 25px; background: #e3e3e3;">
<span class="auto">Currently in auto player mode.</span>
<span class="manual">Currently in manual helper mode.</span>

<br><br>

<div id="autoPlay" class="ui button manual">Switch to Auto player mode</div>
<div id="manualHelp" class="ui button auto">Switch to Manual helper mode</div>
<br>
<div class="auto">Auto player is learning that:</div>
<div class="auto" id="autoupdates"></div>

</div>
`)

if ( autoMode == true ) {
    console.log('should be trye now')
    $(`.manual`).hide()
    $(`.auto`).show()
    console.log(autoMode)
} else {
    console.log('should be false now')
    $(`.manual`).show()
    $(`.auto`).hide()
    console.log(autoMode)
}

$(`#autoPlay`).click( function() {
    GM_setValue('autoModeKey', true );

    location.reload();
});
$(`#manualHelp`).click( function() {
    console.log('should be false now')
    GM_setValue('autoModeKey', false );

    location.reload();
});



if (window.location.href.includes("/games/memory.php?act=end")) {
    window.location.href = "/games/memory.php";
}
if ( window.location.href.includes("/games/memory.php") && $(`a:contains('Start me up a game!')`).length > 0 && ( ! $(`b:contains('10/10')`).length > 0 ) ) {
    window.location.href = $(`a:contains('Start me up a game!')`).attr("href");
}


if (window.location.href.includes("/games/memory.php?act=play")) {
    if ( autoMode == true ) {

        $(window).load(function(){

            function wait() {
                return Math.floor(Math.random() * 5001) + 3000;
            }

            var cardObjectArray = {};



            function cardFlip (i) {
                if (i < 20) {
                    console.log(`a is ${i}`);

                    // click on card with specified number
                    $(`#tile_${i}`).click();

                    var saveBack = setInterval(function(){

                        // get card url
                        var img = $(`#tile_${i}`).attr("src");

                        // if the card url is NOT the default
                        if ( img !== "https://img.subeta.net/games/tile_front.png" ) {


                            console.log(`#tile_${i} is ${img}`)
                            $(`#autoupdates`).html(`#tile_${i} is ${img}`);

                            // if there's already a card with the same url
                            // https://stackoverflow.com/questions/17126481/checking-if-a-key-exists-in-a-js-object
                            if ( ( img in cardObjectArray ) && ( cardObjectArray[img] !== i ) ) {

                                var matchedCard = cardObjectArray[img];
                                console.log(`#tile_${i} matches with ${matchedCard}`)
                                $(`#autoupdates`).html(`#tile_${i} matches with #tile_${matchedCard}`);


                                $(`#tile_${matchedCard}`).click();
                                $(`#tile_${i}`).click();
                                setTimeout(function(){
                                    $(`#tile_${matchedCard}`).click();
                                    $(`#tile_${i}`).click();
                                }, 2000);
                                setTimeout(function(){
                                    $(`#tile_${matchedCard}`).click();
                                    $(`#tile_${i}`).click();
                                }, 3000);
                                setTimeout(function(){
                                    $(`#tile_${matchedCard}`).click();
                                    $(`#tile_${i}`).click();
                                }, 4000);

                                setTimeout(function(){
                                    b(i);
                                }, 5000);

                            }

                            // if the current card url does not match any previous card urls
                            else {
                                cardObjectArray[img] = i;
                                console.log(cardObjectArray)

                                console.log(`#tile_${i} has no matches`)
                                $(`#tile_${i}`).attr("src",img);

                                setTimeout(function(){
                                    b(i);
                                }, 5000);

                            }



                            // stop the interval
                            clearInterval(saveBack);
                        }
                    }, 1000);

                }
            }

            // https://stackoverflow.com/questions/14295816/javascript-functions-calling-each-other
            function b(i)
            {
                i++;
                console.log(`b is ${i}`);
                setTimeout(function(){
                    cardFlip(i);
                }, 5000);

            };

            cardFlip(0);

        });
    }


    //////////////////////////// manual mode
    else {

        $(`body`).append(`<style>
#memory_game img {opacity:.4}

#memory_game img.lol {
opacity:1;
    margin-right: -150px;
}
</style>`);

        var alreadyFlipped = [];
        $(`#memory_game img`).click(function(){

            var cardID = $(this).attr("id");

            // if the card has not been flipped yet
            if ( ! alreadyFlipped.includes(cardID) ) {
                alreadyFlipped.push(cardID);
                var saveBack = setInterval(function(){

                    console.log(cardID);
                    var img = $(`#${cardID}`).attr("src");
                    console.log(img);
                    if ( img !== "https://img.subeta.net/games/tile_front.png" ) {
                        console.log("yes" + img);

                        if ( cardID == "tile_5" || cardID == "tile_10" || cardID == "tile_15" ) {
                            $(`#${cardID}`).before(`<br><img src="${img}" class="lol" id="${cardID}real">`);
                        } else {
                            $(`#${cardID}`).before(`<img src="${img}" class="lol" id="${cardID}real">`);
                        }

                        clearInterval(saveBack);
                    }
                }, 1000);
            }
        });
    }
}