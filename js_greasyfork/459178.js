// ==UserScript==
// @name         Kemono/Coomer-VideoPlayer
// @namespace    http://tampermonkey.net/
// @version      0.3.7
// @description  在Kemono或Coomer的post链接下添加video.js视频播放器。
// @description:en-US  Add video.js player under Kemono or Coomer's post links.
// @author       dsx137
// @match        https://kemono.party/*
// @match        https://kemono.su/*
// @match        https://kemono.cr/*
// @match        https://coomer.party/*
// @match        https://coomer.su/*
// @match        https://coomer.st/*
// @match        https://nekohouse.su/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     video.js_css https://cdnjs.cloudflare.com/ajax/libs/video.js/8.16.1/video-js.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/video.js/8.16.1/video.min.js
// @license      AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/459178/KemonoCoomer-VideoPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/459178/KemonoCoomer-VideoPlayer.meta.js
// ==/UserScript==

const suffixes = ['.mp4', '.m4v']

function isSupportedVideoLink(link) {
    try {
        const path = new URL(link).pathname.toLowerCase();
        return suffixes.some(suffix => path.endsWith(suffix));
    } catch (error) {
        return false;
    }
}

function createPlayer(linkSrc) {
    let player = document.createElement("video");

    player.className = "video-js vjs-theme-city";
    player.style.width = "100%";
    player.style.backgroundColor = "black"
    player.setAttribute("data-setup", '{"controls":true, "autoplay":false, "preload":"auto", "height":"800px"}');
    let src = document.createElement("source");
    src.type = "video/mp4";
    src.src = linkSrc;
    player.appendChild(src);

    let volumePanelHoverCounter = 0;

    player.addEventListener('keydown', event => {
        let step = 5;
        let volumePanel = player.parentElement.querySelector('.vjs-volume-panel');

        let volumePanelAdjust = () => {
            volumePanelHoverCounter++;
            setTimeout(() => {
                volumePanelHoverCounter--;
                if (volumePanelHoverCounter <= 0) {
                    if (!volumePanel.matches(':hover')) {
                        volumePanel.classList.remove('vjs-hover');
                    }
                }
            }, 1000);
        }

        switch (event.code) {
            case 'ArrowLeft':
                player.currentTime = Math.max(0, player.currentTime - step);
                break;
            case 'ArrowRight':
                player.currentTime = Math.min(player.duration, player.currentTime + step);
                break;
            case 'Space':
                player.paused ? player.play() : player.pause();
                break;
            case 'ArrowUp':
                if (player.muted) {
                    player.volume = 0
                    player.muted = false;
                }
                player.volume = Math.min(1, player.volume + 0.1);
                volumePanel.classList.add('vjs-hover');
                volumePanelAdjust();
                break;
            case 'ArrowDown':
                if (player.muted) {
                    break;
                }
                player.volume = Math.max(0, player.volume - 0.1);
                volumePanel.classList.add('vjs-hover');
                volumePanelAdjust();
                break;
            case 'KeyM':
                player.muted = !player.muted;
                break;
            case 'KeyF':
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    player.requestFullscreen();
                }
                break;
            default:
                return;
        }

        event.stopPropagation();
        event.preventDefault();
    });

    return player
}

function attachPlayer() {
    let links = Array.from(document.querySelectorAll(".post__attachment-link, .scrape__attachment-link")).filter(it => !it.classList.contains('has-player'));
    if (links.length == 0) return false;
    for (let i in links) {
        let linkSrc = links[i].href;
        if (!isSupportedVideoLink(linkSrc)) break;
        links[i].classList.add('has-player');
        let player = createPlayer(linkSrc)
        links[i].parentElement.appendChild(player);
        videojs(player)

        let observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (!mutation.target) {
                    return;
                }

                let newLinkSrc = mutation.target.getAttribute("href");
                if (!isSupportedVideoLink(newLinkSrc)) {
                    videojs(player).dispose();
                    links[i].classList.remove('has-player');
                    return;
                }

                player.src = newLinkSrc;
                videojs(player)
            });
        });
        observer.observe(links[i], { attributes: true, attributeFilter: ['href'] });
    }
    return true;
}

(function () {
    'use strict';
    GM_addStyle(GM_getResourceText("video.js_css"));

    attachPlayer();

    let observer = new MutationObserver(mutations => {
        attachPlayer();
    });
    observer.observe(document.body, { childList: true, subtree: true })
})();
