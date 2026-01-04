// ==UserScript==
// @name       JA
// @version    1
// @author	   Hunter
// @description  Hybrid HITs
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/en/users/21792-hunterwashere
// @downloadURL https://update.greasyfork.org/scripts/370537/JA.user.js
// @updateURL https://update.greasyfork.org/scripts/370537/JA.meta.js
// ==/UserScript==

if ($('li:contains("JA")').length) {
    var question1 = [], question2 = [], question3 = [];

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

    var number = $('.fields-text');

    //Answers//
    number.append('<br>');
    createButton('VVY',0,0,0);
    number.append('<br>');
    createButton('VVN',0,0,1);


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

function createButton(inner, a, b, c) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a,b,c); };
    number.append (btn);
}

function answer(one, two, three) {
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
    question3[three].prop( "checked", true );
}


