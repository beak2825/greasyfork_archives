// ==UserScript==
// @name         v3.nz auto login
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  simple auto login!
// @author       You
// @match        https://v3.nz.ua/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nz.ua
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504991/v3nz%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/504991/v3nz%20auto%20login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let lb = document.querySelector("#lp--top > header > button")
    let lt = document.querySelector("#loginform-login")
    let lp = document.querySelector("#loginform-password")
    lb.click()
    lt.value ='YOUR LOGIN HERE'
    lp.value ='YOUR PASSWORD HERE'
    let sb = document.querySelector("#login-form > div.login-btn-box > button")
    sb.click()


})();