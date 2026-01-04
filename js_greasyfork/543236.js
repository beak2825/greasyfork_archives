// ==UserScript==
// @name         Region restriction checker
// @namespace    http://tampermonkey.net/
// @version      2026.2
// @description  Adds a region restriction checker to various game store sites
// @author       Yann
// @match        https://www.fanatical.com/*bundle*
// @match        https://www.fanatical.com/*game*
// @match        https://store.playsum.live/product/*
// @match        https://www.gamivo.com/product/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543236/Region%20restriction%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/543236/Region%20restriction%20checker.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  /******************************************************
   * Unified Activation State Helper
   ******************************************************/
  const ACTIVATION_STATE = {
    ALLOWED: 'allowed',
    NOT_ALLOWED: 'not_allowed',
    UNKNOWN: 'unknown',
  }

  // All possible region codes
  const ALL_REGION_CODES = [
    'AD',
    'AE',
    'AF',
    'AG',
    'AI',
    'AL',
    'AM',
    'AO',
    'AQ',
    'AR',
    'AS',
    'AT',
    'AU',
    'AW',
    'AX',
    'AZ',
    'BA',
    'BB',
    'BD',
    'BE',
    'BF',
    'BG',
    'BH',
    'BI',
    'BJ',
    'BL',
    'BM',
    'BN',
    'BO',
    'BQ',
    'BR',
    'BS',
    'BT',
    'BV',
    'BW',
    'BY',
    'BZ',
    'CA',
    'CC',
    'CD',
    'CF',
    'CG',
    'CH',
    'CI',
    'CK',
    'CL',
    'CM',
    'CN',
    'CO',
    'CR',
    'CU',
    'CV',
    'CW',
    'CX',
    'CY',
    'CZ',
    'DE',
    'DJ',
    'DK',
    'DM',
    'DO',
    'DZ',
    'EC',
    'EE',
    'EG',
    'EH',
    'ER',
    'ES',
    'ET',
    'FI',
    'FJ',
    'FK',
    'FM',
    'FO',
    'FR',
    'GA',
    'GB',
    'GD',
    'GE',
    'GF',
    'GG',
    'GH',
    'GI',
    'GL',
    'GM',
    'GN',
    'GP',
    'GQ',
    'GR',
    'GS',
    'GT',
    'GU',
    'GW',
    'GY',
    'HK',
    'HM',
    'HN',
    'HR',
    'HT',
    'HU',
    'ID',
    'IE',
    'IL',
    'IM',
    'IN',
    'IO',
    'IQ',
    'IR',
    'IS',
    'IT',
    'JE',
    'JM',
    'JO',
    'JP',
    'KE',
    'KG',
    'KH',
    'KI',
    'KM',
    'KN',
    'KP',
    'KR',
    'KW',
    'KY',
    'KZ',
    'LA',
    'LB',
    'LC',
    'LI',
    'LK',
    'LR',
    'LS',
    'LT',
    'LU',
    'LV',
    'LY',
    'MA',
    'MC',
    'MD',
    'ME',
    'MF',
    'MG',
    'MH',
    'MK',
    'ML',
    'MM',
    'MN',
    'MO',
    'MP',
    'MQ',
    'MR',
    'MS',
    'MT',
    'MU',
    'MV',
    'MW',
    'MX',
    'MY',
    'MZ',
    'NA',
    'NC',
    'NE',
    'NF',
    'NG',
    'NI',
    'NL',
    'NO',
    'NP',
    'NR',
    'NU',
    'NZ',
    'OM',
    'PA',
    'PE',
    'PF',
    'PG',
    'PH',
    'PK',
    'PL',
    'PM',
    'PN',
    'PR',
    'PS',
    'PT',
    'PW',
    'PY',
    'QA',
    'RE',
    'RO',
    'RS',
    'RU',
    'RW',
    'SA',
    'SB',
    'SC',
    'SD',
    'SE',
    'SG',
    'SH',
    'SI',
    'SJ',
    'SK',
    'SL',
    'SM',
    'SN',
    'SO',
    'SR',
    'SS',
    'ST',
    'SV',
    'SX',
    'SY',
    'SZ',
    'TC',
    'TD',
    'TF',
    'TG',
    'TH',
    'TJ',
    'TK',
    'TL',
    'TM',
    'TN',
    'TO',
    'TR',
    'TT',
    'TV',
    'TW',
    'TZ',
    'UA',
    'UG',
    'UM',
    'US',
    'UY',
    'UZ',
    'VA',
    'VC',
    'VE',
    'VG',
    'VI',
    'VN',
    'VU',
    'WF',
    'WS',
    'XK',
    'YE',
    'YT',
    'ZA',
    'ZM',
    'ZW',
  ]

  // Mapping from country names to region codes (extracted from the allowed countries list)
  const COUNTRY_NAME_TO_CODE = {
    Bangladesh: 'BD',
    Belgium: 'BE',
    'Burkina Faso': 'BF',
    Bulgaria: 'BG',
    'Bosnia and Herzegovina': 'BA',
    Barbados: 'BB',
    'Wallis and Futuna': 'WF',
    'Saint Barthelemy': 'BL',
    Bermuda: 'BM',
    Brunei: 'BN',
    Bolivia: 'BO',
    Bahrain: 'BH',
    Burundi: 'BI',
    Benin: 'BJ',
    Bhutan: 'BT',
    Jamaica: 'JM',
    'Bouvet Island': 'BV',
    Botswana: 'BW',
    Samoa: 'WS',
    'Bonaire, Saint Eustatius and Saba': 'BQ',
    Brazil: 'BR',
    Bahamas: 'BS',
    Jersey: 'JE',
    Belize: 'BZ',
    Rwanda: 'RW',
    Serbia: 'RS',
    'East Timor': 'TL',
    Reunion: 'RE',
    Turkmenistan: 'TM',
    Tajikistan: 'TJ',
    Romania: 'RO',
    Tokelau: 'TK',
    'Guinea-Bissau': 'GW',
    Guam: 'GU',
    Guatemala: 'GT',
    'South Georgia and the South Sandwich Islands': 'GS',
    Greece: 'GR',
    'Equatorial Guinea': 'GQ',
    Guadeloupe: 'GP',
    Japan: 'JP',
    Guyana: 'GY',
    Guernsey: 'GG',
    'French Guiana': 'GF',
    Georgia: 'GE',
    Grenada: 'GD',
    'United Kingdom': 'GB',
    Gabon: 'GA',
    'El Salvador': 'SV',
    Guinea: 'GN',
    Gambia: 'GM',
    Greenland: 'GL',
    Gibraltar: 'GI',
    Ghana: 'GH',
    Oman: 'OM',
    Tunisia: 'TN',
    Jordan: 'JO',
    Croatia: 'HR',
    Haiti: 'HT',
    Hungary: 'HU',
    'Hong Kong': 'HK',
    Honduras: 'HN',
    'Heard Island and McDonald Islands': 'HM',
    Venezuela: 'VE',
    'Puerto Rico': 'PR',
    'Palestinian Territory': 'PS',
    Palau: 'PW',
    Portugal: 'PT',
    'Svalbard and Jan Mayen': 'SJ',
    Paraguay: 'PY',
    Iraq: 'IQ',
    Panama: 'PA',
    'French Polynesia': 'PF',
    'Papua New Guinea': 'PG',
    Peru: 'PE',
    Pakistan: 'PK',
    Philippines: 'PH',
    Pitcairn: 'PN',
    Poland: 'PL',
    'Saint Pierre and Miquelon': 'PM',
    Zambia: 'ZM',
    'Western Sahara': 'EH',
    Estonia: 'EE',
    Egypt: 'EG',
    'South Africa': 'ZA',
    Ecuador: 'EC',
    Italy: 'IT',
    Vietnam: 'VN',
    'Solomon Islands': 'SB',
    Ethiopia: 'ET',
    Somalia: 'SO',
    Zimbabwe: 'ZW',
    'Saudi Arabia': 'SA',
    Spain: 'ES',
    Eritrea: 'ER',
    Montenegro: 'ME',
    Moldova: 'MD',
    Madagascar: 'MG',
    'Saint Martin': 'MF',
    Morocco: 'MA',
    Monaco: 'MC',
    Uzbekistan: 'UZ',
    Myanmar: 'MM',
    Mali: 'ML',
    Macao: 'MO',
    Mongolia: 'MN',
    'Marshall Islands': 'MH',
    'North Macedonia': 'MK',
    Mauritius: 'MU',
    Malta: 'MT',
    Malawi: 'MW',
    Maldives: 'MV',
    Martinique: 'MQ',
    'Northern Mariana Islands': 'MP',
    Montserrat: 'MS',
    Mauritania: 'MR',
    'Isle of Man': 'IM',
    Uganda: 'UG',
    Tanzania: 'TZ',
    Malaysia: 'MY',
    Mexico: 'MX',
    Israel: 'IL',
    France: 'FR',
    'British Indian Ocean Territory': 'IO',
    'Saint Helena': 'SH',
    Finland: 'FI',
    Fiji: 'FJ',
    'Falkland Islands': 'FK',
    Micronesia: 'FM',
    'Faroe Islands': 'FO',
    Nicaragua: 'NI',
    Netherlands: 'NL',
    Norway: 'NO',
    Namibia: 'NA',
    Vanuatu: 'VU',
    'New Caledonia': 'NC',
    Niger: 'NE',
    'Norfolk Island': 'NF',
    Nigeria: 'NG',
    'New Zealand': 'NZ',
    Nepal: 'NP',
    Nauru: 'NR',
    Niue: 'NU',
    'Cook Islands': 'CK',
    Kosovo: 'XK',
    'Ivory Coast': 'CI',
    Switzerland: 'CH',
    Colombia: 'CO',
    China: 'CN',
    Cameroon: 'CM',
    Chile: 'CL',
    'Cocos Islands': 'CC',
    Canada: 'CA',
    'Republic of the Congo': 'CG',
    'Central African Republic': 'CF',
    'Democratic Republic of the Congo': 'CD',
    'Czech Republic': 'CZ',
    Cyprus: 'CY',
    'Christmas Island': 'CX',
    'Costa Rica': 'CR',
    Curacao: 'CW',
    'Cape Verde': 'CV',
    Cuba: 'CU',
    Swaziland: 'SZ',
    Syria: 'SY',
    'Sint Maarten': 'SX',
    Kyrgyzstan: 'KG',
    Kenya: 'KE',
    'South Sudan': 'SS',
    Suriname: 'SR',
    Kiribati: 'KI',
    Cambodia: 'KH',
    'Saint Kitts and Nevis': 'KN',
    Comoros: 'KM',
    'Sao Tome and Principe': 'ST',
    Slovakia: 'SK',
    'South Korea': 'KR',
    Slovenia: 'SI',
    'North Korea': 'KP',
    Kuwait: 'KW',
    Senegal: 'SN',
    'San Marino': 'SM',
    'Sierra Leone': 'SL',
    Seychelles: 'SC',
    Kazakhstan: 'KZ',
    'Cayman Islands': 'KY',
    Singapore: 'SG',
    Sweden: 'SE',
    Sudan: 'SD',
    'Dominican Republic': 'DO',
    Dominica: 'DM',
    Djibouti: 'DJ',
    Denmark: 'DK',
    'British Virgin Islands': 'VG',
    Germany: 'DE',
    Yemen: 'YE',
    Algeria: 'DZ',
    'United States': 'US',
    Uruguay: 'UY',
    Mayotte: 'YT',
    'United States Minor Outlying Islands': 'UM',
    Lebanon: 'LB',
    'Saint Lucia': 'LC',
    Laos: 'LA',
    Tuvalu: 'TV',
    Taiwan: 'TW',
    'Trinidad and Tobago': 'TT',
    Turkey: 'TR',
    'Sri Lanka': 'LK',
    Liechtenstein: 'LI',
    Latvia: 'LV',
    Tonga: 'TO',
    Lithuania: 'LT',
    Luxembourg: 'LU',
    Liberia: 'LR',
    Lesotho: 'LS',
    Thailand: 'TH',
    'French Southern Territories': 'TF',
    Togo: 'TG',
    Chad: 'TD',
    'Turks and Caicos Islands': 'TC',
    Libya: 'LY',
    Vatican: 'VA',
    'Saint Vincent and the Grenadines': 'VC',
    'United Arab Emirates': 'AE',
    Andorra: 'AD',
    'Antigua and Barbuda': 'AG',
    Afghanistan: 'AF',
    Anguilla: 'AI',
    'The Virgin Islands of the United States': 'VI',
    Iceland: 'IS',
    Iran: 'IR',
    Armenia: 'AM',
    Albania: 'AL',
    Angola: 'AO',
    Antarctica: 'AQ',
    'American Samoa': 'AS',
    Argentina: 'AR',
    Australia: 'AU',
    Austria: 'AT',
    Aruba: 'AW',
    India: 'IN',
    'Aland Islands': 'AX',
    Azerbaijan: 'AZ',
    Ireland: 'IE',
    Indonesia: 'ID',
    Ukraine: 'UA',
    Qatar: 'QA',
    Mozambique: 'MZ',
  }

  /******************************************************
   * Site Adapters (Fanatical, PlaySum, Gamivo)
   ******************************************************/
  const REGION_ADAPTERS = [
    {
      id: 'gamivo',
      test: () => location.hostname.includes('gamivo.com'),

      observerActivation: () =>
        !!document.querySelector('modal-container[role="dialog"]'),

      // Container on the modal itself
      getRegionUi() {
        return document.querySelector(
          'modal-container[role="dialog"] .ui-modal__content'
        )
      },

      // Gamivo doesn't have region switching - noop
      setRegion() {},

      // Extract current activation state from the modal header
      getCurrentActivationState() {
        const activationDetails = document.querySelector(
          'app-product-activation-details'
        )
        if (!activationDetails) return null

        return activationDetails.classList.contains('is-allowed')
          ? ACTIVATION_STATE.ALLOWED
          : ACTIVATION_STATE.NOT_ALLOWED
      },

      // Gamivo shows all allowed countries at once - return single "GLOBAL" region
      getRegionOptions() {
        return ['GLOBAL']
      },
    },
    {
      id: 'fanatical',
      test: () => location.hostname.includes('fanatical.com'),
      observerActivation: () => document.body.classList.contains('modal-open'),

      // Fanatical region selector container
      getRegionUi() {
        return document.querySelector('.dropdown-activation-container')
      },

      // Called when a region changes; website automatically updates the icon/text
      setRegion(code) {
        const container = this.getRegionUi()
        if (!container) return

        const select = container.querySelector('select')
        if (!select) return

        select.value = code
        select.dispatchEvent(new Event('change', { bubbles: true }))
      },

      // Extract current activation state (Fanatical uses an SVG icon)
      getCurrentActivationState() {
        const icon = document
          .querySelector('.can-activate-container svg')
          ?.getAttribute('data-icon')

        if (icon === 'circle-check') return ACTIVATION_STATE.ALLOWED
        return ACTIVATION_STATE.NOT_ALLOWED
      },

      // Optional: return list of available regions
      getRegionOptions() {
        const container = this.getRegionUi()
        if (!container) return []

        const select = container.querySelector('select')
        if (!select) return []

        return [...select.querySelectorAll('option')].map((opt) => opt.value)
      },
    },
    {
      id: 'playsum',
      test: () => location.hostname.includes('playsum'),

      observerActivation: () =>
        !!document.getElementById('headlessui-portal-root'),

      // Container for the modal content area
      getRegionUi() {
        return document.querySelector('.py-4.px-6.md\\:py-5')
      },

      // Select region in the dropdown
      setRegion(code) {
        const select = document.querySelector('#currency')
        if (!select) return

        select.value = code
        select.dispatchEvent(new Event('change', { bubbles: true }))
      },

      // Reads the current activation state from the modal
      getCurrentActivationState() {
        const modal = document.querySelector(
          '[role="dialog"][aria-modal="true"]'
        )
        if (!modal) return null // Modal not open yet

        // Try green or red text
        const statusEl = modal.querySelector('.text-green-500, .text-red-500')

        if (statusEl) {
          const isAllowed = statusEl.classList.contains('text-green-500')
          return isAllowed
            ? ACTIVATION_STATE.ALLOWED
            : ACTIVATION_STATE.NOT_ALLOWED
        }

        // Fallback: read raw text in case PlaySum changes classes
        const text = modal.textContent.toLowerCase()

        if (text.includes('can be activated')) {
          return ACTIVATION_STATE.ALLOWED
        }
        if (
          text.includes('cannot be activated') ||
          text.includes('not available')
        ) {
          return ACTIVATION_STATE.NOT_ALLOWED
        }

        return null // Unknown / still loading
      },

      // Get all region options from the select dropdown
      getRegionOptions() {
        const select = document.querySelector('#currency')
        if (!select) return []

        return [...select.querySelectorAll('option')].map((opt) => opt.value)
      },
    },
  ]

  /******************************************************
   * Active Adapter Resolver
   ******************************************************/
  const ADAPTER = REGION_ADAPTERS.find((a) => {
    try {
      return a.test()
    } catch {
      return false
    }
  })

  if (!ADAPTER) return // site not supported yet

  /******************************************************
   * Modal Observer
   ******************************************************/
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        if (ADAPTER.observerActivation()) {
          setTimeout(injectCheckerButton, 400)
        }
      }
    }
  })

  observer.observe(document.body, { attributes: true, subtree: true })

  /******************************************************
   * UI Injection
   ******************************************************/
  function injectCheckerButton() {
    const container = ADAPTER.getRegionUi()
    if (!container) return
    // console.log(container)

    // Remove existing results to avoid stale data
    container.querySelector('.region-check-results')?.remove()

    const existingBtn = container.querySelector('.region-check-btn')
    if (existingBtn) return // already inserted

    const btn = document.createElement('button')
    btn.className = 'btn btn-primary region-check-btn'
    btn.textContent = 'Check Countries'
    btn.style.margin = '10px'
    btn.style.padding = '5px 10px'
    container.appendChild(btn)

    btn.addEventListener('click', async () => {
      runRegionCheck(container)
    })
  }

  /******************************************************
   * Region Checker Logic
   ******************************************************/
  async function runRegionCheck(container) {
    // Special handling for Gamivo - show all regions with allowed/not allowed status
    if (ADAPTER.id === 'gamivo') {
      const results = getGamivoRegionStatus()
      showResults(container, results)
      return
    }

    const regions = ADAPTER.getRegionOptions()
    if (!regions || regions.length === 0) return

    const allowed = []
    const notAllowed = []
    const unknown = []

    for (const code of regions) {
      ADAPTER.setRegion(code)

      // Give UI time to update
      // await delay(0);

      const state = ADAPTER.getCurrentActivationState()
      if (state === ACTIVATION_STATE.ALLOWED) allowed.push(code)
      else if (state === ACTIVATION_STATE.NOT_ALLOWED) notAllowed.push(code)
      else unknown.push(code)
    }

    showResults(container, { allowed, notAllowed, unknown })
  }

  /******************************************************
   * Gamivo-specific helpers
   ******************************************************/
  function getGamivoRegionStatus() {
    const allowedCountryNames = getGamivoAllowedCountries()
    const allowedCodes = allowedCountryNames
      .map((name) => COUNTRY_NAME_TO_CODE[name])
      .filter(Boolean)

    const allCodes = ALL_REGION_CODES
    const allowed = []
    const notAllowed = []

    for (const code of allCodes) {
      if (allowedCodes.includes(code)) {
        allowed.push(code)
      } else {
        notAllowed.push(code)
      }
    }

    return { allowed, notAllowed, unknown: [] }
  }

  function getGamivoAllowedCountries() {
    const countryItems = document.querySelectorAll(
      'ul.restricted-countries__list li.restricted-countries__list-item'
    )
    return Array.from(countryItems).map((li) => li.textContent.trim())
  }

  /******************************************************
   * Display Results
   ******************************************************/
  function showResults(container, results) {
    container.querySelector('.region-check-results')?.remove()

    const div = document.createElement('div')
    div.className = 'region-check-results'
    div.style.color = 'white'
    div.style.marginTop = '12px'
    container.appendChild(div)

    if (results.notAllowed.length === 0) {
      div.innerHTML = `
        <strong style="color:#8bc34a; font-size:14px;">
          ✔ No region restrictions detected! All regions allowed.
        </strong>
      `
      return
    }

    div.innerHTML = `
      <div><i>Disclaimer: <strong>This is not an official list</strong>. It is a best effort to determine which regions are allowed based on the information provided by the website, but may not be accurate. Please double check!</i><br/><strong style="color:#8bc34a">Allowed (${
        results.allowed.length
      }):</strong> ${results.allowed.join(' ')}</div>
      <div style="margin-top:5px;"><strong style="color:#f44336">Not Allowed (${
        results.notAllowed.length
      }):</strong> ${results.notAllowed.join(' ')}</div>
      ${
        results.unknown.length
          ? `<div style="margin-top:5px;"><strong style="color:#ff9800">Unknown (${
              results.unknown.length
            }):</strong> ${results.unknown.join(' ')}</div>`
          : ''
      }
    `
    // Because PlaySum UI keeps deleting what it's added externally, we add to the info to the clipboard.
    if (location.hostname.includes('playsum')) {
      const textParts = []
      if (results.allowed.length > 0) {
        textParts.push(
          `Allowed (${results.allowed.length}): ${results.allowed.join(' ')}`
        )
      }
      if (results.notAllowed.length > 0) {
        textParts.push(
          `Not Allowed (${
            results.notAllowed.length
          }): ${results.notAllowed.join(' ')}`
        )
      }
      const clipboardText = textParts.join('\n')
      if (navigator.clipboard && clipboardText.trim()) {
        // Don't await, just try to copy if permission
        navigator.clipboard.writeText(clipboardText).catch(() => {})
      }
    }
  }

  /******************************************************
   * Utility
   ******************************************************/
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
})()
