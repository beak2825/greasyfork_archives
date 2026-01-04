// ==UserScript==
// @name            PoE Cluster Filter
// @description     PoE trade cluster jewel starting passives filter
// @version         1.0.0
// @author          ArnoldsK
// @namespace       https://arnoldsk.lv
// @match           https://*.pathofexile.com/trade/search/*
// @icon            https://www.google.com/s2/favicons?domain=pathofexile.com
// @license         MIT
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/465153/PoE%20Cluster%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/465153/PoE%20Cluster%20Filter.meta.js
// ==/UserScript==

// #############################################################################
// Global elements
// #############################################################################
const getResultsEl = () => document.querySelector('#trade .resultset')
const getSearchBtnEl = () => document.querySelector('#trade .btn.search-btn')

const clusterFilterApp = (
  state = {
    masteries: [],
    hidden: 0,
  },
) => {
  // #############################################################################
  // Add nav tab
  // #############################################################################
  const tabsEl = document.querySelector('.nav.nav-tabs.account')

  const tabEl = document.createElement('li')
  tabEl.classList.add('menu-settings', 'menu-clusters')
  tabEl.innerHTML = `
    <a href="javascript:void(0)">
      <span>Clusters</span>
    </a>
  `

  tabsEl.appendChild(tabEl)

  // #############################################################################
  // Add config
  // #############################################################################
  const cfgEl = document.createElement('div')
  cfgEl.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0 0 0 / 0.5);
  `

  const cfgBodyEl = document.createElement('div')
  cfgBodyEl.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #000;
    padding: 16px;
    border: 1px solid #5a3806;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  `

  const txtEl = document.createElement('textarea')
  txtEl.classList.add('form-control')
  txtEl.placeholder = [
    'Add mastery names that should be the first passives before the jewel sockets. Separate each one by a new line. For example:',
    '',
    'Martial Prowess',
    'Fuel the Fight',
  ].join('\n')
  txtEl.style.cssText = `
    width: 30vmin;
    min-height: 13vmin;
    resize: vertical;
  `

  const ctlEl = document.createElement('div')
  ctlEl.classList.add('controls')
  ctlEl.style.cssText = `
    width: 100%;
    display: flex;
    justify-content: center;
  `

  const filterBtnEl = document.createElement('button')
  filterBtnEl.classList.add('btn', 'search-btn', 'cluster-filter-btn')
  filterBtnEl.innerHTML = `
    <span>Filter</span>
  `

  const resetBtnEl = document.createElement('button')
  resetBtnEl.classList.add('btn', 'clear-btn', 'cluster-reset-btn')
  resetBtnEl.innerHTML = `
  <span>Reset</span>
  `

  const infoBtnEl = document.createElement('button')
  infoBtnEl.classList.add('btn', 'clear-btn', 'cluster-info-btn')
  infoBtnEl.style.cssText = `
    min-width: auto;
  `
  infoBtnEl.innerHTML = `
    <span>?</span>
  `

  const btnGrpEl = document.createElement('div')
  btnGrpEl.style.cssText = `
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 8px;
  `

  btnGrpEl.appendChild(filterBtnEl)
  btnGrpEl.appendChild(resetBtnEl)
  btnGrpEl.appendChild(infoBtnEl)

  cfgBodyEl.appendChild(txtEl)
  cfgBodyEl.appendChild(btnGrpEl)

  ctlEl.appendChild(cfgBodyEl)
  cfgEl.appendChild(ctlEl)
  document.querySelector('#trade').appendChild(cfgEl)

  // #############################################################################
  // Observer for new items
  // #############################################################################
  const observer = new MutationObserver(async (mutationList) => {
    // No masteries
    if (!state.masteries.length) return

    // Has new items
    const hasAddedNodes = mutationList.some(
      (mutation) => !!mutation.addedNodes.length,
    )

    if (hasAddedNodes) {
      filterClusters()
    }
  })

  // #############################################################################
  // Handlers
  // #############################################################################
  const setHidden = (hidden) => {
    state.hidden = hidden

    tabEl.querySelector('span').innerText = hidden
      ? `Clusters (${hidden} hidden)`
      : 'Clusters'
  }

  const toggleConfig = () => {
    const isVisible = cfgEl.style.display !== 'none'

    cfgEl.style.display = isVisible ? 'none' : 'block'
  }

  const filterClusters = () => {
    // No masteries
    if (!state.masteries.length) return

    // Filter
    const cntEls = [...getResultsEl().querySelectorAll('.content')]

    for (const cntEl of cntEls) {
      // Skip the already hidden
      const rowEl = cntEl.closest('.row')

      if (!rowEl || rowEl.style.display === 'none') continue

      // Hide if has matched masteries
      const noteEls = [...cntEl.querySelectorAll('.notableProperty')]

      if (noteEls.length < 2) continue

      const names = noteEls.map(
        (el) => el.querySelector('.colourAugmented').innerText,
      )

      const filter = (name) =>
        state.masteries.some(
          (mastery) => mastery.toLocaleLowerCase() === name.toLocaleLowerCase(),
        )

      const firstName = names[0]
      const lastName = names[names.length - 1]

      // Match
      const findFn = state.masteries.length === 1 ? 'some' : 'every'
      const hasMatch =
        names.length === 2
          ? [firstName][findFn](filter)
          : [firstName, lastName][findFn](filter)

      if (!hasMatch) {
        rowEl.style.display = 'none'
        setHidden(state.hidden + 1)
      }
    }
  }

  const resetClusters = () => {
    setHidden(0)

    const resultsEl = getResultsEl()

    if (resultsEl) {
      resultsEl.querySelectorAll('.row').forEach((el) => {
        el.style.display = 'flex'
      })
    }
  }

  // #############################################################################
  // Events and data
  // #############################################################################
  tabEl.addEventListener('click', () => {
    toggleConfig()
  })

  filterBtnEl.addEventListener('click', () => {
    const masteries = txtEl.value
      .split('\n')
      .map((el) => el.trim())
      .filter((el) => !!el)

    state.masteries = masteries

    resetClusters()

    if (masteries.length) {
      localStorage.setItem('poe-clusters-filter', JSON.stringify(masteries))

      filterClusters()
      observer.observe(getResultsEl(), {
        childList: true,
      })
    } else {
      localStorage.removeItem('poe-clusters-filter')

      observer.disconnect()
    }

    toggleConfig()
  })

  getSearchBtnEl().addEventListener('click', () => {
    resetClusters()
    observer.disconnect()
  })

  resetBtnEl.addEventListener('click', () => {
    toggleConfig()
    resetClusters()
    observer.disconnect()
  })

  infoBtnEl.addEventListener('click', () => {
    window.open('https://imgur.com/a/ELSXIW7')
  })

  // #############################################################################
  // Restore local storage if set
  // #############################################################################
  const storedMasteries = localStorage.getItem('poe-clusters-filter')

  if (storedMasteries) {
    const masteries = JSON.parse(storedMasteries)

    txtEl.value = masteries.join('\n')
  }
}

window.addEventListener('load', () => {
  // Scuffed solution for content load check
  const loadedInterval = setInterval(() => {
    if (!getSearchBtnEl()) return

    clearInterval(loadedInterval)
    clusterFilterApp()
  }, 100)
})
