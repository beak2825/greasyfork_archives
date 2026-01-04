// ==UserScript==
// @name         Vimeo to Player redirect
// @version      0.1
// @description  Fast redirect to player.vimeo from vimeo
// @author       declider
// @match        https://vimeo.com/*
// @exclude      https://player.vimeo.com/video/*
// @grant        GM_registerMenuCommand
// @noframes
// @license      MIT
// @namespace    https://greasyfork.org/users/1257876
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/511213/Vimeo%20to%20Player%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/511213/Vimeo%20to%20Player%20redirect.meta.js
// ==/UserScript==

(function() {
    function redirectToPlayerVimeo() {
        window.location.href = window.location.href.replace("vimeo.com/", "player.vimeo.com/video/")
    }

    GM_registerMenuCommand("Redirect to player.vimeo.com", redirectToPlayerVimeo, "r")
})();