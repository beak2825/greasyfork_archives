// ==UserScript==
// @name         Keep learning suite alive
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Keep learning suite alive.
// @author       hacker09
// @include      https://learningsuite.*.edu/*
// @icon         https://learningsuite.*.edu/images/favicon.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488145/Keep%20learning%20suite%20alive.user.js
// @updateURL https://update.greasyfork.org/scripts/488145/Keep%20learning%20suite%20alive.meta.js
// ==/UserScript==

(function() {
  'use strict';
  //document.head.insertAdjacentHTML('beforeend', '<style>.flex.justify-center {display: none;}</style>'); //Hide the warnings popups

  setInterval(function() {
    //document.querySelectorAll("div.select-none.px-3.pt-1.pb-px")[1]?.click(); //click on continue working
    //document.querySelector(".pl-3 button")?.click(); //Click on OK (do not use because it clicks on submit assignment) maybe try document.querySelectorAll(".pl-3 button")[1]?
    //do not select button with class mx-auto mt-3 block text-white bg-action hover:bg-action-alt p-px font-metro focus:outline-none transition-colors duration-150 because it is submit assignment button
    fetch(location.origin + "/ajax.php?appId=student&subsessionID=" + location.href.split(/\//)[3], {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,pt;q=0.8",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      "body": "funcName=keepAlive&funcParams%5BnoParams%5D=true&url=ajax%2Fgeneral%2Fgeneral.php&classname=&contructorParams=null&isPage=false",
      "method": "POST"
    });
  }, 240000); //4 mins
})();