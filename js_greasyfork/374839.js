// ==UserScript==
// @name         UI Shipping
// @version      1.1
// @description  Prompts label printing and then redirects to Homepage
// @match        https://urbaninspirations.co/amazon-ca/fba-qb-to-ss/custom-app/uiorders-label-output*
// @grant        none
// @namespace https://greasyfork.org/users/228706
// @downloadURL https://update.greasyfork.org/scripts/374839/UI%20Shipping.user.js
// @updateURL https://update.greasyfork.org/scripts/374839/UI%20Shipping.meta.js
// ==/UserScript==

setTimeout(redirectPage,5000)

onclick=window.print();

function redirectPage (){
if(!confirm('Printing successful?'))return false
    else{
    location.href = "https://owaisashfaq.quickbase.com/db/bixmzbci5";
        }
}

