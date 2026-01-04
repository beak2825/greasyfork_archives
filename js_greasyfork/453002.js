// ==UserScript==
// @name         minimal duckduckgo lite
// @version      1.0.1
// @description  make the lite version more minimalistic and clean
// @author       woepsych
// @license      MIT
// @match        https://lite.duckduckgo.com/lite/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duckduckgo.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/970325
// @downloadURL https://update.greasyfork.org/scripts/453002/minimal%20duckduckgo%20lite.user.js
// @updateURL https://update.greasyfork.org/scripts/453002/minimal%20duckduckgo%20lite.meta.js
// ==/UserScript==

var $ = window.jQuery;

(function() {
    'use strict';

    $('link[rel=stylesheet]').remove();
    $(".header").text("duckduckgo");
    $(".submit").attr("value", "search");
    $(".extra").remove();
    $("a").css("color", "#333333");
    $(".result-snippet").css({"color": "#666666", "font-size": "smaller"});
    $(".link-text").css({"color": "#888888", "font-size": "small"});
})();