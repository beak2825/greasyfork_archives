// ==UserScript==
// @name           Fjords begone
// @namespace      Mexiguy
// @author         Mexiguy
// @version        1.0
// @description    Redirects fjorded e-hentai galleries to their sadpanda version.
// @include        http://g.e-hentai.org/*
// @grant          none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/2053/Fjords%20begone.user.js
// @updateURL https://update.greasyfork.org/scripts/2053/Fjords%20begone.meta.js
// ==/UserScript==

//Get the page title and URL of the gallery
var title = document.title;
var url = document.location.toString().toLowerCase();

//Check if it's fjorded
if (title.search("Gallery Not Available") != -1)
{
    document.title = "Redirecting..."
    
    //Change the URL to the sadpanda one and redirect.
    url = url.replace("g.e-hentai", "exhentai");
    document.location = url;
}