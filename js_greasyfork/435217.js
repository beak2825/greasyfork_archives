// ==UserScript==
// @name         MH: Detailed Time
// @namespace    https://greasyfork.org/en/users/831030-plasmoidia
// @version      0.2
// @description  Adds seconds to the top journal entry.
// @author       asterios, plasmoidia
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435217/MH%3A%20Detailed%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/435217/MH%3A%20Detailed%20Time.meta.js
// ==/UserScript==

function detailedTime() {
    const myjournal = document.querySelectorAll(`.journalEntries.journalEntries${user.user_id}`)
    if(myjournal) {
        const node = myjournal.length - 1
        if(node >= 0) {
            var topentry = myjournal[node].querySelector('.entry.short.linked .journaldate, .entry.short.active .journaldate')
            if(topentry) {
                const loc = topentry.innerText.split(/ - /)[1]
                const datesec = new Date(user.last_active_turn_timestamp*1000)
                               .toLocaleTimeString().toLocaleLowerCase()
                               + ' - ' + loc
                const oldtime = topentry.innerText.split(/[: ]/, 2).join(':')
                const newtime = datesec.split(':', 2).join(':')
                if(oldtime === newtime) {
                    topentry.innerText = datesec
                }
            }
        }
    }
}

$(document).ajaxStop(detailedTime)
$(document).ready(detailedTime)
