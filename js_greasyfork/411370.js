// ==UserScript==
// @name         Primedice 10 min (Autoclaim)
// @description  Claims bonus on stake every 10 minutes
// @description  only works in chrome and you need this addon for chrome
// @author       Dauersendung
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @version      3.0
// @match        https://primedice.com/*
// @match        https://primedice.com
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/411370/Primedice%2010%20min%20%28Autoclaim%29.user.js
// @updateURL https://update.greasyfork.org/scripts/411370/Primedice%2010%20min%20%28Autoclaim%29.meta.js
// ==/UserScript==
var count_min = 1;
window.onload = function loadpage(){
console.log(document.readyState);

setInterval(function(){
      window.location.assign("?currency=btc&modal=vipReload");
}, random(580000,580010));

setInterval(function(){
       document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 gRHihC")[0].click();
}, random(15000,20000));

setInterval(function(){
        console.log("Status: Elapsed time " + count_min + " minutes");
        count_min = count_min + 1;
}, 60000);

};


function random(min,max){
   return min + (max - min) * Math.random();
}