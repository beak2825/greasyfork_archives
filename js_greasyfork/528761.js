// ==UserScript==
// @name        kurviger.com Speed Stats
// @namespace   shiftgeist
// @match       https://kurviger.com/*
// @match       https://kurviger.de/*
// @grant       GM_addStyle
// @version     20250417
// @author      shiftgeist
// @description Show speed stats (Desktop only)
// @license     GNU GPLv3
// @icon        https://www.google.com/s2/favicons?sz=64&domain=kurviger.com
// @downloadURL https://update.greasyfork.org/scripts/528761/kurvigercom%20Speed%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/528761/kurvigercom%20Speed%20Stats.meta.js
// ==/UserScript==

GM_addStyle(`
  .leaflet-marker-icon.rounded-full {
    display: none !important;
  }

  .leaflet-zoom-animated [stroke="#ff7575"] /* 30 */ {
    stroke-width: 10px;
  }

  /* .leaflet-zoom-animated [stroke="#ffcf6e"], 50 */
  .leaflet-zoom-animated [stroke="#fff06e"], /* 70 */
  .leaflet-zoom-animated [stroke="#6eff8d"] /* 100 */ {
    stroke: #477BD6;
  }
`)

const debug = window.localStorage.getItem('debug-log') === 'true'
const doc = document
const elDropdown = '.selection-dropdown'
const elSource = '.heightgraph-container-inner'
let sourceObserver = null
let stats = null
let timeoutCounter = 0

function log(...params) {
  if (debug) {
    console.debug('[Speed]', ...params)
  }
}

function getSpeed(color) {
  switch (color) {
    case 'rgb(255, 117, 117)':
      return '30'
    case 'rgb(255, 207, 110)':
      return '50'
    case 'rgb(255, 240, 110)':
      return '70'
    case 'rgb(110, 255, 141)':
      return '100'
    default:
    case 'rgb(179, 179, 179)':
      return 'unknown'
  }
}

function getData() {
  const source = doc.querySelector(elSource)

  const childrenEl = Array.from(source.querySelectorAll('.area'))
  const containerWidth = childrenEl.reduce((acc, v) => acc + v.getBoundingClientRect().width - 4, 0)

  const children = childrenEl.map(v => ({
    width: v.getBoundingClientRect().width / containerWidth,
    speed: getSpeed(v.style.fill),
  }))

  const speeds = {
    30: 0,
    50: 0,
    70: 0,
    100: 0,
    unknown: 0,
  }

  for (const s of children) {
    speeds[s.speed] += s.width
  }

  speeds.sum = speeds['30'] + speeds['50'] + speeds['70'] + speeds['100']
  speeds.average = speeds['30'] * 30 + speeds['50'] * 50 + speeds['70'] * 70 + speeds['100'] * 100

  return speeds
}

function isSpeedGraph() {
  return doc.querySelector(elDropdown).value === '2'
}

function prepareStats() {
  if (stats) {
    log('remove first', stats)
    stats.remove()
    stats = null
  }

  createListener(createStats)

  if (!isSpeedGraph()) {
    log('wrong graph type')
    return
  }

  return true
}

function createListener(callback) {
  if (!sourceObserver) {
    log('registering observer')

    sourceObserver = new MutationObserver(() => {
      if (prepareStats()) {
        callback()
      }
    })

    sourceObserver.observe(document.querySelector(elSource), { childList: true })
  }
}

function createStats() {
  if (!prepareStats()) return

  log('create stats')

  stats = doc.createElement('div')
  stats.id = 'SpeedStats'
  stats.style.zIndex = '9999'
  stats.style.position = 'absolute'
  stats.style.top = '155px'
  stats.style.left = '50%'
  stats.style.transform = 'translate(-50%)'
  doc.querySelector('.heightgraph').appendChild(stats)

  const d = getData()

  stats.textContent += `${(d['30'] * 100).toFixed()}% 30 km/h`
  stats.textContent += `, `
  stats.textContent += `${(d['50'] * 100).toFixed()}% 50 km/h`
  stats.textContent += `, `
  stats.textContent += `${(d['70'] * 100).toFixed()}% 70 km/h`
  stats.textContent += `, `
  stats.textContent += `${(d['100'] * 100).toFixed()}% 100 km/h`
  stats.textContent += `, `
  stats.textContent += `Average ${d.average.toFixed()} km/h`

  log('Stats created', d)
}

function waitForLoad(callback) {
  log('wait for load')

  if (!window.location.href.includes('/plan') || timeoutCounter > 20) {
    log('wrong url or too many retries')
    return
  }

  if (doc.querySelectorAll(`${elSource}, ${elDropdown}`).length) {
    log('has source')
    callback()
  } else {
    timeoutCounter += 1
    setTimeout(() => waitForLoad(callback), 20 * (timeoutCounter / 2 + 1))
  }
}

waitForLoad(createStats)
