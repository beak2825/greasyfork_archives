// ==UserScript==
// @name A9 Category Validation ($0.02)
// @namespace None
// @version 1.0.2
// @description Blamm!
// @author ceedj / THFYM
// @include *.mturkcontent.com/*
// @include https://s3.amazonaws.com/*
// @grant GM_log
// @require http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/21810/A9%20Category%20Validation%20%28%24002%29.user.js
// @updateURL https://update.greasyfork.org/scripts/21810/A9%20Category%20Validation%20%28%24002%29.meta.js
// ==/UserScript==

var my_var = $('h5:contains(examples)');
var my_var2 = $('h5:contains(looking for...)');
if (my_var.length || my_var2.length)
{
window.focus();
$("p").eq(0).css('font-size', '250%');
$('img').detach(); //Comment out this line if you want to see example images
my_var.detach();
my_var2.detach();
$("#truth").bind('contextmenu', function(){ return false ;});
$("#truth").click(function(){
        $("input[id='oneItem']").click();
        $("#noPersonal[value='No']").focus();
        $("#noPersonal[value='No']").click();
        $("#yesCatalog[value='Yes']").click();
        $("#noOverlay[value='No']").click();
    });
$("#truth").mousedown(function(m){
    if( m.button == 2 ) {
        $("input[id='multipleItem']").click();
        $("#noPersonal[value='No']").focus();
        $("#noPersonal[value='No']").click();
        $("#yesCatalog[value='Yes']").click();
        $("#noOverlay[value='No']").click();
    }
    });
// Keybinds
document.onkeydown = function(e) {

// No Items
if ((e.keyCode === 48) || (e.keyCode === 96) || (e.altKey && e.keyCode === 96)) { // 0 or Numpad0 or Alt+Numpad0
$("input[id='noItem']").click();

}

// One Item
if ((e.keyCode === 49) || (e.keyCode === 97) || (e.altKey && e.keyCode === 97)) { // 1 or Numpad1 or Alt+Numpad1
$("input[id='oneItem']").click();
$("#noPersonal[value='No']").focus();
$("#noPersonal[value='No']").click();
$("#yesCatalog[value='Yes']").click();
$("#noOverlay[value='No']").click();

}

// Multiple Items
if ((e.keyCode === 50) || (e.keyCode === 98) || (e.altKey && e.keyCode === 98)) { // 2 or Numpad2 or Alt+Numpad2
$("input[id='multipleItem']").click();
$("#noPersonal[value='No']").focus();
$("#noPersonal[value='No']").click();
$("#yesCatalog[value='Yes']").click();
$("#noOverlay[value='No']").click();

}

// No Picture Loaded
if ((e.keyCode === 51) || (e.keyCode === 99) || (e.altKey && e.keyCode === 99)) { // 3 or Numpad3 or Alt+Numpad3
$("input[id='deadLink']").click();

}


//Submit
if (e.keyCode === 13) { // Enter or NumpadEnter
$("input[id='submitButton']").click();
}
};
}