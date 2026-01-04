// ==UserScript==
// @name         Ying Yiyi script
// @namespace    https://greasyfork.org/users/144229
// @version      1.2
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/41787/Ying%20Yiyi%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/41787/Ying%20Yiyi%20script.meta.js
// ==/UserScript==
function bigBub(pop) {
    var div = $('<div />', {
        html: '&shy;<style>' + pop + '</style>'
    } ).appendTo('body');
}

$('h2').eq(0).text(" ");
$('p').eq(0).toggle();
$('ol').eq(0).toggle();

bigBub('input[type=radio] { width: 1.5em; height: 1.5em;}' );
$('input[value=Average]').click();
$('input[value=Self-clicked]').click();
$('input[value=Both]').click();
$(document).keyup(function(event){
    if(event.which == 13){
        $('#submitButton').click();
    }
});

$('.panel-body').eq(0).before(`<button id=high>HIGH</button>`);
$('.panel-body').eq(0).before(`<button id=boston>BOSTON</button>`);
$('.panel-body').eq(0).before(`<button id=dead>DEAD</button>`);
$('.panel-body').eq(0).before(`<button id=no-air>NO AIR</button>`);
$('.panel-body').eq(0).before(`<button id=internet>INTERNET</button>`);
$('.panel-body').eq(0).before(`<button id=unrelated>UNRELATED</button>`);


$('h3').eq(0).before(`<button style='float:right;' id=high>HIGH</button>`);
$('h3').eq(0).before(`<button style='float:right;' id=boston>BOSTON</button>`);
$('h3').eq(0).before(`<button style='float:right;' id=dead>DEAD</button>`);
$('h3').eq(0).before(`<button style='float:right;' id=no-air>NO AIR</button>`);
$('h3').eq(0).before(`<button style='float:right;' id=internet>INTERNET</button>`);
$('h3').eq(0).before(`<button style='float:right;' id=unrelated>UNRELATED</button>`);

$('#dead').click(function(){
    $('input[value=Low]').click();
    $('input[value=Neither]').click();
});

$('#boston').click(function(){
    $('input[value=High]').click();
    $('input[value=Text]').click();
});

$('#high').click(function(){
    $('input[value=High]').click();
});

$('#no-air').click(function(){
    $('input[value=Text]').click();
});

$('#internet').click(function(){
    $('input[value=Stock]').click();
});

$('#unrelated').click(function(){
    $('input[value=Text]').click();
    $('input[value=Stock]').click();
});