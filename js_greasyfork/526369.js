// ==UserScript==
// @name         pics-viewer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  search pics-viewer images quickly
// @author       miles
// @match        https://pics-view.com/*
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACBUExURUxpcWB9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i////198il17idng49DY3PT297/K0MTP1M3X27rHzaCxupmstbTByK69xOfr7bfFy3WOmqi4wPz9/X+XomSBjqW1vZOmsN/l6GmFkomeqe7x8vn6+kv+1vUAAAAOdFJOUwDsAoYli9zV+lIqAZEDwV05SQAAAUZJREFUOMuFk+eWgjAUhGPBiLohjZACUqTp+z/gJkqJy4rzg3Nn+MjhwB0AANjv4BEtdITBHjhtQ4g+CIZbC4Qb9FGb0J4P0YrgCezQqgIA14EDGN8fYz+f3BGMASFkTJ+GDAYMUSONzrFL7SVvjNQIz4B9VERRmV0rbJWbrIwidnsd6ACMlEoip3uad3X2HJmqb3gCkkJELwk5DExRDxA6HnKaDEPSsBnAsZoANgJaoAkg12IJqBiPACImXQKF9IDULIHUkOk7kDpeAMykHqCEWACy8ACdSM7LGSg5F3HtAU1rrkaK9uGAshXS2lZ5QH/nVhmlD8rKlmbO3ZsZwLe8qnpdxJRnLaci1X1V5R32fjd5CndVkfYdGpy3D+htU952C/ypzPtdt3JflzZYBy7fi/O1euvl/XH1Pp+Cw3/1P1xOZwB+AWMcP/iw0AlKAAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/526369/pics-viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/526369/pics-viewer.meta.js
// ==/UserScript==
;(function () {
  'use strict'
  
  // Default configuration
  const DEFAULT_CONFIG = {
    magnetSearchUrl: 'https://laowangun.top/search?keyword=',
    avSearchUrl: 'https://123av.com/en/search?keyword='
  }
  
  // Get configuration from Tampermonkey storage or use default
  const getConfig = () => ({
    magnetSearchUrl: GM_getValue('magnetSearchUrl', DEFAULT_CONFIG.magnetSearchUrl),
    avSearchUrl: GM_getValue('avSearchUrl', DEFAULT_CONFIG.avSearchUrl)
  })
  
  // Set configuration in Tampermonkey storage
  const setConfig = (config) => {
    GM_setValue('magnetSearchUrl', config.magnetSearchUrl)
    GM_setValue('avSearchUrl', config.avSearchUrl)
  }
  
  // Register menu command to configure magnet search URL
  GM_registerMenuCommand('Configure Magnet Search URL', () => {
    const config = getConfig()
    const newUrl = prompt('Enter the magnet search URL (with trailing = or ?q=):', config.magnetSearchUrl)
    if (newUrl !== null) {
      setConfig({ ...config, magnetSearchUrl: newUrl })
      alert('Magnet search URL updated successfully!')
    }
  })
  
  // Register menu command to configure AV search URL
  GM_registerMenuCommand('Configure AV Search URL', () => {
    const config = getConfig()
    const newUrl = prompt('Enter the AV search URL (with trailing = or ?keyword=):', config.avSearchUrl)
    if (newUrl !== null) {
      setConfig({ ...config, avSearchUrl: newUrl })
      alert('AV search URL updated successfully!')
    }
  })
  
  const runPicView = () => {
    if (!location.href.includes('pics-view.com')) {
      return
    }
    const maybeKeyword = location.href.split('/').pop().split('.')[0]
    const maybeWordList = maybeKeyword.split('-')
    if (maybeWordList[maybeWordList.length - 1].length < 2) {
      maybeWordList.pop()
    }
    const keyword = maybeWordList.join('-')
    const btn = document.createElement('button')
    btn.style.marginLeft = '5px'
    btn.innerText = 'search'
    btn.onclick = () => {
      window.open(`https://google.com/search?q=${keyword}`)
    }
    document.body.prepend(btn)

    const btnSearchInAV = document.createElement('button')
    btnSearchInAV.style.marginLeft = '5px'
    btnSearchInAV.innerText = 'searchAV'
    btnSearchInAV.onclick = () => {
      const config = getConfig()
      window.open(`${config.avSearchUrl}${maybeWordList[maybeWordList.length - 1]}`)
    }
    document.body.prepend(btnSearchInAV)

    const searchInMagnet = document.createElement('button')
    searchInMagnet.style.marginLeft = '5px'
    searchInMagnet.innerText = 'searchMagnet'
    searchInMagnet.onclick = () => {
      const config = getConfig()
      window.open(`${config.magnetSearchUrl}${keyword}`)
    }
    document.body.prepend(searchInMagnet)
  }
  runPicView()
})()
