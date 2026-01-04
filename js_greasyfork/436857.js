

    // ==UserScript==
    // @name           Twitch Raid Referral Remover
    // @name:de        Twitch Raid Referral Entferner
    // @description    A simple script to remove the "?referrer=raid" from the URL after raiding to another streamer
    // @description:de Ein einfaches Userscript, um nach einem Raid von der URL den Tag `?referrer=raid` zu entfernen.
    // @author         Tirre_G
    // @homepage       https://greasyfork.org/en/scripts/436857-twitch-raid-referral-remover
    // @namespace      https://greasyfork.org/en/users/53355
    // @version        0.2.1
    // @license         The Unlicense
    // @icon           https://www.google.com/s2/favicons?domain=twitch.tv
    // @match          *://*.twitch.tv/*?referrer=raid
    // @match          *://*.twitch.tv/*
    // @grant          none
    // @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/436857/Twitch%20Raid%20Referral%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/436857/Twitch%20Raid%20Referral%20Remover.meta.js
    // ==/UserScript==


    (function() {
        'use strict';
        // listen for changes
        setInterval(function() {
            if (location.href.match(/\?referrer=raid/gi)){
                location.href = location.href.replace(/\?referrer=raid/gi,"");
            }
        }, 500);
    })();
