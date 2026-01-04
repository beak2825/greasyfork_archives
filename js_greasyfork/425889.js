// ==UserScript==
// @name         B站动态页header固定（消息、动态、收藏、历史栏）
// @namespace    http://tampermonkey.net/
// @version      0.0.0.7
// @description  每次点收藏历史都要拉到顶部烦死了！
// @author       王泥巴
// @grant        none
// @icon         https://bilibili.com/favicon.ico
// @match        https://t.bilibili.com/*
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/425889/B%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5header%E5%9B%BA%E5%AE%9A%EF%BC%88%E6%B6%88%E6%81%AF%E3%80%81%E5%8A%A8%E6%80%81%E3%80%81%E6%94%B6%E8%97%8F%E3%80%81%E5%8E%86%E5%8F%B2%E6%A0%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/425889/B%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5header%E5%9B%BA%E5%AE%9A%EF%BC%88%E6%B6%88%E6%81%AF%E3%80%81%E5%8A%A8%E6%80%81%E3%80%81%E6%94%B6%E8%97%8F%E3%80%81%E5%8E%86%E5%8F%B2%E6%A0%8F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    let interval = setInterval(function(){
        let bili_header = document.querySelector(".bili-header")
        let main = document.querySelector("#app")
        let a_dong_tai = document.querySelector("#bili-header-container > div > div > ul.right-entry > li:nth-child(4) > a")
        if (bili_header && bili_header.style && main && main.style && a_dong_tai){
            bili_header.style.position = "fixed"
            bili_header.style.width = "100%"
            bili_header.style.top = "0px"
            bili_header.style.zIndex = "999"
            bili_header.addEventListener("click", function (e) {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                //let div1 = document.querySelector("#internationalHeader > div > div > div.nav-link")
                //let div2 = document.querySelector("#internationalHeader > div > div > div.nav-search-box")
                //let div3 = document.querySelector("#internationalHeader > div > div > div.nav-user-center")
                //if (!div1.contains(e.target) && !div2.contains(e.target) && !div3.contains(e.target)) {
                //    document.body.scrollTop = document.documentElement.scrollTop = 0;
                //}
            })
            main.style['margin-top'] = "64px"
            a_dong_tai.target='_self'
            clearInterval(interval)
        }
    }, 100)
})();