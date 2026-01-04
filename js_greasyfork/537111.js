// ==UserScript==
// @name         Redirect to full image
// @namespace    https://greasyfork.org/users/61164
// @version      1.2
// @description  Community post images are often downscaled to 640p. This is done as url request parameter. This script redirects to full size image.
// @author       Last8Exile
// @match        https://*.ggpht.com/*
// @match        https://*.googleusercontent.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537111/Redirect%20to%20full%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/537111/Redirect%20to%20full%20image.meta.js
// ==/UserScript==

(function()
 {
    'use strict';
    if (window.top != window.self)
    {
        return;
    }

    function checkAndRedirect()
    {
        let url = window.location.href;

        let regex = /https:\/\/(.+).com\/(.+)=s(\d+)(-.+)?/gm;
        let replace = "https://$1.com/$2=s0";

        let match = [...url.matchAll(regex)];
        if (match && match[0][3] != "0")
        {
            window.location.replace(url.replace(regex, replace));
            return true;
        }

        return false;
    }

    if (checkAndRedirect())
    {
        return;
    }

    let intervalID = setInterval(checkAndRedirect, 1000);

})();