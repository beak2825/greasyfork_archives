// ==UserScript==
// @name         GoToNextPage
// @namespace    com.gmail.fujifruity.greasemonkey
// @version      0.7
// @description  A shortcut (ctrl+alt+n) to next-button of pagination. google.com and amazon.com are tested.
// @author       fujifruity
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437283/GoToNextPage.user.js
// @updateURL https://update.greasyfork.org/scripts/437283/GoToNextPage.meta.js
// ==/UserScript==

{
    'use strict';

    // Keywords to filter buttons.
    const keywords = [
        'next', 'Next','NEXT', '>',
        '次', 'つぎ', '＞'
    ]
    window.addEventListener('keydown', event => {
        if (["INPUT", "TEXTAREA"].includes(event.target.tagName)) return
        if (event.key != 'n' || !event.altKey || !event.ctrlKey) return

        const queries = [
            '[role*="navigation"]',
            '[role*="pagination"]',
            '[role*="pagenation"]',
            '[class*="navigation"]',
            '[class*="pagination"]',
            '[class*="pagenation"]',
            '[class*="pager"]'].join(',')
        const paginations = [...document.querySelectorAll(queries)]
        console.log('paginations', paginations)

        const nextButtons = paginations.map(pg => {
            const descendants = [...pg.querySelectorAll('*')]
            return descendants.reverse().find(e =>
                // is visible
                e.offsetParent != null
                // and has any keyword
                && keywords.some(keyword =>
                                 e.innerText?.includes(keyword)
                                 || e.getAttribute('aria-label')?.includes(keyword) )
            )
        })
        console.log('nextButtons', nextButtons)

        // Click them all.
        nextButtons.forEach(e => e?.click())

        // If it did not work, click the first clickable descendant.
        nextButtons.forEach(e => {
            const isClickable = e => e.tagName == 'A' || e.getAttribute('onclick')
            const clickable = [...e.querySelectorAll('*')].find(isClickable)
            console.log('clickable', clickable)
            clickable.click()
        })
    })
}
