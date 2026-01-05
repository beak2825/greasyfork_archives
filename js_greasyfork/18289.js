// ==UserScript==
// @name        AntiFeed
// @description Перенаправление на свою страницу и замена ссылки на кнопке ВК.
// @include     https://vk.com/*
// @run-at document-start
// @version     1
// @grant       none
// @namespace https://greasyfork.org/users/35350
// @downloadURL https://update.greasyfork.org/scripts/18289/AntiFeed.user.js
// @updateURL https://update.greasyfork.org/scripts/18289/AntiFeed.meta.js
// ==/UserScript==
window.addEventListener ("load", pageFullyLoaded);
 if((window.document.location == "https://vk.com/feed") || (window.document.location == "https://vk.com")) {window.location.replace("https://vk.com/id0")}
function pageFullyLoaded () {
    link = document.getElementsByClassName('top_home_link')[0];
	link.href='https://vk.com/id0';
}
