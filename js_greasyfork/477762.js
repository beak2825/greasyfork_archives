// ==UserScript==
// @name         军团珠宝跳转国服市集
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  跳转地址劫持
// @author       Rxdey
// @match        https://vilsol.github.io/timeless-jewels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477762/%E5%86%9B%E5%9B%A2%E7%8F%A0%E5%AE%9D%E8%B7%B3%E8%BD%AC%E5%9B%BD%E6%9C%8D%E5%B8%82%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/477762/%E5%86%9B%E5%9B%A2%E7%8F%A0%E5%AE%9D%E8%B7%B3%E8%BD%AC%E5%9B%BD%E6%9C%8D%E5%B8%82%E9%9B%86.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const TRAD_URL = 'https://poe.game.qq.com/trade/search';
    const transformUrl = (url) => {
        let params = url.searchParams;
        let query = JSON.parse(decodeURIComponent(params.get('q')));
        // 识别不出英文名字类型，直接删除
        delete query.query.name;
        delete query.query.type;
        // 在线状态改成任何
        query.query.status.option = 'any';
        window.temp_Open(`${TRAD_URL}?q=${encodeURIComponent(JSON.stringify(query))}`);
    };
    window.temp_Open = window.open;
    // 劫持window.open
    window.open = (url, tag) => {
        // console.log(JSON.stringify(url));
        if (!/^https\:\/\/www\.pathofexile\.com\/trade\/search\//.test(url.href)) {
            window.temp_Open(url, tag);
            return;
        }
        transformUrl(url);
    };

})();