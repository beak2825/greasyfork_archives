// ==UserScript==
// @name         arcalive hotdeal post counter
// @namespace    http://tampermonkey.net/
// @version      2024-03-16
// @description  count hot deal post and display post description
// @author       BOI
// @match        http://arca.live/b/hotdeal*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489969/arcalive%20hotdeal%20post%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/489969/arcalive%20hotdeal%20post%20counter.meta.js
// ==/UserScript==

const getUserLink = () => {
    document.querySelector('div.member-info')?.children[0].children[0].getAttribute('href');
};

const getUserInfo = async (url) => {
    let cnt = 0;
    const res = await fetch(url);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const recent = doc.querySelectorAll('div.user-recent');

    for (let i = 0; i < 15; i++) {
        cnt += recent[i].children[0].children[0]?.getAttribute('href') == '/b/hotdeal';
    }

    const info = document.querySelector('div.article-info.article-info-section');
    info.innerHTML = `<span class="head">최근 핫딜 게시물 수</span><span class="body">${cnt}</span><span class="sep"></span>` + info.innerHTML;
};

(function() {
    'use strict';
    const userLink = getUserLink();

    if (userLink && window.location.href.indexOf('/b/hotdeal') != -1) {
        getUserInfo(userLink);
    }
})();