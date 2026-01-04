// ==UserScript==
// @name         Hazmat Exemptions
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  This script reminds reviewers to add Hazmat Exceptions
// @author       Kanan Ibrahimov (ibrkanan@amazon.com)
// @match        https://*argus.aka.amazon.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454237/Hazmat%20Exemptions.user.js
// @updateURL https://update.greasyfork.org/scripts/454237/Hazmat%20Exemptions.meta.js
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

addGlobalStyle('#exception-text {padding: 7px; background-color: rgba(255, 82, 82, 1); color: white; font-size:15px; animation: pulse 1500ms infinite;} @keyframes pulse {0% {box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);}100% {box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);}}');


var $ = window.jQuery
window.addEventListener('load', () => {
    var divCheckingInterval = setInterval(function() {
        if (document.querySelector("#dtQuickCodesUp").style.display != "none") {
            if (document.querySelector("#exception-text") === null) {

                var Asin = document.querySelector('#review_details_container > md-list > md-list-item:nth-child(1) > div.url-wrapper.md-list-item-text.layout-align-center-center.layout-column > span');
                var Asin1 = Asin.textContent;
                var date = document.querySelector("#review_details_container > md-list > md-list-item:nth-child(5) > div.url-wrapper.md-list-item-text.layout-align-center-center.layout-column > span");
                let date1 = date.textContent;
                const myArray = date1.split(" ", 37);
                let final = myArray;
                var filtered = myArray.filter(function(e) {
                    return e.replace(/(\r\n|\n|\r)/gm, "")
                });
                var d1 = new Date(filtered); //mm-dd-yyyy.
                var d2 = new Date('02-01-2023'); //mm-dd-yyyy.
                if (Asin1.includes("1xpl") == true || Asin1.includes("2.1l") == true || Asin1.includes("2.1") == true || Asin1.includes("2.2") == true || Asin1.includes("2.2c") == true || Asin1.includes("2.2f") == true || Asin1.includes("2.2st") == true || Asin1.includes("3a") == true || Asin1.includes("3a2") == true || Asin1.includes("3a3") == true || Asin1.includes("3a4") == true || Asin1.includes("3ad") == true || Asin1.includes("3e") == true || Asin1.includes("3en") == true || Asin1.includes("3n") == true || Asin1.includes("3p") == true || Asin1.includes("3pi") == true || Asin1.includes("3xa") == true || Asin1.includes("3xf") == true || Asin1.includes("fdl") == true || Asin1.includes("4.1l") == true || Asin1.includes("4.1m") == true || Asin1.includes("4.1mk") == true || Asin1.includes("5.1hp") == true || Asin1.includes("6.1n") == true || Asin1.includes("7") == true || Asin1.includes("9el") == true || Asin1.includes("9es") == true || Asin1.includes("9la") == true || Asin1.includes("9ma") == true || Asin1.includes("9vh") == true || Asin1.includes("custom") == true || Asin1.includes("9ii") == true || Asin1.includes("9iw") == true || Asin1.includes("9is") == true || Asin1.includes("9mi") == true || Asin1.includes("9mw") == true || Asin1.includes("9ms") == true || Asin1.includes("9mlb") == true || Asin1.includes("9mbe") == true || Asin1.includes("9fr") == true || Asin1.includes("8nsb") == true || Asin1.includes("8sb") == true || Asin1.includes("9bp") == true || Asin1.includes("3cl") == true || Asin1.includes("3fl") == true || Asin1.includes("4.1fl") == true || Asin1.includes("8cl") == true || Asin1.includes("9ar") == true || Asin1.includes("8ba") == true || Asin1.includes("Custom") == true) {
                    if (d1 < d2) {
                        if (document.querySelector('#exception-text') === null) {
                            document.querySelector('.summary-text').innerHTML += '<p id="exception-text"> Please add Exception <br> ASIN is reviewed before February 2023';
                        }
                    }
                }
            }

        }

    });
})();