// ==UserScript==
// @name       jawz Hybrid - Phone Call - Contact
// @version    1.1
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/17033/jawz%20Hybrid%20-%20Phone%20Call%20-%20Contact.user.js
// @updateURL https://update.greasyfork.org/scripts/17033/jawz%20Hybrid%20-%20Phone%20Call%20-%20Contact.meta.js
// ==/UserScript==

if ($('h1:contains("Phone Call")').length) {
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
    
    question4[0] = $('div[class="item-response order-6"]').find('input').eq(4);
    question4[1] = $('div[class="item-response order-6"]').find('input').eq(5);
    question4[2] = $('div[class="item-response order-6"]').find('input').eq(6);
    question4[3] = $('div[class="item-response order-6"]').find('input').eq(7);
    
    question5 = $('#item_responses_7_text');
    
    var number = $('p:contains("Phone Number")')
    var number2 = number.text().split("Phone Number: ")[1].split('Address:')[0];
    
    //Copy//
    number2 = '*67' + number2;
    GM_setClipboard(number2);
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Copy';
    btn.type = "button";
    btn.onclick = function() { GM_setClipboard(number2); }
    number.append('<br><br>');
    number.append (btn);
    number.append(' ' + number2 + '<br><br>');
    
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
    btn.innerHTML = 'Wrong Biz';
    btn.type = "button";
    btn.onclick = function() { answer(0,1,2,2,''); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'DC';
    btn.type = "button";
    btn.onclick = function() { answer(2,3,3,3,'Disconnected'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Fax';
    btn.type = "button";
    btn.onclick = function() { answer(1,3,3,3,'Fax'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Generic VM';
    btn.type = "button";
    btn.onclick = function() { answer(0,2,2,2,'Generic Voicemail'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Ringing';
    btn.type = "button";
    btn.onclick = function() { answer(0,2,2,2,'Kept Ringing'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Silence';
    btn.type = "button";
    btn.onclick = function() { answer(0,2,2,2,'Rang Until Silence'); }
    number.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'No Contact VM';
    btn.type = "button";
    btn.onclick = function() { answer(0,0,2,2,'Voicemail Without Contact'); }
    number.append (btn);
    
    //Sub&Skip//
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Submit';
    btn.type = "button";
    btn.onclick = function() { $('input[name="commit"]').click(); }
    number.append('<br><br>');
    number.append(btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Skip';
    btn.type = "button";
    btn.onclick = function() { $('input[name="skip"]').click(); }
    number.append(btn);
}


function answer(one, two, three, four, five) {
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
    question3[three].prop( "checked", true );
    question4[four].prop( "checked", true );
    question5.val(five);
}

