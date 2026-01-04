// ==UserScript==
// @name        OpenStreetMap Changeset Viewer Integration v.MM
// @namespace   Violentmonkey Scripts
// @match       https://www.openstreetmap.org/*
// @match       https://osm.mapki.com/*
// @match       https://overpass-api.de/achavi/*
// @match       https://rene78.github.io/latest-changes/*
// @grant       none
// @version     1.1.2
// @license     GNU Affero General Public License v3.0
// @author      Marek-M
// @description 2023-12-06 @ 20:10:15 (OSM, OpenStreetMaps)
// @updateURL
// @downloadURL
// @downloadURL https://update.greasyfork.org/scripts/481557/OpenStreetMap%20Changeset%20Viewer%20Integration%20vMM.user.js
// @updateURL https://update.greasyfork.org/scripts/481557/OpenStreetMap%20Changeset%20Viewer%20Integration%20vMM.meta.js
// ==/UserScript==

(() => {
  'use strict'

  const pattern = /^https?:\/\/(www\.)?(osm\.org|openstreetmap\.org)\/(changeset)\/(\d+)$/g
  // const pattern2 = /^(Zestaw zmian: )(\d+)$/g
  const addHistoryButtons = linkElement => {
    if (linkElement.getAttribute('data-history-button')) return
    const matched = linkElement.href.match(pattern)
    if (!matched) return
    const [_, __, ___, type, id] = matched[0].split('/')

    // historyLinksArray - each element should have 3 elements: [textContent, title, historyLink]
    const textContent = 0, title = 1, historyLink = 2
    const historyLinksArray =
        [
          ['A', `Check in Achavi - changeset no. ${id}`                               , `https://overpass-api.de/achavi/?changeset=${id}`         ],
          ['V', `Check Changeset with Comparison Visualization - changeset no. ${id}` , `https://resultmaps.neis-one.org/osm-change-viz?c=${id}`  ],
          ['C', `Check in OSMCha - changeset no. ${id}`                               , `https://osmcha.org/changesets/${id}`                     ],
          ['H', `OSM History Viewer - changeset no. ${id}`                            , `https://osmhv.openstreetmap.de/changeset.jsp?id=${id}`   ]
        ]

    historyLinksArray.forEach
    (
      (historyLinkArrayElement) =>
      {
        const button = document.createElement('a')
        button.textContent =  historyLinkArrayElement[textContent]
        button.title =        historyLinkArrayElement[title]
        button.href =         historyLinkArrayElement[historyLink]
        button.alt = button.title
        button.target = '_blank'
        button.style.paddingLeft = '0.45ch'
        button.style.paddingRight = '0.20ch'
        button.style.position = 'relative'
        button.style.top = '-0.5ch'
        button.style.display = 'inline-block'
        button.style.transform = 'scale(1.1)'
        button.style.fontSize = '70%'
        button.addEventListener('click', event => {event.stopPropagation()})
        linkElement.insertAdjacentElement('beforeend', button)
      }
    ) // forEach
    linkElement.setAttribute('data-history-button', 'true')
  }

  const scanLinks = () => {
    const links = document.querySelectorAll('a')
    links.forEach(addHistoryButtons)
  }

  const observer = new MutationObserver(scanLinks)
  observer.observe(document.body, {
      childList: true,
      subtree: true
  })
  scanLinks()
})()

