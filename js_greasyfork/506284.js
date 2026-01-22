// ==UserScript==
// @name         Lobbyfilter for Autodarts
// @namespace    http://tampermonkey.net/
// @version      0.3
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

    GM_addStyle('#gamemode, #avgmenumin, #avgmenumax, #sidomenu, #plusmenu { width: 100px; padding: 5px 10px 5px 10px; } .tm_menu1 { } .tm_menu2 {  } .tm_menu3{ } .tm_menu4{ } .hide {display: none !important;} ');

    let gamemode = 'All';
    let minavg = 'All';
    let maxavg = 'All';
    let sidomode = 'All';
    let plus = 'All';

    setInterval(function() {


if( window.location.href.indexOf("lobbies") != -1
   &&  window.location.href.indexOf("lobbies/") == -1 ) {

        $('.chakra-card').each(function(i, obj) {
            var search = gamemode+'</span>';
            var searchsido = sidomode+'</span>';
            var avg = $(this).find(".chakra-badge").eq(0).text();
            avg = parseInt(avg.slice(0, -1));
            var searchplus = plus;

            /////////////// Plus CHECK ///////////////////////////
            if( $(this).html().indexOf(searchplus) != -1 || plus == 'All'   ){
                $(this).eq(0).find("l5at91");
            }
            else {
                $(this).addClass('hide');
            }

            /////////////// AVG CHECK ///////////////////////////
            if(  (avg >= minavg || minavg == 'All') && avg != 'NaN') {
                $(this).find(".chakra-badge").css('border','2px solid green');
            }
            else {
                $(this).addClass('hide');
            }

            /////////////// AVG MAX CHECK ///////////////////////////
            if(  (avg <= maxavg || maxavg == 'All') && avg != 'NaN') {
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

                $(".chakra-heading").after('<div style="" class="tm_menu"><div class="chakra-wrap css-1qfb0s7"  style="float: left;"><ul class="chakra-wrap__list css-19lo6pj"><div class="chakra-stack css-1igwmid"><div class="css-0">Game:</div><div class="css-1domaf0"><div class="chakra-select__wrapper css-42b2qy"><select class="chakra-select css-1wq9qmd" id="gamemode" style="width:100px;"><option value="All">All</option><option value="301">301</option><option value="501">501</option><option value="CountUp">CountUp</option><option value="RTW">RTW</option><option value="Cricket">Cricket</option><option value="Tactics">Tactics</option><option value="Random Checkout">Random CheckOut</option></select></div></ul></div></div>');

                $(".tm_menu").after('<div style="" class="tm_menu1"><div class="chakra-wrap css-1qfb0s7"><ul class="chakra-wrap__list css-19lo6pj"><div class="chakra-stack css-1igwmid"><div class="css-0">Min:</div><div class="css-1domaf0"><div class="chakra-select__wrapper css-42b2qy"><select class="chakra-select css-1wq9qmd" id="avgmenumin" style="width:60px;"><option value="All" >All</option><option value="25">25+</option><option value="30">30+</option><option value="35">35+</option><option value="40">40+</option><option value="45">45+</option><option value="50">50+</option><option value="55">55+</option><option value="60">60+</option><option value="65">65+</option><option value="70">70+</option><option value="75">75+</option><option value="80">80+</option></select></div></ul></div></div>');

                $(".tm_menu1").after('<div style="" class="tm_menu2"><div class="chakra-wrap css-1qfb0s7"><ul class="chakra-wrap__list css-19lo6pj"><div class="chakra-stack css-1igwmid"><div class="css-0">Max:</div><div class="css-1domaf0"><div class="chakra-select__wrapper css-42b2qy"><select class="chakra-select css-1wq9qmd" id="avgmenumax" style="width:60px;"><option value="All" >All</option><option value="25">25+</option><option value="30">30+</option><option value="35">35+</option><option value="40">40+</option><option value="45">45+</option><option value="50">50+</option><option value="55">55+</option><option value="60">60+</option><option value="65">65+</option><option value="70">70+</option><option value="75">75+</option><option value="80">80+</option></select></div></ul></div></div>');

                $(".tm_menu2").after('<div style="" class="tm_menu3"><div class="chakra-wrap css-1qfb0s7"><ul class="chakra-wrap__list css-19lo6pj"><div class="chakra-stack css-1igwmid"><div class="css-0">Mode:</div><div class="css-1domaf0"><div class="chakra-select__wrapper css-42b2qy"><select class="chakra-select css-1wq9qmd" id="sidomenu" style="width:75px;"><option value="All" >All</option><option value="SI-SO">SI-SO</option><option value="SI-DO">SI-DO</option><option value="SI-MO">SI-MO</option><option value="DI-SO">DI-SO</option><option value="DI-DO">DI-DO</option><option value="DI-MO">DI-MO</option><option value="MI-SO">MI-SO</option><option value="MI-DO">MI-DO</option><option value="MI-MO">MI-MO</option></select></div></ul></div></div>');

                $(".tm_menu3").after('<div style="" class="tm_menu4"><div class="chakra-wrap css-1qfb0s7"><ul class="chakra-wrap__list css-19lo6pj"><div class="chakra-stack css-1igwmid"><div class="css-0">Plus:</div><div class="css-1domaf0"><div class="chakra-select__wrapper css-42b2qy"><select class="chakra-select css-1wq9qmd" id="plusmenu" style="width:75px;"><option value="All" >All</option><option value="plus">plus</option></select></div></ul></div></div>');


            }
        });
  }

    }, 1000);

    $(document).on('change', '#plusmenu', function(){
        $(".hide").removeClass("hide");
        plus = $("#plusmenu").find(":selected").val();
        //console.log('Sido-val: '+plus);
    })

    $(document).on('change', '#sidomenu', function(){
        $(".hide").removeClass("hide");
        sidomode = $("#sidomenu").find(":selected").val();
        //console.log('Sido-val: '+sidomode);
    })

    $(document).on('change', '#gamemode', function(){
        $(".hide").removeClass("hide");
        gamemode = $("#gamemode").find(":selected").val();
        //console.log('Gamemode: '+gamemode);
    })

    $(document).on('change', '#avgmenumin', function(){
        $(".hide").removeClass("hide");
        minavg  = $("#avgmenumin").find(":selected").val();
        //console.log('min-avg : '+minavg );
    })

    $(document).on('change', '#avgmenumax', function(){
        $(".hide").removeClass("hide");
        maxavg  = $("#avgmenumax").find(":selected").val();
        //console.log('min-avg : '+minavg );
    })


})();