// ==UserScript==
// @name        FreePoisk
// @version     1
// @description Redirects the current page from Kinopoisk to Flicksbar.
// @match       https://www.kinopoisk.ru/series/*/*
// @match       https://www.kinopoisk.ru/film/*/*
// @grant       unsafeWindow
// @icon        https://www.kinopoisk.ru/favicon.ico
// @icon64      https://www.kinopoisk.ru/favicon.ico
// @grant       none
// @namespace https://greasyfork.org/users/1259312
// @downloadURL https://update.greasyfork.org/scripts/486947/FreePoisk.user.js
// @updateURL https://update.greasyfork.org/scripts/486947/FreePoisk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function redirectURL() {
        var currentURL = window.location.href;
        var newURL = currentURL.replace('www.kinopoisk.ru', 'www.sspoisk.ru');
        window.location.href = newURL;
    }

    function createButton() {
        var button = document.createElement('button');
        button.innerHTML = 'СМОТРЕТЬ БЕСПЛАТНО';
        button.style.position = 'fixed'; 
        button.style.bottom = '20px'; 
        button.style.right = '20px'; 
        button.style.zIndex = '9999';
        button.style.width = 'unset';
        button.style.height = '52px';
        button.style.padding = '14px 28px';
        button.style.fontSize = '16px';
        button.style.fontWeight = '600';
        button.style.lineHeight = '20px';
        button.style.borderRadius = '1000px';
        button.style.background = 'linear-gradient(90deg,#ff5c4d,#eb469f 26.56%,#8341ef 75%,#3f68f9)';
        button.style.border = 'none'; 
        button.style.color = 'white'; 
        button.style.cursor = 'pointer'; 
        button.style.boxShadow = '0 4px 6px rgba(0,0,0,.1)'; 
        button.style.transition = 'background .2s ease,transform .2s ease,box-shadow .2s ease';
        button.onclick = redirectURL;

        document.body.appendChild(button); 
    }

    createButton();
})();