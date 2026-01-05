// ==UserScript==
// @name       NAICS++ - DCS
// @version    1.0
// @author	   Hunter
// @description  For NAICS++ - DCS
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace    Hunter
// @downloadURL https://update.greasyfork.org/scripts/28580/NAICS%2B%2B%20-%20DCS.user.js
// @updateURL https://update.greasyfork.org/scripts/28580/NAICS%2B%2B%20-%20DCS.meta.js
// ==/UserScript==

if ($('li:contains("NAICS++")').length) {
    var question1 = [], question2 = [], question3 = [], question4 = [], question5 = [], question6 = [];

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
    question4[4] = $('div[class="item-response order-4"]').find('input').eq(4);

    question5[0] = $('div[class="item-response order-5"]').find('input').eq(0);
    question5[1] = $('div[class="item-response order-5"]').find('input').eq(1);
    question5[2] = $('div[class="item-response order-5"]').find('input').eq(2);
    question5[3] = $('div[class="item-response order-5"]').find('input').eq(3);
    
    question6[0] = $('div[class="item-response order-7"]').find('input').eq(0);
    question6[1] = $('div[class="item-response order-7"]').find('input').eq(1);
    question6[2] = $('div[class="item-response order-7"]').find('input').eq(2);
    question6[3] = $('div[class="item-response order-7"]').find('input').eq(3);

    var number = $('.fields-text');
    var number2 = $('.fields-text:contains("Phone:")').text().replace('Phone:','').split('Bus')[0].trim();
    if (!number2.includes("-")) {
        number2 = number2.substr(0, 3) + '-' + number2.substr(3);
        number2 = number2.substr(0, 7) + '-' + number2.substr(7);
    }
    number2 = number2.replace('.0','');

    number.append (btn);
    number.append (btn);

    number.append('<br>');

    //Answers//  
    createButton('Yah Buddy',0,0,0,0,0,1);
    number.append('<br>');
    createButton('Phone Wrong',0,1,0,0,0,1);
    number.append('<br>');
    createButton('Wrong Addy - City',1,0,0,0,0,1);
    number.append('<br>');
    createButton('Wrong Addy - Completely',2,0,0,0,0,1);
    number.append('<br>');
    createButton('Wrong Category',0,0,1,0,0,1);
    number.append('<br>');
    number.append('<br>');
    createButton('No or Dead Contact',0,0,0,1,3,1);
    number.append('<br>');
    createButton('Past Contact',0,0,0,4,3,1);
    number.append('<br>');
    createButton('Unable to find Contact',0,0,0,2,3,1);
    number.append('<br>');
    number.append('<br>');
    createButton('Title Wrong - Same Level',0,0,0,0,1,1);
    number.append('<br>');
    createButton('Title Wrong - Completely',0,0,0,0,2,1);
    number.append('<br>');
    createButton('Unable to Find Title',0,0,0,0,3,1);
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

function createButton(inner, a, b, c, d, e, f) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a,b,c,d, e, f); };
    number.append (btn);
}

function answer(one, two, three, four, five, six) {
    GM_setClipboard("AHKhangup");
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
    question3[three].prop( "checked", true );
    question4[four].prop( "checked", true );
    question5[five].prop( "checked", true );
    question6[six].prop( "checked", true );
}




