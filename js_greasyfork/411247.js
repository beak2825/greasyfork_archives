// ==UserScript==
// @name         Redeem Nanotoken ever 10 minutes 
// @description  Claims bonus on https://www.freenanofaucet.com/ every 10 minutes
// @description  Claim more free money in Crypto with my other scripts : )
// @description  https://greasyfork.org/de/scripts/410211-000-12-page-multi-faucet-roller/code
// @author       Dauersendung
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @version      1.2
// @match        https://www.freenanofaucet.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411247/Redeem%20Nanotoken%20ever%2010%20minutes.user.js
// @updateURL https://update.greasyfork.org/scripts/411247/Redeem%20Nanotoken%20ever%2010%20minutes.meta.js
// ==/UserScript==
  var count_min = 1;
window.onload = function loadpage(){
console.log(document.readyState);
      setTimeout(function(){
       document.getElementById("getNano").click();
         }, random(1500,2500));

    setInterval(function(){
        console.log("Status: Elapsed time " + count_min + " minutes");
        count_min = count_min + 1;
    }, 60000);

    setTimeout(function(){
      window.location.assign("https://www.freenanofaucet.com/");
      }, random(90000,100000));


    setInterval(function(){
               document.getElementById("getNano").click();
       }, random(722000,725000));
};

function random(min,max){
   return min + (max - min) * Math.random();
}


