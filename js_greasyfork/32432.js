// ==UserScript==
// @name       Contact Accuracy - Contacts
// @version    1
// @author	   Hunter
// @description  For Biz Hits
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/en/users/21792-hunterwashere
// @downloadURL https://update.greasyfork.org/scripts/32432/Contact%20Accuracy%20-%20Contacts.user.js
// @updateURL https://update.greasyfork.org/scripts/32432/Contact%20Accuracy%20-%20Contacts.meta.js
// ==/UserScript==

if ($('li:contains("2694")').length) {
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
    question2[4] = $('div[class="item-response order-2"]').find('input').eq(4);
    
    question3[0] = $('div[class="item-response order-4"]').find('input').eq(0);
    question3[1] = $('div[class="item-response order-4"]').find('input').eq(1);
    question3[2] = $('div[class="item-response order-4"]').find('input').eq(2);
    question3[3] = $('div[class="item-response order-4"]').find('input').eq(3);
    question3[4] = $('div[class="item-response order-4"]').find('input').eq(4);
    question3[5] = $('div[class="item-response order-4"]').find('input').eq(5);

    question4[0] = $('div[class="item-response order-5"]').find('input').eq(0);
    question4[1] = $('div[class="item-response order-5"]').find('input').eq(1);
    question4[2] = $('div[class="item-response order-5"]').find('input').eq(2);
    question4[3] = $('div[class="item-response order-5"]').find('input').eq(3);
    question4[4] = $('div[class="item-response order-5"]').find('input').eq(4);
    
    $('div[class="item-response order-1"]').before($('div[class="item-response order-4"]'));
    $('div[class="item-response order-1"]').before($('div[class="item-response order-3"]'));
    
    var number = $('.fields-text').find('p').eq(1);
    var number2 = number.text().replace('Phone Number:','').trim();
    
    if (!number2.includes("-")) {
        number2 = number2.substr(0, 3) + '-' + number2.substr(3);
        number2 = number2.substr(0, 7) + '-' + number2.substr(7);
    }
    number2 = number2.replace('.0','');
    number.append('<br>');
    number.append('<br>');

     //Answers//
    createButton('Yes Yes Linkedin Yes', 0,0,0,0);
    number.append('<br>');
    createButton('N/A U N/A N/A', 4,4,5,4);
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
    number.append('<br>');
    number.append('<br>');
}

function createButton(inner, a, b, c, d) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a,b,c,d); };
    number.append (btn);
}

function answer(one, two, three, four) {
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
    question3[three].prop( "checked", true );
    question4[four].prop( "checked", true );
}


