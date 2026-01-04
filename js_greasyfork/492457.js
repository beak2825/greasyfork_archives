// ==UserScript==
// @name         Get Custom Titles For Nitro Type
// @namespace    https://www.youtube.com/channel/UC62K5Rmg7L3-E5FBm2CbGMw?view_as=subscriber
// @version      1.1
// @description  Nitro Type Get Custom Titles
// @match        https://www.nitrotype.com/*
// @downloadURL https://update.greasyfork.org/scripts/492457/Get%20Custom%20Titles%20For%20Nitro%20Type.user.js
// @updateURL https://update.greasyfork.org/scripts/492457/Get%20Custom%20Titles%20For%20Nitro%20Type.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setInterval(function(){
        var a = JSON.parse(localStorage["persist:nt"]);
        var b = JSON.parse(a.user);
        b.title = "TOP THREE";
        a.user = JSON.stringify(b);
        localStorage["persist:nt"] = JSON.stringify(a);
     }, 8000);
})();
//Credit: https://www.youtube.com/channel/UC4KqtdIrZucElkUUgma-79w