// ==UserScript==
// @name         SteamCompanion AutoJoin
// @namespace    http://s3rxus.com
// @version      0.1
// @description  Auto join SteamCompanion
// @author       Sergio Susa
// @match        https://steamcompanion.com/gifts/*
// @grant        none
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/13565/SteamCompanion%20AutoJoin.user.js
// @updateURL https://update.greasyfork.org/scripts/13565/SteamCompanion%20AutoJoin.meta.js
// ==/UserScript==

$(document).ready(function() {

    if ($(".points")[0].innerHTML < 10) {

        setInterval(function(){
            window.location.reload();
        }, 3600000);

        return;

    }

    if (document.URL == "https://steamcompanion.com/gifts/") {
        window.location.href = "https://steamcompanion.com/gifts/search/?type=public";
    }

    if(document.URL.indexOf("search") != -1 ) {

        var links = $(".giveaway-links");

        var max = 0;

        for(var x = 0 ; x < links.length && max < 8 ; x++ ) {

            if (links[x].style.opacity != "0.5") {
                window.open(links[x].getAttribute("data-href"));
                max++;
            }
        }

        setInterval(function(){
            window.location.reload();
        }, 600000);

        return;

    } else {
        $("#enter-giveaway").click();
        $("#more_entries").click();
        setInterval(function(){
            window.close();
        }, 10000);
    }
});