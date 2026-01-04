// ==UserScript==
// @name     google search unredirect android firefox
// @namespace http://gholk.github.io
// @description remove redirect link in google search result page
// @version  0.1
// @match    https://www.google.com/search?*
// @grant    none
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/467987/google%20search%20unredirect%20android%20firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/467987/google%20search%20unredirect%20android%20firefox.meta.js
// ==/UserScript==

function unRedirect(a) {
    const attr = a.getAttribute('href')
    if (attr.slice(0, 5) != '/url?') return
    const u = new URL(a.href)
    const o = u.searchParams.get('q')
    a.href = o
}

void function tryUnRedirect () {
    const allAnchor = document.querySelectorAll('a[href^= "/url?"')
    if (allAnchor.length > 0) {
        allAnchor.forEach(a => unRedirect(a))
    }
    else setTimeout(tryUnRedirect, 500)
}()
