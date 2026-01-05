// ==UserScript==
// @name        Sadpanda begone
// @namespace   Luciano Basurto
// @author      Luciano Basurto
// @version     1.0
// @description Redirects sadpanda galleries to their e-hentai version.
// @include     https://exhentai.org/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/23583/Sadpanda%20begone.user.js
// @updateURL https://update.greasyfork.org/scripts/23583/Sadpanda%20begone.meta.js
// ==/UserScript==

//Get the page title and URL of the gallery
var sadpanda = document.URL;
var url = document.location.toString().toLowerCase();

//Check if it's a sadpanda gallery.
if (sadpanda.search("https://exhentai.org") != -1)
{
    document.title = "Redirecting..."
    
    //Change the URL to the e-hentai one and redirect.
    url = url.replace("https://ex", "http://g.e-");
    document.location = url;
}