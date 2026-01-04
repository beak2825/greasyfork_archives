// ==UserScript==
// @name                Youtube自动切中文
// @namespace           HeyTang
// @version             0.1.3
// @description         Youtube-自动切中文
// @author              只是条咸鱼罢了
// @match               *://*.youtube.com/watch?*
// @downloadURL https://update.greasyfork.org/scripts/437365/Youtube%E8%87%AA%E5%8A%A8%E5%88%87%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/437365/Youtube%E8%87%AA%E5%8A%A8%E5%88%87%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

async function test() {
    if (document.querySelector(".ytp-subtitles-button").getAttribute("style")!="display: none;") {
        if (document.querySelector(".ytp-subtitles-button").getAttribute("aria-pressed") == "false") {
            document.querySelector(".ytp-subtitles-button").click()
        }
        document.querySelector(".ytp-settings-button").click()
        document.querySelector(".ytp-settings-menu .ytp-panel .ytp-panel-menu > div:nth-last-child(2)").click()
        await sleep(500)
        document.querySelector(".ytp-settings-menu .ytp-panel .ytp-panel-menu > div:nth-last-child(1)").click()
        await sleep(500)
        document.querySelector(".ytp-settings-menu .ytp-panel .ytp-panel-menu > div:nth-last-child(2)").click()
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

test()