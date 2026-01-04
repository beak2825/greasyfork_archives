// ==UserScript==
// @name         Stamp Tracker
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      2025-05-13
// @description  Tracks your stamps
// @author       AyBeCee
// @match        https://www.grundos.cafe/stamps/*
// @match        https://www.grundos.cafe/useobject/*
// @match        https://www.grundos.cafe/viewshop/?shop_id=58
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535333/Stamp%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/535333/Stamp%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

    var stampsArray = GM_getValue('stampsArrayKey', []);

    var URL_array = ["https://www.grundos.cafe/stamps/album/?page_id=0&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=1&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=2&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=3&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=4&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=5&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=6&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=7&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=8&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=9&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=10&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=11&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=12&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=13&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=15&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=16&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=43&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=44&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=45&owner=",
                     "https://www.grundos.cafe/stamps/album/?page_id=46&owner="]

    $(`#stamp_tbl img`).each(function (index) {
        if ($(this).attr("src") !== "https://grundoscafe.b-cdn.net/misc/no_stamp.gif") {
            var stampName = $(this).attr("alt");
            stampsArray.push(stampName)
        }

        if ($(`#stamp_tbl img`).length == index + 1) {
            var index_array = URL_array.indexOf(window.location.href);
            GM_setValue('stampsArrayKey', stampsArray);

            console.log(index_array)
            console.log(URL_array.length)
            console.log((index_array < URL_array.length))

            if ( window.location.href != "https://www.grundos.cafe/stamps/album/?page_id=46&owner=" ) {

                console.log(stampsArray)
                setTimeout(function () {
                    window.location.href = URL_array[index_array + 1];
                }, getRandomInt(0, 1000));

            }
        }



    })

    if ( $(`body:contains(to your stamp album!)`).length > 0 ){
        console.log(111)
        var stampNameAdded = $(`strong`).text();
        console.log(stampNameAdded)
        stampsArray.push(stampNameAdded)
        GM_setValue('stampsArrayKey', stampsArray);
    }


    if ( window.location.href.indexOf("/viewshop/?shop_id=58")){
        $(`.searchhelp`).each(function () {

            var itemName = $(this).attr("id");
            itemName = itemName.substring(0, itemName.length - 6)
            console.log(itemName)
            if (stampsArray.indexOf(itemName) > -1) {
                console.log(`you own ${itemName}`);
            } else {
                $(this).parent().css("background","yellow")
                console.log(`you don't own ${itemName}`);
            }

        })
    }

})();