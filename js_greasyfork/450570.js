// ==UserScript==
// @name         ProcessOnHideAD
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide the ProcessOn's Ad view.
// @author       You
// @match        https://www.processon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=processon.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450570/ProcessOnHideAD.user.js
// @updateURL https://update.greasyfork.org/scripts/450570/ProcessOnHideAD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('.activity-con').hide()
    $('.app-down').hide()
     setInterval(function(){
                $("#banner_2").hide()
    $("#banner").hide()
            },100);
})();