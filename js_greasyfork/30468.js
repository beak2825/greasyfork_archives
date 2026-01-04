// ==UserScript==
// @name       Hybrid - Calls - Mailing Address YRVBNF
// @version    1
// @author	   Hunter
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/en/users/21792-hunterwashere
// @downloadURL https://update.greasyfork.org/scripts/30468/Hybrid%20-%20Calls%20-%20Mailing%20Address%20YRVBNF.user.js
// @updateURL https://update.greasyfork.org/scripts/30468/Hybrid%20-%20Calls%20-%20Mailing%20Address%20YRVBNF.meta.js
// ==/UserScript==

if ($('li:contains("Call - Mailing Address")').length) {
    var question1 = [], question2 = [], question3 = [], question4 = [];

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

    question4 = $('div[class="item-response order-4"]').find('textarea');
    
    $('div[class="item-response order-1"]').before($('div[class="item-response order-4"]'));

    var number = $('.fields-text').find('p').eq(1);
    var number2 = number.text().replace('Phone Number:','').trim();
    
    if (!number2.includes("-")) {
        number2 = number2.substr(0, 3) + '-' + number2.substr(3);
        number2 = number2.substr(0, 7) + '-' + number2.substr(7);
    }
    number2 = number2.replace('.0','');
    number.append('<br>');

    

     
     //Answers//
    createButton('Yes', 0,0,0,'');
    createButton('No', 0,0,1,'This is not the business address');
    createButton('Past Address', 0,0,1,'The business used to be located at this address');
    number.append('<br>');
    number.append('<br>');
    createButton('Biz on VM', 2,0,2,'The business is listed on the voicemail but with no information pertaining to the address');
    createButton('Wrong Biz', 0,1,2,'This number connected to the wrong business');
    createButton('Wrong Biz - Voicemail', 2,1,2,'This number connected to the wrong business');
    number.append('<br>');
    number.append('<br>');
    createButton('DC', 4,2,2,'Disconnected- this number is not in service.');
    createButton('DC - Directory', 4,2,2,'Disconnected - Directory assistance offered');
    createButton('DC - Fast Busy', 4,2,2,'Disconnected - fast busy');
    number.append('<br>');
    number.append('<br>');
    createButton('Generic VM', 2,2,2,'This  number connected to a voicemail with information that did not help to answer questions.'); //3
    createButton('Personal VM', 2,2,2,'Personal Voicemail, no information regarding the address or business'); //3
    createButton('No Addy VM', 0,0,2,'Voicemail without address'); 
    
    number.append('<br>');
    number.append('<br>');
    createButton('Fax', 5,2,2,'Fax');
    createButton('Ringing', 1,2,2,'This call did connect but no one answered after extended ringing'); //3
    createButton('Silence', 1,2,2,'Rang until silence'); //3
    createButton('Busy', 3,2,2,'Busy signal repeatedly after multiple attemps at calling'); //3
    createButton('Hung Up', 0,2,2,'Hung up on me');
    number.append('<br>');

    //Sub&Skip//
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Daddy loves me!';
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


