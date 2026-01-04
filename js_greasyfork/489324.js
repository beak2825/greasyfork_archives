// ==UserScript==
// @name         Twitch Redirect to EsfandTV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect from twitch.tv/graycen to twitch.tv/esfand
// @author       You
// @match        https://www.twitch.tv/graycen
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489324/Twitch%20Redirect%20to%20EsfandTV.user.js
// @updateURL https://update.greasyfork.org/scripts/489324/Twitch%20Redirect%20to%20EsfandTV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.location.href = "https://www.twitch.tv/esfandtv";
})();