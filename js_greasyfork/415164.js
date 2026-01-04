// ==UserScript==
// @name         Subeta: Leviathan Harpooning Autoplayer
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.1
// @description  Automatically plays Leviathan Harpooning
// @author       AyBeCee
// @match        https://subeta.net/games/battleship.php*
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415164/Subeta%3A%20Leviathan%20Harpooning%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/415164/Subeta%3A%20Leviathan%20Harpooning%20Autoplayer.meta.js
// ==/UserScript==



// count the number of children
var tdAmount = $(`.container-fluid center table[cellpadding="0"][cellspacing="0"] tr:nth-child(2) > td`).length;
console.log(tdAmount);

// Leviathan Harpooning
var harpoonTileArray = []
function randomHarpoon() {

    var i;

    function smartHarpoon( cell ) {
        console.log ( `smartHarpoon(${cell}) function is being executed ` )
        for (i = 0; i < tdAmount ; i++) {

            if ( cell > tdAmount ) {

                /////// TOTAL RANDOM PICKS vvvvvvvvvvvvvvvvvvvvv

                // add each scratchible option to an array
                $( `td[colspan="1"][align="center"][valign="top"][style="padding:0px;"] a` ).each(function() {
                    harpoonTileArray.push($( this ).attr("href"));
                });

                // randomise one of the scratchible options from the array
                window.location.href = harpoonTileArray[Math.floor(Math.random() * harpoonTileArray.length)] ;

                /////// TOTAL RANDOM PICKS ^^^^^^^^^^^^^^^

                return false;
            }
            else {
                var cellToLookAt = $(`.container-fluid center table[cellpadding="0"][cellspacing="0"] tr:nth-child(${i + 2}) td:nth-child(${cell}) a`);

             //   console.log(cellToLookAt);
                console.log(`loop ${i} for ${cell} cell`);

                if ( cellToLookAt.length > 0 ) {
                    var thirdCell = cellToLookAt.attr("href")
                    console.log(thirdCell);
                    window.location.href = thirdCell;
                    return false;
                }

                if ( i == (tdAmount - 1) ) {
                    console.log('finished first column')
                    smartHarpoon( cell + 4 )

                    return false;
                }
            }
        }
    }

    smartHarpoon( 1 )

}


if ($( `body:contains('Are you ready to harpoon some leviathans?!')` ).length > 0 ) {
    window.location.href =  "?create=game";
}
else if ( $(`td[style="padding:0px;"] img[src*="https://img.subeta.net/battleship_tile_monster_"]`).length > 0 ) {
    var lastLev = $(`td[style="padding:0px;"] img[src*="https://img.subeta.net/battleship_tile_monster_"]`).last().addClass("isLast");

    $(`td[style="padding:0px;"] img[src*="https://img.subeta.net/battleship_tile_monster_"]`).each( function() {
        if ( $(this).parent().prev().find('a').length > 0 ) {
            // click on anything before the leviathan
            console.log ( $(this).parent().prev().find('a').attr("href") )
            window.location.href = $(this).parent().prev().find('a').attr("href");
            return false;
        }
        else if ( $(this).parent().next().find('a').length > 0 ) {
            // click on anything after the leviathan
            console.log ( $(this).parent().next().find('a').attr("href") )
            window.location.href = $(this).parent().next().find('a').attr("href");
            return false;
        }
        else if ( $(this).hasClass("isLast") ) {
            console.log('is laaaaaaaast')
            randomHarpoon();
        }
    });
}
else if ($( `h1:contains('You win! You harpooned all of the leviathans!')` ).length > 0 ) {
    new Notification(`You win! You harpooned all of the leviathans!`);
    window.location.href = '/games/battleship.php'
}
else if ($( `body:contains('You lost! Would you like to')` ).length > 0 ) {
    window.location.href =  $(`a:contains('try again')`).attr("href");
}
else {
    randomHarpoon();
}