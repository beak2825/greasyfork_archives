// ==UserScript==
// @name         Torn Level Hold
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  disable level upgrade links for Torn level holders
// @author       cyrena1c
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440187/Torn%20Level%20Hold.user.js
// @updateURL https://update.greasyfork.org/scripts/440187/Torn%20Level%20Hold.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.$;
    var css_disable = {
            "pointer-events": "none",
            "text-decoration": "line-through"
        };
    $("#pointsLevel").css(css_disable);
    $(".msg.right-round > ul > li").each(function(idx, element) {
        console.log($(element).text());
        if ($(element).text().startsWith("Congratulations! You have enough experience")) {
            $(element).children("a").css(css_disable);
        }
    });
})();