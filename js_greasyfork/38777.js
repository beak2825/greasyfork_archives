// ==UserScript==
// @name         AVgle video add control bar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://avgle.com/video/*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/38777/AVgle%20video%20add%20control%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/38777/AVgle%20video%20add%20control%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

   $('#video-player_html5_api').attr('controls',true);
})();