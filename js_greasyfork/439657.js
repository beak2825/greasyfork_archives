// ==UserScript==
// @name ProtonDB SteamPlay Integration
// @description Adds game ratings from ProtonDB to the Steam Store
// @version 0.3.0
// @author Phlebiac
// @match https://store.steampowered.com/app/*
// @connect www.protondb.com
// @run-at document-end
// @noframes
// @license MIT; https://opensource.org/licenses/MIT
// @namespace Phlebiac/ProtonDB
// @icon https://www.protondb.com/sites/protondb/images/apple-touch-icon.png
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/439657/ProtonDB%20SteamPlay%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/439657/ProtonDB%20SteamPlay%20Integration.meta.js
// ==/UserScript==

/*  Inspired by / some ideas and code from:
 *    https://openuserjs.org/install/DanMan/Steam_Play_Community_Rating_Notice.user.js
 *    https://raw.githubusercontent.com/guihkx/user-scripts/master/scripts/protondb-integration-for-steam.user.js
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

  let userPrefs = {
    open_in_new_tab: GM_getValue('open_in_new_tab', false),
    skip_native_games: GM_getValue('skip_native_games', true),
    show_confidence_level: GM_getValue('show_confidence_level', true)
  }

  const appId = getCurrentAppId();

  if (!appId) {
    return;
  }
  if (userPrefs.skip_native_games) {
    if (document.querySelector('span.platform_img.linux') !== null) {
      log('Ignoring native Linux game:', appId);
      return;
    }
  }
  injectCSS();

  GM_xmlhttpRequest({
    method: 'GET',
    url: `${PROTONDB_HOMEPAGE}/api/v1/reports/summaries/${appId}.json`,
    onload: addRatingToStorePage
  })

  function getCurrentAppId() {
    const urlPath = window.location.pathname;
    const appId = urlPath.match(/\/app\/(\d+)/);

    if (appId === null) {
      log('Unable to get AppId from URL path:', urlPath);
      return false;
    }
    return appId[1];
  }

  function addRatingToStorePage(response) {
    let reports = {};
    let tier = 'N/A';

    if (response.status === 200) {
      try {
        reports = JSON.parse(response.responseText);
        tier = reports.tier;
      } catch (err) {
        log('Unable to parse ProtonDB response as JSON:', response);
        log('Javascript error:', err);
        tier = 'error';
      }
      if (!PROTONDB_TIERS.includes(tier)) {
        log('Unknown tier:', tier);
        tier = 'unknown';
      }
    } else if (response.status === 404) {
      log(`App ${appId} doesn't have a page on ProtonDB yet`);
      tier = 'N/A';
    } else {
      log('Got unexpected HTTP code from ProtonDB:', response.status);
      tier = 'error';
    }
    
    let confidence, tooltip = '';
    if ('confidence' in reports && PROTONDB_CONFIDENCE_LEVELS.includes(reports.confidence)) {
      confidence = reports.confidence;
      tooltip = `Confidence: ${confidence}`;
      if ('total' in reports) {
        tooltip += ` with ${reports.total} reports`;
      }
      tooltip += ' | ';
    }
    
    let target = document.querySelector('.game_area_purchase_platform');
    if (target) {
      let node = Object.assign(document.createElement('span'), {
        className: 'protondb_rating_row' 
      });
      node.appendChild(preferencesDialog());
      node.appendChild(createBadge(tier, confidence, tooltip, appId));
      target.insertBefore(node, target.firstChild);
    }
  }

  function createBadge(tier, confidence, tooltip, appId) {
    let confidence_style = confidence && userPrefs.show_confidence_level ?` protondb_confidence_${confidence}` : '';
    return Object.assign(document.createElement('a'), {
      textContent: tier,
      className: `protondb_rating_link protondb_rating_${tier}${confidence_style}`,
      title: tooltip + 'View on www.protondb.com',
      href: `${PROTONDB_HOMEPAGE}/app/${appId}`,
      target: userPrefs.open_in_new_tab ? '_blank' : '_self'
    });
  }

  function preferencesDialog() {
    const container = Object.assign(document.createElement('span'), {
      className: 'protondb_prefs_icon',
      title: 'Preferences for ProtonDB SteamPlay Integration',
      textContent: '⚙'
    })

    container.addEventListener('click', () => {
      const html = `
      <div class="protondb_prefs">
        <div class="newmodal_prompt_description">
          New preferences will only take effect after you refresh the page.
        </div>
        <blockquote>
          <div>
            <input type="checkbox" id="protondb_open_in_new_tab" ${ userPrefs.open_in_new_tab ? 'checked' : '' } />
            <label for="protondb_open_in_new_tab">Open ProtonDB links in new tab</label>
          </div>
          <div>
            <input type="checkbox" id="protondb_skip_native_games" ${ userPrefs.skip_native_games ? 'checked' : '' } />
            <label for="protondb_skip_native_games">Don't check native Linux games</label>
          </div>
          <div>
            <input type="checkbox" id="protondb_show_confidence_level" ${ userPrefs.show_confidence_level ? 'checked' : '' } />
            <label for="protondb_show_confidence_level">Style based on confidence level of ratings</label>
          </div>
        </blockquote>
      </div>`

      unsafeWindow.ShowDialog('ProtonDB SteamPlay Prefs', html);

      // Handle preferences changes
      const inputs = document.querySelectorAll('.protondb_prefs input');

      for (const input of inputs) {
        input.addEventListener('change', event => {
          const target = event.target;
          const prefName = target.id.replace('protondb_', '');

          switch (target.type) {
            case 'text':
              userPrefs[prefName] = target.value;
              GM_setValue(prefName, target.value);
              break;
            case 'checkbox':
              userPrefs[prefName] = target.checked;
              GM_setValue(prefName, target.checked);
              break;
            default:
              break;
          }
        })
      }
    })

    return container;
  }

  function injectCSS() {
    GM_addStyle(`
      .protondb_rating_row {
        text-transform: capitalize;
        vertical-align: top;
      }
      .protondb_rating_link {
        background: #4d4b49 url('https://support.steampowered.com/images/custom/platform_steamplay.png') no-repeat -51px center;
        display: inline-block;
        line-height: 19px;
        font-size: 14px;
        padding: 1px 10px 2px 79px;
        margin-right: 1ex;
        color: #b0aeac;
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
      .protondb_confidence_low {
        font-style: italic;
      }
      .protondb_confidence_moderate {
        font-weight: normal;
      }
      .protondb_confidence_good {
        font-weight: bold;
      }
      .protondb_confidence_strong {
        font-variant: small-caps;
        font-weight: bold;
      }
      .protondb_prefs_icon {
        font-size: 16px;
        padding: 0 4px;
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

  function log() {
    console.log('[ProtonDB SteamPlay Integration]', ...arguments)
  }
})()
