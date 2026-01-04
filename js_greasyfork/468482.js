// ==UserScript==
// @name        KraXen's Krunker Utils
// @namespace   Violentmonkey Scripts
// @include     https://krunker.io/*
// @grant       none
// @version     4.0
// @author      KraXen72
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM_download
// @grant       GM_addStyle
// @description various utilities to get data for krunker client development
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468482/KraXen%27s%20Krunker%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/468482/KraXen%27s%20Krunker%20Utils.meta.js
// ==/UserScript==

const log = console.log.bind(console)
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

// i found no good way to keep this updated programatically
const regionMappings = {
    "de-fra": {c:"FRA", off: 2},
    "us-ca-sv": {c:"SV", off: -7},
    "au-syd": {c:"SYD", off: 10},
    "jb-hnd": {c:"TOK", off: 9},
    "us-fl": {c:"MIA", off: -4},
    "sgp": {c:"SIN", off: 8},
    "us-nj": {c:"NY", off: -4},
    "as-mb": {c:"MBI", off: 5.5},
    "us-tx": {c:"DAL", off: -5},
    "brz": {c:"BRZ", off: -3}, // approx, BRT
    "me-bhn": {c:"BHN", off: 3}, // approx, Saudi arabia
    "af-ct": {c:"AFR", off: 2} // approx SAST
}
const versionRegex = /(?:v)(\d\.\d\.\d)/g;

function getGamemodes() {
  clearPops()
  closWind()
  showWindow(42)
  openHostWindow(false, 0)
  windows[7].switchTab(1)
  const wrap = document.querySelector('.hostTb1 > div[style*="margin"]:has(.hostOpt)')
  const gamemodes = [...wrap.children].map((item, i) => {
    const name = item.querySelector('.optName').textContent
    return name
  })
  log(gamemodes)
}

function getRegions() {
  GM_xmlhttpRequest({
    url: "https://matchmaker.krunker.io/game-list?hostname=krunker.io",
    responseType: 'json',
    onload: (data) => {
      const regionsWithDuplicates = data.response.games
        .map(game => game[0].split(":")[0])
      const regions = [...new Set(regionsWithDuplicates)]
      log(regions)
    }
  })
}

function getRegionsSetting() {
  clearPops()
  closWind()
  showWindow(1)
  const options = [...document.querySelectorAll('.settName[title$="specific region"] > select.inputGrey2[onchange*="defaultRegion"] option')]
  const regions = options.map(opt => ({ name: opt.textContent, id: opt.value, code: regionMappings[opt.value].c, offset: regionMappings[opt.value]?.off ?? 0 }))
  // found in matchmaker, but not region picker
  regions.push({ "name": "London (hidden)", "id": '', "code": "LON", "offset": 1 })
  regions.push({ "name": "China (hidden)", "id": '', "code": "CHI", "offset": 8 }) // approx, Beijing
  regions.push({ "name": "Seattle (hidden)", "id": '', "code": "STL", "offset": -7 })
  regions.push({ "name": "Mexico (hidden)", "id": '', "code": "MX", "offset": -6 })
  log(regions)
  log(regions.map(reg => reg.code))
}

function getModUrls() {
    if (!('6' in windows[3].listData)
        || typeof windows[3].listData['6'] === undefined
        || !('list' in windows[3].listData['6'])
        || windows[3].listData['6'].list.length === 0) {
      alert('search for some mods first, then hit this button!');
      return;
    }
    try {
      document.getElementById('userscript-mod-dl-holder').remove()
    } catch(e) {}

    const holderDiv = document.createElement('div')
    holderDiv.id = "userscript-mod-dl-holder"

    const mods = windows[3].listData['6'].list
    log(windows[3].listData, windows[3].listData['6'], mods)
    mods.forEach(mod => {
      holderDiv.innerHTML += `<a class="settingsBtn" style="font-size: 12px; width: max-content;" href="${mod['mod_url']}" target="_blank">Download ${mod['mod_name']}</a>`;
    })
    holderDiv.innerHTML += `<button class="settingsBtn" style="font-size: 12px;" onclick="this.parentElement.remove()">X</button>`

    document.body.appendChild(holderDiv)
}

function getLatestModZip() {
  clearPops()
  closWind()
  showWindow(35) // open changelog
  setTimeout(() => {
    const elem = document.querySelector(".logVersionHed")
    const ver = elem.textContent;
    const matches = [...ver.matchAll(versionRegex)]
    const version = matches[matches.length - 1]
    const url = `https://krunker.io/modzip/${version}`
    log(ver, matches, url)
    window.open(url, '_blank')

  }, 2500)
}

GM_addStyle(`
  #userscript-mod-dl-holder {
    position: fixed;
    z-index: 2000;
    top: 20px;
    left: 20px;
    background: #232323;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    row-gap: 8px;

    width: max-content;
    padding: 8px;
  }
`)


GM_registerMenuCommand("log gamemodes to console", getGamemodes)
GM_registerMenuCommand("fetch all regions (3-letter shortcuts)", getRegions)
GM_registerMenuCommand("fetch all regions (full objects)", getRegionsSetting)
GM_registerMenuCommand("get latest mod.zip", getLatestModZip)
GM_registerMenuCommand("get current mod download urls", getModUrls)









