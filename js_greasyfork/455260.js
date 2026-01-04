// ==UserScript==
// @name         Twitch Auto Loot (22.11.2022 Working)
// @namespace    Scripts
// @match        https://www.twitch.tv/*
// @grant        none
// @version      1.9
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @author       -
// @description  22.11.2022, 17:18:00
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/455260/Twitch%20Auto%20Loot%20%2822112022%20Working%29.user.js
// @updateURL https://update.greasyfork.org/scripts/455260/Twitch%20Auto%20Loot%20%2822112022%20Working%29.meta.js
// ==/UserScript==
var classname = "ScCoreButton-sc-ocjdkq-0 ScCoreButtonSuccess-sc-ocjdkq-5 ibtYyW iVIehm";
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
   console.log("Auto Loot Active");
});