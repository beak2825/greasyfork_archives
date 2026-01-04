// ==UserScript==
// @name         Force TSB Login Link To Business Banking
// @namespace    https://github.com/PeteDevoy/userscripts/
// @version      1.0.2
// @description  If you only have a business account with TSB this overcomes
//               the problem of the big pink login button defaulting to
//               personal banking.
// @author       Peter Devoy
// @match        http://www.tsb.co.uk/*
// @grant        none
// @license      CC-0
// @downloadURL https://update.greasyfork.org/scripts/32243/Force%20TSB%20Login%20Link%20To%20Business%20Banking.user.js
// @updateURL https://update.greasyfork.org/scripts/32243/Force%20TSB%20Login%20Link%20To%20Business%20Banking.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.hash == '#login') {
        window.location = 'https://online-business.tsb.co.uk/business/logon/login.jsp';
    } else {
    Array.from(document.getElementsByTagName('a')).forEach(function (a) {
        if (a.href == "https://online.tsb.co.uk/personal/logon/login.jsp") {
            a.href = "https://www.tsb.co.uk/business/#login";
            return true;  //break from forEach
        }
    });    
    }
})();
