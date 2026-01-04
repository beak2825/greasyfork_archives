// ==UserScript==
// @name          MusicBrainz Magic Tagger Button
// @description   Automatically enable the green tagger button on MusicBrainz.org depending on whether Picard is running.
// @version       0.7.14
// @author        Philipp Wolfer
// @namespace     https://uploadedlobster.com
// @license       MIT
// @icon          https://raw.githubusercontent.com/phw/musicbrainz-magic-tagger-button/main/resources/mblookup-tagger-default.png
// @match         https://*.musicbrainz.org/cdtoc/*
// @match         https://*.musicbrainz.org/collection/*
// @match         https://*.musicbrainz.org/recording/*
// @match         https://*.musicbrainz.org/release-group/*
// @match         https://*.musicbrainz.org/release/*
// @match         https://*.musicbrainz.org/series/*
// @match         https://*.musicbrainz.org/taglookup*
// @match         https://*.musicbrainz.org/search*
// @match         https://*.musicbrainz.org/artist/*/releases*
// @match         https://*.musicbrainz.eu/cdtoc/*
// @match         https://*.musicbrainz.eu/collection/*
// @match         https://*.musicbrainz.eu/recording/*
// @match         https://*.musicbrainz.eu/release-group/*
// @match         https://*.musicbrainz.eu/release/*
// @match         https://*.musicbrainz.eu/series/*
// @match         https://*.musicbrainz.eu/taglookup*
// @match         https://*.musicbrainz.eu/search*
// @match         https://*.musicbrainz.eu/artist/*/releases*
// @exclude       /^https://(.*\.)?musicbrainz\.(org|eu)/release/add/
// @exclude       /^https://(.*\.)?musicbrainz\.(org|eu)/.*/create/
// @exclude       /^https://(.*\.)?musicbrainz\.(org|eu)/.*/.*/edit/
// @exclude       /^https://(.*\.)?musicbrainz\.(org|eu)/cdtoc/.*/.*/
// @exclude       /^https://(.*\.)?musicbrainz\.(org|eu)/collection/.*/.*/
// @exclude       /^https://(.*\.)?musicbrainz\.(org|eu)/release-group/.*/.*/
// @exclude       /^https://(.*\.)?musicbrainz\.(org|eu)/series/.*/.*/
// @grant         GM.xmlHttpRequest
// @connect       127.0.0.1
// @inject-into   content
// @noframes
// @homepage      https://github.com/phw/musicbrainz-magic-tagger-button
// @homepageURL   https://github.com/phw/musicbrainz-magic-tagger-button
// @downloadURL https://update.greasyfork.org/scripts/422670/MusicBrainz%20Magic%20Tagger%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/422670/MusicBrainz%20Magic%20Tagger%20Button.meta.js
// ==/UserScript==

// You can change the default port below if you have running Picard on a
// different port then the default 8000.
const TAGGER_DEFAULT_PORT = 8000

// As Picard can end up running on a higher port if the configured port is in
// use, this script probes a range of ports up to TAGGER_MAX_PORT. You can
// lower this value or even set it to TAGGER_DEFAULT_PORT to reduce the amount
// of probing requests.
const TAGGER_MAX_PORT = 8010

// Usually Picard will listen on your local device only. You might want to
// set this to a different IP address in your local network if Picard is
// running on a different computer then your browser.
const TAGGER_HOST = '127.0.0.1'

// MusicBrainz Magic Tagger Button - Copyright (c) 2021-2025 Philipp Wolfer
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const TAGGER_ERROR_MESSAGE = 'Loading this release or recording into MusicBrainz Picard failed.\nPlease make sure Picard is running and the browser integration is activated.'
const TAGGER_ICON_SUCCESS = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAANCAMAAAADg7fkAAAAUVBMVEUAAAAzMzM/OzxDQ0NMSUpVVlhaV1hmZmZ2c3R7fHWEhX2Nj4WXmIyZmZmfoaShopOqq5isq6uvmv+zs566ubnDw6fMy6zMzMzW1dXj4+P///9p+Ql3AAAAhElEQVQoz42RUQ+CMAyEe0NBx+aGYNX9/x9qRyFkL9h7uDTdl+aWo1I1Ofov4T6XLrB/nquSEZ7ZQt4ws4lcMId+XEnSzWa0G20rlxMe13En62trOggJ9rHEoSXXUzodpEsZEcFwU3JmHzSnJjsOtznLhGz7uxSE+8tGlm8PW0eit6H3H3qWGo9r6lL+AAAAAElFTkSuQmCC'
const TAGGER_ICON_ERROR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAANCAMAAAADg7fkAAAAUVBMVEUAAAAzMzM/OzxDQ0NMSUpVVlhaV1hmZmZ2c3R7fHWEhX2Nj4WXmIyZmZmfoaShopOqq5isq6uzs566ubnDw6fMy6zMzMzW1dXj4+P/Zmb///8r7DMeAAAAh0lEQVQoz42RyQ6DMAxEM0BpCUkJi2mT///QJpgIq4fWI3k5PI3GsklFc2P+K3OvrnVk428V0sMSacgHFlKRKxbXjyeZ0xzFLV5bmU2Y8LyNJ8llvttBgqxP/l49o/Bk8vKcAjyc9BRehreaM1gncwqu4nz7jKC7PT8Iw6Yj07uH7kdZu+LvH+KRIrjjFXuTAAAAAElFTkSuQmCC'

function logger (level, ...args) {
  if (!console) {
    return
  }

  let func = console.log
  if (level && typeof console[level] === 'function') {
    func = console[level]
  }

  func('[Magic Tagger Button]', ...args)
}

const debug = (...args) => logger('debug', ...args)
const log = (...args) => logger('log', ...args)
const warn = (...args) => logger('warn', ...args)
const error = (...args) => logger('error', ...args)

let xmlHttpRequest
if (typeof (GM) !== 'undefined' && GM.xmlHttpRequest) {
  debug('Using GM.xmlHttpRequest')
  xmlHttpRequest = GM.xmlHttpRequest
} else {
  debug('Using XMLHttpRequest')
  xmlHttpRequest = function xmlHttpRequest (details) {
    const xhr = new XMLHttpRequest()
    xhr.timeout = details.timeout || 0
    xhr.open(details.method, details.url)
    xhr.onload = details.onload.bind(null, xhr)
    xhr.onerror = details.onerror.bind(null, xhr)
    xhr.send()
  }
}

function makeRequest (method, url) {
  return new Promise((resolve, reject) => {
    const successHandler = (response) => {
      resolve({
        method,
        url,
        status: response.status,
        statusText: response.statusText,
        responseText: response.responseText,
      })
    }
    const errorHandler = (response) => {
      const msg = `Request failed ${method} ${url}: ${response.status} ${response.statusText}`
      reject(new Error(msg))
    }
    xmlHttpRequest({
      method,
      url,
      timeout: 200,
      onload: successHandler,
      onerror: errorHandler,
      ontimeout: errorHandler,
    })
  })
}

async function probeTagger (port) {
  try {
    const response = await makeRequest('GET', `http://${TAGGER_HOST}:${port}`)
    debug(response)
    const text = response.responseText || ''
    return text.match(/MusicBrainz-Picard/) || text.match(/Nothing to see here/)
  } catch (reason) {
    debug(reason)
    return false
  }
}

async function detectTaggerPort () {
  for (let port = TAGGER_DEFAULT_PORT; port <= TAGGER_MAX_PORT; port++) {
    debug(`Probing port ${port}`)
    if (await probeTagger(port)) {
      return port
    }
  }
}

function allTaggerButtons () {
  return document.querySelectorAll('a.tagger-icon')
}

function findTaggerButton () {
  const button = document.querySelector('a.tagger-icon')
  if (button && button.href) {
    const url = new URL(button.href)
    return {
      protocol: url.protocol,
      host: url.host,
      port: parseInt(url.port, 10)
    }
  }
}

function setTaggerButtonStatus (button, icon, title) {
  button.setAttribute('title', title)
  const img = button.getElementsByTagName('img')[0]
  img.setAttribute('src', icon)
}

function improveTaggerButtons () {
  for (const button of allTaggerButtons()) {
    const newButton = button.cloneNode(true)
    button.parentNode.replaceChild(newButton, button)
    newButton.addEventListener('click', async (event) => {
      event.preventDefault()
      try {
        const url = new URL(newButton.href)
        url.host = TAGGER_HOST
        debug('Tagger button clicked', url)
        const response = await makeRequest('GET', url)
        if (response.status >= 200 && response.status < 400) {
          debug('Tagger request successful', response.responseText)
          setTaggerButtonStatus(newButton, TAGGER_ICON_SUCCESS, response.responseText)
        } else {
          error('Tagger request was answered with an error', response)
          setTaggerButtonStatus(newButton, TAGGER_ICON_ERROR, TAGGER_ERROR_MESSAGE)
        }
      } catch (reason) {
        error('Tagger request error', reason)
        setTaggerButtonStatus(newButton, TAGGER_ICON_ERROR, TAGGER_ERROR_MESSAGE)
      }
    })
  }
}

function hideAllTaggerButtons () {
  for (const button of allTaggerButtons()) {
    button.style.display = 'none'
  }
}

function findCurrentlyUsedTaggerPort () {
  const url = new URL(document.location.href)
  const tport = parseInt(url.searchParams.get('tport'), 10)
  if (tport) {
    return tport
  }

  const taggerInfo = findTaggerButton()
  if (taggerInfo) {
    return taggerInfo.port
  }
}

function getCurrentUrlWithPort (port) {
  const url = new URL(document.location.href)
  url.searchParams.set('tport', port)
  return url
}

function reloadWithTaggerPort (port) {
  document.location.href = getCurrentUrlWithPort(port)
}

async function disableTaggerButtons () {
  hideAllTaggerButtons()
  // Perform a request in the background to clear the tport from session
  const url = getCurrentUrlWithPort(0)
  url.pathname = '/'
  try {
    await makeRequest('GET', url)
  } catch (reason) {
    warn(reason)
  }
}

function checkCurrentPageExcluded () {
  const url = new URL(document.location.href)

  // Special handling for search pages
  if (url.pathname === '/search' && !['release', 'recording'].includes(url.searchParams.get('type'))) {
    debug(`No tagger buttons on ${url.searchParams.get('type')} search page.`)
    return true
  }

  return false
}

async function run () {
  if (checkCurrentPageExcluded()) {
    return
  }

  log('Initializing MusicBrainz Magic Tagger Button!')

  const currentPort = findCurrentlyUsedTaggerPort()
  if (currentPort) {
    improveTaggerButtons()

    if (await probeTagger(currentPort)) {
      log(`Tagger button configured for port ${currentPort}.`)
      return
    }
  }

  const taggerPort = await detectTaggerPort()
  if (taggerPort) {
    log(`Found Picard listening on port ${taggerPort}.`)
    if (currentPort !== taggerPort) {
      log(`Reloading to activate tagger button on port ${taggerPort}...`)
      reloadWithTaggerPort(taggerPort)
    } else {
      debug('Tagger button already active')
    }
  } else {
    log('Could not find Picard listening for tagger button')
    if (currentPort) {
      debug('Disable tagger buttons')
      await disableTaggerButtons()
    }
  }
}

window.addEventListener('load', run, false)
