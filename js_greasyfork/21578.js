// ==UserScript==
// @name       jawz Hybrid - Phone Call - Contact 2
// @version    1.6
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/21578/jawz%20Hybrid%20-%20Phone%20Call%20-%20Contact%202.user.js
// @updateURL https://update.greasyfork.org/scripts/21578/jawz%20Hybrid%20-%20Phone%20Call%20-%20Contact%202.meta.js
// ==/UserScript==

if ($('li:contains("Phone Call - Contact")').length) {
    var question1 = [], question2 = [], question3 = [], question4 = [], question5;
    
    question1[0] = $('div[class="item-response order-2"]').find('input').eq(4);
    question1[1] = $('div[class="item-response order-2"]').find('input').eq(5);
    question1[2] = $('div[class="item-response order-2"]').find('input').eq(6);
    
    question2[0] = $('div[class="item-response order-3"]').find('input').eq(4);
    question2[1] = $('div[class="item-response order-3"]').find('input').eq(5);
    question2[2] = $('div[class="item-response order-3"]').find('input').eq(6);
    question2[3] = $('div[class="item-response order-3"]').find('input').eq(7);
    question2[4] = $('div[class="item-response order-3"]').find('input').eq(8);
    
    question3[0] = $('div[class="item-response order-4"]').find('input').eq(4);
    question3[1] = $('div[class="item-response order-4"]').find('input').eq(5);
    question3[2] = $('div[class="item-response order-4"]').find('input').eq(6);
    question3[3] = $('div[class="item-response order-4"]').find('input').eq(7);
    
    question4[0] = $('div[class="item-response order-5"]').find('input').eq(4);
    question4[1] = $('div[class="item-response order-5"]').find('input').eq(5);
    question4[2] = $('div[class="item-response order-5"]').find('input').eq(6);
    question4[3] = $('div[class="item-response order-5"]').find('input').eq(7);
    
    question5 = $('#item_responses_6_text');
    
    var number = $('p:contains("Phone Number")')
    var number2 = number.text().split("Phone Number: ")[1].split('Address:')[0];
    number2 = number2.substr(0, 3) + '-' + number2.substr(3)
    number2 = number2.substr(0, 7) + '-' + number2.substr(7)
    
    //Copy//
    number2 = '*67-' + number2;
    GM_setClipboard(number2);
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Copy';
    btn.type = "button";
    btn.onclick = function() { GM_setClipboard(number2); }
    number.append('<br>');
    number.append (btn);
    number.append(' ' + number2 + '<br>');
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Call';
    btn.type = "button";
    btn.onclick = function() { GM_setClipboard("AHKcall " + number2); }
    
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Hangup';
    btn.type = "button";
    btn.onclick = function() { GM_setClipboard("AHKhangup"); }
    
    number.append (btn);
    
    number.append('<br>');
    
    //Answers//
    createButton('Yes Biz', 0,1,0,0,'');
    createButton('Yes Con', 0,0,0,0,'');
    createButton('No', 0,1,1,1,'');
    createButton('Wrong Biz', 0,2,2,2,'');
    createButton('DC', 2,4,3,3,'Disconnected');
    createButton('Fax', 1,4,3,3,'Fax');
    createButton('Generic VM', 0,3,2,2,'Generic voicemail');
    createButton('Contact VM', 0,0,2,2,'Voicemail with contact name only');
    createButton('No Contact VM', 0,3,2,2,'Voicemail without contact');
    createButton('Wrong VM', 0,2,2,2,'Voicemail of other person');
    createButton('Ringing', 0,3,2,2,'Kept Ringing');
    createButton('Silence', 0,3,2,2,'Rang until silence');
    createButton('Busy', 0,3,2,2,'Busy signal');
    createButton('Hung Up', 0,3,2,2,'Hung up on');
    
    //Sub&Skip//
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Submit';
    btn.type = "button";
    btn.onclick = function() { $('input[name="commit"]').click(); }
    number.append('<br>');
    number.append(btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Skip';
    btn.type = "button";
    btn.onclick = function() { $('input[name="skip"]').click(); GM_setClipboard("AHKhangup"); }
    number.append(btn);
}

function createButton(inner, a, b, c, d, text) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a,b,c,d,text); }
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


