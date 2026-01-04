// ==UserScript==
// @name         Scorchy Slots AP
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      2025-06-14
// @description  Follows the advice of Jellyneo's Scorchy Slots guide
// @match        https://www.grundos.cafe/games/play_slots/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541899/Scorchy%20Slots%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/541899/Scorchy%20Slots%20AP.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var winnings = GM_getValue('winningsKey', []);
    var winnings_np = GM_getValue('winnings_npKey', 0);
    console.log(winnings_np)
    var winnings1 = GM_getValue('winningsoneKey', "");
    console.log(winnings1)
    $(`#scorchy-wrapper`).after(`<div style="text-align:left;display:flex;flex-direction:column-reverse">${winnings1}</div>`)

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }



    var row_json = [];
    var item_array = [];

    var payout = {
        'mappiece':0,
        'faerie':0,
        'cherry': 15,
        'strawberry': 30,
        'grapes': 60,
        'melon': 90,
        'apple': 120,
        'peach': 180,
        'bell': 240,
        'baggold': 600
    }


    $(`.scorchy-row:nth-child(2) img`).each(function(index){
        var pic = $(this).attr("src");
        //  console.log(pic)

        var item = pic.substring(
            pic.indexOf("ruits/") + 6,
            pic.lastIndexOf(".gif") - 2
        );
        //  console.log(item)

        item_array.push(item)

        var points  = Number(pic.substring(
            pic.lastIndexOf(".gif") - 1,
            pic.lastIndexOf(".gif")
        ));
        //     console.log(points)

        row_json.push({
            pic: pic,
            item: item,
            points: points,
        })

        if (index == 3){
            console.log(item_array)
        }

    })

    function hold_instructions(){
        // if has duplicates

        if (item_array[0] == item_array[1]||
            item_array[0] == item_array[2]||
            item_array[0] == item_array[3]||
            item_array[1] == item_array[2]||
            item_array[1] == item_array[3]||
            item_array[2] == item_array[3]){
            console.log(`has duplicates`)

            check_matches();

        } else {
            console.log(`no duplicates`)




            if (payout[item_array[0]] > payout[item_array[3]]){
                $(`.scorchy-row:nth-child(2) [src*="https://grundoscafe.b-cdn.net/games/slots/fruits/${item_array[0]}_"]`).each(function(){
                    console.log(`checking checkbox ${$(this).index()}`)
                    $(`[name="scorchy_hold_${$(this).index() - 1}"]`).prop( "checked", true );
                });
            } else {
                $(`.scorchy-row:nth-child(2) [src*="https://grundoscafe.b-cdn.net/games/slots/fruits/${item_array[3]}_"]`).each(function(){
                    console.log(`checking checkbox ${$(this).index()}`)
                    $(`[name="scorchy_hold_${$(this).index() - 1}"]`).prop( "checked", true );
                });
            }


        }
    }

    function check_matches(){
        var xxyz = false;
        var xxyy = false;

        var dups = [];
        var three_dups = false;
        var three_dups_item;


        for (var i = 0; i < 4; i++) {


            var matches_amount = 0;
            for (var j = 0; j < 4; j++) {
                if (item_array[i] == item_array[j]) {
                    matches_amount++
                }
                // console.log(`${item_array[i]} == ${item_array[j]}`)
                // console.log(matches_amount)
                if (j == 3) {
                    if (matches_amount == 2) {
                        //   console.log(`2 duplicates of ${item_array[i]}`)

                        if (!dups.includes(item_array[i])){
                            dups.push(item_array[i])
                        }
                    } else if (matches_amount == 3) {
                        //   console.log(`3 duplicates of ${item_array[i]}`)
                        three_dups = true;
                        three_dups_item = item_array[i];
                    }

                    if (i == 3) {
                        console.log(dups)

                        if (three_dups) {
                            console.log(`three_dups of ` + three_dups_item)

                            $(`.scorchy-row:nth-child(2) [src*="https://grundoscafe.b-cdn.net/games/slots/fruits/${three_dups_item}_"]`).each(function(){
                                console.log(`checking checkbox ${$(this).index()}`)
                                $(`[name="scorchy_hold_${$(this).index() - 1}"]`).prop( "checked", true );
                            });

                        } else {
                            determine_xxyz_or_xxyy(dups)
                        }
                    }
                }
            }

        }
    }


    function determine_xxyz_or_xxyy(dups){
        if (dups.length == 2) {
            console.log(`xxyy`)

            if (item_array[1] == item_array[2]){
                $(`[name="scorchy_hold_1"]`).prop( "checked", true );
                $(`[name="scorchy_hold_2"]`).prop( "checked", true );
                console.log(`checking checkbox 1 and 2`)

            } else {
                if (payout[dups[0]] > payout[dups[1]]){
                    $(`.scorchy-row:nth-child(2) [src*="https://grundoscafe.b-cdn.net/games/slots/fruits/${dups[0]}_"]`).each(function(){
                        console.log(`checking checkbox ${$(this).index()}`)
                        $(`[name="scorchy_hold_${$(this).index() - 1}"]`).prop( "checked", true );
                    });
                } else {
                    $(`.scorchy-row:nth-child(2) [src*="https://grundoscafe.b-cdn.net/games/slots/fruits/${dups[1]}_"]`).each(function(){
                        console.log(`checking checkbox ${$(this).index()}`)
                        $(`[name="scorchy_hold_${$(this).index() - 1}"]`).prop( "checked", true );
                    });
                }
            }

        } else if (dups.length == 1){
            console.log(`xxyz`)

            $(`.scorchy-row:nth-child(2) [src*="https://grundoscafe.b-cdn.net/games/slots/fruits/${dups[0]}_"]`).each(function(){
                console.log(`checking checkbox ${$(this).index()}`)
                $(`[name="scorchy_hold_${$(this).index() - 1}"]`).prop( "checked", true );
            });
        }
    }


    // hold_instructions()


    $(`[value="Play Again"]`).hide()
     $(`[value="Collect Winnings"]`).hide()

    if ($(`.scorchy-hold-node`).length == 4) {
        hold_instructions()
        setTimeout(function () {
            $(`[value="Play Again"]`).click()
            $(`[value="Collect Winnings"]`).click()

        }, getRandomInt(3000, 4000));
    } else {

        setTimeout(function () {
            $(`[value="Play Again"]`).click()
            $(`[value="Collect Winnings"]`).click()

        }, getRandomInt(1000, 2000));
    }


    var win_text;
        var today = new Date();
        var nstDate;
    if ($(`b:contains(THE VOLCANO ERUPTS!!!)`).length == 1){
        win_text = $(`b:contains(THE VOLCANO ERUPTS!!!)`).next().text();
        winnings.push(win_text);
        GM_setValue('winningsKey', winnings);

        add_winnings_np(win_text)


         nstDate = today.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
        console.log(`${nstDate}: ${win_text}`)


        winnings1 += `<div>${nstDate}: ${win_text}</div>`;
        GM_setValue('winningsoneKey', winnings1);



    } else if ( $(`#scorchy-wrapper p`).length == 1 ){
        win_text = $(`#scorchy-wrapper p:first`).text();
        winnings.push(win_text);
        GM_setValue('winningsKey', winnings);

        add_winnings_np(win_text)
        nstDate = today.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
        console.log(`${nstDate}: ${win_text}`)


        winnings1 += `<div>${nstDate}: ${win_text}</div>`;
        GM_setValue('winningsoneKey', winnings1);
    }

    function add_winnings_np(win_text){
        if (win_text == "A flock of Korbats surround you. When they leave you are 20 Neopoints poorer!") {
            winnings_np += -20;
        } else if (win_text == "An evil Scorchio flies out of the Volcano and steals 10 Neopoints from you!!") {
            winnings_np += -10;
        } else if (win_text == "One of your Neopoints erupts in flames!") {
            winnings_np += -1;
        } else if (win_text == "The Volcano says 'Sorry, out of luck mate!'") {
            winnings_np += 0;
        } else if (win_text == "A couple of Neopoints rain from the sky, you pick up a handful") {
            winnings_np += 3;
        } else if (win_text == "You only win a single Neopoint :(") {
            winnings_np += 1;
        } else if (win_text == "Two Neopoints fall out of the sky onto your head.") {
            winnings_np += 2;
        } else if (win_text == "It's raining Neopoints, you pick up as many as you can carry!") {
            winnings_np += 18;
        } else if (win_text == "Twenty Neopoints fly out of the volcano!!") {
            winnings_np += 20;
        } else if (win_text == "A light faerie magically appears next to you and gives you 30 Neopoints!") {
            winnings_np += 30;
        } else if (win_text == "A bag containing 50 Neopoints falls from the sky onto your foot.") {
            winnings_np += 50;
        } else if (win_text.includes("You win ")) {
            var pure_np = Number(win_text.substring(
                win_text.indexOf("You win ") + 9,
                win_text.lastIndexOf(" Neopoints!")
            ));
            winnings_np += pure_np;
        }


        GM_setValue('winnings_npKey', winnings_np);
    }

})();