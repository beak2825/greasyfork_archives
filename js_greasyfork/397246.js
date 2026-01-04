// ==UserScript==
// @name         youtube一键搜bilibili
// @namespace    http://tampermonkey.net/
// @version      0.1.1.4
// @description  在油管一键搜b站同名视频
// @author       王泥巴
// @match https://*.youtube.com/*
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/397246/youtube%E4%B8%80%E9%94%AE%E6%90%9Cbilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/397246/youtube%E4%B8%80%E9%94%AE%E6%90%9Cbilibili.meta.js
// ==/UserScript==
// @code         https://greasyfork.org/zh-CN/scripts/397246

(function() {
    let interval = setInterval(function(){
        //let containerH1 = document.querySelector("#title > h1 > yt-formatted-string")
        let containerH1 = document.querySelector("#container > h1 > yt-formatted-string")
        containerH1.style.display="inline"
        let bilibiliSearch = document.querySelector("#bilibiliSearch")
        if (!bilibiliSearch) {
            let addLink = " <a href='' target='_blank' style='font-size: 1px;' id='bilibiliSearch'>一键搜B站</a>"
            bilibiliSearch = containerH1.insertAdjacentHTML('afterend', addLink);
        }
        let searchLink = "https://search.bilibili.com/all?keyword=" + containerH1.textContent.trim()
        if (bilibiliSearch.href != searchLink) {
            bilibiliSearch.href = searchLink
        }

        let divUperName = document.querySelector("#text-container")
        divUperName.style.display="inline"
        let bilibiliSearchUperName = document.querySelector("#bilibiliSearchUperName")
        if (!bilibiliSearchUperName) {
            let addLink = " <a href='' target='_blank' style='font-size: 1px;' id='bilibiliSearchUperName'>一键搜B站</a>"
            bilibiliSearchUperName = divUperName.insertAdjacentHTML('afterend', addLink);
        }
        let searchLinkUperName = "https://search.bilibili.com/upuser?keyword=" + divUperName.textContent.trim()
        if (bilibiliSearchUperName.href != searchLinkUperName) {
            bilibiliSearchUperName.href = searchLinkUperName
        }


    }, 500);
})();
