// ==UserScript==
// @name         Hammerhead Shark Title
// @namespace    G1_1777gold
// @version      0.1
// @description  Shark's Custom Title
// @match        https://www.nitrotype.com/*
// @downloadURL https://update.greasyfork.org/scripts/433182/Hammerhead%20Shark%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/433182/Hammerhead%20Shark%20Title.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setInterval(function(){
        var a = JSON.parse(localStorage["persist:nt"]);
        var b = JSON.parse(a.user);
        b.title = "Sharky";
        a.user = JSON.stringify(b);
        localStorage["persist:nt"] = JSON.stringify(a);
     }, 8000);
})();
//Credit: G1_1777gold