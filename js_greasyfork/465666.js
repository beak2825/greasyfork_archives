// ==UserScript==
// @name         解析直播源
// @namespace    https://your-namespace-here/
// @version      1.0
// @description  解析直播源并自动打开
// @match        https://m.bttdbje.cn/appapi/?service=Live.GetLiveInfo*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465666/%E8%A7%A3%E6%9E%90%E7%9B%B4%E6%92%AD%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/465666/%E8%A7%A3%E6%9E%90%E7%9B%B4%E6%92%AD%E6%BA%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 解析直播源并自动打开
    function parseJson() {
        try {
            const jsonData = JSON.parse(document.body.innerText);
            const pullUrl = jsonData.data.info[0].pull;
            fy_bridge_app.playVideoopen(pullUrl);
            window.open(pullUrl);
        } catch (e) {
            console.error(e);
        }
    }

    // 等待JSON数据加载完毕
    function waitJson() {
        if (document.readyState === 'complete') {
            setTimeout(parseJson, 1000);
        } else {
            setTimeout(waitJson, 100);
        }
    }

    waitJson();
})();
