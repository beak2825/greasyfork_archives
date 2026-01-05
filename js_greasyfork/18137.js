// ==UserScript==
// @version         1.0.4
// @name            Redirect on desktop vk.com
// @namespace       Редирект на десктопную страницу vk.com с мобильной версии m.vk.com
// @description     Автоматическое перенаправленные на десктопную страницу vk.com с мобильной версии m.vk.com
// @icon            http://i3.imageban.ru/out/2016/03/20/01c7e5fa30d361f626cf6541d7c3deb8.png
// @match           https://m.vk.com/*
// @match           http://m.vk.com/*
// @downloadURL https://update.greasyfork.org/scripts/18137/Redirect%20on%20desktop%20vkcom.user.js
// @updateURL https://update.greasyfork.org/scripts/18137/Redirect%20on%20desktop%20vkcom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = 'https://vk.com' + window.location.href.toString().split(window.location.host)[1];
    var form = document.createElement('form');
    form.method = 'post';
    form.action = url;
    document.body.appendChild(form);
    form.submit();
})();