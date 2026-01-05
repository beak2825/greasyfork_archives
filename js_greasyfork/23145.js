// ==UserScript==
// @name            Torrentz2 (dot) eu magnet link
// @namespace       Torrentz2
// @description     Adds direct download links to the pages on https://torrentz2.*. It uses the magnet URI scheme to provide a user friendly, faster way to access your favorite torrents.
// @match           https://torrentz2.eu/*
// @match           https://torrentz2.me/*
// @match           https://torrentzwealmisr.onion/*
// @include         https://torrentz.*
// @include         https://torrentz2.*
// @grant           GM_addStyle
// @license         CC-BY-SA-3.0; http://creativecommons.org/licenses/by-sa/3.0/
// @license         BSD-3-Clause; https://opensource.org/licenses/BSD-3-Clause
// @contributionURL https://github.com/netravnen/torrentz2-magnet-link
// @supportURL      https://github.com/netravnen/torrentz2-magnet-link
// @version         1.1.5
// @downloadURL https://update.greasyfork.org/scripts/23145/Torrentz2%20%28dot%29%20eu%20magnet%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/23145/Torrentz2%20%28dot%29%20eu%20magnet%20link.meta.js
// ==/UserScript==
/*
## Changelog
- v1.1.4
  - Fix dn to tr so trackers actually get added
- v1.1.3
  - Forgot to replace ':' with '%3A'
  - Forgot to replace '/' with '%2F'
- v1.1.2
  - Updated @updateURL
  - Updated @downloadURL
- v1.1.1
  - Updated @updateURL
  - Updated @downloadURL
- v1.1.0
  - Removed all predefined trackers.
  - Now only using the listed trackers listed for the individual torrent
- v1.0.15
  - Added http tracker: explodie.org
  - Added http tracker: mgtracker.org
  - Added http tracker: t1.pow7.com
  - Added http tracker: thetracker.org
- v1.0.14.3
  - Changed updateURL and downloadURL BACK to openuserjs.org after fixing TOS compliance
- v1.0.14.2
  - Added dual license BSD-3-Clause to be compliant with OpenUserJS TOS https://openuserjs.org/about/Terms-of-Service
- v1.0.14.1
  - Changed updateURL and downloadURL to github.com raw link to script
- v1.0.14
  - Added tracker: tracker2.indowebster.com
- v1.0.13
  - Added tracker: exodus.desync.com
  - Added tracker: tracker.pirateparty.gr
  - Added tracker: oscar.reyesleon.xyz
  - Added tracker: tracker.cyberia.is
- v1.0.12
  - Fix: zer0day changed to .to top-domain
- v1.0.11
  - Do not use pow7 tracker anymore
  - Removed http protocol mathcing of urls. Now only https url matching
- v1.0.10
  - Fix: Changed class ".download" to ".downlinks"
- v1.0.9 (2017-04-20)
  - New UserScript Attribute: contributionURL
  - New UserScript Attribute: supportURL
  - Changed the match and inlcude UserScript attributes to use http(s) instead of wildcards
- v1.0.8 (2017-04-18)
  - Added 'p4p.arenabg.ch' to array() 'needleTrackers'-in-a-'haystackTrackers'
  - Added 'tracker.pirateparty.gr' to array() 'needleTrackers'-in-a-'haystackTrackers'
- v1.0.7.1 (2017-01-15)
  - Added 'tracker.pirateparty.gr' to array() 'needleTrackers'-in-a-'haystackTrackers'
- v1.0.7 (2017-01-15)
  - Changed '@grant none' to '@grant GM_addStyle'.
  - Changed style '#magnetlinkurlid' to load with function 'GM_addStyle()' instead of more native
    javascript. Because of Chrome throwing errors related to style-src not set parameter.
- v1.0.6.3 (2016-09-22)
  - Added mirror sites torrentz2.me and torrentzwealmisr.onion.
- v1.0.6.2 (2016-08-28)
  - Modified url regex pattern matching to enable the script to run on proxy sites.
  - Added the inlcude lines *://torrentz.- vand *://torrentz*.- vto script properties.
- v1.0.6.1 (2016-08-20)
  - Added tracker explodie.org and moved 9.rarbg.com to comments section for non-used trackers
- v1.0.6 (2016-08-17)
  - updated matching domains to the new player called torrentz2.eu.
  - torrentz.eu and all affiliated domains and mirror sites removed to the site suffering a slash back.
- v1.0.5 (2012-11-15)
  - update for new domain (torrentz.eu).
  - and changing the default trackers (openbittorrent, publicbt, istole.it).
- v1.0.4 (2011-01-01)
  - update for new domain (torrentz.eu).
- v1.0.3 (2009-12-30)
  - fixed some more problems with 'www.torrentz.com'.
  - adding three default trackers to any magnet link.
- v1.0.2 (2009-12-30)
  - now both 'www.torrentz.com' and 'torrenz.com' are
    correctly treated.
- v1.0.1 (2009-12-05)
  - small bugfix (incompatibility with certain custom
    css styles).
- v1.0.0 (2009-11-17)
  - initial release.
*/

var url;

url = null;

if ((url = location.href.match(/torrentz(2)?(\.([a-z0-9]+))?\.([a-z]{2,8})\/([a-f0-9]{40})/)))
{
    if (url !== null)
    {
        var hash, trackers_a, trackers, title, magnet, head, style, body;

        hash = url[5];


        // get all the listed trackers for the particular torrent.
        trackers_a = document.querySelectorAll( '.trackers > dl > dt' );
        trackers = null;
        for (var i=0;i<trackers_a.length;++i) {
            trackers += '&tr=' + trackers_a[i].innerHTML.replace(/:/g,'%3A').replace(/\//g,'%2F');
        }

        // read title
        title = encodeURIComponent( document.querySelector( '.downurls > h2 > span' ).innerHTML.replace('"','') ).replace('%26amp%3B','and');
        if (title.length == 40 && title.match(/[0-9a-z]+/i) && title == hash)
        {
            var tpb, bitsno;
            tpb = document.querySelector('.downlinks a[href^="https://thepiratebay.org"] .n');
            bitsno = document.querySelector('.downlinks a[href^="http://bitsnoop.com"] .n');
            if(tpb !== null)
            {
                //if the title is equal to the hash, go for the title from TPB.
                title = encodeURIComponent(tpb.innerHTML);
            }
            else if (bitsno !== null)
            {
                title = encodeURIComponent(bitsno.innerHTML);
            }
        }
        else if (title === ''||null||undefined)
        {
            //if the title is still not valied, go for the one from katproxy.com.
            title = encodeURIComponent(document.querySelector('.downlinks a[href^="http://katproxy.com"] .n').innerHTML);
        }
        else if (title === ''||null||undefined)
        {
            //if the title is (unlikely still) not valid, just resign and set the magnet title to 'unknown torrent'.
            title = 'unknown torrent';
        }
        // add key-definition to title-value
        title = '&dn=' + title;

        // generate the magnet link
        magnet = "magnet:?xt=urn:btih:"+hash+title+trackers;

        // add downloadlink
        head = document.getElementsByTagName('head')[0];
        if (!head)
        {
            return;
        }

        GM_addStyle("#magnetlinkurlid { border:1px #4995FF solid; z-index:10000; -moz-border-radius:3px; background:#AACDFF; padding:4px 10px; display:block; position:fixed; right:10px; top:10px; font-family:Verdana; font-size:18px;");

        body = document.getElementsByTagName('body')[0];
        if (!body)
        {
            return;
        }
        style = document.createElement('div');
        style.id = 'magnetlinkurlid';
        style.innerHTML = '<a href="'+magnet+'">Download</a>';
        body.appendChild(style);
    }
}
