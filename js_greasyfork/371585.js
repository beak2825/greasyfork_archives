// ==UserScript==
// @name         ImageDownloader
// @version      1.0.0
// @description  Add download image button to wykop and reddit posts
// @author       mBartek89
// @match        https://www.wykop.pl/*
// @namespace https://greasyfork.org/users/30602
// @downloadURL https://update.greasyfork.org/scripts/371585/ImageDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/371585/ImageDownloader.meta.js
// ==/UserScript==

var page = window.location.hostname;

if(page.includes("wykop"))
{
    var entries = document.getElementsByClassName("entry iC ");

    for(var i = 0; i < entries.length; i++)
    {
        var media = entries[i].getElementsByClassName("media-content");
        if(media.length > 0)
        {
            var link = media[0].firstChild.getAttribute("href");
            var desc = entries[i].getElementsByClassName("description light");

            var downloadButton = document.createElement("a");
            downloadButton.setAttribute("href", link);
            downloadButton.setAttribute("download", "");
            downloadButton.innerHTML = "pobierz";
            media[0].appendChild(downloadButton);
        }
    }
}