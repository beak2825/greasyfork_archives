// ==UserScript==
// @name       Hybrid - Calls - 2308
// @version    2.01
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/28694/Hybrid%20-%20Calls%20-%202308.user.js
// @updateURL https://update.greasyfork.org/scripts/28694/Hybrid%20-%20Calls%20-%202308.meta.js
// ==/UserScript==

if ($('li:contains("Call")').length) {
    var question1 = [], question2 = [], question3 = [], question4 = [], question5, question6 = [], question7;

    question1[0] = $('div[class="item-response order-1"]').find('input').eq(0);
    question1[1] = $('div[class="item-response order-1"]').find('input').eq(1);
    question1[2] = $('div[class="item-response order-1"]').find('input').eq(2);
    question1[3] = $('div[class="item-response order-1"]').find('input').eq(3);
    question1[4] = $('div[class="item-response order-1"]').find('input').eq(4);
    question1[5] = $('div[class="item-response order-1"]').find('input').eq(5);

    question2[0] = $('div[class="item-response order-2"]').find('input').eq(0);
    question2[1] = $('div[class="item-response order-2"]').find('input').eq(1);
    question2[2] = $('div[class="item-response order-2"]').find('input').eq(2);

    question3[0] = $('div[class="item-response order-3"]').find('input').eq(0);
    question3[1] = $('div[class="item-response order-3"]').find('input').eq(1);
    question3[2] = $('div[class="item-response order-3"]').find('input').eq(2);
    question3[3] = $('div[class="item-response order-3"]').find('input').eq(3);

    question4[0] = $('div[class="item-response order-4"]').find('input').eq(0);
    question4[1] = $('div[class="item-response order-4"]').find('input').eq(1);
    question4[2] = $('div[class="item-response order-4"]').find('input').eq(2);

    question5 = $('div[class="item-response order-5"]').find('textarea');
    
    question6[0] = $('div[class="item-response order-6"]').find('input').eq(0);
    question6[1] = $('div[class="item-response order-6"]').find('input').eq(1);
    question6[2] = $('div[class="item-response order-6"]').find('input').eq(2);
    question6[3] = $('div[class="item-response order-6"]').find('input').eq(3);
    question6[4] = $('div[class="item-response order-6"]').find('input').eq(4);
    
    question7 = $('div[class="item-response order-7"]').find('textarea');

    var number = $('.fields-text');
    var number2 = $('.fields-text:contains("Phone:")').text().replace('Phone:','').split('Bus')[0].trim();
    if (!number2.includes("-")) {
        number2 = number2.substr(0, 3) + '-' + number2.substr(3);
        number2 = number2.substr(0, 7) + '-' + number2.substr(7);
    }
    number2 = number2.replace('.0','');




    //Answers//  
    number.append('<br>');
    createButton('I Love Hunter');
    number.append('<br>');
    number.append('<br>');
    createButton('Yes',0,0,0,2,'',3,'');
    createButton('Past',0,0,2,2,'',3,'The business used to be located there, however they no longer do.');
    createButton('No',0,0,2,2,'',3,'The person who answered was not aware of this location.');
    createButton('Wrong Business',0,1,3,2,'',3,'This number connected to the wrong business.');
    number.append('<br>');
    number.append('<br>');
    createButton('VM - No Info',5,2,3,2,'',4,'This number connected to a voicemail with information that did not help to answer questions.');
    createButton('VM - Personal',5,0,3,1,'',3,'This number connected voicemail for a person at the company, but no address.');
    createButton('VM - Business Name',5,0,3,0,'',3,'The business is listed on the voicemail but with no information pertaining to the address.');
    number.append('<br>');
    number.append('<br>');
    createButton('DC - Not in Service',1,2,3,2,'',4,'This number is not in service.');
    createButton('DC - Directory',1,2,3,2,'',4,'Disconnected and directory assistance offered.');
    createButton('DC - Fast Busy',1,2,3,2,'',4,'This number gives a fast busy signal.');
    number.append('<br>');
    number.append('<br>');
    createButton('Fax',2,2,3,2,'',4,'Fax');
    createButton('Ringing', 3,2,3,2,'',4,'This call did connect but no one answered after extended ringing');
    createButton('Silence',3,2,3,2,'',4,'Rang until silence','Unsure');
    createButton('Busy',4,2,3,2,'',4,'Busy signal repeatedly after multiple attempts at calling');
    createButton('Hung Up',0,2,3,2,'',3,'Hung up on me');

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

function createButton(inner, a, b, c, d, text, e, text2) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a,b,c,d,text,e,text2); };
    number.append (btn);
}

function answer(one, two, three, four, five, six, seven) {
    GM_setClipboard("AHKhangup");
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
    question3[three].prop( "checked", true );
    question4[four].prop( "checked", true );
    question5.val(five);
    question6[six].prop( "checked", true );
    question7.val(seven);
}




