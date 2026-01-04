// ==UserScript==
// @name        MDN 自动切换中文
// @namespace   https://greasyfork.org/zh-CN/scripts/421190
// @version     0.5
// @author      zhenhappy<q505507538@gmail.com>
// @description 谷歌搜索的时候经常点击MDN文档打开的默认都是英文的, 很不方便, 来一个自动跳转, 如果需要其他语言, 手动点页面切换即可
// @icon        https://developer.mozilla.org/favicon-512x512.png
// @match       https://developer.mozilla.org/**
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/421190/MDN%20%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/421190/MDN%20%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
    if (window.name !== 'true') {
        window.name = true
        var url = window.location.href.replace(/(developer\.mozilla\.org\/(?!zh\-CN))([^/]+)(\/.*)$/i, '$1zh-CN$3')
        window.location.href !== url && window.location.replace(url)
        document.querySelector('.mdn-cta-container').style.display = 'none'
    }
})()