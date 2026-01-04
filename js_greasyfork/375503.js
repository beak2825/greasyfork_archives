// ==UserScript==
// @name         Bluestream accessibility fix
// @namespace    http://www.disabilityrightsuk.org
// @version      1.5
// @description  Switch off Bluestream animations to help disabled users
// @author       Dr S
// @include      https://*.bluestreamacademy.com/*
// @include      http://*.bluestreamacademy.com/*
// @run-at document-end
// @grant none

// @downloadURL https://update.greasyfork.org/scripts/375503/Bluestream%20accessibility%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/375503/Bluestream%20accessibility%20fix.meta.js
// ==/UserScript==

(function() {

    if (typeof window.doreveal != "undefined") {

        var s = window.doreveal.toString(); // save doreveal function's javascript code to a string

        // Make cunning modifications
        s = s.replace(new RegExp("duration:[ ]?[0-9]+(\.[0-9]+)?,[ ]?delay:[ ]?[0-9]+(\.[0-9]+)?","g"),"duration:0.1, delay:0.1");
        s = s.replace(new RegExp("duration:[ ]?[0-9]+(\.[0-9]+)?","g"), "duration:0.1"); // regular expression , g=find all
        s = s.replace(new RegExp("delay:[ ]?[0-9]+(\.[0-9]+)?","g"), "delay:0.1");
        s = s.replace(new RegExp("setTimeout\(\"[ ]?showNext\(\)\"[ ]?,[ ]?[0-9]+[ ]?\)","g"),"setTimeout(\"showNext()\",500)");

        s = s + " setTimeout(\"showNext()\",500); ";

        // Run the doctored function!
        window.eval("document.getElementById(\"buttonNext\").style.visibility = \"visible\";");
        window.eval(s);
    }

})();