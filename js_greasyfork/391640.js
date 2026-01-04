// ==UserScript==
// @name         Discord-Add Seconds
// @namespace    http://tampermonkey.net/
// @description  Click on the date/time to add seconds
// @version      1.1
// @author       kozy
// @match        https://discordapp.com/channels/**
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391640/Discord-Add%20Seconds.user.js
// @updateURL https://update.greasyfork.org/scripts/391640/Discord-Add%20Seconds.meta.js
// ==/UserScript==
//debugger;
(function() {
    'use strict';
    $('body').on('click', 'time[datetime]', function (e) {
        $('time[datetime]').not(".dateadd").each(function() {
            $(this).html($(this).attr('datetime'));
            $(this).addClass('dateadd');
        });
    });
})();