// ==UserScript==
// @name         Fandom to BreezeWiki
// @namespace    FandomToBreeze
// @version      0.0.2
// @description  Redirects from Fandom to BreezeWiki
// @author       frostice482
// @match        https://*.fandom.com/wiki/*
// @icon         https://fandom.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @connect      z.opnxng.com
// @connect      breezewiki.com
// @connect      antifandom.com
// @connect      breezewiki.pussthecat.org
// @connect      *
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524481/Fandom%20to%20BreezeWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/524481/Fandom%20to%20BreezeWiki.meta.js
// ==/UserScript==

const mirrors = [
    'https://z.opnxng.com',
    'https://breezewiki.com',
    'https://antifandom.com',
    'https://breezewiki.pussthecat.org'
]
const abortTime = 500

// handle aborting redirection
const abort = new AbortController()
document.addEventListener('pointerdown', () => abort.abort(), { signal: abort.signal })
document.addEventListener('click', () => abort.abort(), { signal: abort.signal })
document.addEventListener('keypress', ev => ev.code === 'Escape' && abort.abort(), { signal: abort.signal })

// redirection
const workingMirror = getWorkingMirror(abort)
const timeout = setTimeout(async () => {
    const targetURL = await workingMirror
    if (!targetURL || abort.signal.aborted) return
    location.replace(targetURL)
}, abortTime)

async function getWorkingMirror(signal) {
    const wikiname = location.host.slice(0, location.host.indexOf('.'))
    const targetURL = new URL(location)
    targetURL.pathname = '/' + wikiname + targetURL.pathname

    // try each mirror
    for (const mirror of mirrors) {
        if (signal?.aborted) return
        try {
            const mirrorURL = new URL(mirror)
            targetURL.host = mirrorURL.host

            // send HEAD request
            console.debug('mirror HEAD:', targetURL.toString())
            const res = await new Promise((res, rej) => GM.xmlHttpRequest({
                method: "HEAD",
                url: targetURL.toString(),
                onload: res,
                ontimeout: rej,
                onerror: rej,
                timeout: 1000,
                signal
            }))

            //validate status
            if (res.status !== 200) throw Error(`HEAD ${mirror} HTTP ${res.status} ${res.statusCode}`)

            // is working
            return targetURL
        } catch(e) {
            console.error('mirror error', mirror, '->', e)
        }
    }
}
