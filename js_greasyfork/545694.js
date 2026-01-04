// ==UserScript==
// @name         dexterITY
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  You filthy dex whore
// @author       neth [3564828]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545694/dexterITY.user.js
// @updateURL https://update.greasyfork.org/scripts/545694/dexterITY.meta.js
// ==/UserScript==

(function() {
    'use strict'

    const imageUrl = 'https://i.imgur.com/Fix9Kxv.png'
    const regex = /dexter/gi

    function replaceTextWithImage(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (regex.test(node.nodeValue)) {
                const frag = document.createDocumentFragment()
                const parts = node.nodeValue.split(regex)
                const matches = node.nodeValue.match(regex) || []

                parts.forEach((part, index) => {
                    frag.appendChild(document.createTextNode(part))
                    if (index < matches.length) {
                        const img = document.createElement('img')
                        img.src = imageUrl
                        img.alt = matches[index]
                        img.style.display = 'inline'
                        img.style.height = '2em'
                        img.style.verticalAlign = 'middle'
                        frag.appendChild(img)
                    }
                })

                node.parentNode.replaceChild(frag, node)
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE' && node.nodeName !== 'TEXTAREA') {
            Array.from(node.childNodes).forEach(replaceTextWithImage)
        }
    }

    replaceTextWithImage(document.body)

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(replaceTextWithImage)
        }
    })
    observer.observe(document.body, { childList: true, subtree: true })
})()