// ==UserScript==
// @name         подмена линка вк
// @namespace    м
// @version      0.3
// @description  возвращает старый диз вк/тест
// @match        https://new.vk.com/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21524/%D0%BF%D0%BE%D0%B4%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%BB%D0%B8%D0%BD%D0%BA%D0%B0%20%D0%B2%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/21524/%D0%BF%D0%BE%D0%B4%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%BB%D0%B8%D0%BD%D0%BA%D0%B0%20%D0%B2%D0%BA.meta.js
// ==/UserScript==

function sendPost(vklink) {
    var form = document.createElement('form');
    form.method = 'post';
    form.action = vklink;
    document.body.appendChild(form);
    form.submit();
}

(function() {
    'use strict';
    var url;
    if (window.location.pathname == '/al_profile.php') {
        url = 'https://vk.com/' + window.location.search.toString().split(/[=&]/)[1];
        sendPost(vklink);
    } else {
        url = 'https://vk.com' + window.location.href.toString().split(window.location.host)[1];
        sendPost(vklink);
    }
})();