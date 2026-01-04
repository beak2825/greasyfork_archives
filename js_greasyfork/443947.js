// ==UserScript==
// @name        Google Translate - 2022
// @namespace   https://greasyfork.org/users/906463-coffeegrind123
// @homepageURL https://gist.github.com/coffeegrind123/8ca2c7e700aca3341c71da8d612f6130
// @supportURL  https://greasyfork.org/scripts/443947-google-translate-2022
// @include     https://*/*
// @include     http://*/*
// @exclude     http*://*.google.*/*
// @grant       GM_registerMenuCommand
// @noframes
// @version     2.5
// @license     WTFPL
// @icon        https://translate.google.com/favicon.ico
// @author      coffeegrind123
// @description This script displays a menu option in your userscript manager to translate the current page using Google Translate
// @downloadURL https://update.greasyfork.org/scripts/443947/Google%20Translate%20-%202022.user.js
// @updateURL https://update.greasyfork.org/scripts/443947/Google%20Translate%20-%202022.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.top != window.self)
        return;
    function translateRedirect() {
        var website = window.location;
        var redirect = 'https://translate.google.com/translate?sl=auto&tl=en&hl=en-US&u=' + website + '&client=webapp';
        window.location = redirect;
    }
    GM_registerMenuCommand('Translate page', translateRedirect);
}());