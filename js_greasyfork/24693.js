// ==UserScript==
// @name       Hybrid - Website
// @version    1.2
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/24693/Hybrid%20-%20Website.user.js
// @updateURL https://update.greasyfork.org/scripts/24693/Hybrid%20-%20Website.meta.js
// ==/UserScript==

if ($('li:contains("Websites")').length) {
    
    $('p:contains("Did the website or the domain connect")').prependTo($('div[class="item-response order-1"]'));
    $('div[class="item-response order-1"]').find('label[class="control-label"]').hide();
    
    var appender = $('.fields-text');
    var question1 = [], question2 = [], question3 = [], question4 = [], question5 = [], question6 = [] ;
    question1[0] = $('div[class="item-response order-1"]').find('input').eq(0);
    question1[1] = $('div[class="item-response order-1"]').find('input').eq(1);
    question1[2] = $('div[class="item-response order-1"]').find('input').eq(2);
    
    question2[0] = $('div[class="item-response order-2"]').find('input').eq(0);
    question2[1] = $('div[class="item-response order-2"]').find('input').eq(1);
    question2[2] = $('div[class="item-response order-2"]').find('input').eq(2);
    question2[3] = $('div[class="item-response order-2"]').find('input').eq(3);
    question2[4] = $('div[class="item-response order-2"]').find('input').eq(4);
    
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
    
    question6[0] = $('div[class="item-response order-6"]').find('input').eq(0);
    question6[1] = $('div[class="item-response order-6"]').find('input').eq(1);
    question6[2] = $('div[class="item-response order-6"]').find('input').eq(2);
    
    var url = $('div[class="col-md-12"]').eq(2).find('a').eq(2).text();
    var wleft = window.screenX;
    var halfScreen = window.outerWidth-15;
    var windowHeight = window.outerHeight-68;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
    popupX = window.open(url, 'remote', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);

    window.onbeforeunload = function (e) { popupX.close(); };
    
    question1[0].prop( "checked", true );
    question2[0].prop( "checked", true );
    question3[1].prop( "checked", true );
    question4[0].prop( "checked", true );
    question5[0].prop( "checked", true );
    question6[0].prop( "checked", true );
    
    //Answers//    
    createButton('Yes', 0,0,1,0,0);
    createButton('Yes M Loc', 0,0,0,0,0);
    createButton('No', 0,1,1,3,1);
    createButton('DC', 1,4,3,4,2);
    createButton('Parked', 2,4,3,3,1);
    
    //Sub&Skip//
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Submit';
    btn.type = "button";
    btn.onclick = function() { $('input[name="commit"]').click(); };
    appender.append('<br>');
    appender.append(btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Skip';
    btn.type = "button";
    btn.onclick = function() { $('input[name="skip"]').click(); };
    appender.append(btn);
    
    $('div[class="item-response order-4"]').find('input').click(function() {
        var input_class = $(this).attr('class');

        $('input[class="'+input_class+'"]').prop('checked', false);

        $(this).prop('checked', true);
    });
}

function createButton(inner, a, b, c, d, e) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = inner;
    btn.type = "button";
    btn.onclick = function() { answer(a,b,c,d,e); }
    appender.append (btn);
}

function answer(a,b,c,d,e) {
    question1[a].prop( "checked", true );
    question2[b].prop( "checked", true );
    question3[c].prop( "checked", true );
    question4[d].click();
    question5[e].prop( "checked", true );
}