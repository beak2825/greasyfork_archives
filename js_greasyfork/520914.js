// ==UserScript==
// @name         dropz others
// @namespace    http://tampermonkey.net/
// @version      2024-12-17-000008
// @description  try
// @author       You
// @match        https://raketayo.dropz.xyz/member/t/captcha
// @match        https://raketayo.dropz.xyz/member/t/browse
// @match        https://raketayo.dropz.xyz/member/g/fruit*
// @match        https://googleads.g.doubleclick.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520914/dropz%20others.user.js
// @updateURL https://update.greasyfork.org/scripts/520914/dropz%20others.meta.js
// ==/UserScript==

( function() {
    'use strict';

    // Your code here...


    setInterval(()=>{
        clickOther();
    },200);

})();

var lastSubmit = new Date();
function clickOther(){
    clickButton(".swal2-confirm");
    let captchaText = document.getElementById('captchaText');
    if(captchaText){
        if(captchaText.value.length == 6){
            let d1 = new Date();
            let diff = d1 - lastSubmit;
            if(diff > 6 * 1000) {
                clickButton('.btn-success');
                lastSubmit = new Date();
            }
        }else if(captchaText.value.length ==0){
            //captchaText.click();
            captchaText.dispatchEvent(new Event('input'));
        }
captchaText.scrollIntoView();
    }
//if(document.getElementById('butn')){
 //       document.getElementById('butn').scrollIntoView();
 //   }
}
function clickButton(xpath){
    var targetNode = document.querySelector(xpath);
    if (targetNode) {
        targetNode.click();

    }
    else{

    }
}


