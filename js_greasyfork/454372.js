// ==UserScript==
// @name         Open Steam URL
// @namespace    https://github.com/hash-dev/OpenSteamURL
// @version      1.0
// @description  Adds a button next to the "Install Steam" button to open the current URL in the Steam client
// @author       hash-dev
// @match        http*://steamcommunity.com/*
// @match        http*://store.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @grant        GM_addStyle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/454372/Open%20Steam%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/454372/Open%20Steam%20URL.meta.js
// ==/UserScript==

/* globals $ */
'use strict'

// Icon retrieved from: https://fonts.google.com/icons?icon.set=Material+Icons
const openLinkIcon = $('<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>')
const openSteamBtn = $('<div>', { id: 'open_steam_btn' })
    .append($('<a>', { href: `steam://openurl/${window.location.href}` }).text('Open in Steam').prepend(openLinkIcon))

const injectSteamBtn = () => {
    // Insert the open steam button before the install button
    $('#global_action_menu > .header_installsteam_btn').before(openSteamBtn)
    // Add rounded corners to the install button
    $('#global_action_menu > .header_installsteam_btn > a').css({ borderRadius: '.1875rem' })
}

$(document).ready(injectSteamBtn)

GM_addStyle(`
    #open_steam_btn {
        display: inline-block;
        position: relative;
        height: 21px;
        line-height: 24px;
        margin-right: .5rem;
    }
    #open_steam_btn > a {
        display: inline-flex;
        padding: 0 .5rem 0 .25rem;
        border-radius: .1875rem;
        text-decoration: none;
        color: #e5e4dc;
        font-weight: normal;
        background-color: rgba( 103, 193, 245, 0.2 );
        transition: background-color .1s ease-in-out, color .1s ease-in-out;
    }
    #open_steam_btn > a > svg {
        height: 1rem;
        width: 1rem;
        padding: .25rem;
        margin-right: .125rem;
        fill: #e5e4dc;
        transition: fill .1s ease-in-out;
    }
    #open_steam_btn > a:hover {
        background-color: #67c1f5;
        color: white;
    }
    #open_steam_btn > a:hover > svg {
        fill: white;
    }
`)
