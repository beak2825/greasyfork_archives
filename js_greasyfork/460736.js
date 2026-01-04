// ==UserScript==
// @name         arca.live 채널 구독자순 정렬
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  아카라이브 채널 페이지 자동 구독자순 정렬
// @author       Miug
// @match        https://arca.live/channels
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arca.live
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/460736/arcalive%20%EC%B1%84%EB%84%90%20%EA%B5%AC%EB%8F%85%EC%9E%90%EC%88%9C%20%EC%A0%95%EB%A0%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/460736/arcalive%20%EC%B1%84%EB%84%90%20%EA%B5%AC%EB%8F%85%EC%9E%90%EC%88%9C%20%EC%A0%95%EB%A0%AC.meta.js
// ==/UserScript==

/* globals jQuery, $ */

(function() {
    'use strict';

    const getItemSubscribers = (item) => {
        const infoBoxText = $(item).find('.info').text();
        return parseInt(infoBoxText.match(/(\d+)/)[0]);
    };

    const main = () => {
        const boardItems = $('.board-list > .board-item').toArray()
            .sort((a, b) => getItemSubscribers(b) - getItemSubscribers(a));
        $('.board-list').empty();
        $('.board-list').append(boardItems);
    };

    main();
})();