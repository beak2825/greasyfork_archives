// ==UserScript==
// @name       This might work Contacts
// @version    2.01
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/36464/This%20might%20work%20Contacts.user.js
// @updateURL https://update.greasyfork.org/scripts/36464/This%20might%20work%20Contacts.meta.js
// ==/UserScript==

if ($('li:contains("Call")').length) {
    var question1 = [], question2 = [], question3 = [], question4 = [], question5;

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

    question5 = $('div[class="item-response order-5"]').find('textarea');
    

    var number = $('.fields-text');
    var number2 = $('.fields-text:contains("Phone:")').text().replace('Phone:','').split('Bus')[0].trim();
    if (!number2.includes("-")) {
        number2 = number2.substr(0, 3) + '-' + number2.substr(3);
        number2 = number2.substr(0, 7) + '-' + number2.substr(7);
    }
    number2 = number2.replace('.0','');

    //Copy//
    number2 = '*67-' + number2;
    GM_setClipboard(number2);
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Copy';
    btn.type = "button";
    btn.onclick = function() { GM_setClipboard(number2); };
    number.append('<br>');
    
    number.append (btn);
    number.append(' ' + number2 + '<br>');

    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Call';
    btn.type = "button";
    btn.onclick = function() { GM_setClipboard("AHKcall " + number2); };

    number.append (btn);

    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Hangup';
    btn.type = "button";
    btn.onclick = function() { GM_setClipboard("AHKhangup"); };

    number.append (btn);

    number.append('<br>');
    number.append('<br>');


    //Answers//  
    createButton('Yes',0,0,0,0,'');
    createButton('Past',0,0,1,2,'The contact used to work there, however they no longer do');
    createButton('Nope',0,0,2,2,'This person does not work there, the person I spoke to was not aware of past employment');
    createButton('Wrong Biz',0,1,2,2,'This number connected to the wrong business');
    number.append('<br>');
    number.append('<br>');
    createButton('Generic VM',2,2,2,2,'This  number connected to a voicemail with information that did not help to answer questions.');
    createButton('Personal VM',2,2,2,2,'Voice mail did identify the contact but no title information','Unsure');
    createButton('Biz on VM',2,0,2,2,'The business is listed on the voicemail but with no information pertaining to the contact');
    createButton('No Contact VM',2,0,2,2,'Voicemail without contact');
    number.append('<br>');
    number.append('<br>');
    createButton('DC',4,2,2,2,'Disconnected- this number is not in service. ');
    createButton('DC - Directory',4,2,2,2,'Disconnected - Directory assistance offered');
    createButton('DC - Fast Busy',4,2,2,2,'Disconnected - fast busy');
    number.append('<br>');
    number.append('<br>');
    createButton('Fax',5,2,2,2,'Fax');

    createButton('Ringing', 1,2,2,2,'This call did connect but no one answered after extended ringing');
    createButton('Silence',1,2,2,2,'Rang until silence','Unsure');
    createButton('Busy',3,2,2,2,'Busy signal repeatedly after multiple attemps at calling');
    createButton('Hung Up',1,2,2,2,'Hung up on me');
    number.append('<br>');
    number.append('<br>');
    createButton('Title Different',0,0,0,2,'The person and business are correct the title is not, the persons title is actually:');
    createButton('Similar Title',0,0,0,1,'The person and business are correct the title is not, the persons title is actually:');

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
    btn.onclick = function() { answer(a,b,c,d, text); };
    number.append (btn);
}

function answer(one, two, three, four, five) {
    GM_setClipboard("AHKhangup");
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
    question3[three].prop( "checked", true );
    question4[four].prop( "checked", true );
    question5.val(five);
}




