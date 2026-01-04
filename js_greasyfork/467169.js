// ==UserScript==
// @name         CC特效屏蔽 & 特殊时期弹幕开启
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  看狗狗直播间时屏蔽特效和开启弹幕，只处理了当前看到的，如果还有别的再加
// @author       lruc
// @match        https://cc.163.com/361433/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467169/CC%E7%89%B9%E6%95%88%E5%B1%8F%E8%94%BD%20%20%E7%89%B9%E6%AE%8A%E6%97%B6%E6%9C%9F%E5%BC%B9%E5%B9%95%E5%BC%80%E5%90%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/467169/CC%E7%89%B9%E6%95%88%E5%B1%8F%E8%94%BD%20%20%E7%89%B9%E6%AE%8A%E6%97%B6%E6%9C%9F%E5%BC%B9%E5%B9%95%E5%BC%80%E5%90%AF.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', () => {
        // 视频弹幕显示
        window.ccplayer.player.comment.commentSwitch = true
        // 屏蔽礼物特效
        const fn = () => {
            ;[...document.querySelector('.ban-effect-list').children].forEach(v => {
                if (!v.classList.contains('selected')) {
                    v.click()
                }
            })
        }
        fn()
        setTimeout(fn, 5000)

        // 广告隐藏
        const styleTag = document.createElement('style')
        styleTag.innerText = `
div[id^="float-plugin-container"], div[id^="live-left-plugin"], div.room-tabs, div.ui-book {
display: none !important
}
#chat-list-con {
height: 100% !important
}
`
        document.head.appendChild(styleTag)
    })
})();