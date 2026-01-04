// ==UserScript==
// @name         Shiro.is Autoplay/Autofocus
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Very hacky way of autoplaying/focusing the shiro.is video player.
// @author       hotsno
// @match        https://cherry.subsplea.se/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423534/Shirois%20AutoplayAutofocus.user.js
// @updateURL https://update.greasyfork.org/scripts/423534/Shirois%20AutoplayAutofocus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function() {
        document.getElementsByClassName("plyr")[0].focus();
        document.getElementById('player').click();
    }, 1000)
})();