// ==UserScript==
// @name       LinkShrink Link Scrubber
// @version    0.1
// @description  This removes custom redirections from 300MBfilms links
// @match      earn-money-onlines.info/*
// @match      http*://psarips.com/*
// @namespace https://greasyfork.org/users/2329
// @downloadURL https://update.greasyfork.org/scripts/25681/LinkShrink%20Link%20Scrubber.user.js
// @updateURL https://update.greasyfork.org/scripts/25681/LinkShrink%20Link%20Scrubber.meta.js
// ==/UserScript==

var links = document.links;
for( i=0; i<document.links.length; i++ )
{
    //var pattern = /http:\/\/earn-money-onlines.info\/wp-content\/plugins\/wp-js-external-link-info-1.[0-9]*\/redirect.php.*/;
    var pattern = /linkshrink.net/i;
    if(pattern.test(document.links[i].href) )
    {
        //replaces link with only the actual link (part after url=)
        document.links[i].href = document.links[i].href.substr(document.links[i].href.indexOf('=')+1);
    }
}