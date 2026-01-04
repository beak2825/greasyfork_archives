// ==UserScript==
// @name         Dealabs Jeu Noel
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.dealabs.com/*
// @exclude      https://www.dealabs.com/xmas-game*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36348/Dealabs%20Jeu%20Noel.user.js
// @updateURL https://update.greasyfork.org/scripts/36348/Dealabs%20Jeu%20Noel.meta.js
// ==/UserScript==

(function() {
    if(!readCookie("caughtReindeers")) createCookie("caughtReindeers", 0, 8);
    var caughtOnes = parseInt(readCookie("caughtReindeers"));

    if(!readCookie("lastCaught")) createCookie("lastCaught", "Never", 8);
    var lastCaught = readCookie("lastCaught");

    console.log("Catch:", caughtOnes);

    if(!readCookie("lastError")) createCookie("lastError", "Never", 8);
    var lastError = readCookie("lastError");

    $("body").prepend(`Caught reindeers: ${caughtOnes} <br> Last caught: ${lastCaught} <br> Last Error: ${lastError}`);

    var keyRegex = /(?<=key":")[a-z0-9-]+(?=\")/g;
    var myTimeout;
    var original_jquery_ajax = $.ajax;
    
    $(document).ajaxSuccess(function(event, xhr, settings) {
        a_url = settings.url; 
        console.log(xhr.responseJSON);
        if (a_url.includes("/see")) {
            clearTimeout();

            var data = xhr.responseJSON;
            console.log('DATA CONTENT !!!');
            console.log(data);
            var myData = data.data.content;
            var myMatches = myData.match(keyRegex);
            var myKey = myMatches[0];

            $.post( "https://www.dealabs.com/mascotcards/claim", { key: myKey } ).done(function( data ) {
                console.log("Found reindeer with key:", myKey);
                document.write("<h1>FOUND !!!</h1>");
                createCookie("caughtReindeers", caughtOnes+1, 8);
                var time = new Date();
                createCookie("lastCaught", time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds(), 8);
                setTimeout(refreshThisSite, 10000);
            });
        }
        else
        {
            // if ( ! a_url.includes("/claim"))
            // {
            //     setTimeout(refreshThisSite, 10000);
            // }
        }
    });

    function refreshThisSite() {
        var myURLs =
            [ "https://www.dealabs.com/",
             "https://www.dealabs.com/bons-plans/seche-cheveux-babyliss-6604vpe-2000w-1135350",
             "https://www.dealabs.com/bons-plans/smartphone-52-sony-xperia-xz1-dual-full-hd-snapdragon-835-4-go-de-ram-64-go-noir-via-100eur-pour-la-reprise-dun-ancien-telephone-100eur-dodr-1135306",
             "https://www.dealabs.com/bons-plans/firewatch-sur-pc-dematerialise-1135427",
             "https://www.dealabs.com/nouveaux",
             "https://www.dealabs.com/bons-plans/rocket-league-sur-nintendo-switch-dematerialise-1135502",
             "https://www.dealabs.com/bons-plans/lot-de-6-barquettes-st-moret-aperivrais-6x100g-differentes-varietes-via-bdr-odr-1135332",
             "https://www.dealabs.com/bons-plans/coffret-10-dvd-integrale-tintin-lintegrale-de-la-serie-et-des-longs-metrages-danimation-edition-limitee-1135392",
             "https://www.dealabs.com/bons-plans/outil-de-diagnostic-de-vehicule-elm327-obd2-bluetooth-bleu-1135355",
             "https://www.dealabs.com/bons-plans/distribution-gratuite-de-5-ampoules-led-tout-public-chu-bordeaux-33-1135358",
             "https://www.dealabs.com/bons-plans/50-sur-le-2eme-lego-star-wars-le-moins-cher-1135248",
             "https://www.dealabs.com/bons-plans/panier-plus-cordon-ethernet-rj45-1m-cat-6-sftp-lszh-1135336",
             "https://www.dealabs.com/bons-plans/brasero-de-jardin-deuba-pyramide-102x35x35-cm-1134671",
             "https://www.dealabs.com/bons-plans/destiny-2-xbox-one-et-ps4-1135245",
             "https://www.dealabs.com/bons-plans/pot-de-nutella-950g-via-190eur-sur-la-carte-fidelite-1135346"];
        var myURL = myURLs[Math.floor(Math.random()*myURLs.length)];

        window.location.replace(myURL);
    }
    function createCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    setTimeout(refreshThisSite, 10000);
})();