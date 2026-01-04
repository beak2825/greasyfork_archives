// ==UserScript==
// @name       Hybrid - Calls Contact (Direct Dial) 3
// @version    1.0
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/31016/Hybrid%20-%20Calls%20Contact%20%28Direct%20Dial%29%203.user.js
// @updateURL https://update.greasyfork.org/scripts/31016/Hybrid%20-%20Calls%20Contact%20%28Direct%20Dial%29%203.meta.js
// ==/UserScript==

if ($('li:contains("Call")').length) {
    var question1 = [], question2 = [], question3 = [], question4 = [], question5 =[], question6;

    question1[0] = $('div[class="item-response order-1"]').find('input').eq(0);
    question1[1] = $('div[class="item-response order-1"]').find('input').eq(1);
    question1[2] = $('div[class="item-response order-1"]').find('input').eq(2);
    question1[3] = $('div[class="item-response order-1"]').find('input').eq(3);
    question1[4] = $('div[class="item-response order-1"]').find('input').eq(4);
    question1[5] = $('div[class="item-response order-1"]').find('input').eq(5);

    question2[0] = $('div[class="item-response order-2"]').find('input').eq(0);
    question2[1] = $('div[class="item-response order-2"]').find('input').eq(1);
    question2[2] = $('div[class="item-response order-2"]').find('input').eq(2);
    question2[3] = $('div[class="item-response order-2"]').find('input').eq(3);

    question3[0] = $('div[class="item-response order-3"]').find('input').eq(0);
    question3[1] = $('div[class="item-response order-3"]').find('input').eq(1);
    question3[2] = $('div[class="item-response order-3"]').find('input').eq(2);
    question3[3] = $('div[class="item-response order-3"]').find('input').eq(3);
    
    question4[0] = $('div[class="item-response order-4"]').find('input').eq(0);
    question4[1] = $('div[class="item-response order-4"]').find('input').eq(1);
    question4[2] = $('div[class="item-response order-4"]').find('input').eq(2);
    question4[3] = $('div[class="item-response order-4"]').find('input').eq(3);
    
    question5[0] = $('div[class="item-response order-5"]').find('input').eq(0);
    question5[1] = $('div[class="item-response order-5"]').find('input').eq(1);
    question5[2] = $('div[class="item-response order-5"]').find('input').eq(2);
    question5[3] = $('div[class="item-response order-5"]').find('input').eq(3);

    question6 = $('div[class="item-response order-6"]').find('textarea');
    
        $('div[class="item-response order-1"]').before($('div[class="item-response order-6"]'));

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
    createButton('Yes (Direct)',0,0,0,0,0,'');
    createButton('Yes (Can Reach)',0,0,0,0,1,'');
    createButton('Yes (Cant Reach)',0,0,0,0,2,'');
    number.append('<br>');
    number.append('<br>');
    
    createButton('Generic VM',2,2,2,2,3,'This  number connected to a voicemail with information that did not help to answer questions.');
    createButton('Personal VM',2,2,2,2,3,'Voice mail did identify the contact but no title information');
    createButton('Biz on Voicemail',2,0,2,2,3,'The business is listed on the voicemail but with no information pertaining to the contact');
    number.append('<br>');
    number.append('<br>');
    createButton('No',0,0,1,1,2,'This person does not work there, the person I spoke to was not aware of past employment');
    createButton('No (Previous)',0,0,1,1,2,'This person does not work there anymore');
    createButton('Wrong Biz',0,1,2,2,3,'This number connected to the wrong business');
    number.append('<br>');
    number.append('<br>');
    createButton('DC',4,2,2,2,3,'Disconnected - this number is not in service.');
    createButton('Fax',5,2,2,2,3,'Fax');
    createButton('Ringing',1,2,2,2,3,'Kept ringing','Kept ringing');
    createButton('Silence',1,2,2,2,3,'Rang until silence');
    createButton('Hung Up',0,2,2,2,3,'Hung up on me');
    createButton('Busy',3,2,2,2,3,'Busy signal');

    number.append('<br>');
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

function createButton(inner, a, b, c, d, e, text) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a,b,c,d,e,text); };
    number.append (btn);
}

function answer(one, two, three, four, five, six) {
    GM_setClipboard("AHKhangup");
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
    question3[three].prop( "checked", true );
    question4[four].prop( "checked", true );
    question5[five].prop( "checked", true );
    question6.val(six);
}



