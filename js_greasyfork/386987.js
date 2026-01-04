// ==UserScript==
// @name         Close YT Confirmations
// @version      0.2
// @description  Auto click on Yes when YouTube auto-pause your video
// @author       You
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match        https://www.youtube.com/watch?*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/386987/Close%20YT%20Confirmations.user.js
// @updateURL https://update.greasyfork.org/scripts/386987/Close%20YT%20Confirmations.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        const btns = $('a.yt-simple-endpoint.style-scope.yt-button-renderer')

        for (let i = 0; i < btns.length; i++) {
            if ($(btns[i]).is(':visible'))
                $(btns[i])[0].click()
        }
    },1000)
})();