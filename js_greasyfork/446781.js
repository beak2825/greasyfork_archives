// ==UserScript==
// @name         AnkiWeb MathJax
// @description  Adds MathJax support to the web version of Anki
// @namespace    https://giuseppe.eletto.me
// @author       Giuseppe Eletto
// @version      0.3.1
// @license      MIT
// @match        https://ankiuser.net/study/
// @downloadURL https://update.greasyfork.org/scripts/446781/AnkiWeb%20MathJax.user.js
// @updateURL https://update.greasyfork.org/scripts/446781/AnkiWeb%20MathJax.meta.js
// ==/UserScript==

(function() {
    // Constants
    const MATHJAX_CDN = 'https://cdn.jsdelivr.net/npm/mathjax@3'
    const ANKI_QA_BOX = document.querySelector('div#qa_box > div#qa')
    const ANKI_QA_OBS = new MutationObserver(l => {
        const lastMutation = l[l.length - 1]
        const textNodes = Array.from(lastMutation.addedNodes)
            .filter(n => n.nodeType === 3)

        if (textNodes.length === 0) return
        unsafeWindow.MathJax.typesetPromise()
    })

    // CUSTOM CSS
    ANKI_QA_BOX.style.textAlign = 'justify'

    // Setup custom MathJax configurations
    unsafeWindow.MathJax = {
        chtml: {
            fontURL: `${MATHJAX_CDN}/output/chtml/fonts/woff-v2`
        },
        startup: {
            typeset: true,
            elements: [ANKI_QA_BOX],
            ready: () => {
                // Start watching for "Q&A" div changes
                ANKI_QA_OBS.observe(ANKI_QA_BOX, { subtree: false, childList: true })

                // Continues MathJax startup
                return unsafeWindow.MathJax.startup.defaultReady()
            }
        }
    }

    // Append and load MathJax script
    const mathJaxChtml = document.createElement('script')
    mathJaxChtml.src = `${MATHJAX_CDN}/tex-mml-chtml.js`
    document.body.appendChild(mathJaxChtml)
})()