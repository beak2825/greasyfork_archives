// ==UserScript==
// @name         Old Pikabu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Старый ПИКАБУ рулит
// @author       BanHammer
// @include      http://pikabu.ru/*
// @include      https://pikabu.ru/*
// @include      http://www.pikabu.ru/*
// @include      https://www.pikabu.ru/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/39517/Old%20Pikabu.user.js
// @updateURL https://update.greasyfork.org/scripts/39517/Old%20Pikabu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //debugger;

    redirectToPage("http://pikabu.ru/", "http://old.pikabu.ru/");
    redirectToPage("https://pikabu.ru/", "https://old.pikabu.ru/");
    redirectToPage("http://www.pikabu.ru/", "http://old.pikabu.ru/");
    redirectToPage("https://www.pikabu.ru/", "https://old.pikabu.ru/");

    function redirectToPage(page1, page2){
        var url = window.location.href;
        if(url.indexOf(page1) != -1){
            window.location.href = url.replace(page1, page2);
        }
    }

})();