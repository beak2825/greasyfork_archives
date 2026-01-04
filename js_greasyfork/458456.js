// ==UserScript==
// @name            Twitch Ad Fix
// @description     Code author: https://openuserjs.org/scripts/beypazarigurusu/Twitch_Ad_Fix
// @contribution    URL https://ko-fi.com/beypazari
// @version         2.0.1
// @author          beypazarigurusu
// @license         MIT
// @match           https://*.twitch.tv/*
// @grant           none
// @run-at          document-start
// @icon            https://www.google.com/s2/favicons?domain=twitch.tv
// @namespace https://greasyfork.org/users/925014
// @downloadURL https://update.greasyfork.org/scripts/458456/Twitch%20Ad%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/458456/Twitch%20Ad%20Fix.meta.js
// ==/UserScript==

(function () {
  'use strict'

  function setGlobals(scope) {
    scope.TAG = '[Twitch Ad Fix]'
    scope.POTATO = 'aHR0cHM6Ly90d2l0Y2gzMS5iZXlwYXphcmlndXJ1c3Uud29ya2Vycy5kZXY='
  }
  setGlobals(window)
  const _Worker = window.Worker
  window.Worker = class Worker extends _Worker {
    constructor(twitchBlobUrl) {
      const jsUrl = getWasmWorkerUrl(twitchBlobUrl)
      if (typeof jsUrl !== 'string' || !jsUrl.startsWith('http')) {
        // Otherwise conflicts with unblocked VODS
        super(twitchBlobUrl)
        return
      }
      const newBlobStr = `
        ${setGlobals.toString()}
        ${overrideWorkerFetch.toString()}
        setGlobals(self)
        overrideWorkerFetch()
        importScripts('${jsUrl}')
      `
      super(URL.createObjectURL(new Blob([newBlobStr])))
    }
  }

  function getWasmWorkerUrl(twitchBlobUrl) {
    const req = new XMLHttpRequest()
    req.open('GET', twitchBlobUrl, false)
    req.send()
    return req.responseText.split("'")[1]
  }

  function overrideWorkerFetch() {
    const origFetch = fetch
    fetch = async function (url, options) {
      if (typeof url === 'string' && !url.includes('picture-by-picture')) {
        const match = /\/(hls|vod)\/(.+?)$/.exec(url)
        if (match !== null && match.length === 3) {
          const [_, type, path] = match
          const newUrl = `${atob(POTATO)}/${type}/${encodeURIComponent(path)}`
          const res = await origFetch(newUrl, {
            headers: {
              'x-twitch-twilight-player': true
            }
          }).catch(() => ({
            status: 500
          }))
          if (res.status === 200) {
            console.debug(TAG, 'Success.')
            return res
          }
          console.debug(TAG, 'Fallback to original fetch.', url)
        }
      }
      return origFetch.apply(this, arguments)
    }
  }

  function overrideFetch() {
    const origFetch = window.fetch
    window.fetch = function (url, options) {
      if (typeof url === 'string' && url.includes('gql')) {
        if (typeof options.headers['X-Device-Id'] === 'string') {
          options.headers['X-Device-Id'] = 'twitch-web-wall-mason';
        }
        if (typeof options.headers['Device-ID'] === 'string') {
          options.headers['Device-ID'] = 'twitch-web-wall-mason';
        }
      }
      return origFetch.apply(this, arguments);
    }
  }
  overrideFetch()
})()
