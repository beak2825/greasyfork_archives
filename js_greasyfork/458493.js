// ==UserScript==
// @name         Positiverecords
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove Anti ad block
// @author       You
// @match        https://positiverecords.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=positiverecords.ru
// @grant        none
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/458493/Positiverecords.user.js
// @updateURL https://update.greasyfork.org/scripts/458493/Positiverecords.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // remove adsbygoogle class from A links
    $("a").removeClass( "adsbygoogle" );
    $("div.infopage").hide();
    // Your code here...
})();