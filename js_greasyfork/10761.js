// ==UserScript==
// @name       jawz Hybrid - Phone Call - Mailing Address
// @version    1.7
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/10761/jawz%20Hybrid%20-%20Phone%20Call%20-%20Mailing%20Address.user.js
// @updateURL https://update.greasyfork.org/scripts/10761/jawz%20Hybrid%20-%20Phone%20Call%20-%20Mailing%20Address.meta.js
// ==/UserScript==

if ($('h1:contains(Phone Call - Mailing Address)').length) {
    var number = $('p:contains("Phone Number")')
    var number2 = number.text().split("Phone Number: ")[1].split('Address:')[0];

    number2 = '*67' + number2;

    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Copy';
    btn.type = "button";
    btn.onclick = function() { GM_setClipboard(number2); }
    
    number.append('<br><br>');
    number.append (btn);
    
    number.append(' ' + number2 + '<br><br>');
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Yes';
    btn.type = "button";
    btn.onclick = function() { yes(); }
    
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'No';
    btn.type = "button";
    btn.onclick = function() { no(); }
    
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Wrong Number';
    btn.type = "button";
    btn.onclick = function() { wrong(); }
    
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'DC';
    btn.type = "button";
    btn.onclick = function() { disconnected(); }
    
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Fax';
    btn.type = "button";
    btn.onclick = function() { fax(); }
    
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Generic';
    btn.type = "button";
    btn.onclick = function() { generic(); }
    
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Ringing';
    btn.type = "button";
    btn.onclick = function() { ringing(); }
    
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Silence';
    btn.type = "button";
    btn.onclick = function() { silence(); }
    
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Busy';
    btn.type = "button";
    btn.onclick = function() { busy(); }
    
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'No Addy';
    btn.type = "button";
    btn.onclick = function() { noaddy(); }
    
    number.append (btn);
    
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Submit';
    btn.type = "button";
    btn.onclick = function() { $('input[name="commit"]').click(); }
    
    number.append('<br><br>');
    number.append(btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Skip';
    btn.type = "button";
    btn.onclick = function() { $('input[name="skip"]').click(); }
    
    number.append(btn);
}
GM_setClipboard(number2);
var answer = [];

for (i=0; i<11; i++) {
    answer[i] = $('input[class="radio_buttons required"]').eq(i).val();
}

function yes1() { $('input[name="item_responses[3][item_option_responses][item_option_id]"][value="' + answer[0] + '"]').prop( "checked", true ); }
function no1() { $('input[name="item_responses[3][item_option_responses][item_option_id]"][value="' + answer[1] + '"]').prop( "checked", true ); }

function yes2() { $('input[name="item_responses[4][item_option_responses][item_option_id]"][value="' + answer[2] + '"]').prop( "checked", true ); }
function no2() { $('input[name="item_responses[4][item_option_responses][item_option_id]"][value="' + answer[3] + '"]').prop( "checked", true ); }
function unsure2() { $('input[name="item_responses[4][item_option_responses][item_option_id]"][value="' + answer[4] + '"]').prop( "checked", true ); }
function dc2() { $('input[name="item_responses[4][item_option_responses][item_option_id]"][value="' + answer[5] + '"]').prop( "checked", true ); }

function yes3() { $('input[name="item_responses[5][item_option_responses][item_option_id]"][value="' + answer[6] + '"]').prop( "checked", true ); }
function no3() { $('input[name="item_responses[5][item_option_responses][item_option_id]"][value="' + answer[7] + '"]').prop( "checked", true ); }
function used3() { $('input[name="item_responses[5][item_option_responses][item_option_id]"][value="' + answer[8] + '"]').prop( "checked", true ); }
function unsure3() { $('input[name="item_responses[5][item_option_responses][item_option_id]"][value="' + answer[8] + '"]').prop( "checked", true ); }
function dc3() { $('input[name="item_responses[5][item_option_responses][item_option_id]"][value="' + answer[9] + '"]').prop( "checked", true ); }

function yes() {
    yes1();
    yes2();
    yes3();
    $( "textarea[name='item_responses[6][text]']" ).val('');
    //$('input[name="commit"]').click();
}

function no() {
    yes1();
    yes2();
    no3();
    $( "textarea[name='item_responses[6][text]']" ).val('');
    //$('input[name="commit"]').click();
}

function noaddy() {
    yes1();
    yes2();
    unsure3();
    $( "textarea[name='item_responses[6][text]']" ).val('Voicemail - Address not given.');
    //$('input[name="commit"]').click();
}

function disconnected() {
    no1();
    dc2();
    dc3();
    $( "textarea[name='item_responses[6][text]']" ).val('Disconnected');
    //$('input[name="commit"]').click();
}

function fax() {
    no1();
    dc2();
    dc3();
    $( "textarea[name='item_responses[6][text]']" ).val('Fax');
    //$('input[name="commit"]').click();
}

function generic() {
    yes1();
    unsure2();
    unsure3();
    $( "textarea[name='item_responses[6][text]']" ).val('Generic Voicemail');
    //$('input[name="commit"]').click();
}

function ringing() {
    yes1();
    unsure2();
    unsure3();
    $( "textarea[name='item_responses[6][text]']" ).val('Kept Ringing');
    //$('input[name="commit"]').click();
}

function silence() {
    yes1();
    unsure2();
    unsure3();
    $( "textarea[name='item_responses[6][text]']" ).val('Rang and then silence');
    //$('input[name="commit"]').click();
}

function busy() {
    yes1();
    unsure2();
    unsure3();
    $( "textarea[name='item_responses[6][text]']" ).val('Busy Signal');
    //$('input[name="commit"]').click();
}

function wrong() {
    yes1();
    no2();
    unsure3();
    $( "textarea[name='item_responses[6][text]']" ).val('Wrong Number');
    //$('input[name="commit"]').click();
}
