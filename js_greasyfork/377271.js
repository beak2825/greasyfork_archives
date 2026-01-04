// ==UserScript==
// @name MeCabeTodo
// @namespace MeCabeTodo
// @version 0.9
// @description Likea todo (global) cada 2.5 min
// @author By @kchamat
// @match http*://*.taringa.net/shouts/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/377271/MeCabeTodo.user.js
// @updateURL https://update.greasyfork.org/scripts/377271/MeCabeTodo.meta.js
// ==/UserScript==

(function($) {
'use strict';
window.stop();
var segundos=150;
$('head').append('<meta http-equiv="refresh" URL=https://classic.taringa.net/shouts/recent content='+segundos+'>' );
    $(".like_count:not('.selected')").click();
new Audio('https://www.soundjay.com/button/sounds/button-44.mp3').play();
})(jQuery);





