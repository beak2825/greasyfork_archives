// ==UserScript==
// @name         xust-jwc
// @namespace    xust-jwc
// @version      0.1
// @description  Xust
// @author       Jay
// @match        http://*/jwglxt/xspjgl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/436777/xust-jwc.user.js
// @updateURL https://update.greasyfork.org/scripts/436777/xust-jwc.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName('ui-pg-selbox')[0].selectedIndex = 5
    $('.ui-pg-selbox').change()
    setTimeout(() => {
        let lb =document.getElementsByClassName('ui-widget-content jqgrow ui-row-ltr')
        console.log(lb.length+1)
        for (let i = 1; i <lb.length+1; i++) {
            setTimeout(() => {
                document.getElementById(i).click()
            }, i*10000);
            setTimeout(() => {
                document.getElementsByClassName('form-control')[0].value = '96A44CDDD19A0651E053DCB84A3BFE10'
                for (let m = 1; m < 11; m++) {
                    document.getElementsByClassName('form-control')[m].value = parseInt(Math.random()*10+80)
                }
                document.getElementsByClassName('btn btn-default btn-default')[2].click()
                document.getElementsByClassName('bootbox-close-button btn-sm close bootbox-close')[0].click()
                console.log(i)
            }, i*10000+5500);

        }
}, 5000);

})();