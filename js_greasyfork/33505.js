// ==UserScript==
// @name         Remove Sankaku Advertisements/Iframes
// @description  Hopefully removes all ads from *.sankaku
// @namespace    http://tampermonkey.net/
// @version      4.0
// @author       ECHibiki
// @match        *.sankakucomplex.com/*
// @downloadURL https://update.greasyfork.org/scripts/33505/Remove%20Sankaku%20AdvertisementsIframes.user.js
// @updateURL https://update.greasyfork.org/scripts/33505/Remove%20Sankaku%20AdvertisementsIframes.meta.js
// ==/UserScript==

window.onload = function(){
    var frames = document.getElementsByTagName("IFRAME");
    for (var j = 0 ; j < frames.length ; j++){
        frames[j].remove();
    }
};

setInterval(function(){
    var frames = document.getElementsByTagName("IFRAME");
    for (var j = 0 ; j < frames.length ; j++){
        frames[j].remove();
    }
}, 500);