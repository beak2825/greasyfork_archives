// ==UserScript==
// @name         NovelUpdates Series Add Syosetsu Search Link
// @namespace    alee.syosetsu-search-novelupdates-series
// @version      0.2
// @description  Add a link that does a Google search for the syosetsu for the series
// @author       Aarron Lee
// @license      GNU AGPLv3
// @match        https://www.novelupdates.com/series/*
// @grant        None
// @downloadURL https://update.greasyfork.org/scripts/539458/NovelUpdates%20Series%20Add%20Syosetsu%20Search%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/539458/NovelUpdates%20Series%20Add%20Syosetsu%20Search%20Link.meta.js
// ==/UserScript==


setTimeout(() => {
  document.querySelectorAll('#editassociated').forEach(n => {

    const titles = n.innerHTML.split('<br>')

    let links = ''

    titles.forEach(title => {
      console.log(title, containsJapanese(title))

      if(containsJapanese(title)) {
        const searchStr = `${title} syosetsu`
        links += `${''}<a target='_blank' rel='noopener noreferrer' href='https://www.google.com/search?q=${encodeURIComponent(searchStr)}'>${title}</a><br>`
      }
    })

    if(links.length > 0) {
      n.innerHTML = `${n.innerHTML} <br><br><div><h4>Syosetsu Search</h4>${links}</div>`
    }
  })

}, 0)


function containsJapanese(str) {
  // \p{Script=Hiragana} matches Hiragana characters
  // \p{Script=Katakana} matches Katakana characters
  // \p{Script=Han} matches Han (Chinese/Japanese/Korean) characters (Kanji)
  // The 'u' flag is essential for Unicode property escapes to work.
  const japaneseRegex = /\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Han}/u;

  return japaneseRegex.test(str);
}