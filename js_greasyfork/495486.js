// ==UserScript==
// @name         Youtube Music Random Playlist Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button that when clicked, plays a random playlist. Works when viewing the Playlists section of the User's Library (https://music.youtube.com/library/playlists).
// @author       Marco Souvereyns
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=music.youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495486/Youtube%20Music%20Random%20Playlist%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/495486/Youtube%20Music%20Random%20Playlist%20Button.meta.js
// ==/UserScript==

(function() {
    let playlists = []
    let oldHref = document.location.href
    const playlistPlayButtonSelector = "ytmusic-item-thumbnail-overlay-renderer #play-button"
    const playlistsContainerSelector = "#contents #items"
    const randomPlayButtonSelector = "#play-random-playlist"
    let currentCheckPlayerExpandedInterval = null

    const playRandomPlaylist = () => {
        if (currentCheckPlayerExpandedInterval) {
            clearInterval(currentCheckPlayerExpandedInterval)
        }

        let i = Math.floor(Math.random() * playlists.length)

        const playlistName = playlists[i]?.parentElement?.parentElement?.parentElement?.parentElement?.querySelector(".title")?.innerText || ""
        document.querySelector(randomPlayButtonSelector).innerText = `🔀 ${playlistName} [${i + 1}/${playlists.length}]`

        playlists[i].click()

        checkIfPlayerIsExpanded()
    }

    const waitForFinishLoadingMorePlaylists = async () => {
       const spinner = document.querySelector("#continuations #spinnerContainer")
       if (spinner) {
           await new Promise(res => setTimeout(res, 100))
           return await waitForFinishLoadingMorePlaylists()
       } else {
           return
       }
    }

    const checkIfPlayerIsExpanded = () => {
        const interval = 500
        const maxChecks = interval * 20 // 10s

        let checks = 0
        currentCheckPlayerExpandedInterval = setInterval(() => {
            const playerIsExpanded = document.querySelector("ytmusic-player-bar[player-page-open]") !== null

            if (playerIsExpanded) {
                document.querySelector(".toggle-player-page-button").click()
                clearInterval(currentCheckPlayerExpandedInterval)
                return
            } else {
                checks++
                if (checks >= maxChecks) {
                    clearInterval(currentCheckPlayerExpandedInterval)
                }
            }
        }, interval)
    }

    const scrollAndGetPlaylists = async (play = false) => {
        const oldPlaylistsN = playlists.length

        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
        await new Promise(res => setTimeout(res, 500))

        await waitForFinishLoadingMorePlaylists()

        playlists = document.querySelectorAll(playlistPlayButtonSelector)

        if (playlists.length === oldPlaylistsN) {
            window.scrollTo({ top: 0, behavior: "smooth" })

            if (play) {
                playRandomPlaylist()
            }
        } else {
            await scrollAndGetPlaylists(play)
        }
    }

    const appendButton = async () => {
        if (document.querySelector("#play-random-playlist") === null) {
            let playRandomPlaylistButton = document.createElement("div")

            playRandomPlaylistButton.style.cursor = "pointer"
            playRandomPlaylistButton.style.marginRight = "15px"
            playRandomPlaylistButton.style.fontSize = "14px"
            playRandomPlaylistButton.style.padding = "6px 12px"
            playRandomPlaylistButton.style.background = "#fff"
            playRandomPlaylistButton.style.color = "#222"
            playRandomPlaylistButton.style.borderRadius = "7px"
            playRandomPlaylistButton.innerText = "Play Random Playlist"
            playRandomPlaylistButton.id = "play-random-playlist"

            playRandomPlaylistButton.addEventListener("click", function(e) {
                e.preventDefault()
                if (playlists.length === 0) {
                    scrollAndGetPlaylists(1, true)
                } else {
                    playRandomPlaylist()
                }
            })

            document.querySelector("#right-content").prepend(playRandomPlaylistButton)
        }
    }

    const removeButton = () => {
        document.querySelector(randomPlayButtonSelector).remove()
    }



    window.addEventListener("load", () => {
        const body = document.querySelector("body")
        const observer = new MutationObserver(mutations => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href
                if (window.location.pathname === "/library/playlists") {
                    appendButton()
                } else {
                    removeButton()
                }
            }
        })
        observer.observe(body, { childList: true, subtree: true })

        if (window.location.pathname === "/library/playlists") {
            appendButton()
        }
    }, false)
    window.addEventListener("unload", () => {
        document.querySelectorAll("#play-random-playlist").remove()
    }, false)
})()