// ==UserScript==
// @name       Address Calls
// @version    1
// @author	   Hunter
// @description  hybrid
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace     hunterwashere
// @downloadURL https://update.greasyfork.org/scripts/369849/Address%20Calls.user.js
// @updateURL https://update.greasyfork.org/scripts/369849/Address%20Calls.meta.js
// ==/UserScript==

if ($('li:contains("Call - Address")').length) {
    var question1 = [], question2 = [], question3 = [], question4 = [], question5;

    question1[0] = $('div[class="item-response order-1"]').find('input').eq(0);
    question1[1] = $('div[class="item-response order-1"]').find('input').eq(1);
    question1[2] = $('div[class="item-response order-1"]').find('input').eq(2);
    question1[3] = $('div[class="item-response order-1"]').find('input').eq(3);

    question2[0] = $('div[class="item-response order-2"]').find('input').eq(0);
    question2[1] = $('div[class="item-response order-2"]').find('input').eq(1);
    question2[2] = $('div[class="item-response order-2"]').find('input').eq(2);

    question3[0] = $('div[class="item-response order-3"]').find('input').eq(0);
    question3[1] = $('div[class="item-response order-3"]').find('input').eq(1);
    question3[2] = $('div[class="item-response order-3"]').find('input').eq(2);
    question3[3] = $('div[class="item-response order-3"]').find('input').eq(3);

    question4[0] = $('div[class="item-response order-4"]').find('input').eq(0);
    question4[1] = $('div[class="item-response order-4"]').find('input').eq(1);
    question4[2] = $('div[class="item-response order-4"]').find('input').eq(2);

    question5 = $('div[class="item-response order-5"]').find('textarea');


    var number = $('.fields-text');
    var number2 = $('.fields-text:contains("Phone:")').text().replace('Phone:','').split('Bus')[0].trim();
    if (!number2.includes("-")) {
        number2 = number2.substr(0, 3) + '-' + number2.substr(3);
        number2 = number2.substr(0, 7) + '-' + number2.substr(7);
    }
    number2 = number2.replace('.0','');

    //Answers//
    number.append('<br>');
    createButton('Yes All',0,0,0,0,'');
    number.append('<br>');
    createButton('Wrong Biz',0,1,3,2,'Phone number and business are unrelated');
    number.append('<br>');
    createButton('Voicemail',0,0,3,2,'The business name was mention on their voicemail');
    number.append('<br>');
    createButton('Ringing',1,2,3,2,'');
    number.append('<br>');
    createButton('Disconnected',2,2,3,2,'');
    number.append('<br>');
    createButton('Fax',3,2,3,2,'');

    number.append('<br>');
    //Sub&Skip//
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Submit';
    btn.type = "button";
    btn.onclick = function() { $('input[name="commit"]').click(); };
    number.append('<br>');
    number.append(btn);

    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Skip';
    btn.type = "button";
    btn.onclick = function() { $('input[name="skip"]').click(); GM_setClipboard("AHKhangup"); };
    number.append(btn);
}

function createButton(inner, a, b, c, d, text) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a,b,c,d,text); };
    number.append (btn);
}

function answer(one, two, three, four, five) {
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
    question3[three].prop( "checked", true );
    question4[four].prop( "checked", true );
    question5.val(five);
}

