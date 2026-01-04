// ==UserScript==
// @name wiktionaryForwarder
// @version 1.1
// @author zhengqunkoo
// @description Click on first link under a specific section. Avoids cyclic forwarding by keeping a history of visited locations, which expires after two seconds.
// @match https://*.wiktionary.org/wiki/*
// @grant GM_getValue
// @grant GM_setValue
// @namespace https://greasyfork.org/users/673982
// @downloadURL https://update.greasyfork.org/scripts/408319/wiktionaryForwarder.user.js
// @updateURL https://update.greasyfork.org/scripts/408319/wiktionaryForwarder.meta.js
// ==/UserScript==

(async (style) => {
    const gm_history = 'wiktionaryForwarderHistory'
    const gm_timestamp = 'wiktionaryForwarderTimestamp'
    if (Date.now() - await GM_getValue(gm_timestamp, Date.now()) >= 2000) { GM_setValue(gm_history, JSON.stringify(Array())) }
    var h = JSON.parse(await GM_getValue(gm_history, JSON.stringify(Array())))
    console.log(h)
    if (h.includes(window.location.href)) { return }
    h.push(window.location.href)
    await GM_setValue(gm_history, JSON.stringify(h))
    await GM_setValue(gm_timestamp, Date.now())
    const ts = document.getElementsByTagName('table')
    for (var i=0; i<ts.length; i++) {
        const t = ts[i]
        //console.log(t.style.backgroundColor)
        if (t.style.backgroundColor === style) {
            const as = t.getElementsByTagName('a')
            //console.log(as)
            if (as.length === 0) { return }
            window.location.href = as[0].href
            return
        }
    }
    console.log("done")
})('rgb(245, 255, 250)')