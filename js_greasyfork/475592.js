// ==UserScript==
// @name            南+自动统一域名
// @namespace       http://tampermonkey.net/
// @version         0.1
// @description     自动将域名统一为当前使用的南+域名
// @author          FetchTheMoon & shadows
// @run-at          document-end
// @grant           none
// @license         GPL-3.0 License
// @match           https://*.blue-plus.net/*
// @match           https://*.spring-plus.net/*
// @match           https://*.summer-plus.net/*
// @match           https://*.soul-plus.net/*
// @match           https://*.south-plus.net/*
// @match           https://*.north-plus.net/*
// @match           https://*.snow-plus.net/*
// @match           https://*.level-plus.net/*
// @match           https://*.white-plus.net/*
// @match           https://*.imoutolove.me/*
// @match           https://*.south-plus.org/*
// @match           https://*.east-plus.net/*
// --------------------------------------------
// @match           https://blue-plus.net/*
// @match           https://spring-plus.net/*
// @match           https://summer-plus.net/*
// @match           https://soul-plus.net/*
// @match           https://south-plus.net/*
// @match           https://north-plus.net/*
// @match           https://snow-plus.net/*
// @match           https://level-plus.net/*
// @match           https://white-plus.net/*
// @match           https://imoutolove.me/*
// @match           https://south-plus.org/*
// @match           https://east-plus.net/*
// --------------------------------------------
// @downloadURL https://update.greasyfork.org/scripts/475592/%E5%8D%97%2B%E8%87%AA%E5%8A%A8%E7%BB%9F%E4%B8%80%E5%9F%9F%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/475592/%E5%8D%97%2B%E8%87%AA%E5%8A%A8%E7%BB%9F%E4%B8%80%E5%9F%9F%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const arr = [...document.querySelectorAll("a")];
    const domains = [
        "blue-plus.net",
        "east-plus.net",
        "spring-plus.net",
        "summer-plus.net",
        "soul-plus.net",
        "south-plus.net",
        "north-plus.net",
        "snow-plus.net",
        "level-plus.net",
        "white-plus.net",
        "imoutolove.me",
        "south-plus.org",
    ];
    const checker = value => domains.some(element => value.href.includes(element));

    arr.filter(checker).filter(ele => !ele.href.includes(window.location.hostname)).forEach(ele => {
        console.debug("替换链接:", ele);
        const oldURL=ele.href
        let newURL = new URL(oldURL);
        newURL.hostname = window.location.hostname;
        if (ele.text.trim()==oldURL) ele.text=newURL.href
        ele.href = newURL.href;
    });
})();