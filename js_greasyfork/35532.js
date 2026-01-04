// ==UserScript==
// @name         Steam Game Page - Add Links To Game Trailer & Gameplay Search On YouTube
// @namespace    coop
// @version      0.4
// @description  This script adds links to the right of the breadcrumbs on a Steam game page so you can easily and quickly search youtube for a trailer for the game or for a gameplay video.
// @author       You
// @match        http://store.steampowered.com/app/*
// @match        https://store.steampowered.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35532/Steam%20Game%20Page%20-%20Add%20Links%20To%20Game%20Trailer%20%20Gameplay%20Search%20On%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/35532/Steam%20Game%20Page%20-%20Add%20Links%20To%20Game%20Trailer%20%20Gameplay%20Search%20On%20YouTube.meta.js
// ==/UserScript==

const gameName = document.querySelector('.apphub_AppName').textContent.trim()

const breadcrumbsContainer = document.querySelector('.breadcrumbs')

breadcrumbsContainer.setAttribute('style', `
display: flex;
justify-content: space-between;
margin-right: 320px;
`)

const metaLinksContainer = document.createElement('div')
metaLinksContainer.setAttribute('style', `
display: flex;
justify-content: space-between;
width: 193px;
`)

const gogSearchLink = document.createElement('a')
gogSearchLink.href = 'https://www.google.com/search?q=site%3Agog.com+' + gameName
gogSearchLink.textContent = 'Find On GoG'
gogSearchLink.setAttribute('target', '_blank')

const ytTrailerSearchLink = document.createElement('a')
ytTrailerSearchLink.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(gameName) + ' trailer'
ytTrailerSearchLink.textContent = 'Trailer'
ytTrailerSearchLink.setAttribute('target', '_blank')


const ytGameplaySearchLink = document.createElement('a')
ytGameplaySearchLink.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(gameName) + ' gameplay'
ytGameplaySearchLink.textContent = 'Gameplay'
ytGameplaySearchLink.setAttribute('target', '_blank')

metaLinksContainer.appendChild(gogSearchLink)
metaLinksContainer.appendChild(ytTrailerSearchLink)
metaLinksContainer.appendChild(ytGameplaySearchLink)

breadcrumbsContainer.appendChild(metaLinksContainer)
