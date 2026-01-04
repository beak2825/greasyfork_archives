// ==UserScript==
// @name         Doci.pl AdBlock Unblock
// @license MIT
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  Allows to download pdf files with adblock enabled
// @author       Asgraf
// @match        https://doci.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doci.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450463/Docipl%20AdBlock%20Unblock.user.js
// @updateURL https://update.greasyfork.org/scripts/450463/Docipl%20AdBlock%20Unblock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function(event) {
        window.ads_unblocked=true;
        window.helper.isLogged = function() {
            window.$('#square-1')[0].style.display = 'block';
            window.$('#square-1')[0].style.width = '1px';
            window.$('#doublebillboard-1')[0].style.display = 'block';
            window.$('#doublebillboard-1')[0].style.width = '1px';
            return false;
        };
    });
})();