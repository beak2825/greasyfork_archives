// ==UserScript==
// @name          监听DOM完成事件
// @namespace     https://example.com/
// @description   HTML → [解析中] → 构建 DOM → DOMContentLoaded → 加载资源（CSS/JS/IMG） → load → document-idle
// @match         *://*/*
// @version       1.0.0
// @run-at        document-start
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/540079/%E7%9B%91%E5%90%ACDOM%E5%AE%8C%E6%88%90%E4%BA%8B%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/540079/%E7%9B%91%E5%90%ACDOM%E5%AE%8C%E6%88%90%E4%BA%8B%E4%BB%B6.meta.js
// ==/UserScript==


(function inject() {
    const FLAG_KEY = "__hasPostedDomReady";
    function domReady() {
        if (window[FLAG_KEY]) return;
        window[FLAG_KEY] = true;
        window.webkit?.messageHandlers?.domReady?.postMessage(location.href);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", domReady);
    } else {
        domReady();
    }
})();
