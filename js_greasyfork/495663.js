// ==UserScript==
// @name           KinopoiskFree
// @name:ru        Бесплатный Кинопоиск
// @namespace      http://tampermonkey.net/
// @version        1.6
// @description    Add button for free watch
// @description:ru Добавляет кнопку для бесплатного просмотра
// @author         Lex
// @copyright      2024, Lex
// @icon           https://www.kinopoisk.ru/favicon.ico
// @icon64         https://www.kinopoisk.ru/favicon.ico
// @homepage       https://www.kinopoisk.ru/
// @match          https://*.kinopoisk.ru/*
// @grant          none
// @run-at         document-end
// @license        MIT
// @homepageURL    https://github.com/LexKreyn/KinopoiskFree#readme
// @supportURL     https://github.com/LexKreyn/KinopoiskFree/issues
// @downloadURL https://update.greasyfork.org/scripts/495663/KinopoiskFree.user.js
// @updateURL https://update.greasyfork.org/scripts/495663/KinopoiskFree.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var freeHost = 'https://w3w.kpfr.cc';

    function on_page()
    {
        if (window.location.pathname.includes('/name/')) { return; }

        var playIconDark = document.createElement('span');
        playIconDark.setAttribute('class', 'styles_icon__iKaVd');
        playIconDark.setAttribute('style', 'background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width=\'30\' height=\'30\' fill=\'%23000\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 3.375 21 12 6 20.625V3.375Z\' fill=\'%23000\'/%3E%3C/svg%3E")');

        var playIconLight = document.createElement('span');
        playIconLight.setAttribute('class', 'styles_icon__iKaVd');
        playIconLight.setAttribute('style', 'background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width=\'30\' height=\'30\' fill=\'%23fff\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 3.375 21 12 6 20.625V3.375Z\' fill=\'%23fff\'/%3E%3C/svg%3E")');

        var playLink = document.createElement('a');
        playLink.setAttribute('id', 'freePlay');
        playLink.setAttribute('href', freeHost + window.location.pathname);

        setInterval(function() {
            var work = document.getElementById('freePlay');
            if (new URL(playLink.getAttribute('href')).pathname != window.location.pathname) { playLink.setAttribute('href', freeHost + window.location.pathname); }
            if (work === null) ifw:
            {
                var titleLight = document.getElementsByClassName('styles_rootInLight__juoEZ');
                var titleDark = document.getElementsByClassName('styles_rootInDark__SZlor');

                var title = null;
                var playIcon = null;
                if (titleLight.length > 0)
                {
                    title = titleLight;
                    playIcon = playIconDark;
                }
                else if (titleDark.length > 0)
                {
                    title = titleDark;
                    playIcon = playIconLight;
                }

                if (title === null) { break ifw; }

                title = title[0];
                playLink.appendChild(playIcon);

                title.insertBefore(playLink, title.firstChild);
            }
        }, 100);
    }

    function on_list()
    {
        setInterval(function(){
            var ttl_cnt = document.getElementsByClassName('base-movie-main-info_mainInfo__ZL_u3');
            var work = document.getElementsByClassName('freePlay');
            if (work.length < ttl_cnt.length)
            {
                var title = document.getElementsByClassName('base-movie-main-info_mainInfo__ZL_u3');

                Array.from(title).forEach((ttl) => {
                    if (ttl.classList.contains('freePlay')) return;

                    var playIcon = document.createElement('span');
                    playIcon.setAttribute('class', 'styles_icon__iKaVd');
                    playIcon.setAttribute('style', 'background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width=\'28\' height=\'28\' fill=\'%23000\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 3.375 21 12 6 20.625V3.375Z\' fill=\'%23000\'/%3E%3C/svg%3E")');

                    var playLink = document.createElement('a');
                    playLink.appendChild(playIcon);
                    playLink.setAttribute('href', freeHost + ttl.parentElement.getAttribute('href'));

                    var block = ttl.parentElement.parentElement;
                    block.setAttribute('style', 'display: flex; justify-content: space-between;');
                    block.insertBefore(playLink, block.firstChild);

                    ttl.classList.add('freePlay');
                });
            }
        }, 100);
    }

    on_page();
    on_list();
})();