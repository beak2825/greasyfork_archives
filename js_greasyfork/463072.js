// ==UserScript==
// @name         Make Everything More Fun in Ace Attorney Online
// @namespace    http://tampermonkey.net/
// @version      1.69420
// @description  Boosts up the April Fools Day up to make AO2 finally fun.
// @author       Uri
// @license      MIT
// @match        web.aceattorneyonline.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/463072/Make%20Everything%20More%20Fun%20in%20Ace%20Attorney%20Online.user.js
// @updateURL https://update.greasyfork.org/scripts/463072/Make%20Everything%20More%20Fun%20in%20Ace%20Attorney%20Online.meta.js
// ==/UserScript==

(function() {
    'use strict';
  var garbageVar1 = "A very important string.";
var garbageVar6 = 42;var garbageVar3 = { key: "value" };
    var garbageVar4 = ["I", "am", "I"];
 function
    importantFunction() {
var x = garbageVar6 * 2; x = x / 3;
 garbageVar6 = x + garbageVar6;
   return garbageVar6;
 }

    function baseFunction() {
     garbageVar3.key = "newValue";garbageVar3.newKey = "anotherValue";
delete





garbageVar3.key

        ; return garbageVar3; }
    function extremelyConfusingFunction(input) {
        input.push("Once upon a time");
     input.unshift(
                                 "A programmer cooked spaghetti"


     );input.splice(1, 0,


                    "He called the dish AO2");
        return input;
    } garbageVar4 =

        extremelyConfusingFunction(garbageVar4);
  baseFunction()
    const customCSS = `
    *::before,*::after {
                           content: "🍝";
 position: absolute; opacity: 0;}span
 .nothing {display: none;}
    body {     font-family: "Comic Sans MS", cursive;
   } img {     image-rendering: crisp-edges;
                     image-rendering: pixelated;
            }
                .long {
                animation: drunk 160s linear infinite;
          }
.health-box{animation: drunk 270s linear infinite;}
#client_waiting{    animation: wobble 150s linear infinite;
 }
.lm_content{
   animation: wobble 600s linear infinite;
}
    img {     animation: drunk 100s linear infinite;
    } #client_chatcontainer {
  animation: drunk 50s ease-in-out infinite; }
                                 button:hover {
        animation: speen 2s linear reverse infinite;
}.area-button:hover {     animation: speen 2s linear infinite; } .demothing {
  animation: none; } .menu_button {animation: speen 2s linear infinite;
    }
    @keyframes wobble {
          0% { transform: translateX(0%) rotate(0); }
           15% { transform:
            translateX(-25%) rotate(30deg); }
  30% { transform: translateX(20%)
                rotate(78deg); }45% { transform: translateX(-15%) rotate(253deg); }
         60% { transform: translateX(10%) rotate(62deg); }
         75% { transform: translateX(-5%) rotate(180deg); }
              100% { transform: translateX(0%) rotate(360deg); }
        }

         @keyframes drunk { 0% {transform: rotate(0); }

   20% {
         transform: rotate(72deg);
} 80% { transform: rotate(-288deg);
        }

    100% {
        transform: rotate(360deg);}}
@keyframes speen
{
  0% {     transform: rotate(0); }

    100% {
        transform: rotate(7200deg);
    }
}`;
importantFunction()
    GM_addStyle(customCSS);
                                })();