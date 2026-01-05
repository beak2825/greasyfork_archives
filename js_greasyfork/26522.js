// ==UserScript==
// @name         Sports-replace-feed
// @version      0.2
// @namespace    replace-feed-to-mynews
// @description  Скрипт меняет "Мою ленту" и ссылку (sports.ru/feed/) на "Новости", устанавливая при этом на них ссылку sports.ru/my/news/
// @include        https://www.sports.ru/*
// @author       dimisa
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26522/Sports-replace-feed.user.js
// @updateURL https://update.greasyfork.org/scripts/26522/Sports-replace-feed.meta.js
// ==/UserScript==

window.setTimeout(
	function check() {
    var anchors = document.querySelectorAll('a[href^="/feed/"]');
Array.prototype.forEach.call(anchors, function (element, index) {
element.href = "https://www.sports.ru/my/news/";
element.text = "Новости";
});
        window.setTimeout(check, 100);
	}, 100
);