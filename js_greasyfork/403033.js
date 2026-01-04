// ==UserScript==
// @name         Yohoho for kinopoisk
// @description  Добавляет ссылку на ресурс yohoho на каждую страницу kinopoisk
// @version      0.2
// @author       EgrorBs
// @match        https://www.kinopoisk.ru/film/*/
// @match        https://www.kinopoisk.ru/series/*/
// @namespace https://greasyfork.org/users/558560
// @downloadURL https://update.greasyfork.org/scripts/403033/Yohoho%20for%20kinopoisk.user.js
// @updateURL https://update.greasyfork.org/scripts/403033/Yohoho%20for%20kinopoisk.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var match = window.location.href.match(/kinopoisk.ru\/(?<type>film|series)\/(?<id>[\d]+)/)
    if (match) {
        var className = ((match.groups.type == "film") ? 'movie-info__content' : 'film-basic-info')
        var content = document.getElementsByClassName(className)[0];
        var nw = document.createElement('div');
        nw.innerHTML = "<a href=\"//yohoho.cc/#" + match.groups.id + "\" target=\"_blank\">yohoho</a>";
        content.prepend(nw)
    }
})();