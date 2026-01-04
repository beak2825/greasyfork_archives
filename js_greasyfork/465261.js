// ==UserScript==
// @name         CORS-via-GM
// @description  CORS via Greasemonkey/Tampermonkey
// @version      2.0
// @include      /^(file:///.*/index.html|https?://(127.0.0.1|192.168.\d+.\d+|localhost)(:\d+)?/(([^/]*/)?bundled/)?(index.html)?)(\?.*|$)/
// @include      /\b(pages\.dev|onrender\.com)\b/
// @include      /\b(?:github.io|gitlab.io|glitch.me|js.org|eu.org|web.app|netlify.(?:com|app)|now.sh|vercel.(?:com|app)|herokuapp.com|neocities.org)/
// @include      /https?://\w+?fork\.org/
// @connect      *
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/users/882700
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/465261/CORS-via-GM.user.js
// @updateURL https://update.greasyfork.org/scripts/465261/CORS-via-GM.meta.js
// ==/UserScript==


const CORSViaGM = document.body.appendChild(Object.assign(document.createElement('div'), { id: 'CORSViaGM' }))

addEventListener('fetchViaGM', e => GM_fetch(e.detail.forwardingFetch))

CORSViaGM.init = function (window = unsafeWindow) {
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
    url: p.url,
    method: p.init.method || 'GET',
    data: p.body,
    responseType: 'blob', // !!important
    onload: responseDetails => p.res(new Response(
      responseDetails.response,
      {
        status: responseDetails.status,
        statusText: responseDetails.statusText,
        headers: convertHeaders(responseDetails.responseHeaders)
      }
    ))
  })
}

function fetchViaGM(url, init) {
  let res
  const p = new Promise(r => res = r)
  p.res = res
  p.url = url
  p.init = init || {}
  dispatchEvent(new CustomEvent('fetchViaGM', { detail: { forwardingFetch: p } }))
  return p
}


function convertHeaders(string) {
  return JSON.parse(`{${string.trim().split(/(?:\r?\n(?!(?:.(?!: ))+\r?\n))+/).map(_ => _.replaceAll('"', '\\"').replace(/[\r\n]/g, '; ').replace(/^(.+?):\s*(.+)/s, '"$1": "$2"')).join(',\n')}}`)
}