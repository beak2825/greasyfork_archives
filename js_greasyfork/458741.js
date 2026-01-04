// ==UserScript==
// @name         Redirect to video
// @namespace    https://greasyfork.org/users/61164
// @version      1.1
// @description  Shorts have terrible player UI. This scripts redirects to normal youtube video player.
// @author       Last8Exile
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458741/Redirect%20to%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/458741/Redirect%20to%20video.meta.js
// ==/UserScript==

(function()
 {
    'use strict';
    if (window.top != window.self)
        return;

    function checkAndRedirect()
    {
        let url = window.location.href;

        if (url.includes("shorts/"))
        {
            window.location.replace(url.replace("shorts/","watch?v="));
            return true;
        }

        return false;
    }

    if (checkAndRedirect())
        return;

    let intervalID = setInterval(checkAndRedirect, 1000);

})();