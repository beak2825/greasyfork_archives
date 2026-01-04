// @ts-check
// ==UserScript==
// @name         梁董的愛
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Hi, How are you?
// @author       hilezir
// @match        https://www1.pinnacle.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      127.0.0.1
// @connect      localhost
// @connect      www.googletagmanager.com
// @connect      www.google-analytics.com
// @connect      cdn.jsdelivr.net
// @connect      cdnjs.cloudflare.com
// @downloadURL https://update.greasyfork.org/scripts/409885/%E6%A2%81%E8%91%A3%E7%9A%84%E6%84%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/409885/%E6%A2%81%E8%91%A3%E7%9A%84%E6%84%9B.meta.js
// ==/UserScript==

const version = 'v1.2.0'

addScript({
  id: 'main_output',
  url: `https://cdn.jsdelivr.net/gh/hilezir/oh-my-bets@${version}/dist/index.js`,
  // url: `http://localhost:1234/index.js`,
})

addScript({
  id: 'GTM',
  url: 'https://www.googletagmanager.com/ns.html?id=GTM-W5FVVNP',
})

// addScript({
//   id: 'gtag',
//   url: 'https://www.googletagmanager.com/gtag/js?id=G-1T8V9CBKZD',
// })

function addScript(
  /** @type {{ id?: string, url: string }} */
  props,
) {
  const randomKey = Math.random().toString(36).slice(2)
  const script = document.createElement('script')
  script.src = `https://cdn.jsdelivr.net/gh/hilezir/oh-my-bets@${version}/lib/bundle.esm.js`
  script.id =
    (props.id && `__HRU__module-${props.id}`) || '__HRU__module-' + randomKey
  script.async = true

  document.querySelector('body')?.appendChild(script)
}

window['dataLayer'] = window['dataLayer'] || []
function gtag() {
  window['dataLayer']?.push(arguments)
}
gtag('js', new Date())

gtag('config', 'G-1T8V9CBKZD')
