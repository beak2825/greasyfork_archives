// ==UserScript==
// @name         UE Marketplace redirect remover
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes the annoying "Redirect to external site" notification screen on the UE marketplace that appears when clicking on external links such as to a YouTube preview video.
// @author       A cute puppy
// @match        https://www.unrealengine.com/marketplace/en-US/product/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unrealengine.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440759/UE%20Marketplace%20redirect%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/440759/UE%20Marketplace%20redirect%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const whitelist = ["https://youtube.com", "https://youtu.be", "https://www.youtube.com"]

    let links = document.getElementsByTagName("a");
    const linkIndex = 43;

    for (let i = 0; i < links.length; i++)
    {
        let linkedSite = links[i].href.substr(linkIndex);

        for (let j = 0; j < whitelist.length; j++)
        {
            if (linkedSite.substr(0, whitelist[j].length) == whitelist[j])
            {
                links[i].href = links[i].href.replace("https://redirect.epicgames.com/?redirectTo=", "");
            }
        }
    }
 })();