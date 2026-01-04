// ==UserScript==
// @name               PTT Comment Auto Update & Reload
// @name:zh-TW         PTT 留言自動更新載入
// @namespace          wellstsai.com
// @version            1.0.1
// @license            MIT
// @description        Automatically enables comment auto-update on PTT webpages and reloads the page upon errors.
// @description:zh-TW  自動啟用 PTT 網頁的留言自動更新功能，並在發生錯誤時重新載入網頁。
// @author             WellsTsai
// @match              https://www.ptt.cc/*
// @grant              none
// @run-at             document-idle
// @downloadURL https://update.greasyfork.org/scripts/518289/PTT%20Comment%20Auto%20Update%20%20Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/518289/PTT%20Comment%20Auto%20Update%20%20Reload.meta.js
// ==/UserScript==

(() => {
    'use strict'

    const enableAutoUpdate = () => {
        const pollerDiv = document.querySelector('#article-polling')

        if (!pollerDiv) {
            console.warn('PTT AutoReload: #article-polling not found.')
            return
        }

        pollerDiv.click()
        console.log('PTT AutoReload: Auto-update enabled.')

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.target.textContent.includes('無法更新推文')) {
                    console.warn('PTT AutoReload: Detected update error, reloading page...')
                }
            })
        })

        observer.observe(pollerDiv, { childList: true, subtree: true })
    }

    enableAutoUpdate()
})()
