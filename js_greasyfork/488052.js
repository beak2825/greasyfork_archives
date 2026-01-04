// ==UserScript==
// @name         kopiruem
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2024-02-21
// @description  copy text from i-exam
// @author       You
// @match        https://test.i-exam.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=i-exam.ru
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/488052/kopiruem.user.js
// @updateURL https://update.greasyfork.org/scripts/488052/kopiruem.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('body').attr('style', 'user-select: text');
})();