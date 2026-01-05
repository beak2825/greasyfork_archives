// ==UserScript==
// @name       Hybrid - Contact Calls
// @version    1.0
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/24751/Hybrid%20-%20Contact%20Calls.user.js
// @updateURL https://update.greasyfork.org/scripts/24751/Hybrid%20-%20Contact%20Calls.meta.js
// ==/UserScript==

if ($('li:contains("Contact Calls")').length) {
    var question1 = [], question2 = [], question3 = [], question4 = [], question5 = [], question6;
    
    question1[0] = $('div[class="item-response order-1"]').find('input').eq(0);
    question1[1] = $('div[class="item-response order-1"]').find('input').eq(1);
    question1[2] = $('div[class="item-response order-1"]').find('input').eq(2);
    
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
    question5[4] = $('div[class="item-response order-5"]').find('input').eq(4);
    
    question6 = $('div[class="item-response order-6"]').find('textarea');
    
    var number = $('.fields-text');
    var number2 = number.text().replace('Phone: ', '').split('Business')[0].replace('(','').replace(')','').replace('-','').replace(' ','');
    number2 = number2.substr(0, 3) + '-' + number2.substr(3);
    number2 = number2.substr(0, 7) + '-' + number2.substr(7);
    
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
    btn.onclick = function() { GM_setClipboard("AHKhangup"); }
    
    number.append (btn);
    
    number.append('<br>');
    
    //Answers//    
    createButton('Yes Direct', 0,0,0,0,0,'');
    createButton('Yes Reach', 0,0,0,0,1,'');
    createButton('No', 0,0,1,1,2,'');
    createButton('Wrong #', 0,1,1,2,2,'Wrong number');
    createButton('DC', 1,3,3,3,4,'Disconnected');
    createButton('Fax', 2,3,3,3,4,'Fax');
    createButton('Busy', 0,2,2,2,3,'Busy signal');
    createButton('Ringing', 0,2,2,2,3,'Kept ringing');
    createButton('Generic VM', 0,2,2,2,3,'Voicemail has no info');
    createButton('VM No Contact', 0,0,2,2,3,'Voicemail with no Contact info mentioned.');
    createButton('VM Name Only', 0,2,0,2,0,'Voicemail only has contact name.');
    
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

function createButton(inner, a, b, c, d, e, text) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a,b,c,d,e, text); }
    number.append (btn);
}

function answer(one, two, three, four, five, six) {
    GM_setClipboard("AHKhangup");
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
    question3[three].prop( "checked", true );
    question4[four].prop( "checked", true );
    question5[five].prop( "checked", true );
    question6.text(six);
}


