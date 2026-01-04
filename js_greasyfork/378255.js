// ==UserScript==
// @name         TagPro Region Select
// @description  Select your preferred region from the profile page or while "waiting for eligibility"
// @author       Ko
// @version      1.2
// @match        *://*.koalabeast.com/*
// @match        *://*.jukejuice.com/*
// @match        *://*.newcompte.fr/*
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @website      https://redd.it/aunqi0
// @license      MIT
// @require      https://greasyfork.org/scripts/371240-TPUL.js
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/378255/TagPro%20Region%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/378255/TagPro%20Region%20Select.meta.js
// ==/UserScript==

/* global tagpro, tagproConfig, $, tpul */

(function(){

    // Immediately show the selection and enable the input
    // while finding a game (even when "waiting for eligibility")

    if (tpul.playerLocation == 'find') {

        $("#settings .js-cookie").prop("disabled", false)
        $("#settings .js-send-settings").show()
        $("#settings").show()

        tagpro.rawJoinerSocket.on('settings', function(){
            // as soon as we get the updated settings from the server,
            // forcibly save server-chosen settings to the cookies.
            // (to fix a problem in case you select nothing, and the server auto-selects a region and mode for you)

            // Get the current selection

            var regions = $("#regions .js-cookie:checked").map( function(i,region){ $(region).data("region") }).get()
            var gameModes = $("#gameModes .js-cookie:checked").map( function(i,mode){ $(mode).data("mode") }).get()

            // Save to the cookies

            $("#settings .js-cookie").each(function() {
                var name = $(this).prop("name"),
                    checked = $(this).prop("checked")
                $.cookie(name, checked, { expires: 36500, path: "/", domain: tagproConfig.cookieHost })
            })
        })

        // Show some feedback

        $("#settings .btn.js-send-settings").before('<div id=regions-status style="display: none;">Regions saved!').click(function(){
            $("#regions-status").slideDown()
            setTimeout( function(){ $("#regions-status").slideUp() }, 3e3)
        })

    }


    // Show the region selection on the profile/settings page as well

    if (tpul.playerLocation == 'profile' || tpul.playerLocation == 'settings') {

        // A new header for "Region Select"

        $("#settings, .card:first").before('<div id=region-select class="profile-settings block"><h3 class=header-title>Region Select</h3><form class=form-horizontal><div class=form-group></div><hr><div id=save-group class=form-group>')

        // Fetch the currently available regions and gamemodes (from /games/find)

        $("#region-select .form-group:first").load("/games/find #regions, #gameModes", function(){
            $("#regions").before('<label class="col-sm-4 control-label">Regions</label>').css('margin-bottom','15px')
            $("#gameModes").before('<label class="col-sm-4 control-label">Game modes</label>')
            $("#regions, #gameModes").addClass('col-sm-8')

            // Select the currently enabled regions/modes (from the cookies)

            $("#region-select .js-cookie").each(function() {
                var name = $(this).prop("name")
                $(this).prop("checked", $.cookie( name ) == "true")
            }).prop("disabled", false)
        })

        // The save button

        $("#save-group").append('<div class="col-sm-12 text-right"><div id=regions-status style="display: none;">Regions saved!</div><button id="saveRegions" class="btn" type="button">Save Regions')
        $("#regions-status").css('margin-bottom', '20px')

        $("#save-group button").click(function(){

            // Get the current selection

            var regions = $("#regions .js-cookie:checked").map( function(i,region){ $(region).data("region") }).get()
            var gameModes = $("#gameModes .js-cookie:checked").map( function(i,mode){ $(mode).data("mode") }).get()

            // Save to the cookies

            $("#region-select .js-cookie").each(function() {
                var name = $(this).prop("name"),
                    checked = $(this).prop("checked")
                $.cookie(name, checked, { expires: 36500, path: "/", domain: tagproConfig.cookieHost })
            })

            // Show some feedback

            $("#regions-status").slideDown()
            setTimeout( function(){ $("#regions-status").slideUp() }, 3e3)
        })

        // Slightly change the style when not logged in

        if (tpul.playerLocation == 'settings') {
            $("#region-select").addClass('card')
            $("#region-select h3").replaceWith('<h1>Region Select')
            $("#region-select .text-right").removeClass('text-right').addClass('text-center')
        }
    }

})()