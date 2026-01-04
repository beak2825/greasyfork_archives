// ==UserScript==
// @name         Noah's ark banner
// @namespace    https://greasyfork.org/users/144229
// @version      1.1
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/39627/Noah%27s%20ark%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/39627/Noah%27s%20ark%20banner.meta.js
// ==/UserScript==

$(document).ready(function() {
    if(!$('span:contains(Please look at the presented fashion design)').length) return;
    $('input[name=Q1_answer]').eq(randNum(1,3)).click();
    $('input[name=Q2_answer]').eq(randNum(1,3)).click();
    $('input[name=Q3_answer]').eq(randNum(1,3)).click();
    $('input[name=Q4_answer]').eq(randNum(1,3)).click();
    $('input[name=Q5_answer]').eq(randNum(1,3)).click();
    hotKey('input[name=Q6_answer][value=1]',1);
    hotKey('input#submitButton',1);
    hotKey('input[name=Q6_answer][value=2]',2);
    hotKey('input#submitButton',2);
    setTimeout(function(){
        $('input[name=Q6_answer][value=2]').click();
    $('input#submitButton').click();
    },1100);

});