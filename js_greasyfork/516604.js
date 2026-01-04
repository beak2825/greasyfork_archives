// ==UserScript==
// @name         PornoLab User Menu
// @namespace    copyMister
// @version      1.3
// @description  Adds a dropdown with quick search links for users in forum topics (e.g. messages by author)
// @description:ru  Добавляет выпадающее меню со ссылками на сообщения пользователя в теме (и другие ссылки)
// @author       copyMister
// @license      MIT
// @match        https://pornolab.net/forum/viewtopic.php*
// @match        https://pornolab.cc/forum/viewtopic.php*
// @match        https://pornolab.biz/forum/viewtopic.php*
// @match        https://pornolab.lib/forum/viewtopic.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornolab.net
// @run-at       document-body
// @grant        none
// @homepageURL  https://pornolab.net/forum/viewtopic.php?t=2714164
// @downloadURL https://update.greasyfork.org/scripts/516604/PornoLab%20User%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/516604/PornoLab%20User%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $.holdReady(true);

    document.addEventListener('DOMContentLoaded', function() {
        if (!document.querySelector('#quick-search')) {
            $.holdReady(false);
            return;
        }

        var topicId = document.querySelector('#topic-title').href.split('=')[1];
        var forumId = document.querySelector('option[value^="search.php?f="]').value.split('=')[1];

        document.querySelectorAll('#topic_main .post_btn_2').forEach(function(div) {
            var userId = div.firstElementChild.href.split('=')[2];
            var userName = div.closest('tbody').querySelector('.poster_info > .nick').textContent.trim();
            var userMenu = `usermenu-${userId}`;

            div.insertAdjacentHTML(
                'beforeend',
                `<a class="txtb menu-root without-caret" href="#${userMenu}">[▼]</a>`
            );

            if (!document.querySelector(`#${userMenu}`)) {
                document.body.insertAdjacentHTML(
                    'beforeend',
                    `<div id="${userMenu}" class="menu-sub"><div class="menu-a bold nowrap">
                     <table style="width: 100%; border-collapse: collapse; border: 0;">
                         <tr><th style="font-size: 12px; padding: 4px 12px;">${userName}</th></tr>
                     </table>
                     <a class="med" href="search.php?uid=${userId}&t=${topicId}&dm=1">Сообщения в этой теме</a>
                     <a class="med" href="search.php?uid=${userId}&f=${forumId}&dm=1">Сообщения в этом разделе</a>
                     <a class="med" href="search.php?uid=${userId}&search_author=1">Сообщения по всему трекеру</a>
                     <a class="med" href="search.php?uid=${userId}&myt=1">Начатые темы</a>
                     <a class="med" href="tracker.php?rid=${userId}">Раздачи</a></div></div>`
                );
            }
        });

        $.holdReady(false);
    });
})();