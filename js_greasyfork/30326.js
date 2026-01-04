// ==UserScript==
// @name         Auto Copy Pattern to Clipboard
// @version      0.5
// @description  自動複製國道、台北市、新北市的案件編號到剪貼簿
// @author       KobeNein
// @match        *://www.hpb.gov.tw/*
// @match        *://stackoverflow.com/*
// @match        *://www.tcpd.gov.tw/*
// @match        *://tvrs.ntpd.gov.tw/*
// @grant        GM_setClipboard
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/30326/Auto%20Copy%20Pattern%20to%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/30326/Auto%20Copy%20Pattern%20to%20Clipboard.meta.js
// ==/UserScript==


var patterns = {'www.hpb.gov.tw':/RV-\d{14}/,
                'stackoverflow.com':/.+ times/,
                'www.tcpd.gov.tw':/\d{12}/,
                'tvrs.ntpd.gov.tw':/W\d{18}/
               };



(function() {
    'use strict';
    window.addEventListener("load", function() {

        var patt;

        for (var key in patterns) {
            console.log(key);

            if (document.URL.match(key)) {
                patt = patterns[key];

                var match = patt.exec(document.body.innerText);
                GM_setClipboard(match,"text");


                //document.append("<button type='button'>Try it</button>");
                break;
            }
        }
    });
})();


// <p id='ContentPlaceHolder1_lblCaseNo'>Click the button to make a BUTTON element.</p>
// 
// <button onclick="myFunction()">Try it</button>
// 
// <script>
// function myFunction() {
//     var btn = document.createElement("BUTTON");
//     btn.innerHTML = 'COPY'
//     document.getElementById("ContentPlaceHolder1_lblCaseNo").appendChild(btn);
// }
// </script>