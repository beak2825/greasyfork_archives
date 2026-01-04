// ==UserScript==
// @name SSMMS Timer Stopper
// @namespace https://app.captchas.io/ssmms/
// @version 0.1
// @description try to take over the world!
// @author You
// @include      http://onlinebooking.sand.telangana.gov.in/*
// @include      https://onlinebooking.sand.telangana.gov.in/*
// @grant    GM_getValue
// @grant    GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/382108/SSMMS%20Timer%20Stopper.user.js
// @updateURL https://update.greasyfork.org/scripts/382108/SSMMS%20Timer%20Stopper.meta.js
// ==/UserScript==

(function() {
'use strict';
    if(window.location.href.indexOf("Order/CustomerHome.aspx") !=-1) {
        console.log("Inside the order page");
        var alreadyOpened = JSON.parse(GM_getValue ("alreadyOpened",  null) );
        console.log('already opened: '+ alreadyOpened);
        if(!alreadyOpened) {
            console.log("Not already opened!");
            GM_setValue ("alreadyOpened",  JSON.stringify (true) );
            // javascript:__doPostBack('ctl00$CustomerOrders','');
            document.querySelector(".menuH").querySelectorAll("li")[0].querySelector("a").click();
        }
    } else {
        GM_setValue ("alreadyOpened",  JSON.stringify (false) );
        console.log("Inside the login page page");
        console.log(JSON.parse(GM_getValue ("alreadyOpened",  null) ));
    }
})();