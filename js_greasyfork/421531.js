// ==UserScript==
// @name     Very rough wp.pl anti adblock killer
// @author   JGondek
// @version  0.1
// @description The script attemps to remove the "Tworzenie treści to nasza pasja" popups on wp.pl websites
// @include  *.wp.pl/*
// @include  https://wp.pl
// @include  https://www.wp.pl
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/736392
// @downloadURL https://update.greasyfork.org/scripts/421531/Very%20rough%20wppl%20anti%20adblock%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/421531/Very%20rough%20wppl%20anti%20adblock%20killer.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/

let functionCalled = 0;
console.log("MY wp.pl anti adblock killer: started observing...");


let inter = setInterval(function() {

    if(functionCalled === 10) {
        clearInterval(inter);
        console.log("MY wp.pl anti adblock killer: stopped observing");
        return;
    }

    console.log("MY wp.pl anti adblock killer: checking for element...");

    let element = $('body > div')
    .filter(function() {
        return this.id.match(/.{10}/);
    });

    if(element.length !== 0 && element.length < 3) {
        console.log("MY wp.pl anti adblock killer: element found, removing...");
        element.remove();
    }

    functionCalled++;

}, 500);