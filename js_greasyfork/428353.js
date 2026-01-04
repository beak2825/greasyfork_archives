// ==UserScript==
// @name         jvc-avatar-carre
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  none
// @author       lifeAnime
// @match        https://www.jeuxvideo.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428353/jvc-avatar-carre.user.js
// @updateURL https://update.greasyfork.org/scripts/428353/jvc-avatar-carre.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var j,x = 0;

    j = document.getElementsByClassName("user-avatar-msg");
    for (x in j){
        j[x].style.borderRadius = "0%";
    }
})();