// ==UserScript==
// @name         Check for 2+ days
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @description  check for cases that need to be updated
// @author       Jacob
// @match        https://ironbow.servicenowservices.com/sn_customerservice_case_list.do?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=servicenowservices.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484594/Check%20for%202%2B%20days.user.js
// @updateURL https://update.greasyfork.org/scripts/484594/Check%20for%202%2B%20days.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = yyyy + '-' + mm + '-' + dd;


    var additionalComments = document.querySelectorAll('td.vt[data-original-title*="2023"]');



    for(let i=0;i<additionalComments.length;i++){
        if(additionalComments[i].dataset.originalTitle.includes('(Additional comments)')){
            //console.log(i);
            let text = additionalComments[i].dataset.originalTitle;
            let result = text.indexOf("(Additional comments)");
            let result1 = text.indexOf("\n2024",50);
            let string = text.slice(0,10);
            var diff =  Math.floor(( Date.parse(formattedToday) - Date.parse(string ) ) / 86400000);
            console.log(diff);

            if(diff>=2) {
                additionalComments[i].style.backgroundColor = "red";
            }
            //console.log(string);
        }
    }
    // Your code here...
})();