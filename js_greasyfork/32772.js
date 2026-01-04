// ==UserScript==
// @name         Customer Interests script
// @namespace    https://greasyfork.org/users/144229
// @version      1.1
// @description  Makes money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *amazonaws*
// @include      *mturkcontent*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/32772/Customer%20Interests%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/32772/Customer%20Interests%20script.meta.js
// ==/UserScript==
$(document).ready(function(){
    if (!$('p:contains(The goal is to answer the question: Is the item relevant to the interest?)').length) return;
    $('div.panel').toggle();
    $('p').eq(4, 5).toggle();
    $('p').eq(5).toggle();
    $('p').eq(6).toggle();
    $('textarea').toggle();
});