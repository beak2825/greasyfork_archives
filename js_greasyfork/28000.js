// ==UserScript==
// @name       Hybrid - Calls - Mailing Address (With B)
// @version    2.23
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/28000/Hybrid%20-%20Calls%20-%20Mailing%20Address%20%28With%20B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/28000/Hybrid%20-%20Calls%20-%20Mailing%20Address%20%28With%20B%29.meta.js
// ==/UserScript==

if ($('li:contains("Call - Mailing Address")').length) {
    var question1 = [], question2 = [], question3 = [], question4 = [];

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
    question3[3] = $('div[class="item-response order-3"]').find('input').eq(3);
    question3[4] = $('div[class="item-response order-3"]').find('input').eq(4);

    question4 = $('div[class="item-response order-4"]').find('textarea');

    var number = $('.fields-text').find('p').eq(1);
    var number2 = number.text().replace('Phone Number:','').trim();
    //var number2 = number.text().split('Phone Number:')[1].split('Address')[0].replace('(','').replace(')','').replace('-','').replace(' ','').trim();
    
    number2 = number2.replace('.0','');

    //Copy//
    number2 = '*67 ' + number2;
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
    createButton('Yes', 0,0,0,'');
    createButton('No', 0,0,1,'');
    createButton('Biz on VM', 0,0,2,'Business on voicemail');
    createButton('Wrong Biz', 0,1,2,'Wrong Business');
    createButton('Out of Biz', 0,1,1,'Out of Business');
    createButton('DC', 2,2,2,'Disconnected Message - Generic');
    createButton('DC - Directory', 2,2,2,'Disconnected Message - Directory recommendation');
    createButton('DC - No Complete', 2,2,2,'Disconnected Message - Could not be completed');
    createButton('Fax', 3,2,2,'Fax Machine');
    createButton('Generic VM', 0,2,2,'Generic voicemail with helpful no info'); //3
    createButton('Personal VM', 0,2,2,'Personal voicemail with helpful no info'); //3
    createButton('Cant Confirm VM', 0,2,2,'Voicemail info doesnt match business information, but cant confirm'); //3
    createButton('Ringing', 0,2,2,'Kept ringing with no answer'); //3
    createButton('Regular Busy', 0,2,2,'Regular Busy Signal'); //3
    createButton('Fast Busy', 2,2,2,'"Fast" Busy Signal'); //3
    createButton('Hung Up', 0,2,2,'Hung up on me');

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
    btn.onclick = function() { answer(a,b,c,d, text); };
    number.append (btn);
}

function answer(one, two, three, four) {
    GM_setClipboard("AHKhangup");
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
    question3[three].prop( "checked", true );
    question4.val(four);
}


