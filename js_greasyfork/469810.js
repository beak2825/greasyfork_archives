// ==UserScript==
// @name         Twitter Distractions Hider
// @version      1.4
// @author       VALIDUSER
// @match        https://twitter.com/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @namespace https://greasyfork.org/en/users/1115448-validuser
// @description STFU TWITTER
// @downloadURL https://update.greasyfork.org/scripts/469810/Twitter%20Distractions%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/469810/Twitter%20Distractions%20Hider.meta.js
// ==/UserScript==

function gtfo() {
    $("span:contains('Get Verified')").parent().parent().parent().hide();
    $("span:contains('Terms of Service')" ).parent().parent().parent().hide();
    $("span:contains('Who to follow')").parent().parent().parent().parent().parent().parent().hide();
    $("span:contains('You might like')").parent().parent().parent().parent().parent().parent().hide();
    $("span:contains('Topics to follow')").parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide();
    $("span:contains('Promoted')").parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide();
    $("span:contains('Promoted by')").parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide();
    $("span:contains('Promoted Tweet')").parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide();
    $("span:contains('What’s happening')").parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide();
    console.log('STFU TWITTER APPLIED!');
}

//Initial Run
setTimeout(function(){
    gtfo();
}, 3000);

//Repeat on Scroll - Thanks Ganymed_ for suggestion
$( window ).scroll(function() { gtfo(); });
$( window ).resize(function() { gtfo(); });
$( window ).click(function() { gtfo(); });
$( window ).dblclick(function() { gtfo(); });
$( window ).focus(function() { gtfo(); });
$( window ).focusin(function() { gtfo(); });
$( window ).focusout(function() { gtfo(); });
$( window ).mousedown(function() { gtfo(); });