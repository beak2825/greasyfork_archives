// ==UserScript==
// @name         Get Emojis Into Your Nitro Type Name
// @namespace    https://www.youtube.com/channel/UC62K5Rmg7L3-E5FBm2CbGMw/featured
// @version      1.1
// @description  Get Emojis Into Nitro Type Name
// @author       MasterSheepGaming
// @match        https://www.nitrotype.com/*
// @downloadURL https://update.greasyfork.org/scripts/451673/Get%20Emojis%20Into%20Your%20Nitro%20Type%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/451673/Get%20Emojis%20Into%20Your%20Nitro%20Type%20Name.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setInterval(function(){
        var a = JSON.parse(localStorage["persist:nt"]);
        var b = JSON.parse(a.user);
        b.displayName = "i fucked your mom last night❤️";
        b.username = "epetr";
        a.user = JSON.stringify(b);
        localStorage["persist:nt"] = JSON.stringify(a);
     }, 8000);
})();
//Credit: https://www.youtube.com/channel/UC62K5Rmg7L3-E5FBm2CbGMw/featured