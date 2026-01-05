// ==UserScript==
// @name         Alterian Inc 1
// @namespace    https://greasyfork.org/en/users/13769
// @version      1
// @description  Alterian Inc - Categorize social conversations as an Ad or not (Instructions modified)
// @author       saqfish
// @include      *
// @grant        GM_log
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/16387/Alterian%20Inc%201.user.js
// @updateURL https://update.greasyfork.org/scripts/16387/Alterian%20Inc%201.meta.js
// ==/UserScript==

$('.overview-wrapper').hide();
var docs = [];
var docs2 = [];
var count = 0;
$('div.question-content-wrapper').each(function(f){
    docs.push($(this));
});


function focuss(ting){
    $('html, body').animate({ scrollTop: ting.offset().top }, 'fast');
}
document.onkeydown = function(e) {
    var answers = [];
    var anum = count + 1;
    //var num = anum.replace(/^0+/, '');
    var num =Number(anum).toString();
    $('input[name^=Answer_'+num+']').each(function(f){
        answers.push($(this));
    });
    console.log(answers);
    if ((e.keyCode === 49) || (e.keyCode === 97)) {
        docs[count].css('background-color',"green");
        answers[1].prop('checked',true);
        count++;
        focuss(docs[count]);
    }

    if ((e.keyCode === 50) || (e.keyCode === 98)) {
        docs[count].css('background-color',"green");
        answers[2].prop('checked',true);
        count++;
        focuss(docs[count]);
    }

}