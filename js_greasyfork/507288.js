// ==UserScript==
// @name        Letterboxd Formated Runtime
// @namespace   https://github.com/Tetrax-10
// @description Replaces the original runtime with a formated one
// @icon        https://tetrax-10.github.io/letterboxd-custom-images/assets/icon.png
// @license     MIT
// @version     1.1
// @match       *://*.letterboxd.com/film/*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/507288/Letterboxd%20Formated%20Runtime.user.js
// @updateURL https://update.greasyfork.org/scripts/507288/Letterboxd%20Formated%20Runtime.meta.js
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

    function formatTimeString(timeStr) {
        // Extract hours and minutes using regex
        const match = timeStr.match(/(\d+)h\s(\d+)m/)

        if (!match) return "" // If the input string does not match the pattern

        const hours = parseInt(match[1], 10)
        const minutes = parseInt(match[2], 10)

        // If hours is 0, return an empty string
        if (hours === 0) {
            return ""
        }

        // Build the result string
        let result = ""

        // Format hours
        result += hours === 1 ? "1 hr" : `${hours} hrs`

        // Format minutes if more than 0
        if (minutes > 0) {
            result += ` ${minutes} min${minutes > 1 ? "s" : ""}`
        }

        return result
    }

    const runtimeSelector = ".text-footer-extra.duration-extra[data-original-title]"
    const runtime = await waitForElement(runtimeSelector)
    const formatedRuntime = runtime.dataset.originalTitle || ""

    const reFormatedRuntime = formatTimeString(formatedRuntime)

    if (reFormatedRuntime) {
        runtime.dataset.originalTitle = runtime.innerText
        runtime.innerText = reFormatedRuntime
    }
})()
