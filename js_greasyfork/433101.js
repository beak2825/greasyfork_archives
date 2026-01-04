// ==UserScript==
// @name         Inactivated NT YT's Custom Title
// @namespace    G1_1777gold
// @version      0.2
// @description  HVT Title
// @match        https://www.nitrotype.com/*
// @downloadURL https://update.greasyfork.org/scripts/433101/Inactivated%20NT%20YT%27s%20Custom%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/433101/Inactivated%20NT%20YT%27s%20Custom%20Title.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setInterval(function(){
        var a = JSON.parse(localStorage["persist:nt"]);
        var b = JSON.parse(a.user);
        b.title = "HVT Inactivated";
        a.user = JSON.stringify(b);
        localStorage["persist:nt"] = JSON.stringify(a);
     }, 8000);
})();
//Credit: G1_1777gold Youtube