// ==UserScript==
// @name         CORS-via-GM
// @description  CORS via Greasemonkey/Tampermonkey
// @version      1.01
// @include      /^(file:///.*/index.html|https?://(127.0.0.1|192.168.\d+.\d+|localhost)(:\d+)?/(([^/]*/)?bundled/)?(index.html)?)(\?.*|$)/
// @include      /\b(pages\.dev|onrender\.com)\b/
// @include      /\b(?:github.io|gitlab.io|glitch.me|js.org|eu.org|web.app|netlify.(?:com|app)|now.sh|vercel.(?:com|app)|herokuapp.com|neocities.org)/
// @connect      *
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/users/882700
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/440890/CORS-via-GM.user.js
// @updateURL https://update.greasyfork.org/scripts/440890/CORS-via-GM.meta.js
// ==/UserScript==


const CORSViaGM = document.body.appendChild(Object.assign(document.createElement('div'), { id: 'CORSViaGM' }))

addEventListener('fetchViaGM', e => GM_fetch(e.detail.forwardingFetch))

CORSViaGM.init = function (window) {
  if (!window) throw 'The `window` parameter must be passed in!'
  window.fetch = window.fetchViaGM = fetchViaGM.bind(window)

  // Support for service worker
  window.forwardingFetch = new BroadcastChannel('forwardingFetch')
  window.forwardingFetch.onmessage = async e => {
    const req = e.data
    const { url } = req
    const res = await fetchViaGM(url, req)
    const response = await res.blob()
    window.forwardingFetch.postMessage({ type: 'fetchResponse', url, response })
  }

  window._CORSViaGM && window._CORSViaGM.inited.done()

  const info = '🙉 CORS-via-GM initiated!'
  console.info(info)
  return info
}


function GM_fetch(p) {
  GM_xmlhttpRequest({
    ...p.init,
    url: p.url, method: p.init.method || 'GET',
    onload: responseDetails => p.res(new Response(responseDetails.response, responseDetails))
  })
}

function fetchViaGM(url, init) {
  let _r
  const p = new Promise(r => _r = r)
  p.res = _r
  p.url = url
  p.init = init || {}
  dispatchEvent(new CustomEvent('fetchViaGM', { detail: { forwardingFetch: p } }))
  return p
}