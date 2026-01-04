// ==UserScript==
// @name         RED: Physical Media Finder for Music Requests
// @description  Find purchase links, lowest prices and cost per GB (bounty) for physical media requests on RED.
// @author       k0r302
// @homepage     https://github.com/k0r302/red-physical-media-finder/
// @homepageURL  https://github.com/k0r302/red-physical-media-finder/
// @version      1.0.2
// @grant        GM.xmlHttpRequest
// @connect      discogs.com
// @match        https://redacted.sh/requests.php?action=view&id=*
// @run-at       document-end
// @namespace    _
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://unpkg.com/currency.js@~2.0.0/dist/currency.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527903/RED%3A%20Physical%20Media%20Finder%20for%20Music%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/527903/RED%3A%20Physical%20Media%20Finder%20for%20Music%20Requests.meta.js
// ==/UserScript==

;(() => {
  'use strict'

  if (!document.querySelector('div.header > h2 > a').nextSibling.textContent.match(/Music/)) return // we only care about music

  const DISCOGS_AVAILABLE_MEDIA_TYPES = ['CD', 'Vinyl', 'Cassette', 'SACD', 'DVD', 'Blu-Ray']
  const DESCRIPTION_LOWEST_PRICE = `Lowest total price. If you are logged into Discogs, it will show the price WITH shipping and currency conversion. If you are not logged, it will just show the regular price.`
  const DESCRIPTION_PRICE_PER_GB = `Price per GB as compared to the bounty for this release. Lower is better.`
  const DESCRIPTION_PURCHASE_LINK = `Link to the discogs page with all options to purchase this specific release.`
  const DISCOGS_SELL_RELEASE_URL = 'https://www.discogs.com/sell/release'
  const PMF_MULTIRELEASE_WARNING = `<div class="error_message pmf_warning" style="text-align: center;">⚠️ Warning! ⚠️<br />The description for this request has multiple Discogs links and this tool cannot automatically identify the correct release. Please, manually double check before purchasing a release out of this list to validate if it really matches what the request asks for.</div>`

  const THRESHOLD_1MONEY = 1
  const THRESHOLD_2MONEY = 2
  const THRESHOLD_3MONEY = 3
  const THRESHOLD_4MONEY = 4
  const THRESHOLD_5MONEY = 5

  const THRESHOLD_1MONEY_LABEL = 'Great ($)'
  const THRESHOLD_2MONEY_LABEL = 'Good ($$)'
  const THRESHOLD_3MONEY_LABEL = 'Okay ($$$)'
  const THRESHOLD_4MONEY_LABEL = 'Expensive ($$$$)'
  const THRESHOLD_5MONEY_LABEL = 'Super Expensive ($$$$$)'
  const DISCOGS_BLOCKED_SELLERS_LABEL = 'Discogs Blocked Sellers'
  const DISCOGS_BLOCKED_SELLERS_URL_LABEL = 'Discogs Blocked Sellers URL'

  const request_id = new URL(window.location).searchParams.get('id')
  const promises = []
  let pricesFound = 0;

  const decodeHTML = (orig) => {
    const txt = document.createElement('textarea')
    txt.innerHTML = orig
    return txt.value
  }

  const redAPI = async (request_id) => {
    try {
      const res = await fetch(`${location.origin}/ajax.php?action=request&id=${request_id}`)
      return res.json()
    } catch (error) {
      console.error(error)
    }
  }

  const corsFetch = (url) => {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: 'GET',
        url: encodeURI(url),
        headers: {
          Origin: 'no.origin.com',
        },
        onload: (res) => resolve(res.responseText),
        onerror: (res) => reject(res),
      })
    })
  }

  const fetchDOM = async (url) => {
    const responseText = await corsFetch(url)
    const parser = new DOMParser()
    return parser.parseFromString(responseText, 'text/html')
  }

  const fetchJSON = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Failed to fetch JSON:', error);
    }
  };

  const getBountyInGB = () => {
    const bounty = document.querySelector('#formatted_bounty').textContent.match(/(\d+\.\d+)\s+([GKMT]?i?B)/i)
    const bountyMetric = bounty[2]
    let bountyGB = 0
    switch (bountyMetric) {
      case 'MB':
        bountyGB = parseFloat(bounty) / 1024
        break
      case 'GB':
        bountyGB = parseFloat(bounty)
        break
      case 'TB':
        bountyGB = parseFloat(bounty) * 1024
        break
      case 'PB':
        bountyGB = parseFloat(bounty) * 1024 * 1024
        break
    }

    return bountyGB
  }

  const discogsLoading = (loading) => {
    document.querySelector('#pmf_loading').hidden = !loading
  }

  const getThresholdLimits = (threshold) => {
    return parseFloat(gmc.get(`threshold_${threshold}money`))
  }

  const getThresholdStyle = (threshold) => {
    return gmc.get(`threshold_${threshold}money_cssstyle`)
  }

  let gmcConfig = {
    id: 'GM_config',
    title: 'Physical Media Finder Settings',
    fields: {
      // Threshold Values
      threshold_1money: {
        label: THRESHOLD_1MONEY_LABEL,
        type: 'unsigned float',
        default: '0.25',

        section: [
          'Cost per GB - Thresholds',
          'Values below will be compared to the cost per GB in a "less than or equal" operation, and will determine the color of the Cost per GB table cell. Anything above the Expensive level will be marked Super Expensive.',
        ], // Appears above the field
      },
      threshold_2money: {
        label: THRESHOLD_2MONEY_LABEL,
        type: 'unsigned float',
        default: '0.5',
      },
      threshold_3money: {
        label: THRESHOLD_3MONEY_LABEL,
        type: 'unsigned float',
        default: '1',
      },
      threshold_4money: {
        label: THRESHOLD_4MONEY_LABEL,
        type: 'unsigned float',
        default: '2',
      },
      // Threshold colors
      threshold_1money_cssstyle: {
        label: THRESHOLD_1MONEY_LABEL,
        type: 'string',
        default: 'background: #44ce1b; color: #000000;',

        section: [
          'Cost per GB - CSS Style',
          `CSS Style below will be used to color the cost per GB cell based on its thresholds. Change it if you don't like the default green-to-red color pallete.`,
        ], // Appears above the field
      },
      threshold_2money_cssstyle: {
        label: THRESHOLD_2MONEY_LABEL,
        type: 'string',
        default: 'background: #bbdb44; color: #000000;',
      },
      threshold_3money_cssstyle: {
        label: THRESHOLD_3MONEY_LABEL,
        type: 'string',
        default: 'background: #bbdb44; color: #000000;',
      },
      threshold_4money_cssstyle: {
        label: THRESHOLD_4MONEY_LABEL,
        type: 'string',
        default: 'background: #f2a134; color: #000000;',
      },
      threshold_5money_cssstyle: {
        label: THRESHOLD_5MONEY_LABEL,
        type: 'string',
        default: 'background: #e51f1f; color: #000000;',
      },
      // Other Values
      other_discogs_blocked_sellers_url: {
        label: DISCOGS_BLOCKED_SELLERS_URL_LABEL,
        type: 'string',
        default: 'https://gist.githubusercontent.com/k0r302/543cd02874ae3ce622780a762ebfec0f/raw/b9e7fc39efcff6f21a027ca0b1a9e3d6ef378bcf/red-physical-media-finder_discogs-blocked-sellers.json',
        title: `URL to a JSON file with a list of Discogs sellers to block. This will prevent the script from showing prices from these sellers. If you are using GitHub, use the 'Raw' url.`,

        section: [
          'Other Settings',
        ], // Appears above the field
      },
      other_discogs_blocked_sellers: {
        label: DISCOGS_BLOCKED_SELLERS_LABEL,
        type: 'string',
        default: '',
        title: 'Comma (,) separated list of Discogs sellers to block. This list will be merged with the list coming from the URL. This will prevent the script from showing prices from these sellers. Example: seller1, seller2, seller3. Spaces will be ignored.',
      },
    },
    frameStyle: `inset: 83px auto auto 319px; border: 1px solid rgb(0, 0, 0); height: 550px; margin: 0px; max-height: 95%; max-width: 95%; opacity: 1; overflow: auto; padding: 0px; position: fixed; width: 450px; z-index: 9999; display: block;`,
    css: `
      #GM_config {
        background: #f9f9f9;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        width: 400px !important;
        font-family: Arial, sans-serif;
      }
      #GM_config label {
        display: block;
      }
      #GM_config label:after {
        content: ':';
      }
      #GM_config input[type="text"] {
        width: 100%;
      }
      #GM_config .config_header {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      #GM_config .section_header {
        font-size: 16px;
        font-weight: bold;
        margin-top: 10px;
        margin-bottom: 5px;
      }
      #GM_config .field_label {
        font-size: 14px;
        margin-bottom: 5px;
      }
      #GM_config .field_input {
        margin-bottom: 10px;
      }
      #GM_config .saveclose_buttons {
        text-align: center;
        margin-top: 10px;
      }
      #GM_config .saveclose_buttons button {
        background: #4CAF50;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
      }
      #GM_config .saveclose_buttons button:hover {
        background: #45a049;
      }
    `,
    events: {
      save: function () {
        this.close();
        location.reload();
      }
    }
  }

  const gmc = new GM_config(gmcConfig)

  /**
   * Returns a Set of Discogs sellers that are blocked.
   * In the future, this can become a thread on RED forums instead of a file on github.
   * @returns 
   */
  const getRedDiscogsBlockedSellers = async () => {
    // Fetch list of blocked sellers from RED Discogs blocked sellers user github file
    let redDiscogsBlockedSellers = [];
    try {
      let discogsBlockedSellersUrl = gmc.get('other_discogs_blocked_sellers_url');
      if (discogsBlockedSellersUrl) {
        let redDiscogsBlockedSellersFetchResponse = await fetchJSON(discogsBlockedSellersUrl);
        if (redDiscogsBlockedSellersFetchResponse) {
          redDiscogsBlockedSellers = redDiscogsBlockedSellersFetchResponse;
        }
      }
    } catch (error) {
      console.error('Failed to fetch RED Discogs blocked sellers:', error);
    }

    // Fetch list of blocked sellers from GM_config
    const otherDiscogsBlockedSellers = gmc.get('other_discogs_blocked_sellers').split(',').map(seller => seller.trim());
    redDiscogsBlockedSellers = redDiscogsBlockedSellers.concat(otherDiscogsBlockedSellers);

    // Return a Set of all blocked sellers
    return new Set(redDiscogsBlockedSellers.map(seller => seller.toLowerCase()));
  }

  const discogsPrices = async (releaseId, handlePrices) => {
    try {
      const discogsReleaseLink = `${DISCOGS_SELL_RELEASE_URL}/${releaseId}`
      const discogsBlockedSellers = await getRedDiscogsBlockedSellers();
      const doc = await fetchDOM(discogsReleaseLink)

      const prices = new Set()
      doc
        .querySelectorAll(`[data-release-id="${releaseId}"] .item_price .converted_price`)
        .forEach((priceFoundOnDiscogsElement) => {
          // Fetch price
          const priceString = Array.from(priceFoundOnDiscogsElement.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE) // Only get text nodes
            .map(node => node.textContent.trim()) // Trim spaces
            .join(" ")

          let price = currency(priceString)
          // Skip all disc prices that are available on discogs, but that are unavailable to you. This usually happens when the seller does not deliver to your country.
          if (priceFoundOnDiscogsElement.parentElement.parentElement.textContent.match(/unavailable/i)) {
            console.info(`Disc with price ${price} is available on discogs but unavailable to you, skipping...`)
            return
          }

          // Skip blocked sellers
          const seller = priceFoundOnDiscogsElement.closest('tr').querySelector('.seller_block a').textContent;
          if (discogsBlockedSellers.has(seller.trim().toLowerCase())) {
            console.warn(`Disc with price '${price}' is available on discogs but seller '${seller}' is blocked, skipping...`)
            return
          }

          pricesFound++;
          prices.add(price)
        })

      const sortedPrices = Array.from(prices).sort((a, b) => a - b)
      if (sortedPrices.length > 0) {
        handlePrices(sortedPrices, releaseId)
      } else {
        console.error(`No prices found on Discogs for release '${releaseId}'`)
      }
    } catch (e) {
      console.error(`Discogs search failed (probably, release not found)...`, e)
    }
  }

  const handlePricesOnRequestPage = (sortedPrices, releaseId) => {
    const discogsReleaseLink = `${DISCOGS_SELL_RELEASE_URL}/${releaseId}`
    const lowestPrice = sortedPrices[0]
    const bountyInGB = getBountyInGB()
    const pricePerGB = lowestPrice / bountyInGB

    // Disable the loading message
    discogsLoading(false)

    const THRESHOLD_1MONEY_TITLE = `${THRESHOLD_1MONEY_LABEL}. This is a great cost per GB, buy it now! (Cost per GB > 0 and <= ${getThresholdLimits(
      THRESHOLD_1MONEY,
    )})`
    const THRESHOLD_2MONEY_TITLE = `${THRESHOLD_2MONEY_LABEL}. This is a good cost per GB, buy it! (Cost per GB > ${getThresholdLimits(
      THRESHOLD_1MONEY,
    )} and <= ${getThresholdLimits(THRESHOLD_2MONEY)}>)`
    const THRESHOLD_3MONEY_TITLE = `${THRESHOLD_3MONEY_LABEL}. Just OK cost per GB, but still worth buying. (Cost per GB > ${getThresholdLimits(
      THRESHOLD_2MONEY,
    )} and <= ${getThresholdLimits(THRESHOLD_3MONEY)})`
    const THRESHOLD_4MONEY_TITLE = `${THRESHOLD_4MONEY_LABEL}. Not worth it for bounty only. Only buy if you want to have it in your collection. (Cost per GB > ${getThresholdLimits(
      THRESHOLD_3MONEY,
    )} and <= ${getThresholdLimits(THRESHOLD_4MONEY)})`
    const THRESHOLD_5MONEY_TITLE = `${THRESHOLD_5MONEY_LABEL}. Not worth it for bounty only. Only buy if this is a dream item and you REALLY want to have it in your collection. (Cost per GB > ${getThresholdLimits(
      THRESHOLD_4MONEY,
    )})`

    let priceAttributes = ''
    let pricePerGBLabel = ''
    if (pricePerGB <= getThresholdLimits(THRESHOLD_1MONEY)) {
      priceAttributes = `style="${getThresholdStyle(THRESHOLD_1MONEY)}" title="${THRESHOLD_1MONEY_TITLE}"`
      pricePerGBLabel = '$'
    } else if (pricePerGB <= getThresholdLimits(THRESHOLD_2MONEY)) {
      priceAttributes = `style="${getThresholdStyle(THRESHOLD_2MONEY)}" title="${THRESHOLD_2MONEY_TITLE}"`
      pricePerGBLabel = '$$'
    } else if (pricePerGB <= getThresholdLimits(THRESHOLD_3MONEY)) {
      priceAttributes = `style="${getThresholdStyle(THRESHOLD_3MONEY)}" title="${THRESHOLD_3MONEY_TITLE}"`
      pricePerGBLabel = '$$$'
    } else if (pricePerGB <= getThresholdLimits(THRESHOLD_4MONEY)) {
      priceAttributes = `style="${getThresholdStyle(THRESHOLD_4MONEY)}" title="${THRESHOLD_4MONEY_TITLE}"`
      pricePerGBLabel = '$$$$'
    } else if (pricePerGB > getThresholdLimits(THRESHOLD_4MONEY)) {
      priceAttributes = `style="${getThresholdStyle(THRESHOLD_5MONEY)}" title="${THRESHOLD_5MONEY_TITLE}"`
      pricePerGBLabel = '$$$$$'
    }

    if (!document.getElementById('pmf_table')) {
      document
        .getElementById('pmf')
        .insertAdjacentHTML(
          'beforeend',
          `<table id="pmf_table"><tr><th title="${DESCRIPTION_LOWEST_PRICE}">Lowest price (total)</th><th title="${DESCRIPTION_PRICE_PER_GB}">Cost per GB (bounty)</th><th title="${DESCRIPTION_PURCHASE_LINK}">Release/purchase link</th></tr></table>`,
        )
    }

    // If there are multiple discogs links on the description, warn user that they are on their own.
    if (
      document.querySelectorAll('#pmf_table tr').length > 1 &&
      document.querySelectorAll('.pmf_warning').length == 0
    ) {
      document
        .getElementById('pmf_table')
        .insertAdjacentHTML('beforebegin', PMF_MULTIRELEASE_WARNING)
      document
        .getElementById('pmf_table')
        .insertAdjacentHTML('afterend', PMF_MULTIRELEASE_WARNING)
    }

    document
      .getElementById('pmf_table')
      .insertAdjacentHTML(
        'beforeend',
        `
        <tr>
          <td title="All available prices: ${sortedPrices.map(d => currency(d).format()).join(', ')}">${lowestPrice.format()}</td>
          <td ${priceAttributes}>${currency(pricePerGB).format()} (${pricePerGBLabel})</td>
          <td>
            <a href="${discogsReleaseLink}" target="_blank" style="display: flex; align-items: center;">
              Go to Discogs (${releaseId})
            </a>
          </td>
        </tr>`,
      )
  }

  const getDiscogsReleasesFromDescription = (description) => {
    const discogsUrlsInDescription = description.match(/discogs.com.*?\/release\/([0-9]+)/gi)
    const discogsReleases = new Set()

    if (discogsUrlsInDescription) {
      discogsUrlsInDescription.forEach((discogsUrl) => {
        const discogsRelease = discogsUrl.match(/\/release\/([0-9]+)/)
        const discogsReleaseId = discogsRelease[1]
        if (discogsReleaseId) {
          discogsReleases.add(discogsReleaseId)
        }
      })
    }

    return discogsReleases
  }

  redAPI(request_id).then(({ response, status }) => {
    if (status !== 'success') {
      console.error('RED API request failed; aborting.')
      return
    }
    if (!response.mediaList.some((r) => DISCOGS_AVAILABLE_MEDIA_TYPES.includes(r)) && response.mediaList != 'Any') {
      console.error(
        `Acceptable media on this request does not match Discogs available media types (${DISCOGS_AVAILABLE_MEDIA_TYPES.join(
          ', ',
        )}).`,
      )
      return
    }

    const rowRef = document.querySelector('div.main_column table.layout tbody tr')
    rowRef.insertAdjacentHTML(
      'beforebegin',
      '<td class="label">Physical Media Finder <a href="#" id="pmf_config_button" title="Preferences">⚙️</a></td><td><span id="pmf"><span id="pmf_loading">Searching ...</div></span></td>',
    )
    document.getElementById('pmf_config_button').onclick = function () {
      gmc.open()
    }

    const artist = decodeHTML(response.musicInfo.artists[0]?.name)
    const album = decodeHTML(response.title)
    const year = decodeHTML(response.year)
    const catalogueNumber = response.catalogueNumber
    const discogsReleases = getDiscogsReleasesFromDescription(response.description)

    if (discogsReleases.size > 0) {
      discogsReleases.forEach((discogsReleaseId) => {
        promises.push(discogsPrices(discogsReleaseId, handlePricesOnRequestPage))
      })

      Promise.all(promises).then(() => {
        if (pricesFound == 0) {
          document.getElementById('pmf').innerHTML =
            'Sorry. No items available in the Marketplace for this release on Discogs. 😔'
        }
      })
    } else {
      let alternativeSearches = []
      let manualSearchString = ''
      if (catalogueNumber) {
        alternativeSearches.push(
          `<a href="https://www.discogs.com/search?q=${catalogueNumber}&type=all" target="_blank">Catalogue number</a>`,
        )
      }

      if (artist && album) {
        const searchString = encodeURI(`${artist} - ${album} [${year}]`)
        alternativeSearches.push(
          `<a href="https://www.discogs.com/search?q=${searchString}&type=all" target="_blank">Artist and album</a>`,
        )
      }

      if (alternativeSearches.length > 0) {
        manualSearchString = `<br />You can still try to manually find it on Discogs by: ${alternativeSearches.join(
          ', ',
        )}`
      }

      document.getElementById(
        'pmf',
      ).innerHTML = `Sorry. There are no Discogs links in the description for this request. 😔<br />${manualSearchString}.`
    }
  })
})()
