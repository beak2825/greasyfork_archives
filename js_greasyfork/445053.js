// ==UserScript==
// @name Block Pornography
// @namespace -
// @version 2.4.0
// @description Automatically stops loading of page and applies blur filter to prevent user from viewing adult content.
// @author NotYou
// @include *
// @match *://*/*
// @exclude *://greasyfork.org/*
// @exclude *://sleazyfork.org/*
// @run-at document-end
// @license GPL-3.0-or-later
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/445053/Block%20Pornography.user.js
// @updateURL https://update.greasyfork.org/scripts/445053/Block%20Pornography.meta.js
// ==/UserScript==

(function() {
    let list = [
        'porno', 'pornografi', 'pornografie', 'pornographie', 'pornografia', 'порно', // Global
        'porn', 'pornography', 'p@rn', 'p0rn', 'p*rn', // English
        'pornografía', // Spanish
        'pornogrāfija', // Latvian
        'pornoqrafiya', // Azerbaijani
        'pornografi', // Danish
        'pornografio', // Esperanto
        'pornograafia', // Estonian
        'pornografiaa', // Finnish
        'pornograpiya', // Filipino
        'pornografiya', // Uzbek
        'πορνογραφία', // Greek
        'ngono', 'ponografia', // Swahili
        'porr', // Swedish
        'pornô', // Portuguese
        'zolaula', // Chichewa
        'ポルノ', // Japanase
        'A片', '色情', // Chinese
        'الإباحية', 'المواد الإباحية', // Arabic
        'فحش', 'فحش نگاری', // Urdu
        'โป๊', 'ภาพอนาจาร', // Thai
        'पॉर्न', 'कामोद्दीपक चित्र', // Hindi
        'अश्लील', 'अश्लील साहित्य', // Nepali
        'порнография', // Russian
        'порнографія', // Ukrainian
        'порна', 'парнаграфія', // Belarusian
        'порнограф', // Mongolian
        'порнографија' // Serbian
    ]

    const TITLE = '503 Service Unavailable'
    const DEBUG = -1

    let debug = function() {}

    if(DEBUG > 0) {
        debug = function() {
            return console.log.apply(this, arguments)
        }
    }

    for (let i = 0; i < list.length; i++) {
        let word = list[i]
        let isAdult = containsWord(document.title, word) || containsWord(document.body.textContent, ' ' + word + ' ')

        debug(word, isAdult)

        if(isAdult) {
            return onAdult()
        }
    }

    function onAdult() {
        let node = document.body || document.querySelector('body')

        document.title = TITLE
        applyFilter(node)
    }

    function applyFilter(node) {
        node.setAttribute('style', (node.getAttribute('style') ?? '') + 'filter: blur(30px);-webkit-filter: blur(30px);-ms-filter: blur(30px);filter: progid: DXImageTransform.Microsoft.Blur(PixelRadius=\'30\');pointer-events: none;')
    }

    function containsWord(str, word) {
        return str.toLowerCase().indexOf(word) != -1
    }
})()
