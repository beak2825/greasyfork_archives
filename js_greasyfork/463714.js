// ==UserScript==
// @name         Invidious Preferences
// @namespace    http://tampermonkey.net/
// @version      3.3.7
// @description  Redirect Invidious Videos with URL Parameters
// @author       Doctor Derp
// @match        *://invidious.baczek.me/*
// @match        *://iteroni.com/*
// @match        *://invidious.namazso.eu/*
// @match        *://iv.ggtyler.dev/*
// @match        *://yewtu.be/*
// @match        *://invidious.reallyaweso.me/*
// @match        *://inv.nadeko.net/*
// @match        *://y.com.sb/*
// @match        *://invidious.nerdvpn.de/*
// @match        *://invidious.tiekoetter.com/*
// @match        *://yt.artemislena.eu/*
// @match        *://invidious.flokinet.to/*
// @match        *://inv.bp.projectsegfau.lt/*
// @match        *://invidious.f5.si/*
// @match        *://invidious.projectsegfau.lt/*
// @match        *://yt.funami.tech/*
// @match        *://invidious.lunar.icu/*
// @match        *://invidious.privacydev.net/*
// @match        *://invidious.esmailelbob.xyz/*
// @match        *://invidious.snopyta.org/*
// @match        *://invidious.kavin.rocks/*
// @match        *://yt.oelrichsgarcia.de/*
// @match        *://invidious.privacydev.net/*
// @match        *://inv.zzls.xyz/*
// @match        *://vid.priv.au/*
// @match        *://invidious.fdn.fr/*
// @match        *://inv.tux.pizza/*
// @match        *://invidious.nogafa.org/*
// @match        *://inv.pistasjis.net/*
// @match        *://invidious.protokolla.fi/*
// @match        *://inv.in.projectsegfau.lt/*
// @match        *://inv.citw.lgbt/*
// @match        *://iv.nboeck.de/*
// @match        *://invidious.private.coffee/*
// @match        *://invidious.asir.dev/*
// @match        *://invidious.io.lol/*
// @match        *://anontube.lvkaszus.pl/*
// @match        *://iv.datura.network/*
// @match        *://invidious.no-logs.com/*
// @match        *://iv.melmac.space/*
// @match        *://yt.cdaut.de/*
// @match        *://yt.drgnz.club/*
// @match        *://invidious.slipfox.xyz/*
// @match        *://c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid.onion/*
// @match        *://w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd.onion/*
// @match        *://kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad.onion/*
// @match        *://grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad.onion/*
// @match        *://osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd.onion/*
// @match        *://u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad.onion/*
// @match        *://euxxcnhsynwmfidvhjf6uzptsmh4dipkmgdmcmxxuo7tunp3ad2jrwyd.onion/*
// @match        *://invidious.esmail5pdn24shtvieloeedh7ehz3nrwcdivnfhfcedl7gf4kwddhkqd.onion/*
// @match        *://inv.vernccvbvyi5qhfzyqengccj7lkove6bjot2xhh5kajhwvidqafczrad.onion/*
// @match        *://am74vkcrjp2d5v36lcdqgsj2m6x36tbrkhsruoegwfcizzabnfgf5zyd.onion/*
// @match        *://ng27owmagn5amdm7l5s3rsqxwscl5ynppnis5dqcasogkyxcfqn7psid.onion/*
// @match        *://iv.odysfvr23q5wgt7i456o5t3trw2cw5dgn56vbjfbq2m7xsc5vqbqpcyd.onion/*
// @match        *://invidious.g4c3eya4clenolymqbpgwz3q3tawoxw56yhzk4vugqrl6dtu3ejvhjid.onion/*
// @match        *://verni6dr4qxjgjumnvesxerh5rvhv6oy5ddeibaqy5d7tgbiiyfa.b32.i2p/*
// @grant        none
// @license      MIT
// @homepage     https://gitlab.com/userscripts3/Invidious-Preferences-Userscript
// @downloadURL https://update.greasyfork.org/scripts/463714/Invidious%20Preferences.user.js
// @updateURL https://update.greasyfork.org/scripts/463714/Invidious%20Preferences.meta.js
// ==/UserScript==
/** This userscript is based on https://greasyfork.org/en/scripts/450983-genius-back-to-the-original-page-layout but rewritten to enforce video playback preferences as video quality, visibility of comments, etc, through URL parameters and without using browser cookies.
For more information about Invidious URL parameters and the various options, see https://docs.invidious.io/url-parameters/
To edit the enforced URL parameters, change the setting strings below. Keep options in their appropriate catagories (URL Parameters affecting video playback should only be in videosettings, etc). You can keep a setting option blank if you would rather not append any URL parameters.
*/
let appearencesettings = ""
let searchsettings = ""
let videosettings = "related_videos=false&extend_desc=true&comments=false"
let trendingsettings = "type=Music"
/**
Anytime you load a video URL on your desired Invidious instance, this script will check the URL for the desired parameters, and apply them if not found.
To edit the Invidious instances this script applies to, edit the domains above.
You may also edit the Homepage by changing the variable below (options include "search", "popular", and "trending"). */
let homepage = "search"
/** You may also set it so videos in a single playlist play automatically by setting the toggle below. */

let PlaylistAutoplay = "true"


/**

It is recommended that you use this script in combination with https://github.com/dybdeskarphet/privacy-redirector and https://codeberg.org/mthsk/userscripts/src/branch/master/simple-sponsor-skipper


This script can also redirect Invidious Feeds to their YouTube equivelants so that URLs from RSS Feeds can be easily redirected to the most convenient instance. To disable this, set rssRedirect below to "false". */
let rssRedirect = "true"

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getCurrentURL () {
  return window.location.href;
}

// Example
const url = getCurrentURL();

(function() {
    'use strict';

    if (!url.includes("?") && !url.includes(appearencesettings)) {
        window.location.replace(url + ("?" + appearencesettings));

    }

            else if(!url.includes(appearencesettings)) {
                window.location.replace(url + ("&" + appearencesettings));

    }

    if (url.includes("q=") && !url.includes(searchsettings)) {
        window.location.replace(url + ("&" + appearencesettings + "&" + searchsettings));
    }

    if(homepage.includes("search") && url.includes("feed/trending")){
            window.location.replace (window.location.href.substring(0, window.location.href.indexOf('feed/trending')) + ("search"));
    }
    else if(homepage.includes("search") && url.includes("feed/popular")){
                window.location.replace (window.location.href.substring(0, window.location.href.indexOf('feed/popular')) + ("search"));
    }

    if(homepage.includes("popular") && url.includes("feed/trending")){
            window.location.replace (window.location.href.substring(0, window.location.href.indexOf('feed/trending')) + ("feed/popular"));
    }
    else if(homepage.includes("popular") && url.includes("search") && !url.includes("q=")){
                window.location.replace (window.location.href.substring(0, window.location.href.indexOf('search')) + ("feed/popular"));
    }

    if(homepage.includes("trending") && url.includes("feed/popular")){
            window.location.replace (window.location.href.substring(0, window.location.href.indexOf('feed/popular')) + ("feed/trending"));
    }
    else if(homepage.includes("popular") && url.includes("search") && !url.includes("q=")){
                window.location.replace (window.location.href.substring(0, window.location.href.indexOf('search')) + ("feed/trending"));
    }
    if (url.includes("feed/trending") && !url.includes(trendingsettings)) {
        window.location.replace(url + ("?" + appearencesettings + "&" + trendingsettings));
    }

    if (url.includes("v=") && url.includes("&list=") && !url.includes(videosettings) && PlaylistAutoplay.includes("true")) {
        window.location.replace(url + ("&" + appearencesettings + "&" + videosettings + "&autoplay=1"));
    }
    else if (url.includes("v=") && !url.includes(videosettings) && !url.includes(videosettings.reverse)) {
        window.location.replace(url + ("&" + appearencesettings + "&" + videosettings));
    }

})();

var InvidiousLinks = Array.from(document.links).filter(link => link.href.includes(window.location.hostname));
    for (var i = 0; i < InvidiousLinks.length; i++) {


        if(!InvidiousLinks[i].href.includes("watch") && !InvidiousLinks[i].href.includes("preferences") && !InvidiousLinks[i].href.includes("channel") && !InvidiousLinks[i].href.includes("search") && !InvidiousLinks[i].href.includes("feed") && !InvidiousLinks[i].href.includes("@") && !InvidiousLinks[i].href.includes("playlist") && homepage.includes("search") && !InvidiousLinks[i].href.includes("embed")){
            InvidiousLinks[i].href = InvidiousLinks[i].href + ("search")
        }

        else if(!InvidiousLinks[i].href.includes("watch") && !InvidiousLinks[i].href.includes("preferences") && !InvidiousLinks[i].href.includes("channel") && !InvidiousLinks[i].href.includes("search") && !InvidiousLinks[i].href.includes("feed") && !InvidiousLinks[i].href.includes("@") && !InvidiousLinks[i].href.includes("playlist") && homepage.includes("trending") && !InvidiousLinks[i].href.includes("embed")){
            InvidiousLinks[i].href = InvidiousLinks[i].href + ("feed/trending")
        }

        else if(!InvidiousLinks[i].href.includes("watch") && !InvidiousLinks[i].href.includes("preferences") && !InvidiousLinks[i].href.includes("channel") && !InvidiousLinks[i].href.includes("search") && !InvidiousLinks[i].href.includes("feed") && !InvidiousLinks[i].href.includes("@") && !InvidiousLinks[i].href.includes("playlist") && homepage.includes("popular") && !InvidiousLinks[i].href.includes("embed")){
            InvidiousLinks[i].href = InvidiousLinks[i].href + ("feed/popular")
        }

        if(InvidiousLinks[i].href.includes("?") && !InvidiousLinks[i].href.includes("v=") && !InvidiousLinks[i].href.includes("embed") && !InvidiousLinks[i].href.includes("switchbackend")){
            InvidiousLinks[i].href = InvidiousLinks[i].href + ("&" + appearencesettings)
        }
        else if (!InvidiousLinks[i].href.includes("feed/channel") && !InvidiousLinks[i].href.includes("feed/playlist") && !InvidiousLinks[i].href.includes("v=") && !InvidiousLinks[i].href.includes("embed")){
            InvidiousLinks[i].href = InvidiousLinks[i].href + ("?" + appearencesettings)
        }

         if(InvidiousLinks[i].href.includes("v=") && InvidiousLinks[i].href.includes("&t=") && !InvidiousLinks[i].href.includes(videosettings)){
            InvidiousLinks[i].href = InvidiousLinks[i].href.replace("t=", appearencesettings + "&" + videosettings + "&t=")
        }

          else if (InvidiousLinks[i].href.includes("v=") && InvidiousLinks[i].href.includes("&list=") && !InvidiousLinks[i].href.includes(videosettings) && !InvidiousLinks[i].href.includes("embed") && PlaylistAutoplay.includes("true") && !InvidiousLinks[i].href.includes("switchbackend")){
                 InvidiousLinks[i].href = InvidiousLinks[i].href + ("&"+ appearencesettings + "&" + videosettings + "&autoplay=1")
        }


        else if (InvidiousLinks[i].href.includes("v=") && !InvidiousLinks[i].href.includes(videosettings) && !InvidiousLinks[i].href.includes("embed") && !InvidiousLinks[i].href.includes("switchbackend")){
                 InvidiousLinks[i].href = InvidiousLinks[i].href + ("&"+ appearencesettings + "&" + videosettings)
        }
                   if(InvidiousLinks[i].href.includes("feed/channel") && rssRedirect.includes("true")){
            InvidiousLinks[i].href = ("https://www.youtube.com/feeds/videos.xml?channel_id=" + InvidiousLinks[i].pathname.replace("/feed/channel/", ""))
           }
                  if(InvidiousLinks[i].href.includes("feed/playlist") && rssRedirect.includes("true")){
            InvidiousLinks[i].href = ("https://www.youtube.com/feeds/videos.xml?playlist_id=" + InvidiousLinks[i].pathname.replace("/feed/playlist/", ""))
           }
    }
