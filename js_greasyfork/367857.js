// ==UserScript==
// @name       Yes on Audits
// @version    2.01
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/367857/Yes%20on%20Audits.user.js
// @updateURL https://update.greasyfork.org/scripts/367857/Yes%20on%20Audits.meta.js
// ==/UserScript==

if ($('li:contains("Audit")').length) {
    var question1 = [];

    question1[0] = $('div[class="item-response order-1"]').find('input').eq(0);
    question1[1] = $('div[class="item-response order-1"]').find('input').eq(1);
    question1[2] = $('div[class="item-response order-1"]').find('input').eq(2);

    var number = $('.fields-text');
    var number2 = $('.fields-text:contains("Phone:")').text().replace('Phone:','').split('Bus')[0].trim();
    if (!number2.includes("-")) {
        number2 = number2.substr(0, 3) + '-' + number2.substr(3);
        number2 = number2.substr(0, 7) + '-' + number2.substr(7);
    }
    number2 = number2.replace('.0','');

    //Answers//
    createButton('Yes',0);

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

function createButton(inner, a) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a); };
    number.append (btn);
}

function answer(one) {
    GM_setClipboard("I love you baby");
    question1[one].prop( "checked", true );
}




