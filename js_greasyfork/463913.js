// ==UserScript==
// @name         9dm Mask Hidden
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Hide number mask!
// @author       FinKiin
// @match        *://*.9d*game*.*
// @match        http://www.9dmgamemod.com/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463913/9dm%20Mask%20Hidden.user.js
// @updateURL https://update.greasyfork.org/scripts/463913/9dm%20Mask%20Hidden.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var b = document.getElementsByTagName('b')[0];
    if(b){
        let formula = b.innerHTML.split('=');
        if(formula){
            let sum = 0;
            formula[0].split('+').map(item => {
                sum += Number(item);
            })
            let answerInput = document.querySelector("input[name='answer']");
            if(answerInput){
                answerInput.value = sum;
                let secqSubmitBtn = document.querySelector("input[name='secqsubmit']");
                if(secqSubmitBtn){
                    secqSubmitBtn.click();
                }
            }
        }
    }
    const mask = document.querySelector(".my-mask");
    if(mask){
        mask.style.display = "none";
    }

})();