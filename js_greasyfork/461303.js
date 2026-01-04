// ==UserScript==
// @name              GM_CORS
// @name:zh-CN        油猴 CORS 工具
// @description       CORS on test drive via GM_xmlhttpRequest
// @description:zh-CN 在开发环境通过油猴提供 CORS 跨域
// @version           1.04
// @include           /^(file:///.*/index.html|https?://(127.0.0.1|192.168.\d+.\d+|localhost)(:\d+)?/(([^/]*/)?bundled/)?(index.html)?)(\?.*|$)/
// @include           /\b(pages\.dev|onrender\.com)\b/
// @include           /\b(?:github.io|gitlab.io|glitch.me|js.org|eu.org|web.app|netlify.(?:com|app)|now.sh|vercel.(?:com|app)|herokuapp.com|neocities.org|caitou.org)/
// @connect           *
// @require           https://unpkg.com/@trim21/gm-fetch@0.1.12/dist/gm_fetch.js
// @grant             GM_xmlhttpRequest
// @run-at            document-start
// @license           WTFPL
// @namespace         https://greasyfork.org/users/448274
// @downloadURL https://update.greasyfork.org/scripts/461303/GM_CORS.user.js
// @updateURL https://update.greasyfork.org/scripts/461303/GM_CORS.meta.js
// ==/UserScript==

const GmCors = document.body.appendChild(Object.assign(document.createElement('div'), { id: 'GmCors' }))

GmCors.init = function (window) {
  if (!window) throw 'No window specified.'
  window.fetch = GM_fetch
  window.xhr = req => new Promise((resolve, reject) => GM_xmlhttpRequest({
    ...req,
    onload: response => resolve(response),
    onerror: error => reject(error)
  }))

  // for sw
  window.GM_CORS = new BroadcastChannel('GM_CORS')
  window.GM_CORS.onmessage = async e => {
    const { reqType, req } = e
    if (reqType === 'fetch') {
      const response = await GM_fetch(req)
      window.GM_CORS.postMessage(response)
    } else if (reqType === 'xhr') {
      GM_xmlhttpRequest({
        ...req,
         onload: response => window.GM_CORS.postMessage(response)
      })
    }
  }

  window.GmCors = { fetch: window.fetch, xhr: window.xhr };
  console.info('GmCors activated.');
  return window.GmCors;
}