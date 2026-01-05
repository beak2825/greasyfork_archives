// ==UserScript==
// @name         the100 24h format
// @namespace    https://www.the100.io/
// @version      0.1
// @description  12h to 24h format converter
// @author       Fryde
// @match        https://www.the100.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20848/the100%2024h%20format.user.js
// @updateURL https://update.greasyfork.org/scripts/20848/the100%2024h%20format.meta.js
// ==/UserScript==

(function() {

    var times = document.getElementsByClassName('game-time');

    for ( i=0; i<times.length; i++) {

        var old = times[i].innerHTML;

        var regex = /([01]?\d)(:\d{2}) (AM|PM)/ig;
        var match = regex.exec(old);

        //12:00 -> 00:00
        match[1] = match[1]%12;
        //add 12h for pm
        if( match[3] == "PM" || match[3] == "pm") match[1] += 12;
        //add leading 0 if needed
        if( match[1] < 10) match[1] = "0"+match[1];

        times[i].innerHTML = old.replace(regex, match[1] + match[2] + ' Uhr');
        //add old time to title attribute
        times[i].title=old;

    }


})();