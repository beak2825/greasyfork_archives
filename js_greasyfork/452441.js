// ==UserScript==
// @name         Remove Spoilers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      https://www.soccercatch.com/*
// @include      https://dood.wf/*
// @include      https://sltube.org/*
// @include      https://sblanh.com/*
// @include      https://streamtape.com/*


// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452441/Remove%20Spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/452441/Remove%20Spoilers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(location.hostname == 'sltube.org') {
        document.querySelectorAll('iframe').forEach(iframe => iframe.style.opacity = 0);
    }

    if(location.hostname == 'www.soccercatch.com') {
        (document.getElementsByClassName("iframe-responsive")[0]).remove();
    }

    if(location.hostname == 'dood.wf') {
        document.getElementById('os_player').remove();
    }

    if(location.hostname == 'sblanh.com') {
        document.querySelectorAll('iframe').forEach(iframe => iframe.remove());
    }
    if(location.hostname == 'streamtape.com') {
       (document.getElementsByClassName("plyr-container")[0]).remove();
    }

    try{
       document.querySelectorAll('img').forEach(img => img.remove());
    }
    catch(error) {
         console.log(error);
    }


})();