// ==UserScript==
// @name         bypass vfxdownload.net ad
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bypass vfxdownload.net anti-adblocker.
// @author       You
// @match        https://vfxdownload.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vfxdownload.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449303/bypass%20vfxdownloadnet%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/449303/bypass%20vfxdownloadnet%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var adContainers = document.getElementsByClassName('adb')
    if (adContainers){
        var len = adContainers.length;
        var i=0;
        var child =null;
        for(;i<len;i++){

           child = adContainers[i];
            child.parentNode.removeChild(child);

            console.log('adContainers Removed')
        }
       console.log('adContainers Removed')
    }
    // Your code here...
})();