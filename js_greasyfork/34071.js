// ==UserScript==
// @name       Hybrid - Calls - Mailing Address
// @version    2.24
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/34071/Hybrid%20-%20Calls%20-%20Mailing%20Address.user.js
// @updateURL https://update.greasyfork.org/scripts/34071/Hybrid%20-%20Calls%20-%20Mailing%20Address.meta.js
// ==/UserScript==

if ($('li:contains("Call - Mailing")').length) {
    var question1 = [], question2 = [], question3 = [], question4 = [];

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
    question3[4] = $('div[class="item-response order-3"]').find('input').eq(4);

    question4 = $('div[class="item-response order-4"]').find('textarea');

    var number = $('.fields-text').find('p').eq(1);
    var number2 = number.text().replace('Phone Number:','').trim();
    //var number2 = number.text().split('Phone Number:')[1].split('Address')[0].replace('(','').replace(')','').replace('-','').replace(' ','').trim();
    
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
    createButton('Yes', 0,0,0,'');
    //createButton('City', 0,0,1,'');
    createButton('No', 0,0,1,'');
    createButton('Wrong Biz', 0,1,2,'');
    createButton('DC', 1,2,2,'Disconnected');
    createButton('Fax', 2,2,2,'Fax');
    createButton('Generic VM', 0,2,2,'Voicemail has no info'); //3
    createButton('Ringing', 0,2,2,'Kept ringing'); //3
    createButton('Silence', 0,2,2,'Rang until silence'); //3
    createButton('Busy', 0,2,2,'Busy Signal'); //3
    createButton('No Addy VM', 0,0,2,'Voicemail without address'); //3
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


