// ==UserScript==
// @name         njav 快捷搜索
// @namespace    http://tampermonkey.net/
// @version      0.4.5
// @description  njav qiuck search
// @author       miles
// @match        https://123av.com/*/v/*
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACBUExURUxpcWB9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i////198il17idng49DY3PT297/K0MTP1M3X27rHzaCxupmstbTByK69xOfr7bfFy3WOmqi4wPz9/X+XomSBjqW1vZOmsN/l6GmFkomeqe7x8vn6+kv+1vUAAAAOdFJOUwDsAoYli9zV+lIqAZEDwV05SQAAAUZJREFUOMuFk+eWgjAUhGPBiLohjZACUqTp+z/gJkqJy4rzg3Nn+MjhwB0AANjv4BEtdITBHjhtQ4g+CIZbC4Qb9FGb0J4P0YrgCezQqgIA14EDGN8fYz+f3BGMASFkTJ+GDAYMUSONzrFL7SVvjNQIz4B9VERRmV0rbJWbrIwidnsd6ACMlEoip3uad3X2HJmqb3gCkkJELwk5DExRDxA6HnKaDEPSsBnAsZoANgJaoAkg12IJqBiPACImXQKF9IDULIHUkOk7kDpeAMykHqCEWACy8ACdSM7LGSg5F3HtAU1rrkaK9uGAshXS2lZ5QH/nVhmlD8rKlmbO3ZsZwLe8qnpdxJRnLaci1X1V5R32fjd5CndVkfYdGpy3D+htU952C/ypzPtdt3JflzZYBy7fi/O1euvl/XH1Pp+Cw3/1P1xOZwB+AWMcP/iw0AlKAAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/527562/njav%20%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/527562/njav%20%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
;(function () {
  'use strict'

  // Default configuration
  const DEFAULT_CONFIG = {
    magnetSearchUrl: 'https://btdig.com/search?q=',
  }

  // Get configuration from Tampermonkey storage or use default
  const getConfig = () => ({
    magnetSearchUrl: GM_getValue('magnetSearchUrl', DEFAULT_CONFIG.magnetSearchUrl),
  })

  // Set configuration in Tampermonkey storage
  const setConfig = (config) => {
    GM_setValue('magnetSearchUrl', config.magnetSearchUrl)
  }

  // Register menu command to configure magnet search URL
  GM_registerMenuCommand('Configure Magnet Search URL', () => {
    const config = getConfig()
    const newUrl = prompt('Enter the magnet search URL (with trailing = or ?q=):', config.magnetSearchUrl)
    if (newUrl !== null) {
      setConfig({ magnetSearchUrl: newUrl })
      alert('Magnet search URL updated successfully!')
    }
  })

  const renderButton = (container, text, onClick) => {
    const btn = document.createElement('button')
    btn.style.position = 'absolute'
    btn.style.zIndex = 20
    btn.style.padding = '2px'
    btn.style.border = '2px solid gray'
    btn.style.borderRadius = '9px'
    btn.innerText = text
    btn.onclick = onClick
    container.prepend(btn)
    return btn
  }

  const run = () => {
    if (!location.href.includes('123av.com')) {
      return
    }
    const keyword = location.href.split('/').pop()
    const google = renderButton(document.body, 'search', () => {
      window.open(`https://google.com/search?q=${keyword}`)
    })
    google.style.marginLeft = '5px'

    const magnet = renderButton(document.body, 'searchMagnet', () => {
      const config = getConfig()
      window.open(`${config.magnetSearchUrl}${keyword}`)
    })
    magnet.style.marginLeft = '70px'
  }
  run()
})()
