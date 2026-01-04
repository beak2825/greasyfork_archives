// ==UserScript==
// @name         Last Commment
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @description  copy last additional comment and post again by double clicking
// @author       You
// @match        https://ironbow.servicenowservices.com/sn_customerservice_case_list.do?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=servicenowservices.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484595/Last%20Commment.user.js
// @updateURL https://update.greasyfork.org/scripts/484595/Last%20Commment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var additionalComments = document.querySelectorAll('td.vt[data-original-title*="2024"]');

    document.querySelectorAll('td.vt[data-original-title*="2024"]').forEach((el, i) => {
        additionalComments[i].onclick = event => {
            if (event.detail === 2) {
                // it was a double click
                console.log("double");

                console.log(additionalComments[1].dataset.originalTitle);

                setTimeout(function(){
                    console.log(document.getElementById("cell_edit_value").value=additionalComments[i].dataset.originalTitle);
                    let text = additionalComments[i].dataset.originalTitle;
                    let result = text.indexOf("(Additional comments)");
                    let result1 = text.indexOf("\n2024",50);
                    let string = text.slice(result+22,result1-1);

                    document.getElementById("cell_edit_value").value=string;

                    //text.split('(Additional comments)');

                    document.getElementById("demo").innerHTML = string;
                }, 1000);
                setTimeout(function(){
                    //document.getElementsByClassName("btn btn-icon icon-check-circle color-green")[0].click();
                }, 1000);
            }
        };
    } )
    // Your code here...
})();