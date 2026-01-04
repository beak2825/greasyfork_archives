// ==UserScript==
// @name         ニコニ広告を割りこませない
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  検索結果に割りこんでくるニコニ広告を隠すだけ
// @author       You
// @match        http://www.nicovideo.jp/search/*
// @match        http://www.nicovideo.jp/tag/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36421/%E3%83%8B%E3%82%B3%E3%83%8B%E5%BA%83%E5%91%8A%E3%82%92%E5%89%B2%E3%82%8A%E3%81%93%E3%81%BE%E3%81%9B%E3%81%AA%E3%81%84.user.js
// @updateURL https://update.greasyfork.org/scripts/36421/%E3%83%8B%E3%82%B3%E3%83%8B%E5%BA%83%E5%91%8A%E3%82%92%E5%89%B2%E3%82%8A%E3%81%93%E3%81%BE%E3%81%9B%E3%81%AA%E3%81%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement("style")
    style.innerHTML = `
.contentBody .nicoadVideoItem {
display:none;
}
`;
    document.body.appendChild(style)
})();