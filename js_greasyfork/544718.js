// ==UserScript==
// @name         Youtube Playlist Nullifier
// @namespace    Amaroq64
// @version      0.2
// @description  Open videos in a playlist by themselves by removing the &list parameter from links. You have to right-click and open in new tab for it to work.
// @author       Amaroq
// @match        https://www.youtube.com/playlist*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/544718/Youtube%20Playlist%20Nullifier.user.js
// @updateURL https://update.greasyfork.org/scripts/544718/Youtube%20Playlist%20Nullifier.meta.js
// ==/UserScript==

(function()
{
    'use strict';

    function cleanLinks()
    {
        //Duplicate IDs on the same page are invalid html, but youtube does it anyway.
        //However, this is probably the most reliable way to get the correct links.
        let links = document.querySelectorAll('a#video-title');

        for (let link = 0; link < links.length; link++)
        {
            //Keep everything before the first &.
            //A simple split will do.
            if(!links[link].dataset.cleaned)
            {
                links[link].href = links[link].href.split('&')[0];
                links[link].dataset.cleaned = 'true';
            }
        }
    }

    var observer = new MutationObserver(cleanLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();