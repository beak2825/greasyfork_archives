// ==UserScript==
// @name         Cenzura DK
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Cenzuruje názvy vesnic, hráčů, souřadnice, ...
// @author       Darxeal
// @match        https://*/game.php?*
// @icon         https://www.google.com/s2/favicons?domain=divokekmeny.cz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439556/Cenzura%20DK.user.js
// @updateURL https://update.greasyfork.org/scripts/439556/Cenzura%20DK.meta.js
// ==/UserScript==

function censor() {
    // header
    $('.header.village').first().parent().contents()[1].textContent = "censored";
    $("#menu_row2 b").html("(420|420) K69");
    $("#rank_rank").html("69");
    $("#rank_points").html("69");
    $("#premium_points").remove();
    $(".flags_new").next().html("69");

    // footer
    $(".world_button_active").html("Svět 69");

    // nahled
    $("#show_summary>h4").html("censored");

    // oznamka
    if ($("#incomings_table").length == 0) $(".quickedit-label").html("censored");

    $('a[href*="screen=info_player"]').html("censored");
    $('a[href*="screen=info_village"]:not(#map)').html("censored");

    // mapa
    $("#map_legend").remove();
    $(".centercoord").val(0);
    $("#map_popup").remove();
    $("#continent_id").html("69");

    // poslat prikaz
    $(".village-name").html("censored");
    $(".village-info").html("censored");
    $("#command_change_sender").parent().html("censored");
    $("#command-data-form>h2").html("censored");

    // prikazy
    $('#incomings_table td a[href*="screen=overview"]').html("censored");

    // moje skripty
    $(".censor").html("censored");
}

(function() {
    'use strict';

    censor();

    setInterval(censor, 100);
})();