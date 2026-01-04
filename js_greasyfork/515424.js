// ==UserScript==
// @name         bilibili关注分组完全展开
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  bilibili关注分组列表完全展开
// @author       Y_jun
// @match        https://space.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515424/bilibili%E5%85%B3%E6%B3%A8%E5%88%86%E7%BB%84%E5%AE%8C%E5%85%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/515424/bilibili%E5%85%B3%E6%B3%A8%E5%88%86%E7%BB%84%E5%AE%8C%E5%85%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

'use strict';

function change() {
    if (location.pathname.includes('/fans')) {
        let iv2 = setInterval(() => {
            let leftBar = document.querySelector('.follow-sidenav');
            if (leftBar) {
                let followBar = leftBar.querySelector('.follow-container');
                let fanBar = leftBar.querySelector('.topic-container');
                leftBar.insertBefore(fanBar, followBar);
                let followList = followBar.querySelector(".follow-list-container");
                followList.style.maxHeight = 'none';
                let followScroll = followBar.querySelector(".ps__rail-y");
                if (followScroll) followScroll.remove();
                clearInterval(iv2);
            }
        }, 200);
    }
}

addEventListener("load", () => {
    change();
    let iv = setInterval(() => {
        const targetDiv = document.querySelector('.s-space');
        if (targetDiv) {
            const observer = new MutationObserver((mutationsList) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        change();
                    }
                }
            });

            observer.observe(targetDiv, { childList: true });
            clearInterval(iv);
        }
    }, 200);

});
