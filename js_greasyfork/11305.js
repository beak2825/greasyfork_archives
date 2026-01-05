
// ==UserScript==
// @name         Venue Quality
// @version      0.1.1
// @description  Show if entries are exactly the same and submit option 1 (Yes) on key a or numpad 1 and option 2 (No) on key s or numbad 2
// @author       Saqfish
// @include      https://www.mturk.com/mturk/*
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @namespace    saqfish
// @downloadURL https://update.greasyfork.org/scripts/11305/Venue%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/11305/Venue%20Quality.meta.js
// ==/UserScript==

var p1,p2,p3;
$("tr td:contains('Venue Quality')").each(function(){
    //Hide the instructions/Description  
    document.getElementsByClassName('overview-wrapper')[0].style.display='none';
    var var1 = $(".question-content-wrapper tr:nth-child(2) td:eq(0)").text();
    var var2 = $(".question-content-wrapper tr:nth-child(2) td:eq(1)").text();
    //document.write(var1 + "\n" + var2);
    var res = var1.split(":");
    var res2 = var2.split(":");
if(res[1] == res2[1]){ p1="Name: <font color=green>Exactly Same</font> "}else{p1="Name: <font color=red>Something Different</font> "}
if(res[2] == res2[2]){ p2="Address: <font color=green>Exactly Same</font> "}else{p2="Address: <font color=red>Something Different</font> "}
if(res[3] == res2[3]){ p3="City /Region: <font color=green>Exactly Same</font> "}else{p3="City/State: <font color=red>Something Different</font> "}

 
   
    
});

$(".question-content-wrapper tr:nth-child(2)").append(p1 + p2 + p3);

$(document).keypress(function(e) {
      switch(e.which) {
        case 97: // a
            $('input[name="Answer_1"]').eq(0).click();
    $('input[name="/submit"]').eq(0).click();
        break;

        case 49: // 1 - keypad
            $('input[name="Answer_1"]').eq(0).click();
    $('input[name="/submit"]').eq(0).click();
        break;

        case 115: // s
             $('input[name="Answer_1"]').eq(1).click();
    $('input[name="/submit"]').eq(0).click(); 
        break;

        case 50: // 2
             $('input[name="Answer_1"]').eq(1).click();
    $('input[name="/submit"]').eq(0).click(); 
        break;

        default: return;
    }
    e.preventDefault();
});

