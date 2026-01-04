// ==UserScript==
// @name        Remove Twitter Frames
// @namespace   radio)))
// @description Remove Twitter iFrames
// @match       *://*.resetera.com/threads/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/39447/Remove%20Twitter%20Frames.user.js
// @updateURL https://update.greasyfork.org/scripts/39447/Remove%20Twitter%20Frames.meta.js
// ==/UserScript==


(() => {

    'use strict'

    const frames = Array.from(document.querySelectorAll('iframe[src*="twitter"]'))

    // https://twitter.com/user/status/${id}
    frames.forEach(f => {
        const id = f.src.split('#')[1]
        f.insertAdjacentHTML('beforebegin', `<a target=_blank href="https://twitter.com/user/status/${id}">Tweet</a>`)
        f.parentElement.removeChild(f)
    })

 })();