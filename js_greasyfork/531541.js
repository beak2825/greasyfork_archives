// ==UserScript==
// @name         Autoloop Discord videos (NOT MINE)
// @namespace    https://greasyfork.org/en/users/3372-nixxquality
// @version      1.0
// @description  Makes videos posted in Discord loop
// @author       nixx quality 
// @match        https://discord.com/channels/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/531541/Autoloop%20Discord%20videos%20%28NOT%20MINE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531541/Autoloop%20Discord%20videos%20%28NOT%20MINE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements(
        "video",
        vid => vid.attr('loop', 'loop')
    );
})();


