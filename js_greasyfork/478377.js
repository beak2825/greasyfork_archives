// ==UserScript==
// @name         B站广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bilibili站广告屏蔽
// @author       MXXXXXS
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478377/B%E7%AB%99%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/478377/B%E7%AB%99%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
const banElSearchClassNameList = [
    ".living", "floor-single-card", // 直播
    ".bili-video-card__info--ad", "feed-card",// 贴片广告
    ".bili-video-card__info--creative-ad", "feed-card",
    ".recommended-swipe-core", "recommended-swipe" // 滚动推荐栏
]

const searchMaxCount = 10
let searchCount = 0

const timer = setInterval(searchAd, 100)

function searchAd() {
    searchCount++
    if (searchCount > searchMaxCount) {
        clearInterval(timer)
        return
    }
    outFor: for (let index = 0; index < banElSearchClassNameList.length; index += 2) {
        const banElClassName = banElSearchClassNameList[index];
        const banElContainerClassName = banElSearchClassNameList[index + 1];
        const adEl = document.querySelector(banElClassName)
        const maxLevel = 10
        let counter = 0
        let curParentEl = adEl?.parentElement
        let found = false
        if (!curParentEl) {
            console.log("没找到广告")
            continue
        }
        outWhile: while (counter < maxLevel && !found) {
            if (!curParentEl) {
                continue outFor
            }
            const elClassNames = Array.from(curParentEl.classList)
            if (elClassNames.includes(banElContainerClassName)) {
                found = true
                curParentEl.parentElement.removeChild(curParentEl)
                console.log("找到并屏蔽了", curParentEl)
                break outWhile;
            }

            curParentEl = curParentEl.parentElement
            counter++
        }
        if (!found) {
            console.log("没找到广告")
        }
    }
}