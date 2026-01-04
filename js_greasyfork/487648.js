// ==UserScript==
// @name         GC - Hagan Blah Blah avatar
// @version      1.0.3
// @description  Explanation by batmanda: "You have to make the king ANGRY (I think I got kicked out can't remember) while using a phrase that contains the word "nugget". Nugget is an option in the 2nd to last blank.". This script automatically fills insightful nuggets of wisdom, incorporating the term 'nugget'. (credits to Humro for the GC - Wise Old King script, and batmanda for the by avatar solution).
// @author       Teffy (original created by Humro)
// @match        https://www.grundos.cafe/medieval/wiseking*
// @match        www.grundos.cafe/medieval/wiseking*
// @match        https://grundos.cafe/medieval/wiseking*
// @match        grundos.cafe/medieval/wiseking*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/users/1251911
// @downloadURL https://update.greasyfork.org/scripts/487648/GC%20-%20Hagan%20Blah%20Blah%20avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/487648/GC%20-%20Hagan%20Blah%20Blah%20avatar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('document').ready( function() {
        $('#wisdom1').val('A wise friend once told me that');
        $('#wisdom2').val('pride');
        $('#wisdom3').val('is like');
        $('#wisdom4').val('the tenacity of');
        $('#wisdom5').val('a school of');
        $('#wisdom6').val('nugget');
        $('#wisdom7').val('Chias');
    });
})();