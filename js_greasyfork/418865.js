// ==UserScript==
// @name         SelectAndGo
// @namespace    com.gmail.fujifruity.greasemonkey
// @version      1.3
// @description  Search with selected text by pressing s(Google), t(Translate) or o(Oxford) within 2 seconds.
// @author       fujifruity
// @match        *://*/*
// @grant        GM.openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/418865/SelectAndGo.user.js
// @updateURL https://update.greasyfork.org/scripts/418865/SelectAndGo.meta.js
// ==/UserScript==

{
    const timeoutMs = 2000

    const shortcuts = selection => ({
        s: () => GM.openInTab("https://www.google.com/search?q=" + selection, false),
        t: () => GM.openInTab("https://translate.google.com/#en/ja/" + selection, false),
        i: () => GM.openInTab("https://www.google.com/search?tbm=isch&q=" + selection, false),
        m: () => GM.openInTab("https://www.google.com/maps/search/" + selection, false),
        o: () => {
            const url = "https://www.oxfordlearnersdictionaries.com/search/english/?q="
            // the website requires hyphen-separated words
            const query = selection.replace(/\s+/g, '-')
            GM.openInTab(url + query, false)
        },
        c: () => alert(selection.length + ' characters') // count chars
    })

    const onKeydown = event => {
        if (["INPUT", "TEXTAREA"].includes(event.target.tagName)) return
        if (event.ctrlKey || event.altKey) return
        const selection = window.getSelection().toString()
        shortcuts(selection)[event.key]()
    }

    const unsetShortcut = () => window.removeEventListener('keydown', onKeydown)

    window.addEventListener('selectstart', () => {
        window.addEventListener('keydown', onKeydown)
        // unset shortcuts in seconds.
        window.onmouseup = () => {
            setTimeout(unsetShortcut, timeoutMs)
            window.onmouseup = null
        }
        // unset shortcuts when selection is triggerd by ctrl+a
        window.onkeyup = () => {
            setTimeout(unsetShortcut, timeoutMs)
            window.onkeyup = null
        }
    })

}