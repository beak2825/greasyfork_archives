// ==UserScript==
// @name Victorian Covid-19 exposure site highlighter
// @namespace https://www.claudinec.net/
// @description Finds and highlights suburbs of interest in the Victorian Government table of Covid-19 exposure sites. Highlight colour matches exposure tier (1-3).
// @include /www\.coronavirus\.vic\.gov\.au\/.*exposure-sites?/
// @require https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant   GM_getValue
// @grant   GM_setValue
// @author Claudine Chionh <info@claudinec.net>
// @version 0.2.3
// @license GPL-3.0-or-later
// @supportURL https://github.com/claudinec/cc-userscripts/issues
// @homepageURL https://github.com/claudinec/cc-userscripts
// @downloadURL https://update.greasyfork.org/scripts/431462/Victorian%20Covid-19%20exposure%20site%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/431462/Victorian%20Covid-19%20exposure%20site%20highlighter.meta.js
// ==/UserScript==

GM_config.init(
  {
    'id': 'highlightConfig',
    'title': 'Exposure site highlighter options',
    'fields':
    {
      'Suburbs':
      {
        'label': 'Suburbs to highlight, separated by commas or new lines',
        'type': 'textarea',
        'default': 'Melbourne'
      },
      'Tier 1 colour':
      {
        'label': 'Highlight colour for Tier 1 sites',
        'section': [
          'Highlight colours for Tiers 1-3 – use colour names or hex codes',
          '<a href="https://www.w3.org/wiki/CSS/Properties/color/keywords">Colour reference</a>'
        ],
        'type': 'text',
        'default': 'orangered'
      },
      'Tier 2 colour':
      {
        'label': 'Highlight colour for Tier 2 sites',
        'type': 'text',
        'default': 'yellow'
      },
      'Tier 3 colour':
      {
        'label': 'Highlight colour for Tier 3 sites',
        'type': 'text',
        'default': 'aqua'
      }
    },
    'css': 'textarea {display: block; width: 20%; height: 40%} #highlightConfig_wrapper {height: 60%}'
  }
)
GM_config.open()

// Get configuration for chosen suburbs.
const splitRe = /\s?(,|\n)\s?/
var alertSuburbs = ['Melbourne']
const suburbsText = GM_config.get('Suburbs')
if (suburbsText) {
  alertSuburbs = suburbsText.split(splitRe)
}

// Get configuration for highlight colours.
var tier1Colour = GM_config.get('Tier 1 colour')
if (!tier1Colour || tier1Colour === '') {
  tier1Colour = 'orangered'
}
var tier2Colour = GM_config.get('Tier 2 colour')
if (!tier2Colour || tier2Colour === '') {
  tier2Colour = 'yellow'
}
var tier3Colour = GM_config.get('Tier 3 colour')
if (!tier3Colour || tier3Colour === '') {
  tier3Colour = 'aqua'
}

const resultsPage = document.body
const callback = function (mutations, observer) {
  for (const mutation of mutations) {
    removeStyles()
    matchSuburbs()
  }
}
const observer = new MutationObserver(callback)
observer.observe(resultsPage, { characterData: true, childList: true, subtree: true })

function matchSuburbs () {
  const tierMatch = /Tier [0-9]/
  const suburbs = document.querySelectorAll('td[data-tid="col-suburb"]')
  suburbs.forEach(suburb => {
    const suburbName = suburb.lastElementChild.textContent
    const suburbRow = suburb.closest('tr')
    const siteTier = suburbRow.querySelector('.ch-health-advice-dropdown').textContent.match(tierMatch)
    if (alertSuburbs.includes(suburbName)) {
      switch (siteTier[0]) {
        case 'Tier 1':
          suburbRow.style.backgroundColor = tier1Colour
          break
        case 'Tier 2':
          suburbRow.style.backgroundColor = tier2Colour
          break
        case 'Tier 3':
          suburbRow.style.backgroundColor = tier3Colour
          break
        // no default
      }
    }
  })
}

function removeStyles () {
  const dataRows = document.querySelectorAll('tbody tr')
  dataRows.forEach(dataRow => {
    dataRow.removeAttribute('style')
  })
}
