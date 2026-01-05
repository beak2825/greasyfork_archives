// ==UserScript==
// @name        habr.com
// @include     https://habr.com/*
// @version     5.2
// @description Cached pages from closed habrahabr/geektimes posts.
// @description Remove all unnecessary blocks from page.
// @grant       none
// @namespace https://habrahabr.ru/
// @downloadURL https://update.greasyfork.org/scripts/4429/habrcom.user.js
// @updateURL https://update.greasyfork.org/scripts/4429/habrcom.meta.js
// ==/UserScript==

var h1 = document.querySelector("h1");
if (h1 && h1.innerHTML == "Доступ к публикации закрыт") {
        h1.innerHTML += "<br/><br/>";
	var link = "http://webcache.googleusercontent.com/search?q=cache:" + window.location;
	h1.innerHTML += " <a href='" + link + "'>[Google Cache]</a>";
	var link = window.location.toString();
	link = link.replace(/(habr.com\/post\/)(\d+)\//, 'savepearlharbor.com/?p=$2');
	h1.innerHTML += " <a href='" + link + "'>[SavePearlHarbor]</a>";
	var link = window.location.toString();
	link = link.replace(/(habr.com\/post\/)(\d+)\//, 'sohabr.ru/post/$2/');
	h1.innerHTML += " <a href='" + link + "'>[SoHabr]</a>";
} else {
    // быстрый доступ к трекеру
    $('a.logo[href="https://habr.com/ru/feed/"]').attr('href', 'https://habr.com/ru/tracker/');
}

function GM_addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

GM_addStyle('.sidebar_content-area {display:none !important;}');
GM_addStyle('.content_left {padding-right: 0px !important;}');