// ==UserScript==
// @name         Opium Pulses AutoJoin
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  OP Autojoin!
// @author       Sergio Susa (http://sergiosusa.com)
// @match        http://www.opiumpulses.com/giveaways*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18487/Opium%20Pulses%20AutoJoin.user.js
// @updateURL https://update.greasyfork.org/scripts/18487/Opium%20Pulses%20AutoJoin.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$( document ).ready(function() {

    var url = "http://www.opiumpulses.com/giveaways?Giveaway_page=[NUM_PAGE]&Giveaway_status=active&Giveaway_who_can_join=everyone";

    if (window.location.href.indexOf("http://www.opiumpulses.com/giveaways/") > -1) { //dentro de una aplicación

        setInterval(function(){
            window.close();
        }, 5000);

    } else {

        var giveaways = $('.btn-success');

        for (var x = 0 ; x < giveaways.length && x < 10; x ++ ){

            giveaways[x].setAttribute('target', '_blank');
            giveaways[x].click();
        }

        if (giveaways.length == 0) { //no hay mas que aplicar a en esta página

            var page = getParameterByName('Giveaway_page');

            if (page == null) {
                page=1;
            } else
            {
                page++;
            }

            if (page > 10 )
            {

                setInterval(function(){
                    window.location="http://www.opiumpulses.com/giveaways?Giveaway_page=[NUM_PAGE]&Giveaway_status=active&Giveaway_who_can_join=everyone".replace("[NUM_PAGE]", 1);
                }, 3600000);

                return;
            }

            window.location="http://www.opiumpulses.com/giveaways?Giveaway_page=[NUM_PAGE]&Giveaway_status=active&Giveaway_who_can_join=everyone".replace("[NUM_PAGE]", page);

        } else
        {
            reloadPage(6000);
        }

    }

});

/***********************************************************
 *  Utility Functions
 **********************************************************/

function reloadPage(miliseconds) {
    setInterval(function(){
        window.location.reload();
    }, miliseconds);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
