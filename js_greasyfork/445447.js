// ==UserScript==
// @name:ru      WarThunder автоматическое перенаправление на новости
// @name         WarThunder auto redirect to news.
// @namespace    https://greasyfork.org/ru/users/917808
// @license MIT
// @version      0.2
// @description:ru Перенаправление с главной страницы warthunder на новости
// @description  Redirect from warthunder main page to news.
// @author       K5CPOFx
// @match        *://warthunder.ru/*
// @match        *://warthunder.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=warthunder.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445447/WarThunder%20auto%20redirect%20to%20news.user.js
// @updateURL https://update.greasyfork.org/scripts/445447/WarThunder%20auto%20redirect%20to%20news.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Ru
    if ( document.URL == ("https://warthunder.ru/ru") || document.URL == ("https://warthunder.ru/ru/") ) {
    window.location.replace('https://warthunder.ru/ru/news/');
}
    //Ru_com
        if ( document.URL == ("https://warthunder.com/ru") || document.URL == ("https://warthunder.com/ru/") ) {
    window.location.replace('https://warthunder.com/ru/news/');
}
    //En
    if ( document.URL == ("https://warthunder.com/en") || document.URL == ("https://warthunder.com/en/") ) {
    window.location.replace('https://warthunder.com/en/news/');
}
    //Zh
    if ( document.URL == ("https://warthunder.com/zh") || document.URL == ("https://warthunder.com/zh/") ) {
    window.location.replace('https://warthunder.com/zh/news/');
}
})();