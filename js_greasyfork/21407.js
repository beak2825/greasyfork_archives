// ==UserScript==
// @name       jawz Hybrid - Phone Call - Call Phone
// @version    1.0
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/21407/jawz%20Hybrid%20-%20Phone%20Call%20-%20Call%20Phone.user.js
// @updateURL https://update.greasyfork.org/scripts/21407/jawz%20Hybrid%20-%20Phone%20Call%20-%20Call%20Phone.meta.js
// ==/UserScript==

if ($('li:contains("Call phone")').length) {
    var question1 = [], question2 = [], question3 = [], question4 = [], question5;
    
    question1[0] = $('div[class="item-response order-2"]').find('input').eq(4);
    question1[1] = $('div[class="item-response order-2"]').find('input').eq(5);
    question1[2] = $('div[class="item-response order-2"]').find('input').eq(6);
    
    question2[0] = $('div[class="item-response order-3"]').find('input').eq(4);
    question2[1] = $('div[class="item-response order-3"]').find('input').eq(5);
    question2[2] = $('div[class="item-response order-3"]').find('input').eq(6);
    question2[3] = $('div[class="item-response order-3"]').find('input').eq(7);
    
    question3[0] = $('div[class="item-response order-4"]').find('input').eq(4);
    question3[1] = $('div[class="item-response order-4"]').find('input').eq(5);
    question3[2] = $('div[class="item-response order-4"]').find('input').eq(6);
    question3[3] = $('div[class="item-response order-4"]').find('input').eq(7);
    
    question4[0] = $('div[class="item-response order-5"]').find('input').eq(4);
    question4[1] = $('div[class="item-response order-5"]').find('input').eq(5);
    
    question5 = $('#item_responses_6_text');
    
    var number = $('p:contains("Phone Number")')
    var number2 = number.text().split("Phone Number: ")[1].split('Address:')[0];
    
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
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Yes Biz';
    btn.type = "button";
    btn.onclick = function() { answer(0,0,1,0,''); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Yes Con';
    btn.type = "button";
    btn.onclick = function() { answer(0,0,0,0,''); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Ring Biz';
    btn.type = "button";
    btn.onclick = function() { answer(0,2,1,1,'Kept Ringing'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Ring Con';
    btn.type = "button";
    btn.onclick = function() { answer(0,2,0,1,'Kept Ringing'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Fax Biz';
    btn.type = "button";
    btn.onclick = function() { answer(1,2,1,1,'Fax'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Fax Con';
    btn.type = "button";
    btn.onclick = function() { answer(1,2,0,1,'Fax'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Busy Biz';
    btn.type = "button";
    btn.onclick = function() { answer(0,2,1,1,'Busy Signal'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Busy Con';
    btn.type = "button";
    btn.onclick = function() { answer(0,2,0,1,'Busy Signal'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Gen VM Biz';
    btn.type = "button";
    btn.onclick = function() { answer(0,2,1,1,'Voicemail Without Contact'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Gen VM Biz';
    btn.type = "button";
    btn.onclick = function() { answer(0,2,0,1,'Voicemail Without Contact'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'DC Biz';
    btn.type = "button";
    btn.onclick = function() { answer(2,3,1,1,'Disconnected'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'DC Biz';
    btn.type = "button";
    btn.onclick = function() { answer(2,3,1,1,'Disconnected'); }
    number.append (btn);
    
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


function answer(one, two, three, four, five) {
    GM_setClipboard("AHKhangup");
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
    question3[three].prop( "checked", true );
    question4[four].prop( "checked", true );
    question5.val(five);
}


