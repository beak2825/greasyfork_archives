// ==UserScript==
// @name         梦幻手游藏宝阁去除视频展示
// @icon         https://cbg2.fp.ps.netease.com/file/60094a9f96dee42ea1daa2bbo32709UE03
// @version      1.0
// @description  去除梦幻西游手游藏宝阁的详情页面顶部视频
// @author       no_author
// @match        https://my.cbg.163.com/*
// @grant        window.onurlchange
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-end
// @license MIT
// @namespace https://greasyfork.org/users/1229104
// @downloadURL https://update.greasyfork.org/scripts/481512/%E6%A2%A6%E5%B9%BB%E6%89%8B%E6%B8%B8%E8%97%8F%E5%AE%9D%E9%98%81%E5%8E%BB%E9%99%A4%E8%A7%86%E9%A2%91%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/481512/%E6%A2%A6%E5%B9%BB%E6%89%8B%E6%B8%B8%E8%97%8F%E5%AE%9D%E9%98%81%E5%8E%BB%E9%99%A4%E8%A7%86%E9%A2%91%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==


var initial = function () {
    if (!document.URL.startsWith("https://my.cbg.163.com/cgi/mweb/equip")) {
        return;
    }
    if (document.getElementsByClassName('equip-video-info').length) {
        const dom = document.getElementsByClassName('equip-video-info')
        dom[0].remove()
    }
};

//main
function main() {
    setInterval(function () {
        if (!document.URL.startsWith("https://my.cbg.163.com/cgi/mweb/equip")) {
            return;
        }
        if (document.getElementsByClassName('equip-video-info').length) {
            const dom = document.getElementsByClassName('equip-video-info')
            console.log({dom})
            dom[0].remove()
        }
    }, 500);
}

if (window.onurlchange === null) {
    window.addEventListener("urlchange", (info) => {
        initial();
        main();
    });
}
