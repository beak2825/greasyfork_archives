// ==UserScript==
// @name         Gormball AP
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      20250604
// @description  Autoplays Gormball, tracks the amount earned.
// @match        https://www.grundos.cafe/games/gormball/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538294/Gormball%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/538294/Gormball%20AP.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var seconds_total = GM_getValue('seconds_totalkey', 0);
    var earned_total = GM_getValue('earned_totalkey', 0);
    var win_total = GM_getValue('win_totalkey', 0);


    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

    var seconds_waited;

        console.log(`seconds_total: ` + seconds_total)
        console.log(`earned_total: ` + earned_total)
        console.log(`win_total: ` + win_total)


    if ($(`body:contains(You are the last remaining character!!! You have won!)`).length == 1) {
        GM_setValue('seconds_totalkey', 0)

        var earned_win = $(`strong:contains(Your Final Score:)`).text()
        earned_win = Number(earned_win.substring(
            earned_win.indexOf(" = ") + 3,
            earned_win.lastIndexOf(")")
        ));

        earned_total += earned_win - 50;
        GM_setValue('earned_totalkey', earned_total)

        win_total++
        GM_setValue('win_totalkey', win_total)

        setTimeout(function () {
            $(`[value="Play Again"]`).click()
        }, getRandomInt(1000, 2000));

    } else if ($(`p:contains(Oh dear, you are out of the game )`).length == 1) {
        GM_setValue('seconds_totalkey', 0)

        earned_total += Number($(`p:contains(Oh dear, you are out of the game ) strong`).text()) - 50;
        GM_setValue('earned_totalkey', earned_total)

        setTimeout(function () {
            $(`[value="Play Again"]`).click()
        }, getRandomInt(1000, 2000));

    } else if ($(`strong:contains(The Gormball explodes on)`).length == 1){
        GM_setValue('seconds_totalkey', 0)
        setTimeout(function () {
            $(`[value="Continue!"]`).click()
        }, getRandomInt(1000, 2000));

    } else   if ($(`[style="background-color:#efefef;padding:6px;"]`).length == 1){
        GM_setValue('seconds_totalkey', 0)
        setTimeout(function () {
              $(`[style="background-color:#efefef;padding:6px;"] img[data-id="${getRandomInt(1, 9)}"]`).click()
        }, getRandomInt(1000, 2000));

    } else if( $(`strong:contains(Your Move)`).length == 1){

        seconds_waited = $(`span.block.medfont`).eq(1).text();
        seconds_waited = Number(seconds_waited.substring(
            seconds_waited.indexOf("waited ") + 7,
            seconds_waited.lastIndexOf(" second")
        ));

        seconds_total += seconds_waited;

        var length_to_wait = 5 - seconds_total;
        if (length_to_wait > 0) {
            $(`[name="turns_waited"]`).val(length_to_wait)
        } else {
            $(`[name="turns_waited"]`).val(1)
        }

        setTimeout(function () {
            $(`[value="Throw!"]`).click()
        }, getRandomInt(1500, 2500));
    } else{

        seconds_waited = $(`span.block.medfont`).eq(1).text();
        seconds_waited = Number(seconds_waited.substring(
            seconds_waited.indexOf("waited ") + 7,
            seconds_waited.lastIndexOf(" second")
        ));

        seconds_total += seconds_waited;
        GM_setValue('seconds_totalkey', seconds_total)

        setTimeout(function () {
            $(`[value="Next >>>"]`).click()
        }, getRandomInt(1000, 1500));
    }

})();