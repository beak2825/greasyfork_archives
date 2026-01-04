// ==UserScript==
// @name CheapShark Steam Integration
// @description Adds current pricing info from CheapShark for other stores to the Steam Store
// @version 0.3.0
// @author Phlebiac
// @match https://store.steampowered.com/app/*
// @connect www.cheapshark.com
// @run-at document-end
// @noframes
// @license MIT; https://opensource.org/licenses/MIT
// @namespace Phlebiac/CheapShark
// @icon https://www.cheapshark.com/img/icons/round_114.png
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/439664/CheapShark%20Steam%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/439664/CheapShark%20Steam%20Integration.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  const BASE_URL = 'https://www.cheapshark.com';
  const API_URL = `${BASE_URL}/api/1.0/`;
  const METACRITIC_BASE = 'https://www.metacritic.com';

  let userPrefs = {
    open_in_new_tab: GM_getValue('open_in_new_tab', true),
    show_metacritic: GM_getValue('show_metacritic', true),
    store_info_cache: GM_getValue('store_info_cache', []),
  }

  const appId = getCurrentAppId();
  if (!appId) {
    return;
  }
  injectCSS();

  if (!userPrefs.store_info_cache.length) {
    log('Requesting store data...');
    GM_xmlhttpRequest({
      method: 'GET',
      url: `${API_URL}stores`,
      onload: buildStoreCache
    });
  } else {
    //log(`Using cache of ${userPrefs.store_info_cache.length} stores`);
  }

  GM_xmlhttpRequest({
    method: 'GET',
    url: `${API_URL}deals?steamAppID=${appId}&sortBy=Price`,
    onload: addDealsToStorePage
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

  function buildStoreCache(response) {
    if (response.status === 200) {
      try {
        var stores = JSON.parse(response.responseText);
        log(`Caching data for ${stores.length} stores`);
        stores.forEach(store => { userPrefs.store_info_cache[store.storeID] = store; });
        GM_setValue('store_info_cache', userPrefs.store_info_cache);
      } catch (err) {
        log('Unable to parse CheapShark response as JSON:', response);
        log('Javascript error:', err);
      }
    } else {
      log('Got unexpected HTTP code from CheapShark:', response.status);
    }
  }

  function addDealsToStorePage(response) {
    if (response.status === 200) {
      try {
        var deals = JSON.parse(response.responseText);
        //log(`Found ${deals.length} deals`);
      } catch (err) {
        log('Unable to parse CheapShark response as JSON:', response);
        log('Javascript error:', err);
      }
    } else {
      log('Got unexpected HTTP code from CheapShark:', response.status);
    }
    
    let target = document.querySelector('.game_purchase_action');
    if (target && deals.length > 0) {
      var bestDeal = deals[0];
      let node = Object.assign(document.createElement('span'), {
        className: 'cheapshark_deals_row btnv6_blue_hoverfade btn_medium'
      });
      if (userPrefs.show_metacritic && bestDeal.metacriticScore > 0) {
        node.appendChild(showMetaCritic(bestDeal));
      }
      node.appendChild(lowestPrice(bestDeal));
      if (deals.length > 1) {
        node.appendChild(listDeals(deals));
      }
      target.insertBefore(node, target.firstChild);
      target.insertBefore(preferencesDialog(), node);
    }
  }

  function showMetaCritic(deal) {
    let node = Object.assign(document.createElement('a'), {
      className: 'cheapshark_metacritic',
      href: `${METACRITIC_BASE}${deal.metacriticLink}`,
      title: 'View on MetaCritic',
      target: userPrefs.open_in_new_tab ? '_blank' : '_self'
    });
    node.appendChild(Object.assign(document.createElement('img'), {
      src: `${METACRITIC_BASE}/MC_favicon.png`,
      className: 'cheapshark_metacritic_img',
      height: 20
    }));
    node.appendChild(Object.assign(document.createElement('span'), {
      textContent: `${deal.metacriticScore}`,
      className: `cheapshark_metacritic_score`
    }));
    return node;
  }

  function lowestPrice(deal) {
    var store = userPrefs.store_info_cache[deal.storeID];
    let node = Object.assign(document.createElement('a'), {
      className: 'cheapshark_lowest',
      href: `${BASE_URL}/redirect?dealID=${deal.dealID}`,
      title: `$${deal.salePrice} on ${store.storeName}`,
      target: userPrefs.open_in_new_tab ? '_blank' : '_self'
    });
    node.appendChild(Object.assign(document.createElement('span'), {
      textContent: `Lowest: $${deal.salePrice}`,
      className: `cheapshark_lowest_price`,
    }));
    node.appendChild(Object.assign(document.createElement('img'), {
      src: `${BASE_URL}${store.images.icon}`,
      className: 'cheapshark_lowest_img' 
    }));
    return node;
  }

  function listDeals(deals) {
    // Build out a menu option for each store deal
    let dealOptions = '';
    for (const deal of deals) {
      var store = userPrefs.store_info_cache[deal.storeID];
      dealOptions = `${dealOptions}
				<div class="cheapshark_deal_option queue_menu_option">
					<div class="cheapshark_valign queue_menu_option_label">
						<a href="${BASE_URL}/redirect?dealID=${deal.dealID}" class="option_title">
						  <img class="cheapshark_valign" src="${BASE_URL}${store.images.icon}"> $${deal.salePrice} on ${store.storeName}
						</a>
					</div>
				</div>`;
    }
    return Object.assign(document.createElement('div'), {
      className: 'cheapshark_deals_dropdown queue_control_button queue_btn_menu',
      innerHTML: `
        <div class="queue_menu_arrow">
					<span><img src="https://store.cloudflare.steamstatic.com/public/images/v6/btn_arrow_down_padded.png"></span>
			  </div>
			  <div class="cheapshark_menu_flyout queue_menu_flyout">
					<div class="queue_flyout_content">${dealOptions}
				  </div>
			  </div>`
    });
  }

  function preferencesDialog() {
    const container = Object.assign(document.createElement('span'), {
      className: 'cheapshark_prefs_icon',
      title: 'Preferences for CheapShark Steam Integration',
      textContent: '⚙'
    })

    container.addEventListener('click', () => {
      const html = `
      <div class="cheapshark_prefs">
        <div class="newmodal_prompt_description">
          New preferences will only take effect after you refresh the page.
        </div>
        <blockquote>
          <div>
            <input type="checkbox" id="cheapshark_open_in_new_tab" ${ userPrefs.open_in_new_tab ? 'checked' : '' } />
            <label for="cheapshark_open_in_new_tab">Open links in a new tab</label>
          </div>
          <div>
            <input type="checkbox" id="cheapshark_show_metacritic" ${ userPrefs.show_metacritic ? 'checked' : '' } />
            <label for="cheapshark_show_metacritic">Show MetaCritic score and link</label>
          </div>
        </blockquote>
      </div>`

      unsafeWindow.ShowDialog('CheapShark on Steam Prefs', html);

      // Handle preferences changes
      const inputs = document.querySelectorAll('.cheapshark_prefs input');

      for (const input of inputs) {
        input.addEventListener('change', event => {
          const target = event.target;
          const prefName = target.id.replace('cheapshark_', '');

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
      .cheapshark_deals_row {
        border-style: solid;
        border-color: black;
        //padding: 0 0 2px 5px;
        padding: 5px 5px 5px 5px;
        background: #4d4b49;
      }
      .cheapshark_deals_row a:hover { 
        color: white;
      }
      .cheapshark_metacritic {
        margin-right: 6px;
      }
      .cheapshark_metacritic_img {
        vertical-align: middle;
        margin-right: 4px;
      }
      .cheapshark_metacritic_score {
        font-size: 16px;
        vertical-align: middle;
      }
      .cheapshark_lowest {
        padding: 0 6px 0 6px;
      }
      .cheapshark_lowest_img {
        vertical-align: middle;
      }
      .cheapshark_lowest_price {
        font-size: 14px;
        vertical-align: middle;
        padding-right: 5px;
      }
      .cheapshark_deals_dropdown {
        //margin: -6px 0 -6px 0;
      }
      .cheapshark_menu_flyout {
        position: relative !important;
        width: unset !important;
        padding: 6px 6px;
        margin: -34px -6px -6px -240px;
        //position: absolute;
        //left: 0px;
        //margin-top: 5px;
      }
      .cheapshark_deal_option {
        padding: 2px !important;
      }
      .cheapshark_valign {
        vertical-align: middle;
      }
      .cheapshark_prefs_icon {
        font-size: 20px;
        padding: 0 2px;
        //vertical-align: top;
        cursor: pointer;
      }
      .cheapshark_prefs input[type="checkbox"], .cheapshark_prefs label {
        line-height: 20px;
        vertical-align: middle;
        display: inline-block;
        color: #66c0f4;
        cursor: pointer;
      }
      .cheapshark_prefs blockquote {
        margin: 15px 0 5px 10px;
      }`)
  }

  function log() {
    console.log('[CheapShark Steam Integration]', ...arguments)
  }
})()
