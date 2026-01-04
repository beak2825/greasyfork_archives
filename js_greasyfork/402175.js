// ==UserScript==
// @include           https://ke.qq.com/*
// @version           0.1.0
// @namespace         keqq.AdBlocker
// @name              remove keqq watermark
// @description       remove watermark in keqq
// @name:zh-CN        移除腾讯课堂水印
// @description:zh-CN 移除腾讯课堂课程中的水印
// @downloadURL https://update.greasyfork.org/scripts/402175/remove%20keqq%20watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/402175/remove%20keqq%20watermark.meta.js
// ==/UserScript==

;(function () {

    // don't run in iframe
    if (window.top != window.self)
        return

    let prependElement = (ele, subEle) => {
        ele.innerHTML = subEle + ele.innerHTML
        return ele
    }

    let appendElement = (ele, subEle) => {
        ele.innerHTML = ele.innerHTML + subEle
        return ele
    }

    let generateStyle = (styles) => {
        return styles.join(';')
    }

    let generateCSS = (selector, styles) => {
        return `${selector}{${generateStyle(styles)}}`
    }

    appendElement(
        document.head,
        `<style>${generateCSS('[class*="player-marquee"]', [
            'display:none'
      ])}</style>`
    )

})()