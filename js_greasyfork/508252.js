// ==UserScript==
// @name        TMDB load unloadable images
// @namespace   https://github.com/Tetrax-10
// @description Force TMDB to load unloaded images
// @icon        https://www.google.com/s2/favicons?sz=64&domain=themoviedb.org
// @license     MIT
// @version     1.7
// @match       *://*.themoviedb.org/*
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/508252/TMDB%20load%20unloadable%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/508252/TMDB%20load%20unloadable%20images.meta.js
// ==/UserScript==

;(() => {
    function changeSrc(img) {
        if (img.src.includes("media.themoviedb.org") && [".jpg", ".png", ".webp", ".svg"].some((e) => img.src.endsWith(e)) && !img.naturalHeight) {
            // Get the resolution and id of the image
            const resolution = img.src.match(/\/t\/p\/([^\/]+)\/[^\/]+$/)?.[1] ?? ""
            const id = img.src.split("/").pop()

            img.src = `https://image.tmdb.org/t/p/${resolution}/${id}`
            img.removeAttribute("srcset")
        }
    }

    // Function to handle intersection events
    function handleIntersection(entries, observer) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Check if the element is visible in the viewport
                const imgElement = entry.target
                changeSrc(imgElement) // Change the image source if it's unloaded
                observer.unobserve(imgElement) // Stop observing the current image after it's logged
            }
        })
    }

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
                                    resolve(undefined)
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

    function changeDivSrc(div) {
        // Get the background image URL from the div
        const bgImage = getComputedStyle(div).backgroundImage

        // Extract the URL from the `url('...')` syntax
        const matches = bgImage.match(/url\(\s*["']([^"']+)["']\s*\)/)
        if (matches && matches[1]) {
            const url = matches[1]

            // Create a new Image object to check if it loads successfully
            const img = new Image()
            img.onerror = () => {
                if (url.includes("media.themoviedb.org") && [".jpg", ".png", ".webp", ".svg"].some((e) => url.endsWith(e))) {
                    // Get the resolution and id of the image
                    const resolution = url.match(/\/t\/p\/([^\/]+)\/[^\/]+$/)?.[1] ?? ""
                    const id = url.split("/").pop()

                    div.style.backgroundImage = bgImage.replace(
                        /https?:\/\/[^\s]+?\.(jpg|png|webp|svg)/,
                        `https://image.tmdb.org/t/p/${resolution}/${id}`
                    )
                } else {
                    console.log("Could not extract a valid image URL from the backgroundImage property.")
                }
            }

            // Set the src to the extracted URL
            img.src = url
        } else {
            console.log("No valid background image URL found.")
        }
    }

    // Create a new IntersectionObserver instance
    const observer = new IntersectionObserver(handleIntersection, {
        root: null, // Observe the viewport
        rootMargin: "0px", // No margin around the viewport
        threshold: 0.1, // Trigger when at least 10% of the image is visible
    })

    // Select all img elements and observe them
    document.querySelectorAll("img").forEach((img) => {
        observer.observe(img)
    })

    // Create a MutationObserver to listen for new img elements
    const mutationObserver = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            // Check if nodes are added
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === "IMG") {
                        console.log("New img element added:", node)
                        observer.observe(node) // Observe the new img
                    }
                    // Check for img elements inside added elements
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        node.querySelectorAll("img").forEach((img) => {
                            console.log("New img element added:", node)
                            observer.observe(img)
                        })
                    }
                })
            }
        })
    })

    // Start observing the body for changes
    mutationObserver.observe(document.body, {
        childList: true, // Listen for direct children changes
        subtree: true, // Include all descendants
    })

    // Change non img elements
    const nonImgEle = [
        ".header", // title page, profile page background image
        ".header.collection", // title page collection card background image
    ]

    for (const ele of nonImgEle) {
        waitForElement(ele, 10000).then((elem) => {
            changeDivSrc(elem)
        })
    }
})()
