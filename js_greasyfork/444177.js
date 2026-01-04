// ==UserScript==
// @name         Google Meet Auto Mute Microphone
// @version      1.1
// @description  auto mute microphone!
// @author       xiao-e-yun
// @match        https://meet.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @namespace https://greasyfork.org/users/908389
// @downloadURL https://update.greasyfork.org/scripts/444177/Google%20Meet%20Auto%20Mute%20Microphone.user.js
// @updateURL https://update.greasyfork.org/scripts/444177/Google%20Meet%20Auto%20Mute%20Microphone.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addEventListener("load",function (){
        var els = document.querySelectorAll("[data-is-muted=false][role]");
        if(els.length === 0) return;
        console.log("try to mute");
        els.forEach(function(el){el.click();});
    });
})();