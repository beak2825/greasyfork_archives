// ==UserScript==
// @name         Redirect discord login
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replaces the url on services that use discord as a login method so that they can't make you join servers
// @author       Boofdev
// @match        *.discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @license mit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466988/Redirect%20discord%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/466988/Redirect%20discord%20login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.href.indexOf("+guilds.join") > -1) {
    var url = window.location.href;
    var cleanurl = url.replace('+guilds.join','');
    window.location.replace(cleanurl);
    }
})();