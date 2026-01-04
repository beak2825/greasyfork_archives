// ==UserScript==
// @name         Double Click
// @namespace    derjoker
// @version      0.1.3
// @description  Double Click to Lookup in Online Dictionary
// @author       Feng Ya
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434539/Double%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/434539/Double%20Click.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  // Your code here...
  console.log('Double Click v' + GM_info.script.version)

  const engines = {
    en: 'https://www.merriam-webster.com/dictionary/',
    de: 'https://www.duden.de/suchen/dudenonline/'
  }

  const htmlLang = document.querySelector('html').lang.slice(0, 2)

  window.addEventListener('dblclick', event => {
    console.log(event.path)
    console.log(event.path.map(node => node.lang))
    const langs = event.path.map(node => node.lang)
      .filter(lang => Boolean(lang))
      .map(lang => lang.slice(0, 2))
    const lang = htmlLang === 'en' ? langs[0] : htmlLang
    const engine = engines[lang] || engines.en

    const selection =
      window.getSelection() ||
      document.getSelection() ||
      document.selection.createRange()
    const link = engine + selection
    console.log(link)
    window.open(link)
  })
})()
