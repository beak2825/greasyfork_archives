// ==UserScript==
// @name         Yandex open results in same tab
// @namespace    https://greasyfork.org/users/59372
// @version      0.3
// @description  Remove 'target=_blank' on Yandex search results page
// @author       Burlaka.net
// @match        *://yandex.ru/search/*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395686/Yandex%20open%20results%20in%20same%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/395686/Yandex%20open%20results%20in%20same%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('a[target=_blank]').removeAttr('target');
})();