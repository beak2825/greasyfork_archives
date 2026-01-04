// ==UserScript==
// @name         clean epubee reader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  drop vip
// @author       You
// @match        http://reader.epubee.com/books/mobile/fd/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412124/clean%20epubee%20reader.user.js
// @updateURL https://update.greasyfork.org/scripts/412124/clean%20epubee%20reader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".reader-to-vip").remove();
 
})();