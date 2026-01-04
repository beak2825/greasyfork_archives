// ==UserScript==
// @name         adfreeway
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make Money online with adfreeway.
// @author       You
// @match        https://adfreeway.com/myaccount/content
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adfreeway.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/444261/adfreeway.user.js
// @updateURL https://update.greasyfork.org/scripts/444261/adfreeway.meta.js
// ==/UserScript==

(function() {
    var claimaTimer = setInterval (function() {claima(); }, Math.floor(Math.random() * 1500) + 1500);
    var claimbTimer = setInterval (function() {claimb(); }, Math.floor(Math.random() * 2500) + 2500);
     function claima() {
       var x = Math.floor((Math.random() * 2) + 1);
           if (x == 1)
           {
               document.querySelector('div.ugc-wrap:nth-child(1) > div:nth-child(2) > form:nth-child(1) > input:nth-child(3)').click();
           }
           if (x == 2)
           {
               document.querySelector('div.ugc-wrap:nth-child(1) > div:nth-child(2) > form:nth-child(3) > input:nth-child(3)').click();
           }
        }
    function claimb() {
                   location.href = "https://adfreeway.com/myaccount/content";
        }

})();