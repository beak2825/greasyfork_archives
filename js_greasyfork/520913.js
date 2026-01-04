// ==UserScript==
// @name         dropz hcaptcha
// @namespace    http://tampermonkey.net/
// @version      2024-08-28
// @description  try
// @author       You
// @match        https://raketayo.dropz.xyz/member/check*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520913/dropz%20hcaptcha.user.js
// @updateURL https://update.greasyfork.org/scripts/520913/dropz%20hcaptcha.meta.js
// ==/UserScript==

( function() {
    'use strict';

    // Your code here...

if(myInterval == null){
    myInterval = setInterval(()=>{
     solveCaptcha();
    },500);
}

})();

var myInterval = null;
function solveCaptcha(){
     var hcaptchaNode = document.querySelector("input[name='cf-turnstile-response']");
    if (hcaptchaNode){
        if(hcaptchaNode.value != ''){

            clickButton(".auth-form-btn");
            clearInterval(myInterval);
        }

    }
}
function clickButton(xpath){
     var targetNode = document.querySelector(xpath);
    if (targetNode) {
        targetNode.click();

    }
    else{

    }
}

