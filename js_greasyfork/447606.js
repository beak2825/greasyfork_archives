// ==UserScript==
// @name         trip.com claimer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  claims coupon on trip.com
// @author       You
// @match        *https://sg.trip.com/sale/w/3195/supersaversale.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/447606/tripcom%20claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/447606/tripcom%20claimer.meta.js
// ==/UserScript==

(() => {
    console.log("is this working")
    setTimeout(ClickTimeout, 2*1000);
    setTimeout(function(){ location.reload(); }, 6*1000);

    function Claim(){
    var docu = document.getElementsByClassName("tcs2-ss-btn_button-txt")[0]
    if(docu.textContent.includes("Claim")){
    docu.click()
    console.log(docu)
    }
}

    function ClickTimeout(){
        var timedocs = document.getElementsByClassName("tcsb-ftb_tab")
        for(let i = 0; i<timedocs.length;i++){
            if(timedocs[i].classList.contains("tcsb-ftb_tab-active")){
                timedocs[i+1].click()
                break
            }

        }
    }

    function Setup() {
        'use strict';
        setInterval(Claim, 1000);
    }

    Setup()
})();

