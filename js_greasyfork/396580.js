// ==UserScript==
// @name        Loop Skillshare Episodes
// @namespace   JasperV
// @match       https://www.skillshare.com/classes/*
// @grant       none
// @version     1.1
// @author      JasperV <jasper@vanveenhuizen.nl>
// @description 2/18/2020, 2:06:44 PM
// @downloadURL https://update.greasyfork.org/scripts/396580/Loop%20Skillshare%20Episodes.user.js
// @updateURL https://update.greasyfork.org/scripts/396580/Loop%20Skillshare%20Episodes.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
    let counter = 0
    const episodes = document.getElementsByClassName('session-list')[0]
    const first_ep = episodes.firstChild
    const last_ep = episodes.lastChild

    const mutation_observer = new MutationObserver((mutations_list, observer) => {
        // ensure its called from entering the episode, not exiting
        if(!last_ep.classList.contains('active')) {
            return
        }
        counter++
        first_ep.click()
        console.log("Switched to episode 1, amount of times done: " + counter)
    })

    // call observer whenever the class changes
    mutation_observer.observe(
        last_ep,
        {
            attributes: true, 
            attributeFilter: ['class'],
        }
    )
}, false)