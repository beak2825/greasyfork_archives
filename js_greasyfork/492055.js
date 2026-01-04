// ==UserScript==
// @name         Admitad Fix Partner Offer Links
// @namespace    http://tampermonkey.net/
// @namespace    https://dev256.com/
// @homepage     https://dev256.com/
// @supportURL   https://dev256.com/
// @version      2024-04-09
// @description  This plugin corrects inccorrect links to partner offers on pages such as pattern https://www.admitad.ru/store/offers/* .
// @author       Rufat
// @match        https://www.admitad.ru/store/offers/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=admitad.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492055/Admitad%20Fix%20Partner%20Offer%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/492055/Admitad%20Fix%20Partner%20Offer%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let links = document.querySelectorAll(".offer__button");

    links.forEach(link => {
        link.href=link.href.replace("https://store.admitad.com/ru/webmaster/registration/?next=", "");
    });

})();
