// ==UserScript==
// @name       Doctor Calls
// @version    1.0
// @author	   Everything
// @description  Huntaaaa loves yaaaaa
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/en/users/21792-hunterwashere
// @downloadURL https://update.greasyfork.org/scripts/31446/Doctor%20Calls.user.js
// @updateURL https://update.greasyfork.org/scripts/31446/Doctor%20Calls.meta.js
// ==/UserScript==

if ($('li:contains("Physician")').length) {
    var question1 = [], question2 = [], question3 = [], question4 =[], question5 =[], question6, question7, question8;

    question1[0] = $('div[class="item-response order-1"]').find('input').eq(0);
    question1[1] = $('div[class="item-response order-1"]').find('input').eq(1);
    question1[2] = $('div[class="item-response order-1"]').find('input').eq(2);
    question1[3] = $('div[class="item-response order-1"]').find('input').eq(3);
    question1[4] = $('div[class="item-response order-1"]').find('input').eq(4);

    question2[0] = $('div[class="item-response order-2"]').find('input').eq(0);
    question2[1] = $('div[class="item-response order-2"]').find('input').eq(1);
    question2[2] = $('div[class="item-response order-2"]').find('input').eq(2);
    question2[3] = $('div[class="item-response order-2"]').find('input').eq(3);

    question3[0] = $('div[class="item-response order-3"]').find('input').eq(0);
    question3[1] = $('div[class="item-response order-3"]').find('input').eq(1);
    question3[2] = $('div[class="item-response order-3"]').find('input').eq(2);
    
    question4[0] = $('div[class="item-response order-5"]').find('input').eq(0);
    question4[1] = $('div[class="item-response order-5"]').find('input').eq(1);
    question4[2] = $('div[class="item-response order-5"]').find('input').eq(2);
    
    question5[0] = $('div[class="item-response order-8"]').find('input').eq(0);
    question5[1] = $('div[class="item-response order-8"]').find('input').eq(1);
    question5[2] = $('div[class="item-response order-8"]').find('input').eq(2);
    
    question6 = $('div[class="item-response order-4"]').find('textarea');
    question7 = $('div[class="item-response order-6"]').find('textarea');
    question8 = $('div[class="item-response order-9"]').find('textarea');

    var number = $('.fields-text');
    var number2 = $('.fields-text:contains("Phone:")').text().replace('Phone:','').split('Bus')[0].trim();
    if (!number2.includes("-")) {
        number2 = number2.substr(0, 3) + '-' + number2.substr(3);
        number2 = number2.substr(0, 7) + '-' + number2.substr(7);
    }
    number2 = number2.replace('.0','');

    number.append (btn);

    number.append('<br>');

    //Answers//
    createButton('No/Voicemail',1,3,2,2);
    createButton('No/Hold',2,3,2,2,'');
    createButton('No/Busy',3,3,2,2,'');
    createButton('No/Fax',4,3,2,2,'');
    number.append('<br>');
    number.append('<br>');
    createButton('Yes',0,0,0,0,0);


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

function createButton(inner, a, b, c, d, e, text1, text2, text3) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a,b,c,d,e,text1,text2,text3); };
    number.append (btn);
}

function answer(one, two, three, four, five, six, seven, eight) {
    GM_setClipboard("AHKhangup");
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
    question3[three].prop( "checked", true );
    question4[four].prop( "checked", true );
    question5[five].prop( "checked", true );
    question6.val(six);
    question7.val(seven);
    question8.val(eight);
}



