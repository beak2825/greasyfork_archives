// ==UserScript==
// @name         GOG Game Page - Add Links To Game Trailer & Gameplay Search On YouTube & Link To Steam Page
// @namespace    coop
// @version      0.2
// @description  This script adds links to a GOG game page so you can easily and quickly search youtube for a trailer for the game or for a gameplay video or go to the game's page on steam.
// @author       You
// @match        http://www.gog.com/game/*
// @match        https://www.gog.com/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367781/GOG%20Game%20Page%20-%20Add%20Links%20To%20Game%20Trailer%20%20Gameplay%20Search%20On%20YouTube%20%20Link%20To%20Steam%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/367781/GOG%20Game%20Page%20-%20Add%20Links%20To%20Game%20Trailer%20%20Gameplay%20Search%20On%20YouTube%20%20Link%20To%20Steam%20Page.meta.js
// ==/UserScript==

const gameName = document.querySelector('.productcard-basics__title').textContent.trim()

const headerInfoContainer = document.querySelector('.productcard-basics__wrapper')

const metaLinksContainer = document.createElement('div')
metaLinksContainer.setAttribute('style', `
display: flex;
justify-content: space-between;
width: 128px;
`)


const ytTrailerSearchLink = document.createElement('a')
ytTrailerSearchLink.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(gameName) + ' trailer'
ytTrailerSearchLink.textContent = 'Trailer'
ytTrailerSearchLink.setAttribute('target', '_blank')


// const linkoutSvg = document.createElement('svg')
// linkoutSvg.setAttribute('fill', 'currentColor')
// linkoutSvg.setAttribute('height', '24')
// linkoutSvg.setAttribute('stroke', 'currentColor')
// linkoutSvg.setAttribute('stroke-linecap', 'round')
// linkoutSvg.setAttribute('stroke-linejoin', 'round')
// linkoutSvg.setAttribute('stroke-width', '2')
// linkoutSvg.setAttribute('viewBox', '0 0 24 24')
// linkoutSvg.setAttribute('width', '24')
// linkoutSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
// linkoutSvg.innerHTML = `
// <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
//     <polyline points="15 3 21 3 21 9" />
//     <line x1="10" x2="21" y1="14" y2="3" />
// `

const ytGameplaySearchLink = document.createElement('a')
ytGameplaySearchLink.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(gameName) + ' gameplay'
ytGameplaySearchLink.textContent = 'Gameplay'
ytGameplaySearchLink.setAttribute('target', '_blank')

const divider = document.createElement('div')
divider.setAttribute('class', 'productcard-basics__separator')

metaLinksContainer.appendChild(ytTrailerSearchLink)
// metaLinksContainer.appendChild(linkoutSvg)
metaLinksContainer.appendChild(ytGameplaySearchLink)

headerInfoContainer.appendChild(divider)
headerInfoContainer.appendChild(metaLinksContainer)
