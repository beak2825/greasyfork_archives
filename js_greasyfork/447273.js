// ==UserScript==
// @name         UtopiaLogin
// @version      2.0
// @description  feel free to donate: 3Q5QzL6iZHyDPTpLYaNhDA2UhRUTxf8D4t
// @author       Derko
// @match        https://utopia-game.com/shared/*
// @grant        none
// @namespace    https://greasyfork.org/users/229236-derko
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447273/UtopiaLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/447273/UtopiaLogin.meta.js
// ==/UserScript==


(function () {
    'use strict';

    var body = $('body');
    var points = {};
    //
    var gamer_version = GM_info.script.version;
    var gamer_email = $("#contact_form_email").val();
    var gamer_withdraw_btc_address = $("#edit_profile_form_btc_address").val();
    //console.log("e-mail: " + gamer_email + "");
    //console.log("withdraw btc: " + gamer_withdraw_btc_address + "");
    var btc_avail = $("#balance").text();
    var bonus_account_balance = "0.00000000";
    var bonus_msg = $('.dep_bonus_max:eq(0)').text();

    //config variables
    var WALK = false; //dali da zalupva linkovete
    var PLAY = false; //dali vaobshte da klika
    var TPA = 1;
    var OPA = 1; //off
    var DPA = 1; //def
    var EPA = 0; //elites
    //
    var _random = 0; //kolko sekundi da chaka predi da izbere drug link
    var _relax = 0; //kolko sekundi da pochiva
    var _sci = 0; //poseshtenija na linka
    var _army = 0; //poseshtenija na linka
    //
    var SCI = [];
    var land = 400;
    var runes = 0;
    //
    var autowithdraw = false;
    //
    var last_task_id = 0;
    var capctha_errors = 0;
    var btc_before_bet = -123;
    //
    var minutes_left = 60;
    var seconds_left = 60;
    //
    var myCounter = -1;
    //
    $('<div id="tools" style="z-index: 99;width: 100%;position: fixed;top: 0px;left: 0;margin: 0 auto;background-color: gray;text-align:right;float:right;">\n\
<span id="greasyfork"                  style="margin: 2px; color: black; " ><a href="https://greasyfork.org/en/scripts/424172-betmanager" target="_blank">BetManager</a></span>\n\
<span id="gamer_play_status"           style="margin: 2px; background-color: coral; " > </span>\n\
<span id="gamer_bonus_account_balance" style="margin: 2px; background-color: rgb(51, 255, 51); " >bonus </span>\n\
<span id="gamer_btc_avail"             style="margin: 2px; background-color: lightblue; bold; display: none; " >btc_avail</span>\n\
<span id="gamer_email"                 style="margin: 2px; color: darkred; " >e-mail</span>\n\
<span id="gamer_version"               style="margin: 2px; background-color: coral; " >ver. </span>\n\
</div>').prependTo('body');

    //

    function Marker() {
        if ( ($('#signInForm').is(':visible')) && ($('#id_username').is(':visible')) ) {
            $(document).prop('title', 'signInForm');
        }
    }
    setInterval(Marker, 1000);

    function Kernel() {
        if ( ($('#signInForm').is(':visible')) && ($('#id_username').is(':visible')) ) {
            clearInterval(KernelInterval);
            $("#signInForm").submit();
        }
    }
    var KernelInterval = setInterval(Kernel, 15000);


    //
})();