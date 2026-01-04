// ==UserScript==
// @name         Jellyfin-Player-Keys
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Enhance Jellyfin's Player with quiet and quick hotkeys
// @author       Tebayaki
// @license      MIT
// @match        http://jellyfin.j.lan/web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jellyfin.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538774/Jellyfin-Player-Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/538774/Jellyfin-Player-Keys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let video = null

    const obVideo = new MutationObserver((mutationList, _observer) => {
        for (let mutationRecord of mutationList) {
            if (mutationRecord.removedNodes) {
                for (let removedNode of mutationRecord.removedNodes) {
                    if (removedNode.className && removedNode.classList.contains('videoPlayerContainer')) {
                        console.log('[Jellyfin-Player-Keys] Video Removed')
                        video = null
                        document.removeEventListener('keydown', keyproc, true)
                        return
                    }
                }
            }
            if (mutationRecord.addedNodes) {
                for (let addedNode of mutationRecord.addedNodes) {
                    if (addedNode.className && addedNode.classList.contains('videoPlayerContainer')) {
                        console.log('[Jellyfin-Player-Keys] Video Added')
                        video = document.querySelector("body > div.videoPlayerContainer > video")
                        document.addEventListener('keydown', keyproc, true)
                        return
                    }
                }
            }
        }
    });

    obVideo.observe(document.body, { childList: true });

    function keyproc(e) {
        const video = document.querySelector("video")
        if (video) {
            const activeEleClass = document.activeElement.classList
            if (activeEleClass.contains("mouseIdle") || activeEleClass.contains("btnPause")) {
                if (e.ctrlKey) {
                    if (e.shiftKey) {
                        switch (e.key) {
                            default:
                                return
                        }
                    }
                    else {
                        switch (e.key) {
                            default:
                                return
                        }
                    }
                }
                else {
                    switch (e.key) {
                        case 'ArrowLeft':
                            video.currentTime -= 5
                            break
                        case 'ArrowRight':
                            video.currentTime += 5
                            break
                        case 'ArrowDown':
                            video.currentTime += 29
                            break
                        case 'ArrowUp':
                            video.currentTime -= 30
                            break
                        case ' ':
                            if (video.paused) {
                                video.play()
                            }
                            else {
                                video.pause()
                            }
                            break
                        case 'Enter':
                            if (!document.fullscreenElement) {
                                document.querySelector("body").requestFullscreen().catch((err) => {
                                    alert(`尝试启用全屏模式时出错：${err.message}（${err.name}）`)
                                })
                            } else {
                                document.exitFullscreen()
                            }
                            break
                        case ',':
                            if (video.playbackRate > 0.5) {
                                video.playbackRate -= 0.25
                            }
                            break
                        case '.':
                            if (video.playbackRate < 4) {
                                video.playbackRate += 0.25
                            }
                            break
                        case '/':
                            video.playbackRate = 1
                            break
                        case 'End':
                            let skipButton = document.querySelector(".skip-button")
                            if (skipButton) {
                                skipButton.click()
                            }
                            break
                        default:
                            return
                    }
                }
                e.preventDefault()
                e.stopPropagation()
            }
        }
    }
})();