// ==UserScript==
// @name         B站专栏复制解锁
// @namespace    limgmk/bilibili-article-copy-unlock
// @version      0.0.1
// @description  B站专栏文章内容复制解锁
// @author       Limgmk
// @include     http*://www.bilibili.com/read/cv*
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/411026/B%E7%AB%99%E4%B8%93%E6%A0%8F%E5%A4%8D%E5%88%B6%E8%A7%A3%E9%94%81.user.js
// @updateURL https://update.greasyfork.org/scripts/411026/B%E7%AB%99%E4%B8%93%E6%A0%8F%E5%A4%8D%E5%88%B6%E8%A7%A3%E9%94%81.meta.js
// ==/UserScript==

(function () {
    unlock();
})();

function unlock() {
    var head = getElementByXpath("//head");
    var style = document.createElement("style");
    style.innerHTML = `
        .article-holder.unable-reprint {
            user-select: text;
            -webkit-user-select: text;
        }
    `
    head.insertBefore(style, null);
}

function getElementByXpath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}