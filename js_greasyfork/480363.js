// ==UserScript==
// @name         Extra click
// @namespace    http://tampermonkey.net/
// @version      5
// @description  Renda Extra
// @author       Groland
// @match        https://feyorra.site/*
// @match        https://earn-pepe.com/*
// @match        https://99faucet.com/*
// @match        https://coingux.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feyorra.site
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480363/Extra%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/480363/Extra%20click.meta.js
// ==/UserScript==

(function() {
    'use strict';



if (window.location.href.includes("https://feyorra.site/")){
     function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

setInterval(function(){

if (isCaptchaChecked()) {

    document.querySelector(".font-sm.bg-current.rounded-10.text-gray-900.rajdhani-700.lh-18.btn-md.btn.claim-button").click();

}
     }, 5000);
}

    if (window.location.href.includes("https://feyorra.site/")){
        var BOT = setInterval(function() {
 if((document.querySelector(".cf-turnstile")) && document.querySelector(".cf-turnstile > input").value > ""){
                document.querySelector(".font-sm.bg-current.rounded-10.text-gray-900.rajdhani-700.lh-18.btn-md.btn.claim-button").click();
                clearInterval(BOT);
            }
        }, 4000);
                                }

///////////////////////////////////////////////////////////////////////////////////////////////////
    (function() {
    'use strict';



if (window.location.href.includes("https://earn-pepe.com/")){
     function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

setInterval(function(){

if (isCaptchaChecked()) {

    document.querySelector(".btn-primary.btn.claim-button").click();

}
     }, 5000);
}

    if (window.location.href.includes("https://earn-pepe.com/")){
        var BOT = setInterval(function() {
 if((document.querySelector(".cf-turnstile")) && document.querySelector(".cf-turnstile > input").value > ""){
                document.querySelector(".btn-primary.btn.claim-button").click();
                clearInterval(BOT);
            }
        }, 4000);
                                }
///////////////////////////////////////////////////////////////////////////////////////////////////////
 (function() {
    'use strict';



if (window.location.href.includes("https://coingux.com/")){
     function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

setInterval(function(){

if (isCaptchaChecked()) {

    document.querySelector(".btn").click();

}
     }, 5000);
}

    if (window.location.href.includes("https://coingux.com/")){
        var BOT = setInterval(function() {
 if((document.querySelector(".cf-turnstile")) && document.querySelector(".cf-turnstile > input").value > ""){
                document.querySelector(".btn").click();
                clearInterval(BOT);
            }
        }, 4000);
                                }
                                
     if (window.location.href.includes("https://99faucet.com/")){
     setTimeout(function(){document.querySelector('.text-white.btn-lg.btn-success.btn').click();  }, 13000);                           
     }                           
                        
     if (window.location.href.includes("https://feyorra.site/")){    
      setTimeout (function () {
function simulateClick(x, y) {
    var clickEvent= document.createEvent('MouseEvents');
    clickEvent.initMouseEvent(
    'click', true, true, window, 0,
    0, 0, x, y, false, false,
    false, false, 0, null
    );
    document.elementFromPoint(x, y).dispatchEvent(clickEvent);
}
simulateClick(629,428);
        simulateClick(255,529);
        simulateClick(612,602);
         simulateClick(253,620);
         simulateClick(362,529);
         simulateClick(206,431);
         simulateClick(323,530);
         simulateClick(149,535);
         simulateClick(208,434);
         simulateClick(260,429);
         simulateClick(334,671);
          simulateClick(286,674);
          simulateClick(304,672);
          simulateClick(267,529);
          simulateClick(267,529);
         simulateClick(324,556);
         simulateClick(528,1544);
}, 5000); }                           
})();
})();
})();