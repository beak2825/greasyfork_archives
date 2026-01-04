// ==UserScript==
// @name       Website - 2741
// @version    1
// @author	   Hunter
// @description  For Webbies
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/en/users/21792-hunterwashere
// @downloadURL https://update.greasyfork.org/scripts/33705/Website%20-%202741.user.js
// @updateURL https://update.greasyfork.org/scripts/33705/Website%20-%202741.meta.js
// ==/UserScript==

if ($('li:contains("Website - 2741")').length) {
    var question1 = [], question2 = [];

    question1[0] = $('div[class="item-response order-1"]').find('input').eq(0);
    question1[1] = $('div[class="item-response order-1"]').find('input').eq(1);
    question1[2] = $('div[class="item-response order-1"]').find('input').eq(2);
    question1[3] = $('div[class="item-response order-1"]').find('input').eq(3);

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
    number.append('<br>');

     //Answers//
    createButton('Yes Yes', 0,0);
    number.append('<br>');
    createButton('Yes No', 0,1);
    number.append('<br>');
    createButton('Redirect Yes', 1,0);
    number.append('<br>');
    createButton('Redirect No', 1,1);
    number.append('<br>');
    createButton('Did Not Connect', 2,2);
    number.append('<br>');
    createButton('Parked', 3,2);
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
    btn.onclick = function() { $('input[name="skip"]').click(); };
    number.append(btn);
    number.append('<br>');
    number.append('<br>');
}

function createButton(inner, a, b) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a,b); };
    number.append (btn);
}

function answer(one, two) {
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
}

document.getElementsByClassName('control-label')[0].style.display='none';
document.getElementsByClassName('instructions')[0].style.display='none';

