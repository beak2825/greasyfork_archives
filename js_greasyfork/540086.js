// ==UserScript==
// @name         AliExpress Sale Remover
// @namespace    aliexpress.com
// @version      0.1
// @description  Remove the annoying sale tags while searching on AliExpress
// @author       Evan Brown
// @match        *://*.aliexpress.com/w/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540086/AliExpress%20Sale%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/540086/AliExpress%20Sale%20Remover.meta.js
// ==/UserScript==

(function(){
    'use strict';

    function sailThatBye() {
       //.mk_mh selects all of the useless stuff ("Save $$$!")
       //I kept the .mk_ay, since it contains things important like quantity discounts
       const uselessElements = this.document.querySelectorAll('.mk_mh:not(.mk_ay)')
       // Remove specific SALE-related icons/images
       const uselessSaleText = document.querySelectorAll(
        'img[src="https://ae01.alicdn.com/kf/Sb6a0486896c44dd8b19b117646c39e36J/116x64.png"], ' + 
        'img[src="https://ae01.alicdn.com/kf/S0f1bc1aeb2ab4de98568b86f99bcd0991/42x60.png"], ' + // SALE tag
        'img[src="https://ae01.alicdn.com/kf/Sa7759f32a8094c98b4dbdc082a876d4dq/60x60.png"]' //Fire tag
        );

        uselessElements.forEach(el => el.remove());
        uselessSaleText.forEach(el => el.remove());
    }

    //Initial page load listener
    window.addEventListener("load", sailThatBye, false)
})();