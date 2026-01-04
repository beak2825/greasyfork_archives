// ==UserScript==
// @name AutoCloseYoutubeMiniplayer
// @namespace javran
// @version 0.1
// @description Auto close Youtube miniplayer
// @author Javran
// @include https://www.youtube.com/*
// @require https://code.jquery.com/jquery-3.4.1.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/418572/AutoCloseYoutubeMiniplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/418572/AutoCloseYoutubeMiniplayer.meta.js
// ==/UserScript==

(() => {
    'use strict'
    // credit: https://stackoverflow.com/a/46428962
    let oldHref = document.location.href
    window.onload = () => {
        let bodyList = document.querySelector('body')
        let observer = new MutationObserver(ms => {
            ms.forEach(_m => {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href
                    // allow some delay for page to load.
                    setTimeout(() => {
                        const jq = $('#movie_player > div.ytp-miniplayer-ui > div > button.ytp-miniplayer-close-button.ytp-button')
                        if (jq.length && !document.location.href.startsWith('https://www.youtube.com/watch?')) {
                            jq.click()
                            console.log('[AutoCloseYoutubeMiniplayer] miniplayer dismissed')
                        }}, 200)
                }
            })
        })
        observer.observe(bodyList, {childList: true, subtree: true})
    }
})()