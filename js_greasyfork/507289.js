// ==UserScript==
// @name        Letterboxd Rating Base 10
// @namespace   https://github.com/Tetrax-10
// @description Changes the Letterboxd rating to Base 10
// @icon        https://raw.githubusercontent.com/worldwidewaves/letterboxd-scripts/master/img/letterboxd_icon.png
// @license     MIT
// @version     1.0
// @match        *://*.letterboxd.com/film/*
// @downloadURL https://update.greasyfork.org/scripts/507289/Letterboxd%20Rating%20Base%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/507289/Letterboxd%20Rating%20Base%2010.meta.js
// ==/UserScript==

;(async () => {
    async function waitForElement(selector, timeout = null, nthElement = 1) {
        // wait till document body loads
        while (!document.body) {
            await new Promise((resolve) => setTimeout(resolve, 10))
        }

        nthElement -= 1

        return new Promise((resolve) => {
            if (document.querySelectorAll(selector)?.[nthElement]) {
                return resolve(document.querySelectorAll(selector)?.[nthElement])
            }

            const observer = new MutationObserver(async () => {
                if (document.querySelectorAll(selector)?.[nthElement]) {
                    resolve(document.querySelectorAll(selector)?.[nthElement])
                    observer.disconnect()
                } else {
                    if (timeout) {
                        async function timeOver() {
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    observer.disconnect()
                                    resolve(false)
                                }, timeout)
                            })
                        }
                        resolve(await timeOver())
                    }
                }
            })

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            })
        })
    }

    const currentURL = location.protocol + "//" + location.hostname + location.pathname

    if (/^(https?:\/\/letterboxd\.com\/film\/[^\/]+(?:\/\?.*)?\/?(crew|details|genres)?)$/.test(currentURL)) {
        const ratingElement = await waitForElement(".tooltip.display-rating", 10000)
        if (ratingElement.innerText) {
            let rating = (parseFloat(ratingElement.innerText) * 2).toFixed(1)
            ratingElement.innerText = rating
        }
    }
})()
