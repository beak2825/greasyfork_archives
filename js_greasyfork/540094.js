// ==UserScript==
// @name         Auto Battler
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      20250707
// @description  auto battles
// @match        https://www.grundos.cafe/dome/1p/battle/*
// @match        https://www.grundos.cafe/dome/1p/select/*
// @match        https://www.grundos.cafe/dome/1p/endbattle/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540094/Auto%20Battler.user.js
// @updateURL https://update.greasyfork.org/scripts/540094/Auto%20Battler.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var beaten_by_array = GM_getValue('beaten_by_arrayKey', []);
    var rematch = GM_getValue('rematchKey', false);



    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

    $(`#dailychallenge button.btn-link.ignore-button-size:first`).attr("onclick","")

    $(`#page_content`).prepend(`<input type="checkbox" id="rematch_status" name="rematch_status">
<label for="rematch_status">rematch?</label>`)
    $(`#rematch_status`).prop('checked', rematch);

    $(`#rematch_status`).change(function(){
        if ($(this).is(':checked')){
            GM_setValue('rematchKey', true);
        } else {
            GM_setValue('rematchKey', false);
        }
    })

    if (window.location.href.includes("https://www.grundos.cafe/dome/1p/battle/")){

        var hpstring = $(`[valign="middle"] strong`).text();
        var hp = Number( hpstring.substring(0,hpstring.lastIndexOf(" / "))                   );
        var hptotal = Number(hpstring.substring(
            hpstring.indexOf(" / ") + 3
        ));

        $('.centered-item.relic input').prop( "checked", false);


        if ( hp >= hptotal) {
            if ($(`[src="https://grundoscafe.b-cdn.net/items/darknova.gif"]`).length > 0 ) {
                $(`[src="https://grundoscafe.b-cdn.net/items/bd_smugglers_amulet.gif"]:first`).parent().find('input').prop( "checked", true );
                $(`[src="https://grundoscafe.b-cdn.net/items/darknova.gif"]:first`).parent().find('input').prop( "checked", true );
            } else   if ($(`[src="https://grundoscafe.b-cdn.net/items/rod_darknova.gif"]`).length == 1) {
                $(`[src="https://grundoscafe.b-cdn.net/items/bd_smugglers_amulet.gif"]:first`).parent().find('input').prop( "checked", true );
                $(`[src="https://grundoscafe.b-cdn.net/items/rod_darknova.gif"]`).parent().find('input').prop( "checked", true );
            }
        } else {
            $(`#page_content`).prepend(`heal`)

            if ($(`[src="https://grundoscafe.b-cdn.net/items/darknova.gif"]`).length > 0 ) {
                $(`[src="https://grundoscafe.b-cdn.net/items/darknova.gif"]:first`).parent().find('input').prop( "checked", true );
                $(`[src="https://grundoscafe.b-cdn.net/items/rod_darknova.gif"]`).parent().find('input').prop( "checked", true );
            } else   if ($(`[src="https://grundoscafe.b-cdn.net/items/rod_darknova.gif"]`).length == 1) {
                $(`[src="https://grundoscafe.b-cdn.net/items/bd_smugglers_amulet.gif"]:first`).parent().find('input').prop( "checked", true );
                $(`[src="https://grundoscafe.b-cdn.net/items/rod_darknova.gif"]`).parent().find('input').prop( "checked", true );
            }

        }

    }
    // $('body').append(`<style>input#bd-go-button {position:fixed;top:0;width:100px;height:100px;}</style>`)
    if (
        $('.centered-item.relic input:checked').length == 2 || $(`img[src="https://grundoscafe.b-cdn.net/battledome/icons/frozen.gif"]`).length == 1) {

$(`#hpbars strong`).each(function(){
    var hp_raw = $(this).text();
    var current = Number(hp_raw.substring(0,    hp_raw.lastIndexOf(" / ")));
    var total = Number(hp_raw.substring(    hp_raw.lastIndexOf(" / ")+3));

    console.log(current)
    console.log(total)

    $(this).after(`<div style="background:#ccc;height:10px;">
    <div style="background:linear-gradient(to left,#12c2e9,#c471ed,#f64f59);height:10px;width:${current/total*150}px"></div>
    </div>`)
})


        setTimeout(function () {
             $(`#bd-go-button`).click()
        }, getRandomInt(1000, 2000));
    }


    // withdraw before losing/drawing a fight
    if ($('#end_blurb').text().includes('You have lost this fight!') || $('#end_blurb').text().includes('You have drawn this fight!')) {
        setTimeout(function () {
            window.location.href = 'https://www.grundos.cafe/dome/status/';
        }, getRandomInt(1500, 2500));

        var beaten_by = $(`b:contains(has beaten you!)`).text();
        beaten_by = beaten_by.substring(0,beaten_by.lastIndexOf(" has beaten you!"));
        console.log(beaten_by)

        beaten_by_array.push(beaten_by);
        GM_setValue('beaten_by_arrayKey', beaten_by_array);

    } else     if (    $(`font[point-size="20"][size="5"]:contains(You have beaten)`).length == 1 ){

        $(`#bd-form-end [value="Next"]`).hide()
        setTimeout(function () {
            $(`#bd-form-end [value="Next"]`).click()
        }, getRandomInt(500, 1500));
    }



    if (window.location.href.includes("https://www.grundos.cafe/dome/1p/endbattle/") ){
        if ($(`font[point-size="20"][size="5"]:first:contains(Winner)`).length == 1 && rematch) {
            setTimeout(function () {
                $(`#bd-rematch-button`).click()
            }, getRandomInt(1000, 2000));
        }
    }

    if (window.location.href.includes("/dome/1p/select/")){
        $(`#challengerlist td:nth-child(2)`).each(function(index){
            if (index > 0 ) {
                var difficulty_text =  $(this).text().trim();
                var total = Number(difficulty_text.substring(0, difficulty_text.lastIndexOf("+"))) + Number(difficulty_text.substring(difficulty_text.lastIndexOf("+")));
                console.log(total)
                $(this).append(`<br>${total}`)
            }
        })
        $(`#challengerlist td:nth-child(1)`).each(function(index){
            var name = $(this).text().trim();
            console.log(name)
            if (beaten_by_array.indexOf(name) >= 0){
                $(this).prepend(`beaten by `)
            }

        })
    }
})();