// ==UserScript==
// @name         Remove BiliBili AD Block Warning
// @namespace    https://www.xumumi.com
// @version      2024-05-27
// @description  移除 B 站的广告屏蔽警告，顺便清除直播推荐等卡片
// @author       xumumi
// @match        https://www.bilibili.com/
// @icon         https://www.bilibili.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492528/Remove%20BiliBili%20AD%20Block%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/492528/Remove%20BiliBili%20AD%20Block%20Warning.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const observer = new MutationObserver(mutations => {
        const tip = document.getElementsByClassName('adblock-tips')[0]
        tip?.parentNode?.removeChild(tip);
        const rmcds = document.getElementsByClassName("bili-video-card is-rcmd")
        for (const rcmd of rmcds) {
            if (isAdBlockWarning(rcmd)) {
                const card = rcmd.parentNode
                card.removeChild(rcmd)
                if (card.classList.value === "feed-card") card.parentNode.removeChild(card)
            }
        }
        removeElement("floor-single-card")
        removeElement("bili-live-card")
        removeElement("left-loc-entry")
        removeElement("recommended-swipe grid-anchor")

        const feedCards = document.getElementsByClassName("feed-card")
        for(const feedCard of feedCards){
            feedCard.style.marginTop = 0
        }

        const videoCards = document.getElementsByClassName("bili-video-card")
        for(const videoCard of videoCards){
            videoCard.style.marginTop = 0
        }
    })
    observer.observe(document, { childList: true, subtree: true })
})();

function isAdBlockWarning(element) {
    const tip = element.childNodes;
    return tip[1]?.tagName === "DIV";
}

function removeElement(className){
    const elements = document.getElementsByClassName(className)
    for (const element of elements) element.parentNode.removeChild(element)
}
