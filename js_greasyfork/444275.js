// ==UserScript==
// @name         IdleScape Horizontal Channels
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Horizontal chat channel list for IdleScape
// @author       Kronos
// @match         *://*.idlescape.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/444275/IdleScape%20Horizontal%20Channels.user.js
// @updateURL https://update.greasyfork.org/scripts/444275/IdleScape%20Horizontal%20Channels.meta.js
// ==/UserScript==


(() => {
    'use strict';
 
    const settings = {
        removeLeaveChannelButton: true, //the 'x' button on channels, set to true to remove the button
    }

    const mainCss = 
    `
    /* make chat area display elements in rows instead of grid */
    div.play-area-chat-container > div.chat-container {
        display:flex;
        flex-direction:column;
        position:relative;
        overflow-y:visible;
    }
    

    /* chat tab list, make it show channels as smaller blocks in row */
    div.play-area-chat-container > div > div.chat-tabs-list {
        width:100%;
        min-height:38px!important;
        max-height:38px!important;
        display: flex;
        flex:1 100 auto;
        flex-direction:row;
        padding:0px;
        flex-wrap: wrap;
    }
    

    /* a single channel tab element */
    div.chat-tabs-list  > div.chat-tab { 
        margin: 0px 5px 0px 0px;
        height:auto;
        color:#e6e6e6;
        flex-grow: 1;
        flex-basis: 95px;
        padding:5px;
    }
    
    
    /* whisper chats, this affects the "activity" tab too (it's set as a whisper tab by devs) */
    .chat-tabs-list > .chat-tab-whisper.chat-tab {
        xborder:1px solid gold;
    }


    /* change channel tab color on hover */
    .chat-tabs-list > .chat-tab:hover { 
        filter: brightness(1.5); 
        color:#b3b3b3!important;
        border-bottom:3px solid rgba(255, 255, 255, 0.1);
    }


    /* "Send a message" field, make it shorter to fit the chat functions buttons on the right side */
    div.play-area-chat-container > div.chat-inner-container > div.chat-input-field-container {
        width:90%;
    }
    

    /* chat functions buttons, move them to the bottom right */
    div.chat-container > div.chat-channels-functions {
        bottom:25px;
        color:grey;
    }
    

    /* make chat functions buttons always visible instead of visible only on chat hover */
    div.chat-channels-functions > div.chat-channel-function {
        opacity:1!important;
    }
    
    `;


    const leaveChannelCss = `
        /* don't display the "x" leave channel button on channel tabs */
        div.chat-tab.chat-tab-active > a.chat-tab-close-button {
            display:none;
        }

        /* always display the "x" leave channel button on whisper/PM chats */
        div.chat-tab.chat-tab-active.chat-tab-whisper > a.chat-tab-close-button {
            display:inline-block;
       }
    `;


    const setCustomCss = str => {
        const styleElem = document.createElement("style");
        styleElem.textContent = str;
        document.body.appendChild(styleElem);
    }


    setCustomCss(mainCss);
    if (settings.removeLeaveChannelButton) setCustomCss(leaveChannelCss); 
   
})();
