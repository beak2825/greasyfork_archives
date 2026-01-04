// ==UserScript==
// @name         Pound Surf
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      20250708
// @description  Surf the pound
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @match        https://www.grundos.cafe/adopt/
// @match        https://www.grundos.cafe/petlookup/?pet_name=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535228/Pound%20Surf.user.js
// @updateURL https://update.greasyfork.org/scripts/535228/Pound%20Surf.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var refresh = true;
    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

    function showNotification() {
        new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3').play()
        if(window.Notification) {
            Notification.requestPermission(function(status) {
                console.log('Status: ', status); // show notification permission if permission granted then show otherwise message will not show
                var options = {
                    body: 'Found a cutie.', // body part of the notification
                    dir: 'ltr', // use for direction of message
                    image:'download.png' // use for show image
                }

                var n = new Notification('Title', options);
            });
        }
        else {
            alert('Your browser doesn\'t support notifications.');
        }
    }


    var petInfo = GM_getValue('petInfoKey', {});

    if (window.location.href.includes("https://www.grundos.cafe/adopt/")) {


        $(`.flex-column.small-gap.center-items img`).each(function(index){
            var url = $(this).attr("src");
            if ( url.includes("draik") || url.includes("krawk") ||url.includes("lupe_tyrannian") || url.includes("cybunny")  || url.includes("lutari") ||
                url.includes("bruce_ice.gif") || url.includes("gnorbu_darigan.gif") ){
                showNotification()
                refresh = false;
            }else if (
                url.includes("fire.gif") ||
                url.includes("split.gif") ||
                url.includes("glowing.gif") ||
                url.includes("spotted.gif") ||
                url.includes("christmas.gif") ||
                url.includes("usul_silver.gif") ||
                url.includes("ice.gif") ||
                url.includes("darigan") ||
                url.includes("rainbow") ||
                url.includes("disco.gif") ||
                url.includes("orange.gif") ||
                url.includes("tyrannian.gif") ||
                url.includes("yellow") ||
                url.includes("skunk.gif") ||
                url.includes("camouflage.gif") ||
                url.includes("speckled.gif") ||
                url.includes("glowing.gif") ||
                url.includes("zafara_yellow")  || url.includes("blue") || url.includes("red") ||  url.includes("sketch.gif") ||
                url.includes("blumaroo_shadow.gif")  ||  url.includes("green") ||  url.includes("ghost.gif") ||url.includes("invisible.gif") ||url.includes("lime.gif") ||
                url.includes("zafara_shadow.gif") || url.includes("snow.gif")|| url.includes("brown.gif") ||url.includes("pink.gif") ||url.includes("cloud.gif") ||url.includes("electric") || url.includes("kyrii_sketch.gif") || url.includes("gelert_orange.gif")||url.includes("nimmo_fire.gif")|| url.includes("speckled.gif")) {
                console.log(`not interested in ${url}`);
            } else {
                showNotification()
                refresh = false;
            }
        })
        var level = $(`strong:contains(level )`).text();
        level = Number(level.substring(6))
        if ( (level > 12) ) {
            // showNotification()
            // refresh = false;
        }

        setTimeout(function () {
            if (refresh) {
               $(`[value="Find a Neopet at Random"]`).click();
            } else {
            }
        }, getRandomInt(1000, 3000));

        $('.black').each(function(){
            var petName = $(this).text();

            if (petInfo[petName] != undefined){
                $(this).parent().after(`<br>Petpet: ${petInfo[petName]["Petpet"]}
                <br>Fishing: ${petInfo[petName]["Fishing"]}
                <br>HP: ${petInfo[petName]["HP"]}
                <br>Days: ${petInfo[petName]["Days"]}`)
            }
            if (petInfo[petName]["Fishing"] > 70) {

                showNotification()
                refresh = false;
            
            } else if (petInfo[petName]["Fishing"] > 40 && $(`.flex-column.small-gap.center-items img[src*="lupe"]`).length > 0) {

                showNotification()
                refresh = false;
            }

        })

    }

    if (window.location.href.includes("https://www.grundos.cafe/petlookup/?pet_name=") &&
       $(`.pet--owner:contains(In the)`).length == 1) {
        var petName = $('.pet--smallname').text();

        var fishingLvl = $('.pet--fishing').text();
        fishingLvl = Number(fishingLvl.substring(
            fishingLvl.indexOf("Level") + 5
        ));
        var age = Number($('.pet--age strong:nth-child(2)').text());
        var HP = $('.pet--hpcolor').text();
        HP = Number(HP.substring(
            HP.indexOf("/ ") + 2
        ));
        var petpet = $('.pet--petpetdesc').text();
        petpet = petpet.substring(
            petpet.indexOf("the ") + 4
        );

        petInfo[petName] = {
            "Petpet": petpet,
            "Fishing": fishingLvl,
            "HP": HP,
            "Days": age
        };
        GM_setValue('petInfoKey', petInfo);
    }

})();