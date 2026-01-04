// ==UserScript==
// @name         Better search results in youtube and google
// @namespace    https://www.twitch.tv/simplevar
// @version      2025-05-15
// @description  Ctrl+ArrowUp and Ctrl+ArrowDown to focus prev/next result
// @author       SimpleVar
// @match        https://www.youtube.com/*
// @match        https://www.google.com/search?*
// @icon         https://icons.iconarchive.com/icons/icons8/windows-8/256/Very-Basic-Search-icon.png
// @grant        none
// @run-at       document-end
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/536011/Better%20search%20results%20in%20youtube%20and%20google.user.js
// @updateURL https://update.greasyfork.org/scripts/536011/Better%20search%20results%20in%20youtube%20and%20google.meta.js
// ==/UserScript==

(() => {
    const ATT_ACTIVE = 'simplevar-active-ef10f5b8bf220b327cb92f44516cc'
    const resultSelector = [
        // youtube
        'ytd-search:not([hidden]) h3>a:not([class*=-ad-], [class^=shorts])', // search results
        'ytd-watch-flexy:not([hidden]) #video-title:not([class*=-ad-], [class^=shorts])', // related vids
        'ytd-browse:not([hidden]) h3>a:not([class*=-ad-], [class^=shorts])', // feed
        // google results
        '.e9EfHf .Ww4FFb a>h3'
    ].join(',')
    document.body.addEventListener('keydown', e => {
        debugger
        if (!e.ctrlKey) return
        let goUp = false
        switch (e.keyCode) {
            case 38: // up
                goUp = true
                break
            case 40: // down
                break
            default:
                return
        }
        let active = document.activeElement
        switch (active.tagName) {
            case 'input':
            case 'textarea':
                //console.log('[bleep] ignoring cuz active element is ' + active.tagName)
                return
        }
        const results = document.querySelectorAll(resultSelector)
        let idx = -1
        active = undefined
        for (let i = 0; i < results.length; i++) {
            if (results[i].getAttribute(ATT_ACTIVE)) {
                idx = i
                active = results[i]
                break
            }
        }
        //console.log(`[bleep] idx=${idx} | len=${results.length}`)
        if (goUp) idx = idx <= 0 ? results.length - 1 : idx - 1
        else idx = idx + 1 < results.length ? idx + 1 : 0

        const next = results[idx]
        //console.log('[bleep] next idx=' + idx, next)
        if (!next) return
        if (active) {
            active.style.outline = 'none'
            active.setAttribute(ATT_ACTIVE, '')
        }
        next.style.outline = 'cyan solid 1px'
        next.style.outlineOffset = '-1px'
        next.setAttribute(ATT_ACTIVE, '1')
        next.scrollIntoView({block: 'center'})
        let a = next
        while (a.tagName !== 'A' && a.parentElement) a = a.parentElement
        a.focus()
        e.preventDefault()
        e.stopPropagation()
    })
})()