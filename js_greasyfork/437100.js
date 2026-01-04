// ==UserScript==
// @name         Gladiatus scrolls highlighter
// @namespace    https://kemsan.xyz
// @version      0.1.0
// @description  Gladiatus+
// @author       Kemsan
// @license      MIT
// @match        *://*.gladiatus.gameforge.com/game/index.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437100/Gladiatus%20scrolls%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/437100/Gladiatus%20scrolls%20highlighter.meta.js
// ==/UserScript==
(() => {
  const $ = window.jQuery


  const scrolls = () => {
      const goodScrolls = ['Antonius', 'Gai', 'Gaius', 'Ichorus', 'Lucius', 'Opiehnzas', 'Sebastian', 'Talith', 'Titanius', 'Trafan', 'Vergilius', 'Alleluja', 'Cierpienia', 'Delikatności', 'Dominacji', 'Duchowej', 'Głupoty', 'Miłości', 'Niebios', 'Ognia', 'Piekieł', 'Piekła', 'Pomysłowości', 'Ran', 'Samotności', 'Smoka', 'Sztuk', 'Śmierci', 'Zabójstwa', 'Ziemi', 'Złośliwości', 'Zniszczenia'].map(title => title.toLowerCase())
      // const $scrolls = $('[data-content-type="64"]')
      const $scrolls = $('[data-content-type]')

      $scrolls.each((idx, scroll) => {
        const $scroll = $(scroll)
        const data = $scroll.data('tooltip')
        let [title] = (data && data[0] && data[0][0]) || []
        title = title && title.replace(/Zwój|\s+/g, '').toLowerCase()

        if (goodScrolls.includes(title)) {
            $scroll.css('background-color', 'red')
        }

        goodScrolls.forEach(scroll => {
          if (title.includes(scroll)) {
            $scroll.css('background-color', 'red')
          }
        })
      })

      setTimeout(scrolls, 1000)
  }

  scrolls()
})()