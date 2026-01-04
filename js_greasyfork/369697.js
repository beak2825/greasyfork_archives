// ==UserScript==
// @name       Categorize search query
// @version    1
// @author	   Hunter
// @description  Hybrid HITs
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace   https://greasyfork.org/en/users/21792-hunterwashere
// @downloadURL https://update.greasyfork.org/scripts/369697/Categorize%20search%20query.user.js
// @updateURL https://update.greasyfork.org/scripts/369697/Categorize%20search%20query.meta.js
// ==/UserScript==

if ($('li:contains("Categorize search query")').length) {
    var question1 = [], question2 = [];

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

    var number = $('.fields-text');

    //Answers//
    number.append('<br>');
    createButton('POI/Specific',0,0);
    number.append('<br>');
    createButton('POI/Cat',0,1);
    number.append('<br>');
    createButton('POI/Both',0,2);
    number.append('<br>');
    createButton('Online/Specific',1,0);
    number.append('<br>');
    createButton('Online/Cat',1,1);
    number.append('<br>');
    createButton('Online/Both',1,2);
    number.append('<br>');
    createButton('Event',2,0);
    number.append('<br>');
    createButton('Local Group',3,0);
    number.append('<br>');
    createButton('No',4,4);
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
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
}


