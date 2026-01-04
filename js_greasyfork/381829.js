// ==UserScript==
// @name         PR Media Link Provider
// @namespace    http://tampermonkey.net/
// @version      20190415
// @description  Finds direct link to media file on Polskie Radio site
// @author       Tahoma
// @match        https://www.polskieradio.pl/*/Artykul/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381829/PR%20Media%20Link%20Provider.user.js
// @updateURL https://update.greasyfork.org/scripts/381829/PR%20Media%20Link%20Provider.meta.js
// ==/UserScript==

var redir='';
var directLinksLocations = document.getElementsByClassName('pr-media-play');
var adressContainer = directLinksLocations[0].getAttribute('data-media');
var segments = adressContainer.split('"');
for (var j=0;j<segments.length;j+=1)
{
    if (segments[j].indexOf('static.prsa.pl/') > 0)
    {
        redir = 'http:'+segments[j];
        console.log('Found link: ' + redir);
        break;
    }
}
var fileIndicators = document.getElementsByClassName('sounds-count');
fileIndicators[0].innerHTML = fileIndicators[0].innerHTML + '<a href="'+ redir+'"> Pobierz plik </a> ';


