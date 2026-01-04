// ==UserScript==
// @name         CursosDev Auto Gather Coupon
// @namespace    http://tampermonkey.net/
// @version      0.1.0.5
// @description  Script to auto gather coupns from CursosDev
// @author       0x01x02x03
// @match        https://www.cursosdev.com/coupons-udemy/*
// @match        https://www.discudemy.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cursosdev.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457769/CursosDev%20Auto%20Gather%20Coupon.user.js
// @updateURL https://update.greasyfork.org/scripts/457769/CursosDev%20Auto%20Gather%20Coupon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function closeTab(){
        window.open('','_self').close();
    }

    function autoGather() {
        let couponButton = document.body.querySelector('html > body > main > div:nth-of-type(1) > main > div > div > div:nth-of-type(1) > article > div:nth-of-type(1) > section:nth-of-type(5) > div > div:nth-of-type(3) > div > div:nth-of-type(2) > div:nth-of-type(2) > a');
        let couponButtonTwo = document.body.querySelector('html > body > div:nth-of-type(2) > div > section > div:nth-of-type(5) > div > a');
        let couponButtonTwoLink = document.body.querySelector('#couponLink');
        if(couponButton != null){
            closeTab();
            couponButton.click();
        }
        else if(couponButtonTwo != null){
            couponButtonTwo.click();
            if(couponButtonTwoLink != null){
                setTimeout(closeTab,5000);
                couponButtonTwoLink.click();
            }
        }
    }

    setTimeout(autoGather, 5000);
})();