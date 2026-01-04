// ==UserScript==
// @name         Sections Remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes sections from 9gag
// @author       MorFinBaZ
// @match        https://9gag.com/*
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/383030/Sections%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/383030/Sections%20Remover.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $(window).scroll(function(){$("a.section[href*='/got?']").parents('article').css("display", "none");});
    $(window).scroll(function(){$("a.section[href*='/superhero?']").parents('article').css("display", "none");});
    $(window).scroll(function(){$("a.section[href*='/endgame?']").parents('article').css("display", "none");});
})();

