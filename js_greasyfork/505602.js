// ==UserScript==
// @name         4chan F4GG0T Thread Hider
// @namespace    http://tampermonkey.net/
// @version      1.0.0.3
// @description  A script will automatically hides threads and table rows on 4chan when the thread title or teaser contains gay shits
// @author       L-813
// @match        *://boards.4chan.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505602/4chan%20F4GG0T%20Thread%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/505602/4chan%20F4GG0T%20Thread%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

     const keywords = [
        'trap',
        'faggots',
        'faggot',
        'traps',
        'tranny',
        'trannies',
        'gay',
        'femboi',
        'White Boys',
        'femboys',
        "femb0i",
        "femb0i",
        'fembois',
        'twinks',
        'Femboys',
        'femboys',
        'famboys',
        'solo male',
        'gay',
        'tribute',
        'f4ggot',
        'f4gg0t',
        'rekt',
        'thug',
        'male',
        'trans',
        'Femboys',
        'femboys',
        'Daisy Taylor',
        'asexuel',
        'aromantique',
        'demisexual',
        'queerplatonic',
        'polysexuel',
        'gender non-conforming',
        'gender expansive',
        'agender',
        'bigender',
        'transmasculin',
        'transféminin',
        'genderfluid',
        'Trans',
        'termes de la culture LGBTQ+',
        'glitter',
        'gay thread',
        'queerbaiting',
        'allyship',
        'leather',
        'leatherdyke',
        'bear culture',
        'radical faeries',
        'chosen family',
        'queer community',
        'pride parade',
        'drag culture',
        'snatched',
        'femboy',
        'muscle bear',
        'brat',
        'balls',
        'Trannies',
        'kinkster',
        'biromantique',
        'demiromantique',
        'LGBT studies',
        'RuPaul',
        'Marsha P. Johnson',
        'futa',
        'Sylvia Rivera',
        'Harvey Milk',
        'Salazar',
        'Ellen DeGeneres',
        'Billy Porter',
        'Laverne Cox',
        'Frank O\'Hara',
        'black boy',
        'black boi',
        'black boi',
        'boi',
        'ballbusting',
        'gay',
        'whitebois',
        'blackbois',
        'chosen family',
        'coming out',
        'thug',
        'Bucks',
        'buck',
        'Buck',
        ' tranny',
        'love is love',
        'queerness',
        'shemales',
         'shemale',
         'shem4le',
         'sh3m4le',
         'Shemales',
         'Shemale',
         'Shemaless',
       ]

function hideThreads() {
    const threads = document.querySelectorAll('.thread')

    threads.forEach((thread) => {
        let shouldHideThread = false
        const flaggedKeywords = []

        const threadTitleElement = thread.querySelector('.teaser')
        let threadTitle = threadTitleElement
            ? threadTitleElement.innerText.toLowerCase()
            : ''

        const subjectElement = thread.querySelector('.subject')
        let subjectText = subjectElement
            ? subjectElement.innerText.toLowerCase()
            : ''

        const messageElement = thread.querySelector('.postMessage')
        let messageText = messageElement
            ? messageElement.innerText.toLowerCase()
            : ''

        let combinedText =
            threadTitle + ' ' + subjectText + ' ' + messageText

        keywords.forEach((keyword) => {
            const keywordLower = keyword.toLowerCase().trim()
            const regex = new RegExp(`\\b${keywordLower}\\b`, 'i')
            const noKeywordRegex = new RegExp(`\\bno\\s+${keywordLower}\\b`, 'i')

            if (regex.test(combinedText) && !noKeywordRegex.test(combinedText)) {
                shouldHideThread = true
                flaggedKeywords.push(keyword)
            }
        })

        if (shouldHideThread) {
            console.log('Thread Hidden:', combinedText)
            console.log('Flagged Keywords:', flaggedKeywords.join(', '))
            thread.remove()
        }
    })
}

function hideTableRows() {
    const rows = document.querySelectorAll('#arc-list tbody tr')

    rows.forEach((row) => {
        const teaserCol = row.querySelector('.teaser-col')
        let teaserText = teaserCol ? teaserCol.innerText.toLowerCase() : ''

        const shouldHideRow = keywords.some((keyword) => {
            const keywordLower = keyword.toLowerCase().trim()
            const regex = new RegExp(`\\b${keywordLower}\\b`, 'i')
            const noKeywordRegex = new RegExp(`\\bno\\s+${keywordLower}\\b`, 'i')

            return regex.test(teaserText) && !noKeywordRegex.test(teaserText)
        })

        if (shouldHideRow) {
            console.log('Row Hidden:', teaserText)
            row.remove()
        }
    })
}

hideThreads()
hideTableRows()

const observer = new MutationObserver(() => {
    hideThreads()
    hideTableRows()
})

observer.observe(document.body, { childList: true, subtree: true })

})();