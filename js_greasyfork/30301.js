// ==UserScript==
// @name       Urgent Care Calls - Text on top
// @version    1.0
// @author	   Hunter
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/en/users/21792
// @downloadURL https://update.greasyfork.org/scripts/30301/Urgent%20Care%20Calls%20-%20Text%20on%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/30301/Urgent%20Care%20Calls%20-%20Text%20on%20top.meta.js
// ==/UserScript==


if ($('li:contains("Urgent Care")').length) {
    var question1 = [], question2 = [], question3 = [];

    question1[0] = $('div[class="item-response order-1"]').find('input').eq(0);
    question1[1] = $('div[class="item-response order-1"]').find('input').eq(1);
    question1[2] = $('div[class="item-response order-1"]').find('input').eq(2);
    question1[3] = $('div[class="item-response order-1"]').find('input').eq(3);

    question2[0] = $('div[class="item-response order-2"]').find('input').eq(0);
    question2[1] = $('div[class="item-response order-2"]').find('input').eq(1);
    question2[2] = $('div[class="item-response order-2"]').find('input').eq(2);
    question2[3] = $('div[class="item-response order-2"]').find('input').eq(3);
    
    question3[0] = $('div[class="item-response order-3"]').find('input').eq(0);
    question3[1] = $('div[class="item-response order-3"]').find('input').eq(1);
    question3[2] = $('div[class="item-response order-3"]').find('input').eq(2);
    question3[3] = $('div[class="item-response order-3"]').find('input').eq(3);
    
    document.getElementsByClassName('breadcrumb')[0].style.display='none';
    document.getElementsByClassName('instructions')[0].style.display='none';
    $('div[class="item-response order-1"]').before($('div[class="item-response order-4"]'));
    
    var number = $('.fields-text');
    var number2 = $('.fields-text:contains("Make a phone call to")').text().replace('','').split('Bus')[0].trim();
    if (!number2.includes("-")) {
        number2 = number2.substr(0, 3) + '-' + number2.substr(3);
        number2 = number2.substr(0, 7) + '-' + number2.substr(7);
    }
    number2 = number2.replace('.0','');


    //Answers//  
    number.append('<br>');
    createButton('Yes - Urgent Care/Walk-in',0,0,0);
    number.append('<br>');
    createButton('Yes - Emergency Room',0,0,1);
    number.append('<br>');
    //Sub&Skip//
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Submit';
    btn.type = "button";
    btn.onclick = function() { $('input[name="commit"]').click(); };
    number.append(btn);
    number.append('<br>');

    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Skip';
    btn.type = "button";
    btn.onclick = function() { $('input[name="skip"]').click(); GM_setClipboard("AHKhangup"); };
    number.append(btn);
}

function createButton(inner, a, b, c) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a,b,c); };
    number.append (btn);
}

function answer(one, two, three) {
    GM_setClipboard("AHKhangup");
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
    question3[three].prop( "checked", true );
}





