// ==UserScript==
// @name         ぺたショートカット
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.peta2.jp/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/406379/%E3%81%BA%E3%81%9F%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/406379/%E3%81%BA%E3%81%9F%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88.meta.js
// ==/UserScript==

$(window).keydown(function(e){

    if (e.keyCode == 39) {
        $('a:contains("»")')[0].click();
    }
    if (e.keyCode == 37) {
        $('a:contains("«")')[1].click();
    }

})(jQuery);