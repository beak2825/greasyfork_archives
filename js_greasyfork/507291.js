// ==UserScript==
// @name        Letterboxd Search YouTube Trailer
// @namespace   https://github.com/Tetrax-10
// @description Replaces movie title with link to youtube trailer search page
// @icon        https://raw.githubusercontent.com/worldwidewaves/letterboxd-scripts/master/img/letterboxd_icon.png
// @license     MIT
// @version     1.2
// @match        *://*.letterboxd.com/film/*
// @downloadURL https://update.greasyfork.org/scripts/507291/Letterboxd%20Search%20YouTube%20Trailer.user.js
// @updateURL https://update.greasyfork.org/scripts/507291/Letterboxd%20Search%20YouTube%20Trailer.meta.js
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
        const nameElement = await waitForElement(".details .primaryname .name", 3000)
        const yearElement = await waitForElement(".releasedate a", 3000)
        const searchString = `${nameElement.textContent} ${yearElement.textContent} trailer`

        const tmdbElement = await waitForElement(`.micro-button.track-event[data-track-action="TMDB"]`, 3000)
        const titleType = tmdbElement?.href?.match(/\/(movie|tv)\/(\d+)\//)?.[1] ?? null

        const linkElement = document.createElement("a")
        linkElement.className = nameElement.className
        linkElement.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchString)}`
        linkElement.target = "_blank"
        linkElement.textContent = nameElement.textContent + (titleType === "tv" ? " ⚠️" : "")

        nameElement.parentNode.replaceChild(linkElement, nameElement)
    }
})()
