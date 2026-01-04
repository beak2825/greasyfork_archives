// ==UserScript==
// @name         FANZAキャッチ 常時表示
// @namespace    http://tampermonkey.net/
// @version      2024-03-16
// @description  FANZAキャッチのクレーンゲーム画面を常時表示します
// @author       fitudao3788
// @match        https://catch.dmm.co.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dmm.co.jp
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/xhook@1.6.2/dist/xhook.min.js
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/489942/FANZA%E3%82%AD%E3%83%A3%E3%83%83%E3%83%81%20%E5%B8%B8%E6%99%82%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/489942/FANZA%E3%82%AD%E3%83%A3%E3%83%83%E3%83%81%20%E5%B8%B8%E6%99%82%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    xhook.after((req, res) => {
        if(req.url.match(/^https:\/\/api\.catch\.dmm\.co\.jp\/api\/(crane|play)\//)) {
            let resData = JSON.parse(res.text);
            resData.data.station.status = 3;
            res.text = JSON.stringify(resData);
        }
    });
})();