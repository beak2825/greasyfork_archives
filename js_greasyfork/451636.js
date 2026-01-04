// ==UserScript==
// @name         Classification Date Checker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  This script checks the classification date and gives warning if the date is the same as the reviewing date.
// @author       Kanan Ibrahimov (ibrkanan@amazon.com)
// @match        https://argus.aka.amazon.com/
// @icon
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451636/Classification%20Date%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/451636/Classification%20Date%20Checker.meta.js
// ==/UserScript==
'use strict';

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('#warning-text {padding: 7px; background-color: rgba(255, 82, 82, 1); color: white; font-size:15px; animation: pulse 1500ms infinite;} @keyframes pulse {0% {box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);}100% {box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);}}');


var $ = window.jQuery
window.addEventListener('load', () => {
    var divCheckingInterval = setInterval(function() {
        if (document.querySelector("#dtQuickCodesUp").style.display != "none") {
            if (document.querySelector("#warning-text") === null) {

                if ($('.utils-display-review-completion-date.text-weight-300.ng-binding').length > 0) {
                    var date = $('.utils-display-review-completion-date.text-weight-300.ng-binding').text().trim().split(' ')[0];
                    var d = new Date;
                    var today = ((d.getMonth() > 8) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1))) + '/' + ((d.getDate() > 9) ? d.getDate() : ('0' + d.getDate())) + '/' + d.getFullYear();
                    if (date === today) {
                        document.querySelector('.summary-text').innerHTML += '<p id="warning-text"> ASIN is classified today. Be careful </p>';

                    }


                }
            }

        }

    });
})();