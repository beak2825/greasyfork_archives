// ==UserScript==
// @name         Remove live feed from GrandPrixRadio
// @namespace    http://www.globalwebsystems.nl/
// @version      1.1
// @description  Remove iframes that contain the live feed of GrandPrixRadio.
// @author       j.n.overmars <jovermars@gwsn.nl>
// @match        https://www.grandprixradio.nl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383433/Remove%20live%20feed%20from%20GrandPrixRadio.user.js
// @updateURL https://update.greasyfork.org/scripts/383433/Remove%20live%20feed%20from%20GrandPrixRadio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var iframes = document.getElementsByTagName("iframe");

    for(var prop in iframes) {
        if(iframes.hasOwnProperty(prop) && iframes[prop].src.indexOf("livestream.com") > 0) {
            iframes[prop].parentNode.removeChild(iframes[prop]);
        }
    }
})();