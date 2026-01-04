// ==UserScript==
// @name         Kissanime ad remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://kissanime.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370298/Kissanime%20ad%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/370298/Kissanime%20ad%20remover.meta.js
// ==/UserScript==
// Anonymous "self-invoking" function


/* including jquery package */
(function() {
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function() {
        var $ = window.jQuery;
        // Use $ here...
    };
    document.getElementsByTagName("head")[0].appendChild(script);
})();


// onload
window.onload = function() {


    // all the advertisement objects found by id in an array
    var advertisements = [
        // advertisement on episode list page
        $('#adsIfrme1'),
        // just in case advertisement objects
        $('#adsIfrme2'),
        $('#adsIfrme3'),
        $('#adsIfrme4'),
        $('#adsIfrme5'),
        //when watching anime advertisements
        $('#adsIfrme6'),
        $('#adsIfrme7'),
        //side bar advertisements
        $('div').filter(function() {
            return $(this).css('left') == '0px' &&
                $(this).css('position') == 'fixed' &&
                $(this).css('height') == '768px';
        })
    ];

    //for every ad if it exists remove it
    for (var ad of advertisements) {
            ad.remove();
    }
}