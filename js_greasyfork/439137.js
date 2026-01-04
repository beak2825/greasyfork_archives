// ==UserScript==
// @name         ROBLOX old favorites redirect.
// @namespace    https://github.com/anthony1x6000/
// @version      0.1
// @description  Redirects to old favorites page.
// @author       anthony1x6000
// @match        https://www.roblox.com/discover
// @icon         https://www.google.com/s2/favicons?domain=roblox.com
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/439137/ROBLOX%20old%20favorites%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/439137/ROBLOX%20old%20favorites%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let userId = document.getElementsByName('user-data')[0].getAttribute('data-userid');
    console.log("User id =", userId);
    if (document.URL.includes(`https://www.roblox.com/discover#/sortName/v2/Favorites`)) {
        window.location.replace(`https://www.roblox.com/users/${userId}/favorites#!/places`);
    }
})();