// ==UserScript==
// @name         HRashkin
// @version      0.3
// @description  How do you feel about that? : Inferring event-driven emotions
// @author       Saqfish
// @match        https://www.mturkcontent.com/dynamic/hit?*
// @grant        none
// @namespace    saqfish
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/13755/HRashkin.user.js
// @updateURL https://update.greasyfork.org/scripts/13755/HRashkin.meta.js
// ==/UserScript==

banana = [];

banana[0] = $('#Other > div > section > fieldset > p:nth-child(7) > input[type="radio"]:nth-child(8)');
banana[1] = $('#Other > div > section > fieldset > p:nth-child(10) > input[type="radio"]:nth-child(7)');
banana[2] = $('#Other > div > section > fieldset > p:nth-child(13) > input[type="radio"]:nth-child(6)');
banana[3] = $('#Other > div > section > fieldset > p:nth-child(16) > input[type="radio"]:nth-child(7)');
banana[4] = $('#Other > div > section > fieldset > p:nth-child(19) > input[type="radio"]:nth-child(5)');
banana[5] = $('#Other > div > section > fieldset > p:nth-child(20) > input[type="radio"]:nth-child(5)');
banana[6] = $('#Other > div > section > fieldset > p:nth-child(25) > input[type="radio"]:nth-child(5)');
banana[7] = $('#Other > div > section > fieldset > p:nth-child(26) > input[type="radio"]:nth-child(5)');
banana[8] = $('#Other > div > section > fieldset > p:nth-child(31) > input[type="radio"]:nth-child(7)');
banana[9] = $('#Other > div > section > fieldset > p:nth-child(34) > input[type="radio"]:nth-child(6)');
banana[10] = $('#Other > div > section > fieldset > p:nth-child(36) > input[type="radio"]:nth-child(7)');
banana[11] = $('#Other > div > section > fieldset > p:nth-child(38) > input[type="radio"]:nth-child(6)');
banana[12] = $('#Other > div > section > fieldset > p:nth-child(40) > input[type="radio"]:nth-child(5)');
banana[13] = $('#Other > div > section > fieldset > p:nth-child(42) > input[type="radio"]:nth-child(6)');
banana[14] = $('#Other > div > section > fieldset > p:nth-child(23) > input[type="radio"]:nth-child(5)');
banana[15] = $('#Other > div > section > fieldset > p:nth-child(42) > input[type="radio"]:nth-child(6)');
banana[16] = $('#Other > div > section > fieldset > p:nth-child(22) > input[type="radio"]:nth-child(5)');

for( var i = 0; i <16; i++){
    banana[i].attr('checked', 'checked');
}

$('.panel-body').hide();
$('#Other > div > section > fieldset > p:nth-child(1)').hide();
$('#Other > div > section > fieldset > p:nth-child(3)').hide();
$('#Other > div > section > fieldset > ul').hide();

$('#Other > div > section > fieldset > p:nth-child(2)').css( "fontSize", "30px" );

$('div.panel-heading').click(function() {

    if($('.panel-body').is(":visible")){
        $('.panel-body').hide();
        $('#Other > div > section > fieldset > p:nth-child(1)').hide();
        $('#Other > div > section > fieldset > p:nth-child(3)').hide();
        $('#Other > div > section > fieldset > ul').hide();
    }else{
        $('.panel-body').show();
        $('#Other > div > section > fieldset > p:nth-child(1)').show();
        $('#Other > div > section > fieldset > p:nth-child(3)').show();
        $(' #Other > div > section > fieldset > ul').show();
    }
});
$(document).keyup(function(e){
    if(e.keyCode === 27){
        $('#submitButton').click();
       
    }
});