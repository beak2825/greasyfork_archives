// ==UserScript==
// @name         APayments script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *amazonaws*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/39597/APayments%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39597/APayments%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('.panel-primary').toggle();
    var link = "http://" + $('a').eq(0).attr('href');
    var html = `<a href=`+link+`> link</a>`;
    $('a').eq(0).after(html);
    $('input[name=Q1Answer][value=Yes]').click();
    $('input[name=Q2Answer][value=No]').click();
    $('input[name=Q3Answer]').eq(0).click();
    $('input[name=Q4Answer]').eq(1).click();
    $('input[name=Q5Answer][value=No]').click();
    $('input[name=Q7Answer][value=No]').click();
    $('input[name=Q8Answer][value=Yes]').click();
    $('input[name=Q9Answer]').eq(0).click();
    $('input[name=Q11Answer][value=No]').click();
    $('input[name=Q11aAnswer]').eq(2).click();
    $(document).keyup(function(event){
        if(event.which == 49){
            $('input').removeAttr('checked');
            $('input').eq(2).click();
        }
    });

});