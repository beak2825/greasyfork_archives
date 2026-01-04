// ==UserScript==
// @name         Crab Rave for New Years
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This will almost perfectly play the crab rave rave when it hits the new year
// @author       You
// @match        https://www.youtube.com/watch?v=cE0wfjsybIQ
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394495/Crab%20Rave%20for%20New%20Years.user.js
// @updateURL https://update.greasyfork.org/scripts/394495/Crab%20Rave%20for%20New%20Years.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        var d = new Date();
        var mo = d.getMonth();
        var da = d.getDate()
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        if (mo == 11 && da == 31 && h == 23 && m == 58 && s == 45) {
            var e = new KeyboardEvent('keydown',{'keyCode':32,'which':32});
            document.dispatchEvent(e);
        }
    }, 1000);
})();