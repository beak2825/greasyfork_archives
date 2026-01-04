// ==UserScript==
// @name       Contact Accuracy - Business
// @version    1
// @author	   Hunter
// @description  For Biz Hits
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/en/users/21792-hunterwashere
// @downloadURL https://update.greasyfork.org/scripts/32433/Contact%20Accuracy%20-%20Business.user.js
// @updateURL https://update.greasyfork.org/scripts/32433/Contact%20Accuracy%20-%20Business.meta.js
// ==/UserScript==

if ($('li:contains("2694")').length) {
    var question1 = [], question2 = [], question3 = [], question4;

    question1[0] = $('div[class="item-response order-1"]').find('input').eq(0);
    question1[1] = $('div[class="item-response order-1"]').find('input').eq(1);
    question1[2] = $('div[class="item-response order-1"]').find('input').eq(2);

    question2[0] = $('div[class="item-response order-3"]').find('input').eq(0);
    question2[1] = $('div[class="item-response order-3"]').find('input').eq(1);
    question2[2] = $('div[class="item-response order-3"]').find('input').eq(2);
    question2[3] = $('div[class="item-response order-3"]').find('input').eq(3);

    question3[0] = $('div[class="item-response order-5"]').find('input').eq(0);
    question3[1] = $('div[class="item-response order-5"]').find('input').eq(1);
    
    
    question4 = $('div[class="item-response order-6"]').find('textarea');
    
    $('div[class="item-response order-1"]').before($('div[class="item-response order-2"]'));
    $('div[class="item-response order-1"]').before($('div[class="item-response order-4"]'));
    
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
    createButton('Yes!', 0,0,0);
    number.append('<br>');
    createButton('Yes but Bad Source', 0,0,1);
    number.append('<br>');
    createButton('Yes but City State', 0,1,0);
    number.append('<br>');
    createButton('Yes but City and Bad Source', 0,1,1);
    number.append('<br>');
    createButton('Completely Unsure', 2,3,1, 'Could not find data');
    number.append('<br>');
    createButton('No Website but Rest is Yes', 1,0,0);
    number.append('<br>');
    createButton('No website and Only City', 1,1,0);
    number.append('<br>');
    createButton('No website, Yes Address, Unofficial Source', 0,0,0);
    number.append('<br>');
    createButton('No website, Only City, Unofficial Source', 1,1,1);

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

function createButton(inner, a, b, c, text) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a,b,c, text); };
    number.append (btn);
}

function answer(one, two, three, four) {
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
    question3[three].prop( "checked", true );
    question4.val(four);
}


