// ==UserScript==
// @name        Chrome CRX Downloader
// @namespace   https://github.com/YandLiu/Userscripts/
// @match       https://chrome.google.com/webstore/detail/*
// @grant       none
// @version     1.0
// @author      YandLiu
// @description 4/3/2021, 1:52:08 AM
// @downloadURL https://update.greasyfork.org/scripts/424390/Chrome%20CRX%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/424390/Chrome%20CRX%20Downloader.meta.js
// ==/UserScript==

(function (root) {
    "use strict";
    var listeners = [];
    var doc = window.document;
    var MutationObserver =
        window.MutationObserver || window.WebKitMutationObserver;
    var observer;

    function ready(selector, fn) {
        // 储存选择器和回调函数
        listeners.push({
            selector: selector,
            fn: fn,
        });
        if (!observer) {
            // 监听document变化
            observer = new MutationObserver(check);
            observer.observe(doc.documentElement, {
                childList: true,
                subtree: true,
            });
        }
        // 检查该元素是否已经在DOM中
        check();
    }

    function check() {
        // 检查DOM元素是否匹配已储存的元素
        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];
            // 检查指定元素是否有匹配
            var elements = document.querySelectorAll(listener.selector);
            for (var j = 0; j < elements.length; j++) {
                var element = elements[j];
                // 确保回调函数只会对该元素调用一次
                if (!element.ready) {
                    element.ready = true;
                    // 对该元素调用回调函数
                    listener.fn.call(element, element);
                }
            }
        }
    }

    // 对外暴露ready
    root.ready = ready;
})(window);

(function () {
    "use strict";
    ready("h1", insert);
})();

function insert() {
    var link =
        "https://clients2.google.com/service/update2/crx?response=redirect&nacl_arch=" +
        "&prodversion=89.0.4389.90" +
        "&acceptformat=crx2,crx3&x=id%3D" +
        document.location.href.split("/")[6].split("?")[0] +
        "%26installsource%3Dondemand%26uc";
    var title = document.querySelector("h1");
    var a = document.createElement("a");
    a.href = link;
    a.innerText = " Download";
    title.appendChild(a);
}
