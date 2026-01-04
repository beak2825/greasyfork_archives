// ==UserScript==
// @name         Mobile Link Replacer
// @namespace    
// @version      0.9.9
// @description  Replaces mobile links on web pages with their desktop counterpart.
// @author       Spencer Ayers-Hale
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @run-at       document-idle
// @match        https://*/*
// @match        http://*/*
// @exclude      https://www.reddit.com/chat/minimize
// @exclude      https://www.craigslist.org/static/www/localStorage*
// @exclude      https://auth.discogs.com/*
// @exclude      https://www.youtube.com/embed/*
// @exclude      https://widget.pico.tools/*
// @exclude      https://m.stripe.network/*
// @exclude      *content.s3.amazonaws.com/*
// @exclude      https://cdns.*.gigya.com/*
// @exclude      https://platform.twitter.com/*
// @exclude      https://myaccount.nytimes.com*
// @exclude      *googleapis.com*
// @exclude      https://www.google.com/recaptcha/*
// @exclude      https://cdn.*.com/widgets/*
// @exclude      https://buy.tinypass.com/*
// @exclude      https://trinitymedia.ai/player/*
// @exclude      https://embed.air.tv/v1/*
// @exclude      https://www.11alive.com/embeds/*
// @exclude      https://widget.yappaapp.com/*
// @exclude      https://authenticate.economist.com/*
// @exclude      https://embed.acast.com/*
// @exclude      https://o.prod.theintercept.com/checkout/*
// @exclude      https://identity-eu.nationalgeographic.com/*
// @exclude      *rackcdn.com/*
// @exclude      *msi.com/*
// @exclude      www.lg.com*
// @exclude     https://support.google.com*
// @downloadURL https://update.greasyfork.org/scripts/406510/Mobile%20Link%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/406510/Mobile%20Link%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var num = document.getElementsByTagName("a").length; //number of links on page
    var cnt = 0; //current link number
    var newLink;

    while(cnt < num){
        const link = document.getElementsByTagName("a")[cnt].href; //get original link

        //find and replace
        //Wikipedia
        newLink = link.replaceAll(/m.wikipedia/gi, 'wikipedia');
        //Facebook
        newLink = newLink.replaceAll(/m.facebook/gi, 'facebook');
        //Twitter
        newLink = newLink.replaceAll(/mobile.twitter/gi, 'twitter');
        newLink = newLink.replaceAll(/m.twitter/gi, 'twitter');
        //YouTube
        newLink = newLink.replaceAll(/m.youtube/gi, 'youtube');
        //IMDB
        newLink = newLink.replaceAll(/m.imdb/gi, 'imdb');
        //AliExpress
        newLink = newLink.replaceAll(/m.aliexpress/gi, 'aliexpress');
        //Blogger
        if (newLink.indexOf("blogspot.com") > -1){
            newLink = newLink.replaceAll(/m=1/gi, 'm=0');
        }
        //CBS Local
        if (newLink.indexOf("cbslocal.com") > -1){
            newLink = newLink.replaceAll(/amp/gi, '');
        }
        //Mozilla Wiki
        if (newLink.indexOf("wiki.mozilla.org") > -1){
            if (newLink.indexOf("index.php?title=") < 0){
                newLink = newLink.replaceAll(/wiki.mozilla.org\//gi, 'wiki.mozilla.org/index.php?title=');
                newLink = newLink.concat('&mobileaction=toggle_view_desktop');
            }
            else if (newLink.endsWith("&mobileaction=toggle_view_mobile")){
                newLink = newLink.replaceAll(/&mobileaction=toggle_view_mobile/gi, '&mobileaction=toggle_view_desktop');
            }
         }

        document.getElementsByTagName("a")[cnt].href=newLink; //write new link to page
        cnt++;
    }

})();