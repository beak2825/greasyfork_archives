

// ==UserScript==
// @description tubantia 03-2017 cookiewall
// @name        Tubantia Cookiewall
// @namespace   Tubantia
// @include     http://www.tubantia.nl/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28034/Tubantia%20Cookiewall.user.js
// @updateURL https://update.greasyfork.org/scripts/28034/Tubantia%20Cookiewall.meta.js
// ==/UserScript==

    if (document.cookie.indexOf('nl_cookiewall_version') < 0) {
        (document.head || document.documentElement).insertAdjacentHTML('beforeend', '<style>* {display:none}</style>');
        document.cookie = 'nl_cookiewall_version=1; domain=tubantia.nl; path=/';
        document.cookie = 'nl_cookiewall_version=1; domain=www.tubantia.nl; path=/';
        location.reload();
    }

