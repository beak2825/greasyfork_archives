// ==UserScript==
// @name        twitch auto loot (24.01.2022 working)
// @namespace   Violentmonkey Scripts
// @match       https://www.twitch.tv/*
// @grant       none
// @version     1.8
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @author      -
// @description 14.7.2020, 13:40:04
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/411891/twitch%20auto%20loot%20%2824012022%20working%29.user.js
// @updateURL https://update.greasyfork.org/scripts/411891/twitch%20auto%20loot%20%2824012022%20working%29.meta.js
// ==/UserScript==
var classname = "ScCoreButton-sc-1qn4ixc-0 ScCoreButtonSuccess-sc-1qn4ixc-5 jGqsfG irROim";
async function main(){
    buttoncounter = 0;
    while(true){
      secondsPassed = 0;
      while(document.getElementsByClassName(classname)[0] == undefined){
          await sleep(1000);
          secondsPassed++;
          console.log("Seconds: " + secondsPassed + " Buttons: " + buttoncounter);
      }

      document.getElementsByClassName(classname)[0].click();
      buttoncounter++;
      console.log("Button clicked: " + buttoncounter);
      await sleep(1000);
    }
};

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
$( document ).ready(function() {
   main();
   console.log("Auto Loot active");
});