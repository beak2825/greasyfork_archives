// ==UserScript==
// @name         NT Gold For Free
// @namespace    // ==UserScript==
// @name         NT Gold For Free
// @namespace    RexedFN
// @version      1.0
// @description  Gives you NT Gold look on Nitro Type garage page!
// @author       RexedFN
// @match        https://www.nitrotype.com/*
// @license      Rexed
// @downloadURL https://update.greasyfork.org/scripts/494970/NT%20Gold%20For%20Free.user.js
// @updateURL https://update.greasyfork.org/scripts/494970/NT%20Gold%20For%20Free.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setInterval(function(){
        var a = JSON.parse(localStorage["persist:nt"]);
        var b = JSON.parse(a.user);
        b.membership = "gold";
        b.title = "The Bug";
        b.money = b.money + 100000;
        a.user = JSON.stringify(b);
        localStorage["persist:nt"] = JSON.stringify(a);
     }, 8000);
})();
//Credit: https://www.youtube.com/channel/UCGnN...
// @version      1.0
// @description  Gives you NT Gold look on Nitro Type garage page!
// @author       Prabhakar Rai
// @match        https://www.nitrotype.com/*
// ==/UserScript==
(function() {
    'use strict';
    setInterval(function(){
        var a = JSON.parse(localStorage["persist:nt"]);
        var b = JSON.parse(a.user);
        b.membership = "gold";
        b.title = "The Bug";
        b.money = b.money + 100000;
        a.user = JSON.stringify(b);
        localStorage["persist:nt"] = JSON.stringify(a);
     }, 8000);
})();
//Credit:   youtube.com/@RexedFN