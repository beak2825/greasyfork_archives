// ==UserScript==
// @name         Bilibili DD体验优化 - 标题栏直接跳转管人区
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将B站视频和主页的菜单栏上的【主播】修改为虚拟主播，简化了跳转操作
// @author       yyly
// @match        *://www.bilibili.com/*
// @grant        none
// @namespace https://greasyfork.org/zh-CN/users/692472-necrosn
// @run-at document-end


// @downloadURL https://update.greasyfork.org/scripts/417160/Bilibili%20DD%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%20-%20%E6%A0%87%E9%A2%98%E6%A0%8F%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E7%AE%A1%E4%BA%BA%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/417160/Bilibili%20DD%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%20-%20%E6%A0%87%E9%A2%98%E6%A0%8F%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E7%AE%A1%E4%BA%BA%E5%8C%BA.meta.js
// ==/UserScript==
const changeToVUP = (urlElement, newURL="https://live.bilibili.com/p/eden/area-tags?areaId=371&parentAreaId=9") => {
    urlElement.innerHTML = "虚拟主播";
    urlElement.href = newURL;
};

window.onload = (function() {
    var headerElement = document.getElementById('internationalHeader');
    if (headerElement != null){
        // static
        var navLinkElement = headerElement.getElementsByClassName('nav-link-ul')[0];
        var liveElement = navLinkElement.getElementsByClassName('nav-link-item')[3];
        var urlElement = liveElement.getElementsByTagName('a')[0];
        changeToVUP(urlElement);
    } else {
        // dynamic
            // 监视 .item 的 DOM 树 childList 变化
        new MutationObserver((mutations, self) => {
            mutations.forEach(({ addedNodes }) => {
                try {
                    headerElement = document.getElementById('internationalHeader');
                    var navLinkElement = headerElement.getElementsByClassName('nav-link-ul mini')[0];
                    var liveElement = navLinkElement.getElementsByClassName('nav-link-item')[3];
                    var urlElement = liveElement.getElementsByTagName('a')[0];
                    changeToVUP(urlElement);
                    self.disconnect();
                } catch (e) {
                    // pass
                    console.log("Error");
                }
            });
        }).observe(document.getElementById('app'), { childList: true });
    }
})();