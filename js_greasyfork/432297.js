// ==UserScript==
// @name        Override throttling on pornolab.net
// @namespace   Violentmonkey Scripts
// @match       *://pornolab.net/*
// @grant       none
// @version     1.0
// @author      -
// @description Try to reload the page after a random delay in case you get throttled. 2021-09-12 15:02:27
// @downloadURL https://update.greasyfork.org/scripts/432297/Override%20throttling%20on%20pornolabnet.user.js
// @updateURL https://update.greasyfork.org/scripts/432297/Override%20throttling%20on%20pornolabnet.meta.js
// ==/UserScript==


// check if this is an error page due to throttling, and if so, refresh it after a random amount of time.
fixed_refresh_delay = 30 // this many seconds to wait at least
max_additional_delay = 30 // this many seconds to wait at least, on top of the fixed delay

// no jQuery loaded in the error page, so we have to do things in pure JS
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector))
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector))
                observer.disconnect()
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true
        })
    })
}

waitForElm("head > title").then(function(titleElm) {
  if (titleElm.textContent == "404 - Service unavailable") {
    delay = fixed_refresh_delay + Math.floor(Math.random() * (max_additional_delay + 1)) // the 1 is to make sure the max delay can be reached after the floor() function is done
    setTimeout(function(){
      window.location.reload(true)
    }, delay)
  }
})
