// ==UserScript==
// @name         Unfix
// @namespace    com.gmail.fujifruity.greasemonkey
// @version      1.2
// @description  Unfixes all fixed elements such as navigation bar and keeps them unfixed. Keybind: ctrl+alt+u
// @author       fujifruity
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418864/Unfix.user.js
// @updateURL https://update.greasyfork.org/scripts/418864/Unfix.meta.js
// ==/UserScript==

{
    const cssOf = e => document.defaultView.getComputedStyle(e, '')

    const isFixed = e => ['fixed', 'sticky'].includes(cssOf(e).position)

    const unfix = e => {
        if (!isFixed(e)) return
        if (e.id == 'fujifruity-toc') return
        e.style.setProperty('position', 'unset', 'important')
        console.log('unfixed: ', e)
    }

    // Keeps all elements unfixed
    const unfixForever = () => {
        // Unfix all fixed elements
        const allElems = Array.from(document.body.getElementsByTagName("*"))
        allElems.forEach(unfix)

        // Start observing elements get fixed
        const observer = new window.MutationObserver((mutationRecords) => {
            mutationRecords.forEach((mutationRecord) => {
                unfix(mutationRecord.target)
            })
        })
        const config = { attributes: true, subtree: true }
        observer.observe(document.body, config)
    }

    // Set keybinds
    window.addEventListener('keydown', event => {
        if (!event.altKey && !event.metaKey || !event.ctrlKey || event.key != 'u') return
        unfixForever()
    })
}