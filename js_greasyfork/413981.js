// ==UserScript==
// @name         Automatically extend 10minutemail with 100 minutes automatically everytime time would run out
// @icon         https://10minutemail.net/cdn/images/Icon-72@2x.png
// @namespace    x4_em
// @version      0.1
// @description  Automatically adds 100 minutes 3 minutes before time would run out
// @author       skapy write me an email 2ae7986e-3774-4c38-9382-75a03f00e934@anonaddy.me
// @match        https://10minutemail.net/
// @match        https://10minutemail.info/
// @match        https://10minutemail.org/
// @license      CC0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413981/Automatically%20extend%2010minutemail%20with%20100%20minutes%20automatically%20everytime%20time%20would%20run%20out.user.js
// @updateURL https://update.greasyfork.org/scripts/413981/Automatically%20extend%2010minutemail%20with%20100%20minutes%20automatically%20everytime%20time%20would%20run%20out.meta.js
// ==/UserScript==

setInterval(function(){
    if ($('#time').text().split(':')[0] < 3){
        $('[href="more100.html"]')[0].click();
    }
}, 1e3);