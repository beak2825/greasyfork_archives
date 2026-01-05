// ==UserScript==
// @name       Hybrid - Calls - DCS
// @version    2.01
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/28547/Hybrid%20-%20Calls%20-%20DCS.user.js
// @updateURL https://update.greasyfork.org/scripts/28547/Hybrid%20-%20Calls%20-%20DCS.meta.js
// ==/UserScript==

if ($('li:contains("Call - Contact")').length) {
    var question1 = [], question2 = [], question3 = [], question4 = [], question5, question6;

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

    question4[0] = $('div[class="item-response order-4"]').find('input').eq(0);
    question4[1] = $('div[class="item-response order-4"]').find('input').eq(1);
    question4[2] = $('div[class="item-response order-4"]').find('input').eq(2);
    question4[3] = $('div[class="item-response order-4"]').find('input').eq(3);

    question5 = $('div[class="item-response order-6"]').find('textarea');
    
    question6 = $('div[class="item-response order-5"]').find('textarea');

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

    //Answers//  
    createButton('Yes',0,0,0,0,'');
    createButton('Past',0,0,1,3,'The contact used to work there, however they no longer do');
    createButton('Nope',0,0,2,3,'This person does not work there, the person I spoke to was not aware of past employment','Unsure');
    createButton('Wrong Biz',0,1,3,3,'This number connected to the wrong business','Unsure');
    createButton('Biz on VM',0,0,3,3,'The business is listed on the voicemail but with no information pertaining to the contact','Unsure');
    createButton('DC',2,2,3,3,'Disconnected- this number is not in service. ','Unsure');
    createButton('DC - Directory',2,2,3,3,'Disconnected - Directory assistance offered','Unsure');
    createButton('DC - Fast Busy',2,2,3,3,'Disconnected - fast busy','Unsure');
    createButton('Fax',3,2,3,3,'Fax','Unsure');
    createButton('Generic VM',0,2,3,3,'This  number connected to a voicemail with information that did not help to answer questions.','Unsure');
    createButton('Personal VM',0,2,3,3,'Voice mail did identify the contact but no title information','Unsure');
    createButton('Ringing', 1,2,3,3,'This call did connect but no one answered after extended ringing','Unsure');
    createButton('Silence',0,2,3,3,'Rang until silence','Unsure');
    createButton('Busy',0,2,3,3,'Busy signal repeatedly after multiple attemps at calling','Unsure');
    createButton('No Contact VM',0,0,3,3,'Voicemail without contact','Unsure');
    createButton('Hung Up',0,2,3,3,'Hung up on me','Unsure');
    createButton('Title Different',0,0,0,2,'The person and business are correct the title is not, the persons title is actually:','Unsure');
    createButton('Similar Title',0,0,0,1,'The person and business are correct the title is not, the persons title is actually:');

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

function createButton(inner, a, b, c, d, text, text2) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a,b,c,d, text, text2); };
    number.append (btn);
}

function answer(one, two, three, four, five, six) {
    GM_setClipboard("AHKhangup");
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
    question3[three].prop( "checked", true );
    question4[four].prop( "checked", true );
    question5.val(five);
    question6.val(six);
}




