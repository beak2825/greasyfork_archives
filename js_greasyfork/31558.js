// ==UserScript==
// @name       Hybrid - Calls Multilocation
// @version    1.0
// @author	   Hunta
// @description  I love you Crystal soooo much
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/31558/Hybrid%20-%20Calls%20Multilocation.user.js
// @updateURL https://update.greasyfork.org/scripts/31558/Hybrid%20-%20Calls%20Multilocation.meta.js
// ==/UserScript==

if ($('li:contains("Call - Multilocation")').length) {
    var question1 = [], question2 = [], question3 = [], question4 = [], question5;

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
    
    question4[0] = $('div[class="item-response order-5"]').find('input').eq(0);
    question4[1] = $('div[class="item-response order-5"]').find('input').eq(1);
    question4[2] = $('div[class="item-response order-5"]').find('input').eq(2);

    question5 = $('div[class="item-response order-7"]').find('textarea');
    
        $('div[class="item-response order-1"]').before($('div[class="item-response order-4"]'));
        $('div[class="item-response order-1"]').before($('div[class="item-response order-6"]'));
        $('div[class="item-response order-1"]').before($('div[class="item-response order-7"]'));

    var number = $('.fields-text');
    var number2 = $('.fields-text:contains("Phone:")').text().replace('Phone:','').split('Bus')[0].trim();
    if (!number2.includes("-")) {
        number2 = number2.substr(0, 3) + '-' + number2.substr(3);
        number2 = number2.substr(0, 7) + '-' + number2.substr(7);
    }
    number2 = number2.replace('.0','');
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    number.append (btn);
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    number.append('<br>');
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    //Answers//
    createButton('Yes/Yes/Yes-Multi/Yes-State',0,0,0,0,'');
    createButton('Yes/Yes/Yes-Multi/No-State',0,0,0,1,'');
    number.append('<br>');
    createButton('Yes/Yes/No-Multi/Yes-State',0,0,1,0,'');
    createButton('Yes/Yes/No-Multi/No-State',0,0,1,1,'');
    number.append('<br>');
    createButton('Business on Voicemail',2,0,2,2,'The business name was on the voicemail.');
    createButton('Wrong Business',0,1,2,2,'');
    number.append('<br>');
    number.append('<br>');
    
    createButton('Ringing Only',1,2,2,2,'It rang endlessly.');
    number.append('<br>');
    createButton('Voicemail',2,2,2,2,'Voicemail with no information pertaining to the business.');
    number.append('<br>');
    createButton('Busy',3,2,2,2,'The line was busy.');
    number.append('<br>');
    createButton('Disconnected',4,2,2,2,'This phone number is disconnected.');
    number.append('<br>');
    createButton('Fax',5,2,2,2,'This number is for a fax machine.');
    number.append('<br>');
    createButton('Daddy loves me!!!',5,2,2,2,'All the muches my little whore. Experiencing life with you has been and always will be for forever the dopest thing ever. Waking up super happy, falling asleep with a smile, little things like that are the creme de la vie. Notre vie! :)');
    


    number.append('<br>');
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

function createButton(inner, a, b, c, d, text) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a,b,c,d,text); };
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



