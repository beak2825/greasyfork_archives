// ==UserScript==
// @name         Lobbyfilter for Autodarts
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Lobbyfilter for gamemode, AVG & In/Out-Mode
// @author       benebelter
// @match        https://play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/506284/Lobbyfilter%20for%20Autodarts.user.js
// @updateURL https://update.greasyfork.org/scripts/506284/Lobbyfilter%20for%20Autodarts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('#gamemode, #avgmenu { min-width: 150px; padding: 5px 10px 5px 10px; } .tm_menu1 {min-width: 300px; text-align: left; } .tm_menu2{min-width: 300px; text-align: left;  margin-left: 15px;} .hide {display: none !important;} ');

    let gamemode = 'All';
    let minavg   = 'All';
    let sidomode = 'All';

    setInterval(function() {


if( window.location.href.indexOf("lobbies") != -1
   &&  window.location.href.indexOf("lobbies/") == -1 ) {

        $('.chakra-card').each(function(i, obj) {
            var search = gamemode+'</span>';
            var searchsido = sidomode+'</span>';
            var avg = $(this).find(".chakra-badge").eq(0).text();
            avg = parseInt(avg.slice(0, -1));

            //console.log(avg);



            /////////////// AVG CHECK ///////////////////////////
            if(  (avg >= minavg  || minavg == 'All') && avg != 'NaN') {
                $(this).find(".chakra-badge").css('border','2px solid green');
            }
            else {
                $(this).addClass('hide');
            }

            /////////////// Gamemode CHECK ///////////////////////////
            if( $(this).html().indexOf(search) != -1 || gamemode == 'All'   ){
                $(this).find(".css-1xbroe7").eq(0).css('border','2px solid green');
            }
            else {
                $(this).addClass('hide');
            }

            /////////////// SIDO CHECK ///////////////////////////
            if(  $(this).html().indexOf(searchsido) != -1 || sidomode == 'All' ) {
                $(this).find(".css-1xbroe7").eq(1).css('border','2px solid green');
            }
            else {
               $(this).addClass('hide');
            }

 
            //Menu
            if($("#gamemode").length == 0 && window.location.href.indexOf("lobbies") != -1 &&  window.location.href.indexOf("lobbies/new/") == -1 ) {

                $(".chakra-heading").after('<div style="" class="tm_menu"><div class="chakra-wrap css-1qfb0s7"  style="float: left;"><ul class="chakra-wrap__list css-19lo6pj"><div class="chakra-stack css-1igwmid"><div class="css-0">Gametype:</div><div class="css-1domaf0"><div class="chakra-select__wrapper css-42b2qy"><select class="chakra-select css-1wq9qmd" id="gamemode" style=""><option value="All">All</option><option value="501">501</option><option value="301">301</option><option value="CountUp">CountUp</option><option value="Cricket">Cricket</option><option value="Random Checkout">Random Checkout</option></select></div></ul></div></div>');

                $(".tm_menu").after('<div style="" class="tm_menu1"><div class="chakra-wrap css-1qfb0s7"><ul class="chakra-wrap__list css-19lo6pj"><div class="chakra-stack css-1igwmid"><div class="css-0">Minimum AVG:</div><div class="css-1domaf0"><div class="chakra-select__wrapper css-42b2qy"><select class="chakra-select css-1wq9qmd" id="avgmenu"><option value="All" >All</option><option value="35">35+</option><option value="40">40+</option><option value="45">45+</option><option value="50">50+</option><option value="55">55+</option><option value="60">60+</option><option value="65">65+</option><option value="70">70+</option></select></div></ul></div></div>');

                $(".tm_menu1").after('<div style="" class="tm_menu2"><div class="chakra-wrap css-1qfb0s7"><ul class="chakra-wrap__list css-19lo6pj"><div class="chakra-stack css-1igwmid"><div class="css-0">Gamemode:</div><div class="css-1domaf0"><div class="chakra-select__wrapper css-42b2qy"><select class="chakra-select css-1wq9qmd" id="sidomenu"><option value="All" >All</option><option value="SI-DO">Single In - Double Out</option><option value="DI-DO">Double In - Double Out</option><option value="SI-SO">Single In - Single Out</option><option value="SI-MO">Single In - Master Out</option></select></div></ul></div></div>');


            }
        });
  }

    }, 1000);

    $(document).on('change', '#sidomenu', function(){
        $(".hide").removeClass("hide");
        sidomode = $("#sidomenu").find(":selected").val();
        console.log('Sido-val: '+sidomode);
    })

    $(document).on('change', '#gamemode', function(){
        $(".hide").removeClass("hide");
        gamemode = $("#gamemode").find(":selected").val();
        console.log('Gamemode: '+gamemode);
    })

    $(document).on('change', '#avgmenu', function(){
        $(".hide").removeClass("hide");
        minavg  = $("#avgmenu").find(":selected").val();
        console.log('min-avg : '+minavg );
    })

})();