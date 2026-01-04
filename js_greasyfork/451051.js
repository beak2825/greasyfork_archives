// ==UserScript==
// @name         GiteeDelAd
// @namespace    no
// @version      0.2
// @description  删除牛皮藓
// @author       superSao
// @match        gitee.com/*

// @downloadURL https://update.greasyfork.org/scripts/451051/GiteeDelAd.user.js
// @updateURL https://update.greasyfork.org/scripts/451051/GiteeDelAd.meta.js
// ==/UserScript==

let set = setInterval(delDom, 100)

// DOM加载完毕
window.onload = function () {
    setTimeout(() => {
        window.clearInterval(set)
        console.log("success");
    }, 3 * 1000);

}

let AdClassName = [
    ".header-container > a",
    ".wechat-banner",
    ".recommend-container",
    ".my-star-collection-popup",
    "#feedback-btn",
]

function delDom() {
    for (const item of AdClassName) {
        $(item).remove();
    }
}

