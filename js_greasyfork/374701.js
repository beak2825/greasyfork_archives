// ==UserScript==
// @name           FSFE Affiliate Programs + extras (auto-SSL...)
// @namespace      https://git.fsfe.org/FSFE/affiliate-script
// @description    Modify Amazon links to support the FSFE, always use SSL and shorten links
// @version        0.5

// Contains the getASIN()-function from:
// https://userscripts-mirror.org/scripts/review/3284 by Jim Biancolo

// @include       http://*
// @include       https://*

// @license       GPL-3.0-or-later
// see https://www.gnu.org/licenses/gpl-3.0-standalone.html
// @author Hannes Hauswedell (original author), Max Mehl (maintainer)
// @homepage https://git.fsfe.org/FSFE/affiliate-script
// @downloadURL https://update.greasyfork.org/scripts/374701/FSFE%20Affiliate%20Programs%20%2B%20extras%20%28auto-SSL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/374701/FSFE%20Affiliate%20Programs%20%2B%20extras%20%28auto-SSL%29.meta.js
// ==/UserScript==



function getASIN(href) {
    var asinMatch;
    asinMatch = href.match(/\/exec\/obidos\/ASIN\/(\w{10})/i);
    if (!asinMatch) { asinMatch = href.match(/\/gp\/product\/(\w{10})/i); }
    if (!asinMatch) { asinMatch = href.match(/\/exec\/obidos\/tg\/detail\/\-\/(\w{10})/i); }
    if (!asinMatch) { asinMatch = href.match(/\/dp\/(\w{10})/i); }
    if (!asinMatch) { return null; }
    return asinMatch[1];
}

(function()
{
    var links = document.getElementsByTagName("a");

    for (i = 0; i < links.length; i++) 
    {
        var curLink = links[i].href;

        // AMAZON
        if (curLink.match(/https?\:\/\/(www\.)?amazon\./i))
        {
            var affiliateID = '';
            var host = '';
            if (curLink.match(/amazon\.de/i))
            {
                host = 'amazon.de';
                affiliateID = 'fsfe-21';
            }
            else if (curLink.match(/amazon\.co\.uk/i))
            {
                host = 'amazon.co.uk';
                affiliateID = 'fsfe05-21';
            }
            else if (curLink.match(/amazon\.ca/i))
            {
                host = 'amazon.ca';
                affiliateID = 'fsfe-20';
            }
            else if (curLink.match(/amazon\.fr/i))
            {
                host = 'amazon.fr';
                affiliateID = 'fsfeurope-21';
            }
            else if (curLink.match(/amazon\.com/i))
            {
                host = 'amazon.com';
                affiliateID = 'freesoftfoune-20';
            }

            var asin = getASIN(curLink);
            if (affiliateID != '')
            {
                if (asin != null)
                    links[i].setAttribute("href", "https://www."+host+"/dp/" + asin + "/?tag="+affiliateID);
//                 else
//                     links[i].setAttribute("href", curLink + "?tag="+affiliateID);
            }
        }
    }
})();
