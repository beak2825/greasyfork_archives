// ==UserScript==
// @name       Hybrid - Phone Call - Contact 4
// @version    1.5
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/22185/Hybrid%20-%20Phone%20Call%20-%20Contact%204.user.js
// @updateURL https://update.greasyfork.org/scripts/22185/Hybrid%20-%20Phone%20Call%20-%20Contact%204.meta.js
// ==/UserScript==

if ($('li:contains("Phone Call - Contact")').length) {
    var question1 = [], question2 = [], question3 = [], question4 = [], question5;
    
    question1[0] = $('div[class="item-response order-3"]').find('input').eq(4);
    question1[1] = $('div[class="item-response order-3"]').find('input').eq(5);
    question1[2] = $('div[class="item-response order-3"]').find('input').eq(6);
    
    question2[0] = $('div[class="item-response order-4"]').find('input').eq(4);
    question2[1] = $('div[class="item-response order-4"]').find('input').eq(5);
    question2[2] = $('div[class="item-response order-4"]').find('input').eq(6);
    question2[3] = $('div[class="item-response order-4"]').find('input').eq(7);
    
    question3[0] = $('div[class="item-response order-5"]').find('input').eq(4);
    question3[1] = $('div[class="item-response order-5"]').find('input').eq(5);
    question3[2] = $('div[class="item-response order-5"]').find('input').eq(6);
    question3[3] = $('div[class="item-response order-5"]').find('input').eq(7);
    question3[4] = $('div[class="item-response order-5"]').find('input').eq(8);
    
    question4[0] = $('div[class="item-response order-6"]').find('input').eq(4);
    question4[1] = $('div[class="item-response order-6"]').find('input').eq(5);
    question4[2] = $('div[class="item-response order-6"]').find('input').eq(6);
    question4[3] = $('div[class="item-response order-6"]').find('input').eq(7);
    question4[4] = $('div[class="item-response order-6"]').find('input').eq(8);
    
    question5 = $('#item_responses_7_text');
    
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
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Yes';
    btn.type = "button";
    btn.onclick = function() { answer(0,0,0,0,''); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Never';
    btn.type = "button";
    btn.onclick = function() { answer(0,0,1,1,''); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Not Anymore';
    btn.type = "button";
    btn.onclick = function() { answer(0,0,2,2,''); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Wrong Biz';
    btn.type = "button";
    btn.onclick = function() { answer(0,1,3,3,''); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'DC';
    btn.type = "button";
    btn.onclick = function() { answer(2,3,4,4,'Disconnected'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Fax';
    btn.type = "button";
    btn.onclick = function() { answer(1,3,4,4,'Fax'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Generic VM';
    btn.type = "button";
    btn.onclick = function() { answer(0,2,3,3,'Generic voicemail'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'No Contact VM';
    btn.type = "button";
    btn.onclick = function() { answer(0,0,3,3,'Voicemail without contact'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Ringing';
    btn.type = "button";
    btn.onclick = function() { answer(0,2,3,3,'Kept ringing'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Silence';
    btn.type = "button";
    btn.onclick = function() { answer(0,2,3,3,'Rang until silence'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Busy';
    btn.type = "button";
    btn.onclick = function() { answer(0,2,3,3,'Busy signal'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Hung up';
    btn.type = "button";
    btn.onclick = function() { answer(0,2,3,3,'Hung up on'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'No Contact VM';
    btn.type = "button";
    btn.onclick = function() { answer(0,0,3,3,'Voicemail without contact'); }
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


