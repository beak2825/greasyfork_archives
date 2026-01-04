// ==UserScript==
// @name        Redirect Youtube to Bitchute
// @namespace   http://domain.com/directory
// @description Redirect Youtube videos to their Bitchute mirror
// @include     *://*.youtube.*/*
// @run-at document-start
// @version 0.0.1.20190618222827
// @downloadURL https://update.greasyfork.org/scripts/386521/Redirect%20Youtube%20to%20Bitchute.user.js
// @updateURL https://update.greasyfork.org/scripts/386521/Redirect%20Youtube%20to%20Bitchute.meta.js
// ==/UserScript==

// Redirect Video
var cur_url = document.URL;

if(cur_url.indexOf("watch?v") > -1)
{
    var fields = document.URL.split('=');
    var ytlink = fields[0];
    var linkstring = fields[1];
    var targetlink = "https://www.bitchute.com/video/" + linkstring;

    if (window.confirm('Play with Bitchute?'))
    {
        window.location.replace(targetlink);
    }
    else
    {

    }
}