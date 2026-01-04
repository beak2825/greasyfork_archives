// ==UserScript==
// @name         RuTracker User Search in Topics
// @namespace    copyMister
// @version      1.0
// @description  Adds a dropdown with quick search links for users in forum topics (e.g. messages by author)
// @description:ru  Добавляет выпадающее меню со ссылками на сообщения пользователя в теме (и другие ссылки)
// @author       copyMister
// @license      MIT
// @match        https://rutracker.org/forum/viewtopic.php*
// @match        https://rutracker.net/forum/viewtopic.php*
// @match        https://rutracker.nl/forum/viewtopic.php*
// @match        https://rutracker.lib/forum/viewtopic.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rutracker.org
// @run-at       document-end
// @grant        none
// @homepageURL  https://rutracker.org/forum/viewtopic.php?t=4717182
// @downloadURL https://update.greasyfork.org/scripts/484010/RuTracker%20User%20Search%20in%20Topics.user.js
// @updateURL https://update.greasyfork.org/scripts/484010/RuTracker%20User%20Search%20in%20Topics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var userId;
    var topicId = document.querySelector('#topic-title').href.split('=')[1];

    document.querySelectorAll('#topic_main .post_btn_2').forEach(function(div) {
        userId = div.firstElementChild.href.split('=')[2];
        div.insertAdjacentHTML('beforeend', '<a class="txtb menu-root menu-alt1" href="#usermenu-' + userId + '">[▼]</a>');
        document.body.insertAdjacentHTML('beforeend', '<div id="usermenu-' + userId + '" class="menu-sub"><div class="menu-a bold nowrap"><a class="med" href="search.php?uid=' + userId + '&t=' + topicId + '&dm=1">Сообщения только в этой теме</a><a class="med" href="search.php?uid=' + userId + '&search_author">Сообщения по всему трекеру</a><a class="med" href="search.php?uid=' + userId + '&myt=1">Темы, начатые пользователем</a><a class="med" href="tracker.php?rid=' + userId + '">Раздачи пользователя</a></div></div>');
    });
})();