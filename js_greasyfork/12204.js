// ==UserScript==
// @name       Hybrid - Is this website correct?
// @version    1.3
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/12204/Hybrid%20-%20Is%20this%20website%20correct.user.js
// @updateURL https://update.greasyfork.org/scripts/12204/Hybrid%20-%20Is%20this%20website%20correct.meta.js
// ==/UserScript==
if ($('li:contains("Is this website correct?")').length) {

var popupX;
var anchor = $('div[class="item-response order-2"]');
var question1 = [], question2 = []

    question1[0] = $('div[class="item-response order-3"]').find('input').eq(4);
    question1[1] = $('div[class="item-response order-3"]').find('input').eq(5);
    question1[2] = $('div[class="item-response order-3"]').find('input').eq(6);
    question1[3] = $('div[class="item-response order-3"]').find('input').eq(7);

    
    question2[0] = $('div[class="item-response order-4"]').find('input').eq(4);
    question2[1] = $('div[class="item-response order-4"]').find('input').eq(5);
    question2[2] = $('div[class="item-response order-4"]').find('input').eq(6);
    question2[3] = $('div[class="item-response order-4"]').find('input').eq(7);
    question2[4] = $('div[class="item-response order-4"]').find('input').eq(8);
    
var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Yes';
    btn.type = "button";
    btn.onclick = function() { answer(0,0); }
    
    anchor.append (btn);

var btn = document.createElement("BUTTON");
    btn.innerHTML = 'No';
    btn.type = "button";
    btn.onclick = function() { answer(0,1); }
    
    anchor.append (btn);

var btn = document.createElement("BUTTON");
    btn.innerHTML = 'DC';
    btn.type = "button";
    btn.onclick = function() { answer(1,4); }
    
    anchor.append (btn);

var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Parked';
    btn.type = "button";
    btn.onclick = function() { answer(2,1); }
    
    anchor.append (btn);

    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Error';
    btn.type = "button";
    btn.onclick = function() { answer(3,4); }
    
    anchor.append (btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Bad Name';
    btn.type = "button";
    btn.onclick = function() { answer(1,3); }
    
    anchor.append (btn);
    
var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Submit';
    btn.type = "button";
    btn.onclick = function() { $('input[name="commit"]').click(); }
    anchor.append('<br>');
    anchor.append(btn);

function answer(one, two) {
    question1[one].prop( "checked", true );
    question2[two].prop( "checked", true );
}


if ($('li:contains("Is this website correct")').length) {
    var url = 'http://' + $('div[class="item-response order-2"]').find('a').eq(0).attr('href').replace(/http:\/\//g, '');
                       
    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

    popupX = window.open(url, 'remote', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);

    window.onbeforeunload = function (e) { popupX.close(); };

    $('div[class="item-response order-3"]').find('input').eq(4).prop('checked',true);
    $('div[class="item-response order-4"]').find('input').eq(4).prop('checked',true);

} if ($('li:contains("Check a contact")').length) {
    //var url = 'http://' + $('div[class="item-response order-2"]').find('a').eq(0).attr('href').replace(/http:\/\//g, '');
    var url = $('div[class="item-response order-1"]').find('a').eq(0).attr('href');
    
    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

    popupX = window.open(url, 'remote', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);

    window.onbeforeunload = function (e) { popupX.close(); };

    $('div[class="item-response order-2"]').find('input').eq(4).prop('checked',true);
    $('div[class="item-response order-3"]').find('input').eq(4).prop('checked',true);

}

$('a').click( function() { 
    if (this.href.indexOf('gethybrid') < 0) {
        var url = this.href;
        if (url.indexOf('google') > -1)
            url = url.replace(/&/g, '%26').replace(/'/g, '%27');
        
        var wleft = window.screenX;
        var halfScreen = window.outerWidth;
        var windowHeight = window.outerHeight;
        var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

        popupX = window.open(url, 'remote', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
        
        return false;
    }
});
    
}