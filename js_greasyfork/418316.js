// ==UserScript==
// @name         SCP Tooltips
// @namespace    alexchandel
// @version      1
// @description  Add tooltips to SCP links on the wiki.
// @author       Alex Chandel
// @match        *://*.scpwiki.com/*
// @match        *://*.scp-wiki.net/*
// @match        *://*.scpwiki.wikidot.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/418316/SCP%20Tooltips.user.js
// @updateURL https://update.greasyfork.org/scripts/418316/SCP%20Tooltips.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

'use strict';

/** -> Promise<Dict<path, name>> */
function updateNames () {
    const re = new RegExp(' - (.+)')
    const reqs = ['', '-2', '-3', '-4', '-5', '-6'].map(
        (sfx, i) => fetch(`/scp-series${sfx}`)
            .then(rsp => rsp.text())
            .then(text => {

                return Array.from((new DOMParser().parseFromString(text, 'text/html')).querySelectorAll('.series:first-of-type > ul'))
                    .slice(1)
                    .flatMap((ul, iUL) => Array.from(ul.querySelectorAll('li'))
                        .map((li, iLI) => {
                            const a = li.querySelector('a') // a.parentElement.removeChild(a)
                            const m = re.exec(li.textContent.slice(a.textContent.length))
                            if (m == null) {
                                console.warn(`${i * 1000 + iUL * 100 + iLI}: ${li.innerHTML}`)
                                return [a.pathname, a.textContent] // .innerText misses invisible text
                            } else {
                                return [a.pathname, m[1]]
                            }
                        })
                    )
            })
    )
    return Promise.all(reqs).then(series => Object.fromEntries(series.flat()))
}

/** Dict<path, name> -> () */
function tipLinks (names) {
    for (const link of window.document.querySelectorAll('a:not([title])')) {
        const name = names[link.pathname]
        if (name != undefined) {
            link.title = name
        }
    }
}

function updateAndTip () {
    updateNames().then(names => {
        GM.setValue('names', JSON.stringify(names)).then(
            _ => GM.setValue('lastupdate', Date.now())
        ).finally(tipLinks(names))
    })
}

const DAYMS = 86400000

window.addEventListener('load', function() {
    GM.getValue('lastupdate', 0).then(
        lastupdate => {
            if (lastupdate < Date.now() - DAYMS * 7) {
                updateAndTip()
            } else {
                GM.getValue('names').then(
                    names => tipLinks(JSON.parse(names)),
                    error => GM.setValue('lastupdate', 0).then(_ => updateAndTip())
                )
            }
        }) // else catastrophic failure…
})