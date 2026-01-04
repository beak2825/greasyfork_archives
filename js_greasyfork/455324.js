// ==UserScript==
// @name Steam - ProtonDB Integration
// @description Adds game ratings from ProtonDB to the Steam Store
// @version 1.0.0
// @author guihkx
// @match https://store.steampowered.com/app/*
// @connect www.protondb.com
// @run-at document-end
// @noframes
// @license MIT; https://opensource.org/licenses/MIT
// @namespace https://github.com/guihkx
// @icon https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @homepageURL https://github.com/guihkx/user-scripts
// @supportURL https://github.com/guihkx/user-scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/455324/Steam%20-%20ProtonDB%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/455324/Steam%20-%20ProtonDB%20Integration.meta.js
// ==/UserScript==

/**
 * Changelog:
 *
 * @version 1.0.0:
 * - First release
 */

;(async () => {
  'use strict'

  const PROTONDB_TIERS = [
    'pending',
    'borked',
    'bronze',
    'silver',
    'gold',
    'platinum'
  ]
  const PROTONDB_CONFIDENCE_LEVELS = ['low', 'moderate', 'good', 'strong']
  const PROTONDB_HOMEPAGE = 'https://www.protondb.com'

  let tempPrefs = {}
  const userPrefs = {
    skip_native_games: GM_getValue('skip_native_games', true),
    open_in_new_tab: GM_getValue('open_in_new_tab', false),
    show_confidence_level: GM_getValue('show_confidence_level', true)
  }

  const appId = getCurrentAppId()

  if (!appId) {
    return
  }
  if (userPrefs.skip_native_games) {
    if (document.querySelector('span.platform_img.linux') !== null) {
      log('Ignoring native Linux game:', appId)
      return
    }
  }
  injectCSS()

  GM_xmlhttpRequest({
    method: 'GET',
    url: `${PROTONDB_HOMEPAGE}/api/v1/reports/summaries/${appId}.json`,
    onload: addRatingToStorePage
  })

  function getCurrentAppId () {
    const urlPath = window.location.pathname
    const appId = urlPath.match(/\/app\/(\d+)/)

    if (appId === null) {
      log('Unable to get AppId from URL path:', urlPath)
      return false
    }
    return appId[1]
  }

  function addRatingToStorePage (response) {
    let reports = {}
    let tier

    if (response.status === 200) {
      try {
        reports = JSON.parse(response.responseText)
        tier = reports.tier
      } catch (err) {
        log('Unable to parse ProtonDB response as JSON:', response)
        log('Javascript error:', err)
        tier = 'error'
      }
      if (!PROTONDB_TIERS.includes(tier)) {
        log('Unknown tier:', tier)
        tier = 'unknown'
      }
    } else if (response.status === 404) {
      log(`App ${appId} doesn't have a page on ProtonDB yet`)
      tier = 'unavailable'
    } else {
      log('Got unexpected HTTP code from ProtonDB:', response.status)
      tier = 'error'
    }
    const container = Object.assign(document.createElement('div'), {
      className: 'protondb_rating_row',
      title: 'View on www.protondb.com'
    })

    const subtitle = Object.assign(document.createElement('div'), {
      className: 'subtitle column',
      textContent: 'ProtonDB Score:'
    })

    const link = Object.assign(document.createElement('a'), {
      className: `protondb_rating_link protondb_rating_${tier}`,
      href: `${PROTONDB_HOMEPAGE}/app/${appId}`,
      target: userPrefs.open_in_new_tab ? '_blank' : '_self'
    })

    if (
      'confidence' in reports &&
      userPrefs.show_confidence_level &&
      PROTONDB_CONFIDENCE_LEVELS.includes(reports.confidence)
    ) {
      tier += ` (${reports.confidence} confidence)`
    }
    link.textContent = tier

    container.appendChild(subtitle)
    container.appendChild(link)

    const element = document.querySelector('.game_description_snippet')
    element.prepend(container)

    buildPreferencesDialog()
  }

  function buildPreferencesDialog () {
    const container = Object.assign(document.createElement('div'), {
      className: 'protondb_prefs_icon',
      title: 'Preferences for ProtonDB for Steam',
      textContent: '⚙'
    })

    container.addEventListener('click', () => {
      // Clear any temporary preferences
      tempPrefs = {}

      const html = `
      <div class="protondb_prefs">
        <div class="newmodal_prompt_description">
          New preferences will only take effect after you refresh the page.
        </div>
        <blockquote>
          <div>
            <input type="checkbox" id="protondb_open_in_new_tab" ${
  userPrefs.open_in_new_tab ? 'checked' : ''
  } />
            <label for="protondb_open_in_new_tab">Open ProtonDB links in new tab</label>
          </div>
          <div>
            <input type="checkbox" id="protondb_skip_native_games" ${
  userPrefs.skip_native_games ? 'checked' : ''
  } />
            <label for="protondb_skip_native_games">Don't check native Linux games</label>
          </div>
          <div>
            <input type="checkbox" id="protondb_show_confidence_level" ${
  userPrefs.show_confidence_level ? 'checked' : ''
  } />
            <label for="protondb_show_confidence_level">Show the confidence level of ratings</label>
          </div>
        </blockquote>
      </div>`

      unsafeWindow
        .ShowConfirmDialog('ProtonDB for Steam', html, 'Save')
        .done(() => {
          log('Saving preferences')
          saveUserPreferences()
        })
        .fail(() => {
          log('Ignoring changed preferences')
        })

      // Handle preferences changes
      const inputs = document.querySelectorAll('.protondb_prefs input')

      for (const input of inputs) {
        input.addEventListener('change', event => {
          const target = event.target
          const prefName = target.id.replace('protondb_', '')

          switch (target.type) {
            case 'text':
              log(
                `Temporarily setting preference '${prefName}' to ${
                  target.value
                }`
              )
              tempPrefs[prefName] = target.value
              break
            case 'checkbox':
              log(
                `Temporarily setting preference '${prefName}' to ${
                  target.checked
                }`
              )
              tempPrefs[prefName] = target.checked
              break
            default:
              break
          }
        })
      }
    })

    document.querySelector('.protondb_rating_row').appendChild(container)
  }

  function saveUserPreferences () {
    for (const prefName in tempPrefs) {
      userPrefs[prefName] = tempPrefs[prefName]
      GM_setValue(prefName, userPrefs[prefName])
    }
  }

  function injectCSS () {
    GM_addStyle(`
      .protondb_rating_row {
        display: flex;
        line-height: 16px;
        text-transform: capitalize;
        margin: 13px 0 13px 0;
        color:#8A97A0;
      }
      .protondb_rating_link {
        margin-left: -3px;
      }
      .protondb_rating_error, .protondb_rating_unavailable, .protondb_rating_unknown {
        color: #386b86 !important;
      }
      .protondb_rating_borked {
        color: #FF1919 !important;
      }
      .protondb_rating_bronze {
        color: #CD7F32 !important;
      }
      .protondb_rating_silver {
        color: #C0C0C0 !important;
      }
      .protondb_rating_gold {
        color: #FFD799 !important;
      }
      .protondb_rating_platinum {
        color: #B4C7DC !important;
      }
      .protondb_prefs_icon {
        margin-left: 5px;
        cursor: pointer;
      }
      .protondb_prefs input[type="checkbox"], .protondb_prefs label {
        line-height: 20px;
        vertical-align: middle;
        display: inline-block;
        color: #66c0f4;
        cursor: pointer;
      }
      .protondb_prefs blockquote {
        margin: 15px 0 5px 10px;
      }`)
  }

  function log () {
    console.log('[ProtonDB Integration for Steam]', ...arguments)
  }
})()
