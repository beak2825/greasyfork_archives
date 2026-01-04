// ==UserScript==
// @name       Hide Today 2
// @version    1
// @author	   Hunter
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/en/users/21792-hunterwashere
// @downloadURL https://update.greasyfork.org/scripts/33789/Hide%20Today%202.user.js
// @updateURL https://update.greasyfork.org/scripts/33789/Hide%20Today%202.meta.js
// ==/UserScript==

document.getElementsByClassName('instructions')[0].style.display='none';

if ($('li:contains("2771")').length) {
    var question1 = [], question2 = [];

    question1[0] = $('div[class="item-response order-1"]').find('input').eq(0);
    question1[1] = $('div[class="item-response order-1"]').find('input').eq(1);
    question1[2] = $('div[class="item-response order-1"]').find('input').eq(2);

    question2[0] = $('div[class="item-response order-2"]').find('input').eq(0);
    question2[1] = $('div[class="item-response order-2"]').find('input').eq(1);
    question2[2] = $('div[class="item-response order-2"]').find('input').eq(2);

  

    var number = $('.fields-text').find('p').eq(1);
    var number2 = number.text().replace('Phone Number:','').trim();
    
    if (!number2.includes("-")) {
        number2 = number2.substr(0, 3) + '-' + number2.substr(3);
        number2 = number2.substr(0, 7) + '-' + number2.substr(7);
    }
    number2 = number2.replace('.0','');
    number.append('<br>');

    

     
     //Answers//
    createButton('Yes', 0,0);
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

function createButton(inner, a, b) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a,b); };
    number.append (btn);
}

function answer(one, two) {
    GM_setClipboard("AHKhangup");
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
}


