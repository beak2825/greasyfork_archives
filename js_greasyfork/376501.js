// ==UserScript==
// @name         HWM скрыть иконку и название вкладки
// @version      1.0.0
// @author       incognito
// @include      https://www.heroeswm.ru/*
// @include      https://www.lordswm.com/*
// @description  чтобы не палиться перед начальством если остались закрытые вкладки в браузере
// @require      https://code.jquery.com/jquery-3.1.1.slim.min.js
// @namespace https://greasyfork.org/users/237404
// @downloadURL https://update.greasyfork.org/scripts/376501/HWM%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D1%83%20%D0%B8%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%B2%D0%BA%D0%BB%D0%B0%D0%B4%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/376501/HWM%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D1%83%20%D0%B8%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%B2%D0%BA%D0%BB%D0%B0%D0%B4%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function (undefined) {

    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'http://www.stackoverflow.com/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);

    document.title = 'google';

}());
