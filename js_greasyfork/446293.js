// ==UserScript==
// @name         TeleParty Addon
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Nuke the TeleParty chat and all the other TeleParty crap, all while keeping TeleParty enabled and working :)
// @author       CandiceJoy
// @match        http*://hulu.com/*
// @match        http*://*.netflix.com/*
// @match        http*://*.disneyplus.com/*
// @match        http*://play.hbomax.com/*
// @match        http*://*.amazon.com/*/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=teleparty.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446293/TeleParty%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/446293/TeleParty%20Addon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const header = "[Candi Teleparty]";

    function log(msg,obj=null)
    {
        console.log( header + " " + msg );
    }

    let tpActive = false;
    let findPlayer;

    if( window.location.href.match( /netflix\.com/ig ) )
    {
        log("Netflix detected");
        findPlayer = function(){return document.querySelector(".watch-video--player-view");};
    }
    else if( window.location.href.match( /hulu\.com/ig ) )
    {
        log("Hulu detected");
        findPlayer = function(){return document.querySelector("#dash-player-container");};
    }
    else if( window.location.href.match( /disneyplus\.com/ig ) )
    {
        log("Disney+ detected");
        findPlayer = function(){return document.querySelector("#hudson-wrapper");};
    }
    else if( window.location.href.match( /hbomax\.com/ig ) )
    {
        log("HBO Max detected");
        findPlayer = function(){return null;};
    }
    else if( window.location.href.match( /amazon\.com/ig ) )
    {
        log("Amazon Prime detected");
        findPlayer = function(){return document.querySelector(".webPlayerSDKContainer");};
    }
    else
    {
        log("Streaming service not supported");
    }

    function callback(mutations,observer)
    {
        if( window.location.href.match( /hbomax/ig ) )
        {
            const area = document.querySelector("div.default");

            if( area )
            {
                const size = area.style.width;
                const player = document.querySelector(".tp-video");

                if( player )
                {
                    log("Resizing video");
                    player.style.width = size;
                }
            }
        }
        else
        {
            const player = findPlayer();

            if( player && player.classList.contains("with-chat") )
            {
                log("Resizing video");
                player.classList.remove("with-chat");
            }
        }

        if( !tpActive )
        {
            for(const mutation of mutations)
            {
                const target = mutation.target;
                const classes = mutation.target.classList;

                if( classes.contains("PlayerMetadata__subTitle") || classes.contains("ControlsContainer__transition") )
                {
                    continue;
                }

                //console.log("Mutated ",target);

                if( target.querySelector("#tpIconContainer") || target.querySelector("#chat-wrapper") )
                {
                    log("Detected Teleparty");
                    tpActive = true;
                    break;
                }
            }
        }

        if( !tpActive )
        {
            return;
        }

        const popup = document.querySelector("#tpIconContainer");

        if( popup )
        {
            log("Removing popup");
            popup.remove();
        }

        const chat = document.querySelector("#chat-wrapper");

        if( chat )
        {
            log("Removing chat");
            chat.remove();
        }

        if( !popup && !chat )
        {
            //observer.disconnect();
            log("Teleparty no longer detected");
            tpActive = false;
        }
    }

    log("Enabling observer");
    const targetNode = document.getElementsByTagName("body")[0];
    const config = { attributes: true, childList: true, subtree: true };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    //observer.disconnect();
})();