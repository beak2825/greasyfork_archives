// ==UserScript==
// @name         hiyoko月同接过滤B站
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       jがすdygk
// @match        https://hiyoko.sonoj.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401622/hiyoko%E6%9C%88%E5%90%8C%E6%8E%A5%E8%BF%87%E6%BB%A4B%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/401622/hiyoko%E6%9C%88%E5%90%8C%E6%8E%A5%E8%BF%87%E6%BB%A4B%E7%AB%99.meta.js
// ==/UserScript==

(function () {
    waitUntilElementLoaded('img[src="/img/bilibililogo24.png"]', 999999999).then(function () {
        Array.from(document.querySelectorAll('img[src="/img/bilibililogo24.png"]')).map(el => el.parentNode.parentNode.style.display = 'none');
        Array.from(document.querySelectorAll('img[src="/img/twcastlogo26.png"]')).map(el => el.parentNode.parentNode.style.display = 'none');
    })

    function waitUntilElementLoaded(selector) {
        var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var start = performance.now();
        var now = 0;
        return new Promise(function (resolve, reject) {
            var interval = setInterval(function () {
                var element = document.querySelector(selector);
                if (element instanceof Element) {
                    clearInterval(interval);
                    resolve();
                }
                now = performance.now();
                if (now - start >= timeout) {
                    reject("Could not find the element " + selector + " within " + timeout + " ms");
                }
            }, 100);
        });
    }
})();