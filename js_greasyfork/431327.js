// ==UserScript==
// @name         Change account shortcut
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Press 1 to select the first account in google meet
// @author       You
// @include        https://meet.google.com/*
// @include        https://accounts.google.com/AccountChooser*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431327/Change%20account%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/431327/Change%20account%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function on1key() {
        if (window.location.href.indexOf("authuser=0") > -1) {
            document.getElementsByClassName("Kx3qp IOxzuf")[0].click();
        }else{
        document.querySelectorAll('[class="lCoei YZVTmd SmR8"][data-identifier="seabornd@educ.cscapitale.qc.ca"]')[0].click();
}
    }
    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.keyCode == 49) {
            on1key();
        }
    }
    document.addEventListener('keydown', onKeydown, true);
})();