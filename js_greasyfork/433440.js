/* 
    Youtube subtitles under video frame: Move youtube subtitles under video frame.
	Copyright (C) 2023  T1mL3arn

    This program is free software: you can redistribute it and/or modify 
    it under the terms of the GNU General Public License as published by 
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version. 
	
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

// ==UserScript==
// @name        Youtube subtitles under video frame 
// @name:RU     Субтитры Youtube под видео
// @description Have you ever been annoyed by youtube subtitles covering some important part of the video? No more! The userscript moves subtitles under video frame (but you can still drag-move them horizontally). It works for default and theater modes. 
// @description:RU  Вам когда-нибудь мешали субтитры Youtube, закрывыющие какую-то важную область видео? Пора это прекратить! Этот скрипт сдвигает субтитры под видео (вы все еще можете перетаскивать их по горизонтали). Работает в режимах "обычный" и "широкий экран".
// @namespace   https://github.com/t1ml3arn-userscript-js
// @version     1.5.1
// @match       https://www.youtube.com/*
// @match       https://youtube.com/*
// @grant       none
// @noframes
// @author      T1mL3arn
// @icon        data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGRlZnM+PHN5bWJvbCBpZD0iYSIgdmlld0JveD0iMCAwIDM0NCA1OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHJlY3QgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwKSIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSIvPjxwYXRoIGQ9Ik0tNTAtNTBINTBWNTBILTUwVi01MHoiIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTAgNTApIi8+PHBhdGggZD0iTS01MC01MEg1MFY1MEgtNTBWLTUweiIgZmlsbD0iI0ZGRiIgZmlsbC1vcGFjaXR5PSIwIiB0cmFuc2Zvcm09Im1hdHJpeCguNDUgMCAwIC43NiAxNTYuNDEgMzY5Ljc1KSIvPjxwYXRoIGQ9Ik0tNTAtNTBWNTBINTBWLTUwSC01MHoiIGZpbGw9IiNGRkYiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB0cmFuc2Zvcm09Im1hdHJpeCgyLjQxIDAgMCAuMiAxMjAuNSAxMCkiLz48cGF0aCBkPSJNLTUwLTUwVjUwSDUwVi01MEgtNTB6IiBmaWxsPSIjRkZGIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgdHJhbnNmb3JtPSJtYXRyaXgoLjcgMCAwIC4yIDMxMC4xOCAxMCkiLz48cGF0aCBkPSJNLTUwLTUwVjUwSDUwVi01MEgtNTB6IiBmaWxsPSIjRkZGIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgdHJhbnNmb3JtPSJtYXRyaXgoLTIuNDEgMCAwIC0uMiAyMjQuNjggNTApIi8+PHBhdGggZD0iTS01MC01MFY1MEg1MFYtNTBILTUweiIgZmlsbD0iI0ZGRiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjAiIHRyYW5zZm9ybT0ibWF0cml4KC0uNyAwIDAgLS4yIDM1IDUwKSIvPjwvc3ltYm9sPjwvZGVmcz48ZyBjbGFzcz0ibGF5ZXIiPjxwYXRoIGQ9Ik00OTguMjk0IDU3LjI5OWMtNS44MjgtMjEuNzc2LTIyLjk0Mi0zOC44ODgtNDQuNzE4LTQ0LjcxN0M0MTQuMTUgMi4wMDYgMjU1Ljk3MiAyLjAwNiAyNTUuOTcyIDIuMDA2cy0xNTguMTc0IDAtMTk3LjYwMyAxMC41NzZDMzYuNTkzIDE4LjQxIDE5LjQ4IDM1LjUyMyAxMy42NTIgNTcuMjk5IDMuMDc2IDk2LjcyOCAzLjA3NiAxNzkuMDQyIDMuMDc2IDE3OS4wNDJzMCA4Mi4zMTUgMTAuNTc2IDEyMS43NDRjNS44MjkgMjEuNzc2IDIyLjk0MSAzOC44ODggNDQuNzE3IDQ0LjcxNiAzOS40MjkgMTAuNTc2IDE5Ny42MDMgMTAuNTc2IDE5Ny42MDMgMTAuNTc2czE1OC4xNzcgMCAxOTcuNjA0LTEwLjU3NmMyMS43NzYtNS44MjggMzguODktMjIuOTQgNDQuNzE4LTQ0LjcxNiAxMC41NzYtMzkuNDMgMTAuNTc2LTEyMS43NDQgMTAuNTc2LTEyMS43NDRzLS4wNDItODIuMzE0LTEwLjU3Ni0xMjEuNzQzeiIgZmlsbD0icmVkIi8+PHBhdGggZD0iTTAgLjVoNTEydjUxMkgwVi41eiIgZmlsbD0idHJhbnNwYXJlbnQiLz48cGF0aCBkPSJNNDMuNzg4IDM3MWg0MjQuNDI3djEzMS4zMkg0My43ODhWMzcxeiIvPjx1c2UgdHJhbnNmb3JtPSJtYXRyaXgoLjczNjA4IDAgMCAuOTYyMTcgLTc1Ljk5IC00ODUuMDY1KSIgeD0iMTk0LjE0NCIgeGxpbms6aHJlZj0iI2EiIHk9IjcwMiIvPjxwYXRoIGQ9Im0yMDUuMzQ1IDI1NS4wODYgMTMxLjQwNC03NS44Ni0xMzEuNDA0LTc1Ljg2djE1MS43MnoiIGZpbGw9IiNGRkYiLz48L2c+PC9zdmc+
// @homepageURL https://github.com/t1ml3arn-userscript-js/Youtube-subtitles-under-video-frame
// @supportURL  https://github.com/t1ml3arn-userscript-js/Youtube-subtitles-under-video-frame/issues
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/433440/Youtube%20subtitles%20under%20video%20frame.user.js
// @updateURL https://update.greasyfork.org/scripts/433440/Youtube%20subtitles%20under%20video%20frame.meta.js
// ==/UserScript==

const SUBS_BUTTON_SELECTOR = '.ytp-subtitles-button'
const USERJS_ELT_CLASS = 'yfms-userjs'
const USERJS_STYLE_ID = 'youtube-subs-under-video-css'
const PLAYER_ELT_SELECTOR = 'ytd-watch-flexy'
const SUBS_GAP = 64;
const SUBS_GAP_THEATER = 100;
const KEY__PLAYER_CAPTION_DISPLAY_SETTINGS = 'yt-player-caption-display-settings'
const KEY__PLAYER_STICKY_CAPTION = 'yt-player-sticky-caption'

const USERJS_STYLE_CONTENT = `
.${USERJS_ELT_CLASS} {
    --subs-gap: ${SUBS_GAP}px;
    --subs-gap-theater: ${SUBS_GAP_THEATER}px;
}

.${USERJS_ELT_CLASS}:not([fullscreen]) .caption-window.ytp-caption-window-bottom {
    margin-bottom: 0 !important;
    margin-top: 0 !important;
    position: absolute !important;
    bottom: 0 !important;
    top: calc(100% + 16px) !important;
    z-index: 9999 !important;
}

ytd-player:not([fullscreen]):not([theater]) {
    /*  in default mode "ytd-player" has "overflow: hidden" thus hiding the subs, 
    this rule makes it visible again */
    overflow: visible !important;
}

.${USERJS_ELT_CLASS} .html5-video-player {
    /* to make subs visible when they are outside player frame */
    overflow: visible;
    /* to make player to be on top 
    (combined with captions z-index rule, 
    it places captions over any element on the page) */
    z-index: 999;
}

.${USERJS_ELT_CLASS} #movie_player.ended-mode .html5-video-container,
.${USERJS_ELT_CLASS} #movie_player.unstarted-mode .html5-video-container {
    /*  By default this container has no height, 
    setting height explicitly prevents hiding of video.
    This actually not needed since "overflow: hidden" happens
    before start and after end, but I want to be sure. */
    height: 100%;
    /* video frame move above when video ends, without hiding
    a user can see part of the video above player */
    overflow: hidden;
}

.${USERJS_ELT_CLASS} #below {
    margin-top: var(--subs-gap);
    transition: margin-top 0.25s;
}

.${USERJS_ELT_CLASS}[theater]:not([fullscreen]) #below {
    margin-top: var(--subs-gap-theater);
}

/* styling for "related videos" section */
.${USERJS_ELT_CLASS}[theater]:not([fullscreen]) #secondary.ytd-watch-flexy {
    margin-top: var(--subs-gap-theater);
    transition: margin-top 0.25s;
}
`

let canToggleSubsWithKeyboard = true;
const ccSizes = {
    0: 64,
    1: 80,
}

function addStyles(css, id) {
    const style = document.head.appendChild(document.createElement('style'))
    style.textContent = css;
    style.id = id
}

function displaceSubtitles(below = true) {
    // this elt gets special attribute by youtube when view mode changes,
    // so it also gets my marker class to apply my CSS
    const playerElt = document.querySelector(PLAYER_ELT_SELECTOR)
    if (below)
        playerElt.classList.add(USERJS_ELT_CLASS)
    else
        playerElt.classList.remove(USERJS_ELT_CLASS)
}

function onSubsClick() {
    displaceSubtitles(areSubsEnabled())
}

function getCaptionsButton() {
    return getVisibleElt(SUBS_BUTTON_SELECTOR)
}

function getVisibleElt(selector) {
    return Array.from(document.querySelectorAll(selector)).find(e => e.offsetParent !==null)
}

function isItVideoPage() {
    return window.location.search.includes('v=')
}

function areSubsAvailable() {
    const subsButton = getCaptionsButton()

    if (!subsButton) {
        console.debug(`Video ${window.location.href} has no subtitles button`);
        return false
    }

    // Video may have no subs at all, to catch that case
    // I can only check button's opacity
    const btnIcon = subsButton.querySelector('svg')
    if (parseFloat(btnIcon.getAttribute("fill-opacity") || 1) != 1)
        return false

    return true
}

function toggleSubtitlesKeyDown(e) {
    
    if (e.code === 'KeyC' || e.keyCode === 67)
    if (isItVideoPage() && areSubsAvailable() && canToggleSubsWithKeyboard) {
        displaceSubtitles(areSubsEnabled())
    }
}

function onFocusIn(e) {

    // disable captions toggling 
    // if user focused any input element (like search bar or comment textarea)
    if (e.target.tagName === 'INPUT' || 
    e.target.matches('div#contenteditable-root.style-scope.yt-formatted-string')) {
        canToggleSubsWithKeyboard = false
    } else {
        canToggleSubsWithKeyboard = true
    }
}

function onFocusOut(e) {

    // restoring captions toggling if user focused out
    // input elements
    if (e.target.tagName === 'INPUT' || 
    e.target.matches('div#contenteditable-root.style-scope.yt-formatted-string')) {
        canToggleSubsWithKeyboard = true
    }
}

function enchanceSubsButton() {
    if (isItVideoPage()) {

        if (!areSubsAvailable()) 
            return

        const subsButton = getCaptionsButton()

        let subsEnabled = areSubsEnabled()
        // sometimes I cannot rely on local storage setting
        // to get subtitles state but I still can get it
        // from the caption button ARIA attribute
        let subsButtonPressed = subsButton.getAttribute('aria-pressed') === 'true'
        displaceSubtitles(subsEnabled || subsButtonPressed)
        
        // forcing YT to enable subs
        if (subsEnabled && !subsButtonPressed) {
            subsButton.click()
        }

        updateGapSize()

        document.addEventListener('keydown', toggleSubtitlesKeyDown )
        subsButton.addEventListener('click', onSubsClick)
    }
}

function localStorageHook() {
    
    let original = Storage.prototype.setItem;
    Storage.prototype.setItem = function() {
        const event = new CustomEvent('storageSetItem', {
            detail: { 
                key: arguments[0], 
                value: arguments[1]
            },
        });
        original.apply(this, arguments);
        window.dispatchEvent(event);
    }
}

function getGapSize(f, initial) {
    // this formula is found in youtube js code
    return initial * (1 + 0.25 * Math.max(f || 0, 0));
}

function updateGapSize() {
    // NOTE CC visible size remains FIXED even if a user changes
    // zoom level in his browser!

    const raw = localStorage.getItem(KEY__PLAYER_CAPTION_DISPLAY_SETTINGS)
    let ccDisplaySettings;
    try {
        ccDisplaySettings = JSON.parse(JSON.parse(raw).data)
    } catch(e) {
        ccDisplaySettings = {}
    }
    const fontSizeIncrement = ccDisplaySettings.fontSizeIncrement || 0
    let newGap = getGapSize(fontSizeIncrement, SUBS_GAP);
    document.querySelector(PLAYER_ELT_SELECTOR).style.setProperty('--subs-gap', `${newGap}px`)
    newGap = getGapSize(fontSizeIncrement, SUBS_GAP_THEATER)
    document.querySelector(PLAYER_ELT_SELECTOR).style.setProperty('--subs-gap-theater', `${newGap}px`)
}

/** Checks if local storage has a setting for 
 * enabled/disabled subs.
 * 
 * **NOTE**: This setting might not be in local storage even
 * if a registered YT user enabled subtitles globally 
 * with YT settings. 
 * @returns {Bool} 
 */
function areSubsEnabled() {
    const raw = localStorage.getItem(KEY__PLAYER_STICKY_CAPTION)
    try {
        return JSON.parse(JSON.parse(raw).data)
    } catch(e) {
        return false
    }
}

function init() {
    addStyles(USERJS_STYLE_CONTENT, USERJS_STYLE_ID)

    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)

    // Hint about youtube-specific events was found there
    // https://stackoverflow.com/questions/34077641/how-to-detect-page-navigation-on-youtube-and-modify-its-appearance-seamlessly/34100952#34100952
    document.addEventListener('yt-navigate-finish', enchanceSubsButton)
    document.addEventListener('yt-page-data-updated', enchanceSubsButton)

    localStorageHook();

    window.addEventListener('storageSetItem', e => {
        const { key } = e.detail;

        // console.log(`YT local storage "${key}" was updated`)

        switch (key) {
            case KEY__PLAYER_CAPTION_DISPLAY_SETTINGS:
                
                updateGapSize()
                break;

            case KEY__PLAYER_STICKY_CAPTION:
    
                // if sticky subs are enabled - displace subs
                displaceSubtitles(areSubsEnabled())
                break;

            default:
                break;
        }

    })
}

init();