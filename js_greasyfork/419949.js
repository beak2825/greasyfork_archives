// ==UserScript==
// @name         知乎简书网站自动跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  知乎、简书自动跳转到外部网页
// @author       niayyy
// @match        https://www.jianshu.com/go-wild*
// @match        https://link.zhihu.com/?target=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419949/%E7%9F%A5%E4%B9%8E%E7%AE%80%E4%B9%A6%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/419949/%E7%9F%A5%E4%B9%8E%E7%AE%80%E4%B9%A6%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let redirectObj = {
        jianshu,
        zhihu,
    }
    let href = window.location.href;
    let search = window.location.search.slice(1)


    redirectObj[parseHref()]()

    function parseHref() {
        let keys = Object.keys(redirectObj)
        for (let i = 0; i < keys.length; i++) {
            if(href.includes(keys[i])) {
                return keys[i]
            }
        }
    }
    function jianshu() {
        let arr = search.split('&')
        let str = arr.find(p => p.includes('url'))
        let url = decodeURIComponent(str.split('=')[1])
        open(url, '_self')
    }
    function zhihu() {
        let arr = search.split('&')
        let str = arr.find(p => p.includes('target'))
        let url = decodeURIComponent(str.split('=')[1])
        open(url, '_self')
    }
})();