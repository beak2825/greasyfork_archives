// ==UserScript==
// @name         t.me Open in Web Telegram A for All Browsers
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  This script allows you to open t.me links in Web Telegram A on Firefox, Chrome, and Safari
// @author       DRLEVONK
// @match        https://t.me/*
// @match        https://www.google.com/url?q=https://t.me/*
// @match        https://duckduckgo.com/l/?uddg=https://t.me/*
// @match        https://www.bing.com/search?q=https://t.me/*
// @match        https://search.brave.com/search?q=https://t.me/*
// @match        https://search.yahoo.com/search?p=https://t.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t.me
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546239/tme%20Open%20in%20Web%20Telegram%20A%20for%20All%20Browsers.user.js
// @updateURL https://update.greasyfork.org/scripts/546239/tme%20Open%20in%20Web%20Telegram%20A%20for%20All%20Browsers.meta.js
// ==/UserScript==
 
( function ()  {
    'use strict' ;
 
    /* Function to get channel ID */
    function  getChannelId ( url )  {
        // Decode URL to get original t.me link
        const  decodedUrl  =  decodeURIComponent ( url );
        // Extract the t.me part of the URL
        const  match  =  decodedUrl . match ( /t\.me\/(.*?)($|&|\?)/ );
        return  match  ?  match [ 1 ]  :  null ;
    }
 
    /* Get the current location */
    const  currentUrl  =  window . location . href ;
    /* Get channel ID from the current location */
    const  channelId  =  getChannelId ( currentUrl );
 
    if  ( ! channelId )  {
        return ;  // Exit if no channel ID is found
    }
 
    /* Find the button that takes you to the desktop client */
    const  desktopClient  =  document . querySelector ( '.tgme_page_action' );
    /* Add a new button below to go to the web client */
    if  ( desktopClient )  {
        const  webClient  =  document . createElement ( 'div' );
        webClient . classList . add ( 'tgme_page_action' ,  'tgme_page_web_action' );
        webClient.innerHTML = `<a class="tgme_action_button_new tgme_action_web_button" href="https://web.telegram.org/a/#@${channelId}"><span class="tgme_action_button_label">Open in Web</span></a>`;
        desktopClient . insertAdjacentElement ( 'afterend' ,  webClient );
    }
 
    /* Hide channel preview link in t.me */
    const  previewLink  =  document . querySelector ( '.tgme_page_context_link_wrap' );
    if  ( previewLink )  {
        previewLink . style . display  =  'none' ;
    }
})();