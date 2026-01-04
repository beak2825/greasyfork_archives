// ==UserScript==
// @name        OpenStreetMap Deep History integration v.MM
// @namespace   Violentmonkey Scripts
// @match       https://www.openstreetmap.org/*
// @match       https://overpass-api.de/achavi/*
// @match       https://rene78.github.io/latest-changes/*
// @grant       none
// @version     1.1.2
// @description 2023-12-06, 13:28:50 (OSM, OpenStreetMaps)
// @license     GNU Affero General Public License v3.0
// @author      Marek-M
// @updateURL
// @downloadURL
// @downloadURL https://update.greasyfork.org/scripts/481556/OpenStreetMap%20Deep%20History%20integration%20vMM.user.js
// @updateURL https://update.greasyfork.org/scripts/481556/OpenStreetMap%20Deep%20History%20integration%20vMM.meta.js
// ==/UserScript==

(() => {
  'use strict'

  const pattern = /^https?:\/\/(www\.)?(osm\.org|openstreetmap\.org)\/(node|way|relation)\/(\d+)\/?(history|)$/g
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
          ['d', `Check in Osm Deep History - ${type} no. ${id}` , `https://osmlab.github.io/osm-deep-history/#/${type}/${id}`   ],
          ['p', `Check PEWU History Viewer - ${type} no. ${id}` , `https://pewu.github.io/osm-history/#/${type}/${id}`          ],
          ['m', `Check in Mapki (TAGS only) - ${type} no. ${id}`, `https://osm.mapki.com/history/${type}/${id}`                 ],
          ['v', `Check in Visual Viewer - ${type} no. ${id}`    , `https://aleung.github.io/osm-visual-history/#/${type}/${id}` ]
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
