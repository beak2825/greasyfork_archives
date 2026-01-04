// ==UserScript==
// @name         Pocket - open all saves in new tab
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds a button to open all saves in new tab, also removes all `?utm_source=*` from url
// @author       FallenMax
// @match        https://getpocket.com/saves
// @match        https://getpocket.com/*/saves
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485279/Pocket%20-%20open%20all%20saves%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/485279/Pocket%20-%20open%20all%20saves%20in%20new%20tab.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    await new Promise(resolve => setTimeout(resolve, 3000))

    const openAllLinks = () =>{
        const items = document.querySelectorAll('article[data-testid=article-card]')
        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            const link = item.querySelector('a.publisher')
            const url = new URL(link.href)
            url.searchParams.delete('utm_source')
            link.href = url.href
            link.target = '_blank'
            link.click()
        }
    }

    let $sort = document.querySelector('button[data-testid="sort-options"]')
    let count=0
    while (!$sort) {
      if(count++>20) throw new Error('button not found')
      await new Promise(resolve => setTimeout(resolve, 1000))
      $sort = document.querySelector('button[data-testid="sort-options"]')
    }
    let $openAll = document.createElement('button')

    $openAll.textContent = 'Open All'
    $openAll.className = 'tiny'

    $sort.insertAdjacentElement('afterend', $openAll)

    $openAll.onclick = openAllLinks


})();