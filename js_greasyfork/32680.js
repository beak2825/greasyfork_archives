// ==UserScript==
// @name         BC.VC Scrubber
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Scrub the bc.vc links, Only works with links as example:  http://bc.vc/12345/http://google.com , if your link is similar to this it will srub http://bc.vc/12345/   Make sure your link length is 19 letters like the one in example. If not then count your link length and edit the script (change 19 in last with your link length)
// @author       xTr3m3
// @match        https://greasyfork.org/en/scripts/32680
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32680/BCVC%20Scrubber.user.js
// @updateURL https://update.greasyfork.org/scripts/32680/BCVC%20Scrubber.meta.js
// ==/UserScript==

var links = document.links;
for( i=0; i<document.links.length; i++ )
{
 	var pattern = /http:\/\/bc.vc\/[a-zA-Z0-9]*\//;
    if(pattern.test(document.links[i].href) )
    {        
        document.links[i].href = document.links[i].href.substr(19);
    }
}