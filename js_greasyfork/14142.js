// ==UserScript==
// @name         Chaoqun Deng 1
// @namespace    https://greasyfork.org/en/users/13769
// @version      1.1
// @description  Chaoqun Deng - A 2-3 minute survey classfying consumer complaints and managerial responses
// @author       saqfish
// @include      https://www.mturk.com/mturk/previewandaccept*
// @include      https://www.mturk.com/mturk/continue*
// @include      https://www.mturk.com/mturk/accept?*
// @grant        GM_log
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/14142/Chaoqun%20Deng%201.user.js
// @updateURL https://update.greasyfork.org/scripts/14142/Chaoqun%20Deng%201.meta.js
// ==/UserScript==

var count = 0;
var fieldsets = [];
$('fieldset.fieldset').each(function(f){
    //$(this).css('background-color',"green"); 
    fieldsets.push($(this));
});


var gender = 0;
fieldsets[20].find('input').each(function(x2){
    if(gender == 0){
        $(this).prop('checked',true);
    }
    gender++;
});
var age = 0;
fieldsets[21].find('input').each(function(x2){
    if(age == 2){
        $(this).prop('checked',true);
    }
    age++;
});
var school = 0;
fieldsets[22].find('input').each(function(x2){
    if(school == 2){
        $(this).prop('checked',true);
    }
    school++;
});
var local = 0;
fieldsets[23].find('input').each(function(x2){
    if(local == 6){
        $(this).prop('checked',true);
    }
    local++;
});



var chx=[];
window.onkeydown = function(e) {

    if ((e.keyCode === 49) || (e.keyCode === 97) || (e.altKey && e.keyCode === 97)) {
        fieldsets[count].css('background-color',"green");
        nc = count +1;
        $('#Answer_' + nc ).each(function(x){
            if (x === 0){
                $(this).prop('checked',true);
                console.log($(this));
                $(this).focus();
            }
        });

        count++;
        nc = 0;
    }

    if ((e.keyCode === 50) || (e.keyCode === 98) || (e.altKey && e.keyCode === 98)) {
        fieldsets[count].css('background-color',"green"); 
        nc2 = count +1;
        fieldsets[count].find('input').each(function(x2){
            chx.push($(this));

        });
        if(chx.length === 2){
            chx[1].prop('checked',true);
            chx[1].focus();
            chx = [];
        }
        count++;
        nc2 = 0;

    }
}
