// ==UserScript==
// @name         Orange Free Wifi Auto Connect
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Get tired of manually connecting to the Orange Wifi everytime? Try this automation script!
// @author       Shaokun XIE
// @match        https://hautdebit-mobile.orange.fr/order/customer/index/
// @match        https://hautdebitmobile.orange.fr:8443/home*
// @icon         https://www.google.com/s2/favicons?domain=orange.fr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427347/Orange%20Free%20Wifi%20Auto%20Connect.user.js
// @updateURL https://update.greasyfork.org/scripts/427347/Orange%20Free%20Wifi%20Auto%20Connect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const login = document.querySelector(".mwf_bt_orange");
    const lastName = document.getElementById("customer-lastname");
    const firstName = document.getElementById("customer-firstname");
    const email = document.getElementById("customer-email");
    const legal = document.getElementById("legal-checkbox");
    const form = document.getElementById("customer-info-form");

    if (login) {
        login.click();
    } else if (form) {
        lastName.value = "abc";
        firstName.value = "abc";
        email.value = "abc@abc.com";
        legal.checked = true;
        form.submit.click();
    }

})();