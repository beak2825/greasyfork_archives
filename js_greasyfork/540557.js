// ==UserScript==
// @name         GGn i18n group filters toolbar
// @namespace    https://gazellegames.net/
// @version      2.2.2
// @description  On a group page, filters the releases list based on the locale.
// @author       VGTal
// @license      Unlicense
// @icon         https://gazellegames.net/favicon.ico
// @match        https://gazellegames.net/torrents.php?id=*
// @downloadURL https://update.greasyfork.org/scripts/540557/GGn%20i18n%20group%20filters%20toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/540557/GGn%20i18n%20group%20filters%20toolbar.meta.js
// ==/UserScript==

const defaultSelectedFilter = 'all'
const highlightMultiWithNoLocaleInDescription = false

const logDebug = (...messages) => {
  const css = 'background: #222; color: #bada55; font-weight: 900;'
  console.debug('%c[I18n Filters Dock]', css, ...messages)
}

//////////////
// INJECTOR //
//////////////

const waitForElement = (selector, elementMustExist = true) => {
  const isResolvable = () => {
    if (elementMustExist) {
      return document.querySelector(selector)
    } else {
      return !document.querySelector(selector)
    }
  }

  return new Promise(resolve => {
    if (isResolvable()) {
      return resolve(document.querySelector(selector))
    }

    const observer = new MutationObserver(mutations => {
      if (isResolvable()) {
        observer.disconnect()
        resolve(document.querySelector(selector))
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  })
}

const watchGroupLinksForInit = () => {
  logDebug('Watching for group links container presence...')
  waitForElement('#grouplinks', true).then((element) => {
    logDebug('Found group links container.')
    initI18nToolbar()

    logDebug('Watching for i18n filters container destruction...')
    waitForElement('#i18n-filters', false).then((element) => {
      logDebug('I18n filters container destruction observed.')
      watchGroupLinksForInit()
    })
  })
}


//////////
// MAIN //
//////////

// Lists of keywords used to match against.
const localesMap = {
  'Multi': ['Multi-Language'],
  'ENG':   ['English', 'ENG', 'EN'],
  'DEU':   ['German', 'Deutsch', 'DEU', 'DE', 'GER'],
  'FRA':   ['French', 'Français', 'FRA', 'FR', 'FRE'],
  'CES':   ['Czech', 'CES', 'CS', 'CZE'],
  'ZH-CN': ['Chinese', 'Simplified Chinese', 'Chinese Simplified', 'Chinese (Simplified)', 'Traditional Chinese', '中文(简体)', 'ZHO','ZH', 'CHI', 'ZH-CN'],
  'ZH-TW': ['Chinese (Taiwan)', 'Chinese - Taiwan', 'ZH-TW'],
  'ITA':   ['Italian', 'ITA', 'IT'],
  'JPN':   ['Japanese', '日本語', 'JPN', 'JA'],
  'KOR':   ['Korean', 'KOR', 'KO'],
  'POL':   ['Polish', 'Polski', 'POL', 'PL'],
  'POR':   ['Portuguese', 'POR', 'PT'],
  'PT-PT': ['Portuguese - Portugal', 'Portuguese (Portugal)', 'PT-PT'],
  'PT-BR': ['Portuguese (Brazilian)', 'Portuguese - Brazil', 'Portuguese (Brazil)', 'PT-BR'],
  'RUS':   ['Russian', 'русский', 'RUS', 'RU'],
  'SPA':   ['Spanish', 'Spanish - Spain', 'Spanish (Spain)', 'Spanish - Castilian', 'Spanish (Castilian)', 'Castilian', 'Español', 'Castellano', 'SPA', 'ES', 'ES-SP'],
  'ES-LA': ['Spanish - Latin America', 'Spanish (Latin America)', 'ES-LA'],
  'TUR':   ['Turkish', 'TUR', 'TR'],
  'THA':   ['Thai', 'THA', 'TH'],
  'ICE':   ['Icelandic', 'Íslenska', 'ICE', 'ISL', 'IS'],
  'DAN':   ['Danish', 'Dansk', 'DAN', 'DA'],
  'NLD':   ['Dutch', 'Flemish', 'Nederlands', 'NLD', 'DUT', 'NL'],
  'FIN':   ['Finnish', 'Suomi', 'FIN', 'FI'],
  'NOR':   ['Norwegian', 'Norsk', 'NOR'], // 'NO' excluded ISO code (for the moment?)
  'SWE':   ['Swedish', 'Svenska', 'SWE', 'SV'],
  'HUN':   ['Hungarian', 'Magyar nyelv', 'HUN', 'HU'],
  'RON':   ['Romanian', 'Moldavian', 'Moldovan', 'Română', 'Ромынэ', 'RON', 'RUM', 'RO'],
  'BUL':   ['Bulgarian', 'Български', 'BUL', 'BG'],
  'ELL':   ['Greek', 'Ελληνικά', 'ELL', 'GRE', 'EL'],
  'UKR':   ['Ukrainian', 'Українська', 'UKR', 'UK'],
  'CAT':   ['Catalan', 'Valencian', 'Català', 'Valencià', 'CAT', 'CA'],
  'LIT':   ['Lithuanian', 'Lietuvių', 'LIT', 'LT'],
  'SRP':   ['Serbian', 'Српски', 'SRP', 'SR'],
  'SLK':   ['Slovak', 'Slovakian', 'Slovenčina', 'SLK', 'SLO', 'SL'],
  'SLV':   ['Slovenian', 'Slovene', 'Slovenščina', 'SLV', 'SL'],
  'VIE':   ['Vietnamese', 'tiếng Việt', 'VIE', 'VI'],
  'LAV':   ['Latvian', 'Latviski', 'LAV', 'LV'],
  'IND':   ['Indonesian', 'bahasa Indonesia', 'IND', 'ID']
}

const initI18nToolbar = () => {
  tagReleasesWithLocales()
  renderI18nToolbar()

  if (highlightMultiWithNoLocaleInDescription) {
    ;[...document.querySelectorAll('[data-release-locales="|Multi|"]')].forEach((releaseRow) => {
      releaseRow.style.outline = "3px dashed red"
    })
  }
}

const tagReleasesWithLocales = () => {
  for (const [localeIsoCode, localeNames] of Object.entries(localesMap)) {
    releaseTitles().forEach((releaseTitleElement) => {
      const releaseMainTr      = releaseTitleElement.closest('tr')
      const releaseDetailsTr   = releaseMainTr.nextElementSibling
      const descriptionElement = releaseDetailsTr.querySelector('#description')

      localeNames.forEach((localeName) => {
        if (
          stringContainValueInBrackets(releaseTitleElement.innerText, localeName) ||
          rawHtmlContainValue(descriptionElement?.innerHTML ?? '', localeName)
        ) {
          // Add to string separated by `|`, including an opening and closing `|`.
          const currentLocales = (releaseMainTr.dataset.releaseLocales || '').split('|')
          const newLocales = [...currentLocales, `${localeIsoCode}`].filter(n => n)
          releaseMainTr.dataset.releaseLocales = `|${newLocales.join('|')}|`
        }
      })
    })
  }
}

const renderI18nToolbar = () => {
  logDebug('Initializing...')

  const groupLinksContainer = document.querySelector('#grouplinks')

  // Setup the container.
  const container = document.createElement('div')
  container.id = 'i18n-filters'
  container.classList.add('box')
  container.classList.add('pad')
  groupLinksContainer.insertAdjacentElement('afterend', container)

  // Create full list button.
  const allButton = document.createElement('button')
  allButton.classList.add('good')
  allButton.style.cursor = 'pointer'
  allButton.style.margin = '2px'
  allButton.innerHTML = `All (${releaseTitles().length})`
  allButton.addEventListener('click', filterList)
  container.appendChild(allButton)

  // Create locale buttons.
  for (const [localeIsoCode, localeNames] of Object.entries(localesMap)) {
    const releasesCount = rowsForLocale(localeIsoCode).length

    // Skip locale if it's empty.
    if (releasesCount === 0) {
      logDebug('No release for', localeIsoCode)
      continue
    }

    // Build locale button.
    const localeButton = document.createElement('button')
    localeButton.style.cursor = 'pointer'
    localeButton.style.margin = '2px'
    localeButton.dataset.localeIsoCode = localeIsoCode
    localeButton.innerHTML = `${localeIsoCode} (${releasesCount})`
    localeButton.addEventListener('click', filterList)
    container.appendChild(localeButton)
  }

  container.querySelector(`[data-locale-iso-code=${defaultSelectedFilter}]`)?.click()

  logDebug('Initialized.')
}

const filterList = (event) => {
  const localeIsoCode = event.target.dataset.localeIsoCode
  const localeRows = [...rowsForLocale(localeIsoCode)]

  logDebug('Filtering on', localeIsoCode ?? 'all')

  releaseEditions().forEach((elements) => {
    const [editionNameElement, releasesBodyElement] = elements
    let anyInEdition = false

    releaseTitles(releasesBodyElement).forEach((element) => {
      const releaseTr = element.closest('tr')

      if (!localeIsoCode || localeRows.includes(releaseTr)) {
        releaseTr.style.display = ''
        releaseTr.nextElementSibling.style.display = ''
        anyInEdition = true
      } else {
        releaseTr.style.display = 'none'
        releaseTr.nextElementSibling.style.display = 'none'
      }
    })

    const rowElement = editionNameElement.querySelector('.group_torrent')

    if (rowElement) {
      if (anyInEdition) {
        editionNameElement.querySelector('.group_torrent').style.display = ''
      } else {
        editionNameElement.querySelector('.group_torrent').style.display = 'none'
      }
    } else {
      logDebug('[WARNING][filterList] Provided elements are not in a row', elements)
    }
  })

  // Move active status
  const currentActive = document.querySelector('#i18n-filters .good')
  currentActive.classList.remove('good')
  event.target.classList.add('good')
}


/////////////
// HELPERS //
/////////////

const releaseEditions = () => {
  // Get all top-level table bodies.
  const arr = [...document.querySelectorAll('.torrent_table > tbody')]
  // Split into pairs, it's expected to always alternate between an edition header and a releases list.
  return arr.slice(arr.length/2).map((_,i)=>arr.slice(i*=2,i+2))
}

const releaseTitles = (torrentsTableContainer = null) => {
  torrentsTableContainer ||= document.querySelector('.torrent_table')
  return [...torrentsTableContainer.querySelectorAll('tr td:first-of-type > a')]
}

const rowsForLocale = (localeName) => {
  return document.querySelectorAll(`[data-release-locales*="|${localeName}|"]`)
}

const stringContainValueInBrackets = (testedString, localeName) => {
  // Test if the provided string exist between two brackets at the start somewhere in the title.
  const titleRegex = new RegExp(String.raw`.*\[${localeName.toLowerCase()}\b[^\]]*\].*`)
  return titleRegex.test(testedString.toLowerCase())
}

const rawHtmlContainValue = (testedString, localeName) => {
  // Start from raw html to ensure eg. lists don't end up as one brick of text.
  const possibleValues = testedString.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, ',')
                                     .toLowerCase()
                                     .replace('fire and ice', '') // Cleanup "common" icelandic false positive.
                                     .split(/(\n|,|:|\/| and |&amp;)/)
                                     .map(v => v.trim())
  return possibleValues.includes(localeName.toLowerCase())
}


//////////
// INIT //
//////////

watchGroupLinksForInit()
