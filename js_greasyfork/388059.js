// ==UserScript==
// @name         Discord Marquee tag
// @namespace    https://greasyfork.org/en/users/3372-nixxquality
// @version      1.0
// @description  Adds a marquee tag to Discord
// @author       nixx quality <nixx@is-fantabulo.us>
// @match        https://discordapp.com/channels/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @downloadURL https://update.greasyfork.org/scripts/388059/Discord%20Marquee%20tag.user.js
// @updateURL https://update.greasyfork.org/scripts/388059/Discord%20Marquee%20tag.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements(
        "div[class^=markup]",
        div => {
            const msg = div.html()
            if (msg.startsWith("~") && msg.endsWith("~")) {
                const marquee = $("<marquee/>").html(msg.slice(1,-1))
                div.text("")
                marquee.appendTo(div)
            }
        }
    );
})();