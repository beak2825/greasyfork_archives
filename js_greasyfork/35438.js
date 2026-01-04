// ==UserScript==
// @name        ABSIFY
// @namespace   http://localhost
// @description ABSIFY your life, yo!
// @version     2.5
// @include     http://*
// @include     https://*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @resource    background http://image.noelshack.com/fichiers/2017/47/1/1511180327-absi-bolleke-original.png
// @downloadURL https://update.greasyfork.org/scripts/35438/ABSIFY.user.js
// @updateURL https://update.greasyfork.org/scripts/35438/ABSIFY.meta.js
// ==/UserScript==
// --------------------------------------------------------------------------------------------------------------------------------

(function() {
    function fishLaunch(){
        var height = Math.floor((Math.random() * 300) + 100);
        $("#fishay").css({
            "left":"-200px",
            "top": height+"px"
        });
        $("#fishay").animate({"left":"2000"}, 20000, fishLaunch);
    }

    $.wait = function(ms) {
        var defer = $.Deferred();
        setTimeout(function() { defer.resolve(); }, ms);
        return defer;
    };

    // Add a custom BACKGROUND
    var b = document.body;

    var fishy = document.createElement("img");
    fishy.setAttribute("src", "http://image.noelshack.com/fichiers/2017/47/2/1511258518-2017-11-21.png");
    fishy.setAttribute("id", "fishay");
    b.appendChild(fishy);
    $("#fishay").css({
        "position":"fixed",
        "left":"-200px",
        "top":"150px",
        "height": "75px",
        "width": "110px",
        "z-index": "999"
    });

    // Set a background image
    b.style.background = '#ccc url("http://image.noelshack.com/fichiers/2017/47/1/1511180327-absi-bolleke-original.png") no-repeat center center fixed';

    // Set the size of the image to fit
    b.style.backgroundSize = "cover";

    var digifacts = [
        "You need to go DIGITAL for the FUTURE",
        "DIGITAL driven API development!",
        "Powered by DIGITAL",
        "Get in the customer DIGITAL shoes!",
        "DIGITALIZE the future of tomorrow, today!",
        "DIGITAL Marketing",
        "Just DO it",
        "Continuous DIGITAL integration",
        "Ahead of the DIGITAL curve"
    ];
    $('h1,h2,h3,h4').each(function(){
       $(this).text(digifacts[Math.floor((Math.random() * 9)+0)]);
    });
    setTimeout(function() {
        fishLaunch();
    }, 10000);
})();