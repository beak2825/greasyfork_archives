// ==UserScript==
// @name         DeviantArt DeBlur For NSFW Peepo
// @namespace    *://*.deviantart.com/*
// @version      0.1
// @description  Blurs Do Be Gay Doe
// @author       Plague
// @match        *://*.deviantart.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419217/DeviantArt%20DeBlur%20For%20NSFW%20Peepo.user.js
// @updateURL https://update.greasyfork.org/scripts/419217/DeviantArt%20DeBlur%20For%20NSFW%20Peepo.meta.js
// ==/UserScript==

setInterval(function()
{
    let images = document.getElementsByTagName("img");

    for (let i = 0; i < images.length; i++)
    {
        images[i].outerHTML = images[i].outerHTML.replace(",blur_30", "");
    }
}, 2000);