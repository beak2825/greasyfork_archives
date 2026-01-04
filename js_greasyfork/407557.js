// ==UserScript==
// @name        Открыть в новой вкладке
// @namespace   YTV
// @include     http*://tv.yandex.ru/*
// @include     https*://xcadr.online/*
// @include     https*://cont.ws/*
// @include     https*://front.newsland.com/*
// @include     http*://seasonvar.ru/*
// @include     http*://lives.seasonvar.mobi/*
// @include     http*://inosmi.ru/*
// @include     http*://duckduckgo.com/*
// @include     http*://rusvesna.su/*
// @include     http*://tvzvezda.ru/*
// @include     http*://maxpark.com/*
// @version     1.16
// @grant       none
// @description Открыть в новой вкладке.
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/407557/%D0%9E%D1%82%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%B2%20%D0%BD%D0%BE%D0%B2%D0%BE%D0%B9%20%D0%B2%D0%BA%D0%BB%D0%B0%D0%B4%D0%BA%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/407557/%D0%9E%D1%82%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%B2%20%D0%BD%D0%BE%D0%B2%D0%BE%D0%B9%20%D0%B2%D0%BA%D0%BB%D0%B0%D0%B4%D0%BA%D0%B5.meta.js
// ==/UserScript==

document.addEventListener("click", (e) => {
    const anchor = e.target.closest("a[href]");
    if (anchor) anchor.target = "_blank";
});