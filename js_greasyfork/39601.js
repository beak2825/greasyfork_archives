// ==UserScript==
// @name         Customer Interests banner
// @namespace    https://greasyfork.org/users/144229
// @version      1.2
// @description  Makes money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *amazonaws*
// @include      *mturkcontent*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/39601/Customer%20Interests%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/39601/Customer%20Interests%20banner.meta.js
// ==/UserScript==
$(document).ready(function(){
    if (!$('p:contains(The goal is to answer the question: Is the item relevant to the interest?)').length) return;
    $('div.panel').toggle();
    $('p').eq(4, 5).toggle();
    $('p').eq(5).toggle();
    $('p').eq(6).toggle();
    $('textarea').toggle();
    var interest = $('p').eq(3).text().slice(10,$('p').eq(3).text().length).toLowerCase();
    var title = $('div').eq(6).text().trim().slice(0,65).toLowerCase();
    var isTrue = Boolean(title.indexOf(interest) !== -1);
    setTimeout(function(){
    if (isTrue){
        $('input#radio-yes').click();
        console.log("confident yes");
        $('input#submitButton').click();
    }else{
        var rando = randNum(1,10);
        if(rando > 8){
            $('input#radio-no').click();
            console.log("guess no");
            $('input#submitButton').click();
        }else{
            $('input#radio-yes').click();
            console.log("guess yes");
            $('input#submitButton').click();
        }
    }},3000);
    //if($('td.title_orange_text_bold')){
    //    window.location.replace("https://www.mturk.com/mturk/myhits");
    //}
});