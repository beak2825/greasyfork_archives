// ==UserScript==
// @name         Migaku Memory Card Exporter
// @namespace    http://kurifuri.com/
// @version      2024-12-28
// @description  Rough script for exporting cards from Migaku.  Emphasis on rough.
// @author       Christopher Fritz
// @match        https://study.migaku.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=migaku.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522063/Migaku%20Memory%20Card%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/522063/Migaku%20Memory%20Card%20Exporter.meta.js
// ==/UserScript==

// Step 1: Install and enable this script.
// Step 2: Browse to study.migaku.com
// Step 3: Click on the collection icon (four tiles in a square)
// Step 4: Click oin the deck you want to export.
// Step 5: Click on the first card in the deck.
// Step 6: Click on the "Read card and move to next" button (or press right arrow key).  Repeat until you have cycled
//         through all your cards.  (Did I mention this was a rough script?  Rumor has it you can just hold the right
//         arrow key to cycle through them all, but please be kind to Migaku's servers)
// Step 7: Click on the "Download cards" button to download cards as a JSON file.

(function() {
    'use strict'

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        addReadCardButton()
        addDownloadCardsButton()
    })

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            readCardAndMoveToNext()
        }
    })

    let cards = []

    function styleButton(button) {
        button.style.position = 'fixed'
        button.style.right = '10px'
        button.style.zIndex = 1000
        button.style.padding = '8px'
        button.style.cursor = 'pointer'
        button.style.backgroundColor = '#4CAF50'
        button.style.color = 'white'
        button.style.border = 'none'
        button.style.borderRadius = '4px'

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#45a049'
        })
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#4CAF50'
        })
    }

    function addReadCardButton() {
        const button = document.createElement('button')
        button.textContent = 'Read card and move to next'
        styleButton(button)
        button.style.top = '10px'

        document.body.appendChild(button)
        button.addEventListener('click', readCardAndMoveToNext)
    }

    function addDownloadCardsButton() {
        const button = document.createElement('button')
        button.textContent = 'Download cards'
        styleButton(button)
        button.style.top = '50px'

        button.addEventListener('click', () => {
            const json = JSON.stringify(cards, null, 2)
            const blob = new Blob([json], { type: 'application/json' })
            const a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = 'cards.json'
            a.click() // Simulate a click to trigger the download
            URL.revokeObjectURL(a.href)
        })

        // Add the button to the document body
        document.body.appendChild(button)
    }

    function readCardAndMoveToNext() {
        readCurrentCard()
        loadNextCard()
        updateProgress()
    }

    function updateProgress() {
        const progressDiv = document.getElementById('cardProgress') || createProgressDiv()
        progressDiv.textContent = `Cards processed: ${cards.length}`
    }

    function createProgressDiv() {
        const div = document.createElement('div')
        div.id = 'cardProgress'
        div.style.position = 'fixed'
        div.style.top = '90px'
        div.style.right = '10px'
        div.style.zIndex = 1000
        div.style.padding = '8px'
        div.style.backgroundColor = '#f0f0f0'
        div.style.borderRadius = '4px'
        document.body.appendChild(div)
        return div
    }

    function isDuplicate(newCard) {
        return cards.some(existingCard =>
            existingCard.word === newCard.word &&
            existingCard.sentence === newCard.sentence
        )
    }

    function readCurrentCard() {
        const content = document.querySelector('div.CardDetailsContent__fields')
        if (!content) {
            console.warn('Card content not found')
            return
        }

        const card = {
            word: content.querySelector('.CardWord')?.textContent?.trim(),
            sentence: content.querySelector('.CardSentence')?.textContent?.trim(),
            definitions: content.querySelector('.CardDefinitions')?.textContent?.trim(),
            exampleSentences: content.querySelector('.CardExampleSentences')?.textContent?.trim(),
            notes: content.querySelector('.CardNotes')?.innerHTML?.trim(),
        }

        // Only add card if it has at least some content
        if (Object.values(card).some(val => val) && !isDuplicate(card)) {
            cards.push(card)
        }
    }

    function loadNextCard() {
        const button = document.querySelector('button[title="Next Card"]')
        if (button) {
            button.click()
        } else {
            console.error('Button with title "Next Card" not found')
        }
    }

})()
