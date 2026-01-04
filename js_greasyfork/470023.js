// ==UserScript==
// @name         GGn Better DL
// @namespace    https://greasyfork.org
// @version      0.1
// @license      MIT
// @description  Copy DL links from https://gazellegames.net/better.php?method=single to keyboard
// @author       drlivog
// @match        https://gazellegames.net/better.php?*method=single*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470023/GGn%20Better%20DL.user.js
// @updateURL https://update.greasyfork.org/scripts/470023/GGn%20Better%20DL.meta.js
// ==/UserScript==

/* globals $ */

(function() {
    'use strict';
    $('#content .linkbox').append('<br><input type=button id="copydllinks" value="Copy DL Links">');
    $('#copydllinks').click( () => {
        let linklist = [];
        let dllist = $('span.torrent_links_block a.brackets');
        for (let i=0; i<dllist.length; i++) {
            linklist.push(dllist[i].href);
        }
        navigator.clipboard.writeText(linklist.join("\n"));
    });
})();