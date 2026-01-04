// ==UserScript==
// @name         Rock Paper Shotgun - Links To Steam & Youtube Trailer & Youtube Gameplay Video
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This script adds links on a RPS article to a the game on steam and a link to search youtube trailer for the game's trailer and link to search youtube for gameplay videos of the game.
// @author       You
// @match        https://www.rockpapershotgun.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35473/Rock%20Paper%20Shotgun%20-%20Links%20To%20Steam%20%20Youtube%20Trailer%20%20Youtube%20Gameplay%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/35473/Rock%20Paper%20Shotgun%20-%20Links%20To%20Steam%20%20Youtube%20Trailer%20%20Youtube%20Gameplay%20Video.meta.js
// ==/UserScript==

const gameName = document.querySelector('nav.breadcrumb li:last-child a').textContent.trim()
console.log(gameName)
const metaLinksContainer = document.createElement('div')
metaLinksContainer.setAttribute('style', `
    font-size: 14px;
    display: flex;
    justify-content: space-around;
    position: absolute;
    top: -42.8px;
    right: 63px;
    width: 242px;

`)

const steamSearchLink = document.createElement('a')
steamSearchLink.href = 'http://store.steampowered.com/search/?term=' + encodeURIComponent(gameName)
steamSearchLink.textContent = 'Find On Steam'
steamSearchLink.setAttribute('target', '_blank')

const ytTrailerSearchLink = document.createElement('a')
ytTrailerSearchLink.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(gameName) + ' trailer'
ytTrailerSearchLink.textContent = 'Trailer'
ytTrailerSearchLink.setAttribute('target', '_blank')

const ytGameplaySearchLink = document.createElement('a')
ytGameplaySearchLink.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(gameName) + ' gameplay'
ytGameplaySearchLink.textContent = 'Gameplay'
ytGameplaySearchLink.setAttribute('target', '_blank')


metaLinksContainer.appendChild(steamSearchLink)
metaLinksContainer.appendChild(ytTrailerSearchLink)
metaLinksContainer.appendChild(ytGameplaySearchLink)

document.querySelector('header .details').insertBefore(metaLinksContainer, document.querySelector('header .details .comment-count'))