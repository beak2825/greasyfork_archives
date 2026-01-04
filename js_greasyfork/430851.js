// ==UserScript==
// @name         avto_forum
// @version      1
// @description  ah ara ara
// @author       omne
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/new_topic\.php.*/
// @grant unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @namespace https://greasyfork.org/users/804986
// @downloadURL https://update.greasyfork.org/scripts/430851/avto_forum.user.js
// @updateURL https://update.greasyfork.org/scripts/430851/avto_forum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.heroeswm.ru/forum_thread.php?id=1');
    xhr.send();

    xhr.onload = function() {
        if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`); // Например, 404: Not Found
        } else { // если всё прошло гладко, выводим результат
            document.getElementsByTagName('input')[1].value = '[News] ' + xhr.response.match(/tid=[0-9]+..([^<]+)/)[1];
            document.getElementsByTagName('textarea')[0].value = 'Сабж';
        }
};
})();