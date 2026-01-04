// ==UserScript==
// @name         Kacheek Seek AP
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      2025-05-04
// @description  Auto plays kacheek seek
// @author       AyBeCee
// @match        https://www.grundos.cafe/games/kacheekseek/*
// @match       https://www.grundos.cafe/games/kacheekseek_process/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535447/Kacheek%20Seek%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/535447/Kacheek%20Seek%20AP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var count = GM_getValue('countKey', 1);

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }


    if ( $(`[shape="poly"]`).length > 0 ) {
        console.log(`clicking nth-child(${count})`)
        setTimeout(function () {
            $(`[shape="poly"]:nth-child(${count})`).click();
        }, getRandomInt(0, 2000));
    }



    if ($(`a:contains(click here to go back)`).length == 1) {
        count++
        GM_setValue('countKey', count);
        console.log(count)
        setTimeout(function () {
            window.location.href = $(`a:contains(click here to go back)`).attr("href");
        }, getRandomInt(0, 2000));
    }
    if ( $(`p:contains(you will have to refresh the main page to see your winnings!)`).length == 1 ) {
        GM_setValue('countKey', 1);
        setTimeout(function () {
            window.location.href = "https://www.grundos.cafe/games/kacheekseek/0/";
        }, getRandomInt(0, 2000));
    }

})();