// ==UserScript==
// @name         Stake 10 min (Autoclaim)
// @description  Claims bonus on stake every 10 minutes
// @description  open in dice in second tab and leave it openend https://stake.com/casino/games/dice 
// @author       Dauersendung
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @version      2.0
// @match        https://stake.com
// @match        https://stake.com/?currency=btc&modal=vipReload
// @match        https://stake.com/casino/games/dice
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/411224/Stake%2010%20min%20%28Autoclaim%29.user.js
// @updateURL https://update.greasyfork.org/scripts/411224/Stake%2010%20min%20%28Autoclaim%29.meta.js
// ==/UserScript==
  var count_min = 1;
window.onload = function loadpage(){
console.log(document.readyState);
          setTimeout(function(){
       document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 fbjzSA styles__Button-fc7ea4-0 mGJpP")[0].click();
         }, random(2000,4000));

      setTimeout(function(){
       document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 fbjzSA")[0].click();
         }, random(2000,4000));

    setInterval(function(){
        console.log("Status: Elapsed time " + count_min + " minutes");
        count_min = count_min + 1;
    }, 60000);

    setTimeout(function(){
      window.location.assign("/?currency=btc&modal=vipReload");
      }, random(615000,620300));
     setInterval(function(){
               document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 fbjzSA styles__Button-fc7ea4-0 mGJpP")[0].click();
       }, random(10000,15000));

    setInterval(function(){
               document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 fbjzSA")[0].click()
       }, random(622000,625000));
};

function random(min,max){
   return min + (max - min) * Math.random();
}


