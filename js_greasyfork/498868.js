// ==UserScript==
// @name        modflix.xyz bypasser
// @namespace   http://tampermonkey.net/
// @version     1.1
// @description Bypass modflix.xyz download links
// @author      limeo
// @license     MIT
// @match       *://*/*
// @icon        https://moviesmod.life/wp-content/uploads/2022/10/moviesmod.png
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/498868/modflixxyz%20bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/498868/modflixxyz%20bypasser.meta.js
// ==/UserScript==

;(function () {
    "use strict"

    const options = [
        {
            key: "instant",
            selector: "a.btn.btn-danger",
        },
        {
            key: "resume",
            selector: "a.btn.btn-light",
        },
    ]

    const setOption = (key, value) => {
        GM_setValue(key, value)
    }

    const getOption = (key) => {
        return GM_getValue(key)
    }

    // Modified to set default to "resume"
    const initOptions = () => {
        options.forEach((option) => {
            const currentValue = getOption(option.key)
            if (currentValue === undefined) {
                // Set "resume" as the default option
                setOption(option.key, option.key === "resume")
            }
        })
    }

    // Function to log the current option
    const logCurrentOption = () => {
        const isInstant = getOption("instant")
        alert(`Current download option is: ${isInstant ? "Instant Download" : "Resume Download"}`)
        // console.log(
        //   `Current download option is: ${isInstant ? "instant" : "resume"}`
        // )
    }

    // Modified to set options directly
    const initMenu = () => {
        GM_registerMenuCommand("Set Instant Download", () => {
            setOption("instant", true)
            setOption("resume", false)
            logCurrentOption()
        })

        GM_registerMenuCommand("Set Resume Download", () => {
            setOption("instant", false)
            setOption("resume", true)
            logCurrentOption()
        })

        GM_registerMenuCommand("Log Current Option", logCurrentOption)

        // GM_registerMenuCommand("Reset Options", () => {
        //   options.forEach((option) => {
        //     setOption(option.key, option.key === "resume")
        //   })
        //   logCurrentOption()
        // })

        GM_registerMenuCommand("Go to modflix.xyz", () => {
            // Open modflix.xyz in new tab
            window.open("https://modflix.xyz")
        })
    }

    const init = () => {
        initOptions()
        initMenu()
    }

    init()

    // Function to check website domain
    function isMatchingDomain(url) {
        const allowedDomains = [
            "https://episodes.modpro.co/archives/", //hollywood series page (episodes)
            "https://links.modpro.co/archives/", //hollywood movie page (links)
            "https://leech.modpro.co/archives/", //leech page (bollywood movies)
            "https://driveseed.org/file/",
            "https://driveleech.org/file/",
            "https://video-seed.xyz/", // Instant download
            "https://workerseed.dev/", // Resume download
            "https://driveseed.org/zfile/", // Resume download (alternative)
            "https://driveleech.org/zfile/", // Resume download (alternative)
        ]
        return allowedDomains.some((domain) => url.startsWith(domain))
    }

    // Function to handle actions on driveseed.org
    function handle_driveSeedsOrLeechs() {
        // Find and click the download button (example selector)
        setTimeout(() => {
            // Implement logic based on the current option
            const performActionBasedOnOption = () => {
                if (getOption("instant")) {
                    console.log("Performing action for instant option.")
                    // Add your logic for "instant" option here
                    let downloadButton = document.querySelector("a.btn.btn-danger")
                    if (downloadButton) {
                        const url = downloadButton.href
                        window.location.href = url
                        console.log("Navigated to:", url)
                    } else {
                        console.log("Instant Download button not found on driveseed.org")
                        //set resume option
                        GM_setValue("instant", false)
                        GM_setValue("resume", true)
                    }
                }
                if (getOption("resume")) {
                    console.log("Performing action for resume option.")
                    // Add your logic for "resume" option here
                    let downloadButtons = document.querySelectorAll(
                        "a.btn.btn-light, a.btn.btn-warning"
                    )

                    let downloadButton = Array.from(downloadButtons).find(Boolean)
                    console.log("downloadButton:", downloadButton)

                    if (downloadButton) {
                        const url = downloadButton.href
                        window.location.href = url
                        console.log("Navigated to:", url)
                    } else {
                        console.log("Resume Download button not found on driveseed.org")
                        //set instant option
                        GM_setValue("instant", true)
                        GM_setValue("resume", false)
                    }
                }
            }
            performActionBasedOnOption()
        }, 500)
    }

    // Function to handle actions on episodes.modpro.co and links.modpro.co
    function handleModproSites() {
        // Find and click the "allEpisodesButton" (if it exists)
        setTimeout(() => {
            const allEpisodesButton = document.getElementById("allEpisodesButton")
            if (allEpisodesButton) {
                // Click the "allEpisodesButton"
                // also close the tab after 5 seconds
                allEpisodesButton.click()
                setTimeout(() => {
                    window.close()
                }, 500)
                console.log("Navigated to all episodes on modpro.co site")
            } else {
                console.log("All episodes button not found on modpro.co site")
            }

            // Find and click the server button (example selector)
            const serverButtons = document.querySelectorAll(".maxbutton")
            const serverButton = Array.from(serverButtons).find(Boolean)
            console.log("serverButton:", serverButton)

            if (serverButton) {
                const serverLink = serverButton.href
                window.location.href = serverLink
                console.log("Navigated to server link on modpro.co site")
            } else {
                console.log("Server buttons not found on modpro.co site")
            }
        }, 500)
    }

    function handleInstantDL() {
        //start download after 1 second
        //https://video-seed.xyz/
        setTimeout(() => {
            const downloadButton = document.getElementById("ins")
            if (downloadButton) {
                downloadButton.click()
                console.log("download begins...")
            } else {
                console.log('Download button with ID "ins" not found')
            }
        }, 1000) // Adjust delay as needed
    }

    function handleResumeDL() {
        //start download after 1 second
        //https://workerseed.dev/ or https://driveleech.org/zfile/
        setTimeout(() => {
            if (window.location.href.startsWith("https://workerseed.dev/")) {
                const downloadButton = document.getElementById("download")
                if (downloadButton) {
                    downloadButton.click()
                    console.log("download begins...")
                } else {
                    console.log('Download button with ID "download" not found')
                }
            } else {
                const downloadButton = document.querySelector("a.btn.btn-success")
                if (downloadButton) {
                    const url = downloadButton.href
                    window.location.href = url
                    console.log("download begins...")
                } else {
                    console.log('Download button with class "btn btn-success" not found')
                }
            }
        }, 1000) // Adjust delay as needed
    }

    // Main execution based on domain
    const currentUrl = window.location.href
    if (isMatchingDomain(currentUrl)) {
        if (
            currentUrl.startsWith("https://driveseed.org/file/") ||
            currentUrl.startsWith("https://driveleech.org/file/")
        ) {
            handle_driveSeedsOrLeechs()
        } else if (currentUrl.startsWith("https://video-seed.xyz/")) {
            handleInstantDL()
        } else if (
            currentUrl.startsWith("https://workerseed.dev/") ||
            currentUrl.startsWith("https://driveleech.org/zfile/") ||
            currentUrl.startsWith("https://driveseed.org/zfile/")
        ) {
            handleResumeDL()
        } else {
            // episodes.modpro.co or links.modpro.co or leech.modpro.co
            handleModproSites()
        }
    } else {
        console.log("Script not applicable for this domain")
    }
})()
