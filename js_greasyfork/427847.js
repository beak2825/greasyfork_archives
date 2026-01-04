// ==UserScript==
// @name         CORS-via-GM
// @description  CORS via Greasemonkey/Tampermonkey
// @version      1.0
// @include      /^(file:///.*/index.html|https?://127.0.0.1(:\d+)?/)(bundled/)?(index.html)?(\?.*|$)/
// @include      /\b(pages\.dev|onrender\.com)\b/
// @connect      *
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/782600
// @downloadURL https://update.greasyfork.org/scripts/427847/CORS-via-GM.user.js
// @updateURL https://update.greasyfork.org/scripts/427847/CORS-via-GM.meta.js
// ==/UserScript==

/**
 * @usage
     ```
     CORSViaGM.init(window)
     fetch('https://example.com')
     ```
 * @usage [Example]
     ```
     window.onload = () => { setTimeout(() => { CORSViaGM.init(window) }, 50) }
     fetch('https://example.com')
     ```
 * @usage [Optional]
     If you want to `await window._CORSViaGM.inited`, add the following elements to the <head> of your index.html:
     ```
     <script>
       window._CORSViaGM = (inited => ({ inited: Object.assign(new Promise(r => inited = r), { done: inited }) }))()
     </script>
     ```
 */


const CORSViaGM = document.body.appendChild(Object.assign(document.createElement('div'), { id: 'CORSViaGM' }))

addEventListener('fetchViaGM', e => GM_fetch(e.detail.forwardingFetch))

CORSViaGM.init = function (window) {
  if(!window) throw 'The `window` parameter must be passed in!'
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


function GM_fetch (p) {
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