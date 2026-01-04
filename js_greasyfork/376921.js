// ==UserScript==
// @name         RoyalRoad Bookmark Enhance
// @namespace    https://fugi.tech
// @version      1.1
// @description  Adds an unread counter and "continue reading" button to your bookmarks
// @match        https://www.royalroad.com/my/bookmarks*
// @downloadURL https://update.greasyfork.org/scripts/376921/RoyalRoad%20Bookmark%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/376921/RoyalRoad%20Bookmark%20Enhance.meta.js
// ==/UserScript==

(function() {
    'use strict';

if (!document.querySelector('#fugi-style')) {
  let dark = Array.from(document.querySelectorAll('link[type="text/css"')).some(e => e.href.startsWith('https://www.royalroad.com/Content/Themes/Bootstrap/Site-dark.css'))
  let style = document.createElement('style')
  style.id = 'fugi-style'
  style.type = 'text/css'
  style.append(`
    .fugi-unread {
      display: inline-block;
      width: 21px;
      margin-right: 6px;
      border-radius: 50% !important;
      vertical-align: top;

      color: ${dark ? 'black' : 'white'} !important;
      background: ${dark ? '#c2a970' : '#e26a6a'};
      font-size: 13px;
      line-height: 21px;
      text-align: center;
    }
  `)
  document.head.appendChild(style)
}

Array.from(document.querySelectorAll('#result .fiction-title a')).forEach(async e => {
  let r = await fetch(e.href)
  let html = await r.text()
  let p = new DOMParser()
  let dom = p.parseFromString(html, 'text/html')

  // Add unread chapter badge
  let chapters = Array.from(dom.querySelectorAll('#chapters tbody tr'))
  let unread =
    chapters.length -
    1 -
    chapters.findIndex(ee => {
      return !!ee.querySelector('i[data-original-title="Reading Progress"]')
    })
  let oldCounter = e.querySelector('.fugi-unread')
  if (oldCounter) oldCounter.remove()
  if (unread > 0) {
    let u = document.createElement('span')
    u.className = 'fugi-unread red-sunglo'
    u.append(unread)
    e.prepend(u)
  }

  // Add "Continue Reading" button
  let button = dom.querySelector('.fiction-page .fic-header .fic-buttons a')
  button.className = 'btn btn-primary margin-bottom-5 fugi-button'
  let buttons = e.parentNode.parentNode.lastElementChild
  let oldButton = buttons.querySelector('.fugi-button')
  if (oldButton) oldButton.remove()
  buttons.prepend(button)
})

})();