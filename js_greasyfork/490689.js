// ==UserScript==
// @name         MyFlixerx
// @namespace    http://myflixerx.to
// @version      0.1
// @description  Resize to 0,0 the invisible window that's stretching over the whole window
// @author       You
// @match        https://myflixerx.to/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myflixerx.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490689/MyFlixerx.user.js
// @updateURL https://update.greasyfork.org/scripts/490689/MyFlixerx.meta.js
// ==/UserScript==

(function()
 {
    'use strict';
    setTimeout(
        function()
        {
            window.bidgearRender(0,0);
        },
        1100);
}
)();